
// RxNorm-ANVISA Mapping Edge Function
// This function manages mappings between RxNorm and ANVISA medication codes

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.6'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  // Create a Supabase client
  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  try {
    const { action, rxnormCode, anvisaCode, medicationName, isVerified, verifiedBy, comments } = await req.json();
    
    // Handle different mapping actions
    switch (action) {
      case 'get':
        // Get a specific mapping
        if (rxnormCode) {
          const { data, error } = await supabase
            .from('rxnorm_anvisa_mappings')
            .select('*')
            .eq('rxnorm_code', rxnormCode)
            .single();
          
          if (error && error.code !== 'PGRST116') {
            throw error;
          }
          
          return new Response(
            JSON.stringify({ mapping: data }),
            { 
              headers: { 
                ...corsHeaders,
                'Content-Type': 'application/json' 
              } 
            }
          );
        } else if (anvisaCode) {
          // Look up by ANVISA code
          const { data, error } = await supabase
            .from('rxnorm_anvisa_mappings')
            .select('*')
            .eq('anvisa_code', anvisaCode)
            .single();
          
          if (error && error.code !== 'PGRST116') {
            throw error;
          }
          
          return new Response(
            JSON.stringify({ mapping: data }),
            { 
              headers: { 
                ...corsHeaders,
                'Content-Type': 'application/json' 
              } 
            }
          );
        } else {
          throw new Error('Either rxnormCode or anvisaCode must be provided');
        }
      
      case 'create':
        // Create a new mapping
        if (!rxnormCode || !anvisaCode || !medicationName) {
          throw new Error('rxnormCode, anvisaCode, and medicationName are required');
        }
        
        const { data: existingMapping } = await supabase
          .from('rxnorm_anvisa_mappings')
          .select('*')
          .eq('rxnorm_code', rxnormCode)
          .single();
        
        if (existingMapping) {
          throw new Error('Mapping already exists for this RxNorm code');
        }
        
        const { data: newMapping, error: insertError } = await supabase
          .from('rxnorm_anvisa_mappings')
          .insert({
            rxnorm_code: rxnormCode,
            anvisa_code: anvisaCode,
            medication_name: medicationName,
            mapping_date: new Date().toISOString(),
            is_verified: isVerified || false,
            verified_by: verifiedBy || null,
            comments: comments || null
          })
          .select()
          .single();
        
        if (insertError) {
          throw insertError;
        }
        
        // Log the mapping creation
        await supabase.from('rxnorm_sync_log').insert({
          sync_date: new Date().toISOString(),
          items_synced: 1,
          sync_type: 'mapping_created',
          details: `Mapped ${medicationName} (RxNorm: ${rxnormCode}) to ANVISA code ${anvisaCode}`
        });
        
        return new Response(
          JSON.stringify({ success: true, mapping: newMapping }),
          { 
            headers: { 
              ...corsHeaders,
              'Content-Type': 'application/json' 
            } 
          }
        );
      
      case 'update':
        // Update an existing mapping
        if (!rxnormCode) {
          throw new Error('rxnormCode is required');
        }
        
        const updateData: Record<string, any> = {};
        if (anvisaCode !== undefined) updateData.anvisa_code = anvisaCode;
        if (medicationName !== undefined) updateData.medication_name = medicationName;
        if (isVerified !== undefined) updateData.is_verified = isVerified;
        if (verifiedBy !== undefined) updateData.verified_by = verifiedBy;
        if (comments !== undefined) updateData.comments = comments;
        
        const { data: updatedMapping, error: updateError } = await supabase
          .from('rxnorm_anvisa_mappings')
          .update(updateData)
          .eq('rxnorm_code', rxnormCode)
          .select()
          .single();
        
        if (updateError) {
          throw updateError;
        }
        
        return new Response(
          JSON.stringify({ success: true, mapping: updatedMapping }),
          { 
            headers: { 
              ...corsHeaders,
              'Content-Type': 'application/json' 
            } 
          }
        );
      
      case 'delete':
        // Delete a mapping
        if (!rxnormCode) {
          throw new Error('rxnormCode is required');
        }
        
        const { error: deleteError } = await supabase
          .from('rxnorm_anvisa_mappings')
          .delete()
          .eq('rxnorm_code', rxnormCode);
        
        if (deleteError) {
          throw deleteError;
        }
        
        return new Response(
          JSON.stringify({ success: true }),
          { 
            headers: { 
              ...corsHeaders,
              'Content-Type': 'application/json' 
            } 
          }
        );
      
      case 'list':
        // List mappings with pagination
        const { page = 1, limit = 20, verified } = await req.json();
        const offset = (page - 1) * limit;
        
        let query = supabase
          .from('rxnorm_anvisa_mappings')
          .select('*', { count: 'exact' });
        
        if (verified !== undefined) {
          query = query.eq('is_verified', verified);
        }
        
        const { data: mappings, count, error: listError } = await query
          .order('mapping_date', { ascending: false })
          .range(offset, offset + limit - 1);
        
        if (listError) {
          throw listError;
        }
        
        return new Response(
          JSON.stringify({ 
            mappings, 
            totalCount: count,
            page,
            limit
          }),
          { 
            headers: { 
              ...corsHeaders,
              'Content-Type': 'application/json' 
            } 
          }
        );
      
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  } catch (error) {
    console.error('Error in RxNorm-ANVISA mapping function:', error);
    
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
