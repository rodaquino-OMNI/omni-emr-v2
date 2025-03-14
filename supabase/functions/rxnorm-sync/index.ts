
// RxNorm Sync Edge Function
// This function handles syncing RxNorm data in batch mode

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.6'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// RxNorm API base URL
const RXNORM_API_BASE_URL = 'https://rxnav.nlm.nih.gov/REST';

interface RxNormApiResponse {
  drugGroup?: {
    conceptGroup: Array<{
      tty: string;
      conceptProperties: Array<{
        rxcui: string;
        name: string;
        tty: string;
      }>;
    }>;
  };
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const { syncType = 'manual', limit = 100 } = await req.json();
    
    // Create a Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    let itemsToSync: string[] = [];
    
    // Get list of RxCUIs to sync based on the sync type
    if (syncType === 'frequently_used') {
      // Get most frequently prescribed medications
      const { data: frequentMeds } = await supabase
        .rpc('get_frequently_prescribed_medications', { limit_count: limit });
      
      if (frequentMeds && frequentMeds.length > 0) {
        itemsToSync = frequentMeds
          .filter((med: any) => med.rxnorm_code)
          .map((med: any) => med.rxnorm_code);
      }
    } else if (syncType === 'outdated') {
      // Get medications that haven't been updated in the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { data: outdatedMeds } = await supabase
        .from('rxnorm_items')
        .select('rxcui')
        .lt('last_updated', thirtyDaysAgo.toISOString())
        .limit(limit);
      
      if (outdatedMeds && outdatedMeds.length > 0) {
        itemsToSync = outdatedMeds.map((med: any) => med.rxcui);
      }
    } else if (syncType === 'class' && req.body) {
      // Sync a specific medication class
      const { className } = await req.json();
      
      if (className) {
        const response = await fetch(
          `${RXNORM_API_BASE_URL}/rxclass/classMembers?classId=${encodeURIComponent(className)}&relaSource=ATC`
        );
        
        if (response.ok) {
          const data = await response.json();
          itemsToSync = data.drugMemberGroup?.drugMember
            .map((drug: any) => drug.rxcui)
            .slice(0, limit) || [];
        }
      }
    }
    
    // Process each item
    const results = {
      total: itemsToSync.length,
      processed: 0,
      errors: [] as string[],
      details: [] as any[]
    };
    
    for (const rxcui of itemsToSync) {
      try {
        // Fetch medication details from RxNorm API
        const response = await fetch(
          `${RXNORM_API_BASE_URL}/rxcui/${rxcui}/allrelated`
        );
        
        if (response.ok) {
          const data = await response.json();
          
          // Extract medication details
          const details = {
            rxcui,
            name: data.relatedGroup?.rxcuiName || '',
            ingredients: extractConceptsByType(data, 'IN'),
            brandNames: extractConceptsByType(data, 'BN'),
            dosageForms: extractConceptsByType(data, 'DF'),
            strengths: extractConceptsByType(data, 'SCDC')
          };
          
          // Update or insert the medication
          const { error: upsertError } = await supabase
            .from('rxnorm_items')
            .upsert({
              rxcui,
              name: data.relatedGroup?.rxcuiName || '',
              term_type: 'SCD',
              active: true,
              last_updated: new Date().toISOString()
            });
          
          if (upsertError) {
            results.errors.push(`Error upserting ${rxcui}: ${upsertError.message}`);
            continue;
          }
          
          // Cache the details
          await supabase.from('rxnorm_details_cache').upsert({
            rxcui,
            details,
            created_at: new Date().toISOString()
          });
          
          results.processed++;
          results.details.push({
            rxcui,
            name: details.name
          });
        } else {
          results.errors.push(`API error for ${rxcui}: ${response.status}`);
        }
      } catch (error) {
        console.error(`Error processing ${rxcui}:`, error);
        results.errors.push(`Error processing ${rxcui}: ${error.message}`);
      }
      
      // Add a small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Log the sync operation
    await supabase.from('rxnorm_sync_log').insert({
      sync_date: new Date().toISOString(),
      items_synced: results.processed,
      sync_type: syncType,
      errors: results.errors.length > 0 ? results.errors : null
    });
    
    return new Response(
      JSON.stringify(results),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error('Error in RxNorm sync:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});

// Helper function to extract concepts by type from RxNorm API response
function extractConceptsByType(data: any, type: string) {
  if (!data.relatedGroup?.conceptGroup) {
    return [];
  }
  
  const group = data.relatedGroup.conceptGroup.find((g: any) => g.tty === type);
  
  if (!group || !group.conceptProperties) {
    return [];
  }
  
  return group.conceptProperties.map((prop: any) => ({
    rxcui: prop.rxcui,
    name: prop.name
  }));
}
