
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Handle CORS preflight requests
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Create a Supabase client with the Auth context of the logged in user
  const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // Get the session from the request headers
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Missing Authorization header' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 401,
    });
  }

  // Extract the token from the Authorization header
  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error: userError } = await supabase.auth.getUser(token);

  if (userError || !user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 401,
    });
  }

  // Check if the user has a valid role to use this function
  const { data: profileData } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profileData || !['admin', 'doctor', 'pharmacist'].includes(profileData.role)) {
    return new Response(JSON.stringify({ error: 'Access denied. Requires admin, doctor, or pharmacist role.' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 403,
    });
  }

  // Parse the request
  const url = new URL(req.url);
  const action = url.searchParams.get('action') || 'sync_popular';
  const limit = parseInt(url.searchParams.get('limit') || '100');
  
  try {
    switch (action) {
      case 'sync_popular':
        return await handleSyncPopular(limit, supabase, corsHeaders);
      case 'clear_cache':
        return await handleClearCache(supabase, corsHeaders);
      case 'sync_specific': 
        // Syncs specific medications, requires a payload
        const payload = await req.json();
        return await handleSyncSpecific(payload, supabase, corsHeaders);
      default:
        return new Response(JSON.stringify({ error: 'Invalid action parameter' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        });
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});

async function handleSyncPopular(limit: number, supabase: any, corsHeaders: any) {
  try {
    // Get the most frequently prescribed medications
    const { data: frequentMeds, error: rpcError } = await supabase
      .rpc('get_frequently_prescribed_medications', { limit_count: limit });
    
    if (rpcError) {
      console.error('Error fetching frequently prescribed medications:', rpcError);
      return new Response(JSON.stringify({ error: 'Error fetching frequently prescribed medications' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }
    
    if (!frequentMeds || frequentMeds.length === 0) {
      return new Response(JSON.stringify({ message: 'No medications to sync', count: 0 }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }
    
    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
      updated: [] as string[],
    };
    
    // Process each medication
    for (const med of frequentMeds) {
      try {
        // If the medication doesn't have an RxNorm code yet, try to find one
        if (!med.rxnorm_code && med.medication_name) {
          const rxnormCode = await findRxNormCode(med.medication_name);
          if (rxnormCode) {
            // Update the medication with the new RxNorm code
            await supabase.from('rxnorm_items').insert({
              rxcui: rxnormCode.rxcui,
              name: rxnormCode.name,
              term_type: rxnormCode.tty || 'SCD',
              last_updated: new Date().toISOString()
            }).onConflict('rxcui').merge();
            
            results.updated.push(`Found RxNorm code ${rxnormCode.rxcui} for ${med.medication_name}`);
            results.success++;
          } else {
            results.errors.push(`No RxNorm code found for ${med.medication_name}`);
            results.failed++;
          }
        } 
        // If it already has an RxNorm code, update medication details
        else if (med.rxnorm_code) {
          const details = await getMedicationDetails(med.rxnorm_code);
          if (details) {
            // Store the details in the cache
            await supabase.from('rxnorm_details_cache').insert({
              rxcui: med.rxnorm_code,
              details: details,
              created_at: new Date().toISOString()
            }).onConflict('rxcui').merge();
            
            results.updated.push(`Updated details for ${med.medication_name} (${med.rxnorm_code})`);
            results.success++;
          } else {
            results.errors.push(`Failed to get details for ${med.medication_name} (${med.rxnorm_code})`);
            results.failed++;
          }
        }
      } catch (error) {
        console.error(`Error processing ${med.medication_name}:`, error);
        results.errors.push(`Error processing ${med.medication_name}: ${error.message}`);
        results.failed++;
      }
    }
    
    // Log the sync operation
    await supabase.from('rxnorm_sync_log').insert({
      sync_date: new Date().toISOString(),
      items_synced: results.success,
      sync_type: 'popular_medications',
      errors: results.errors.length > 0 ? results.errors : null
    });
    
    return new Response(JSON.stringify({
      message: 'Sync completed',
      totalProcessed: frequentMeds.length,
      success: results.success,
      failed: results.failed,
      updates: results.updated,
      errors: results.errors
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error in handleSyncPopular:', error);
    return new Response(JSON.stringify({ error: 'Failed to sync popular medications' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}

async function handleClearCache(supabase: any, corsHeaders: any) {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 7); // Keep 7 days of cache
    const cutoffDateStr = cutoffDate.toISOString();
    
    // Delete expired search cache entries
    const { error: searchCacheError } = await supabase
      .from('rxnorm_search_cache')
      .delete()
      .lt('created_at', cutoffDateStr);
      
    if (searchCacheError) {
      console.error('Error clearing search cache:', searchCacheError);
      return new Response(JSON.stringify({ error: 'Error clearing search cache' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }
    
    // Delete expired details cache entries
    const { error: detailsCacheError } = await supabase
      .from('rxnorm_details_cache')
      .delete()
      .lt('created_at', cutoffDateStr);
    
    if (detailsCacheError) {
      console.error('Error clearing details cache:', detailsCacheError);
      return new Response(JSON.stringify({ error: 'Error clearing details cache' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }
    
    return new Response(JSON.stringify({
      message: 'Cache cleared successfully',
      cutoffDate: cutoffDateStr
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error in handleClearCache:', error);
    return new Response(JSON.stringify({ error: 'Failed to clear cache' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}

async function handleSyncSpecific(payload: any, supabase: any, corsHeaders: any) {
  try {
    const { medications } = payload;
    
    if (!medications || !Array.isArray(medications) || medications.length === 0) {
      return new Response(JSON.stringify({ error: 'Invalid or empty medications list' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }
    
    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
      updated: [] as string[],
    };
    
    // Process each medication
    for (const med of medications) {
      try {
        if (med.rxnorm_code) {
          // Fetch and store RxNorm data
          const details = await getMedicationDetails(med.rxnorm_code);
          if (details) {
            // Update RxNorm item
            await supabase.from('rxnorm_items').insert({
              rxcui: med.rxnorm_code,
              name: details.name,
              term_type: 'SCD',
              last_updated: new Date().toISOString()
            }).onConflict('rxcui').merge();
            
            // Store the details in the cache
            await supabase.from('rxnorm_details_cache').insert({
              rxcui: med.rxnorm_code,
              details: details,
              created_at: new Date().toISOString()
            }).onConflict('rxcui').merge();
            
            results.updated.push(`Updated details for ${details.name} (${med.rxnorm_code})`);
            results.success++;
          } else {
            results.errors.push(`Failed to get details for RxCUI ${med.rxnorm_code}`);
            results.failed++;
          }
        } else if (med.name) {
          // Find RxNorm code for the medication name
          const rxnormCode = await findRxNormCode(med.name);
          if (rxnormCode) {
            // Update the medication with the new RxNorm code
            await supabase.from('rxnorm_items').insert({
              rxcui: rxnormCode.rxcui,
              name: rxnormCode.name,
              term_type: rxnormCode.tty || 'SCD',
              last_updated: new Date().toISOString()
            }).onConflict('rxcui').merge();
            
            results.updated.push(`Found RxNorm code ${rxnormCode.rxcui} for ${med.name}`);
            results.success++;
          } else {
            results.errors.push(`No RxNorm code found for ${med.name}`);
            results.failed++;
          }
        } else {
          results.errors.push('Invalid medication data: requires rxnorm_code or name');
          results.failed++;
        }
      } catch (error) {
        console.error(`Error processing medication:`, error);
        results.errors.push(`Error processing medication: ${error.message}`);
        results.failed++;
      }
    }
    
    // Log the sync operation
    await supabase.from('rxnorm_sync_log').insert({
      sync_date: new Date().toISOString(),
      items_synced: results.success,
      sync_type: 'specific_medications',
      errors: results.errors.length > 0 ? results.errors : null
    });
    
    return new Response(JSON.stringify({
      message: 'Sync completed',
      totalProcessed: medications.length,
      success: results.success,
      failed: results.failed,
      updates: results.updated,
      errors: results.errors
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error in handleSyncSpecific:', error);
    return new Response(JSON.stringify({ error: 'Failed to sync specific medications' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}

// Helper functions to interact with RxNorm API

async function findRxNormCode(medicationName: string) {
  try {
    const response = await fetch(
      `https://rxnav.nlm.nih.gov/REST/drugs?name=${encodeURIComponent(medicationName)}`
    );

    if (!response.ok) {
      throw new Error(`RxNorm API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.drugGroup?.conceptGroup) {
      return null;
    }
    
    // Get the first SCD (semantic clinical drug) result, or any result if no SCD
    let bestMatch = null;
    
    for (const group of data.drugGroup.conceptGroup) {
      if (group.conceptProperties && group.conceptProperties.length > 0) {
        if (group.tty === 'SCD') {
          return group.conceptProperties[0];
        } else if (!bestMatch) {
          bestMatch = group.conceptProperties[0];
        }
      }
    }
    
    return bestMatch;
  } catch (error) {
    console.error('Error finding RxNorm code:', error);
    return null;
  }
}

async function getMedicationDetails(rxcui: string) {
  try {
    // Get basic information
    const infoResponse = await fetch(
      `https://rxnav.nlm.nih.gov/REST/rxcui/${rxcui}/allProperties?prop=names`
    );

    if (!infoResponse.ok) {
      throw new Error(`RxNorm API error: ${infoResponse.status}`);
    }

    const infoData = await infoResponse.json();
    
    if (!infoData.propConceptGroup) {
      return null;
    }
    
    const nameProps = infoData.propConceptGroup.propConcept.filter(
      (prop: any) => prop.propName === 'RxNorm Name'
    );
    
    if (nameProps.length === 0) {
      return null;
    }
    
    // Get related entities
    const relatedResponse = await fetch(
      `https://rxnav.nlm.nih.gov/REST/rxcui/${rxcui}/allrelated`
    );

    if (!relatedResponse.ok) {
      throw new Error(`RxNorm API error: ${relatedResponse.status}`);
    }

    const relatedData = await relatedResponse.json();
    
    // Process and structure the medication details
    const details = {
      rxcui,
      name: nameProps[0].propValue,
      ingredients: extractConceptsByType(relatedData, 'IN'),
      brandNames: extractConceptsByType(relatedData, 'BN'),
      dosageForms: extractConceptsByType(relatedData, 'DF'),
      strengths: extractConceptsByType(relatedData, 'SCDC')
    };
    
    return details;
  } catch (error) {
    console.error('Error getting medication details:', error);
    return null;
  }
}

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
