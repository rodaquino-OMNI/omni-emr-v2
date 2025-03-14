
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

  // Parse the request body
  let payload;
  try {
    payload = await req.json();
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Invalid JSON payload' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }

  // Process the request based on the method
  try {
    switch (req.method) {
      case 'POST':
        return handleCreateMapping(payload, supabase, user.id, corsHeaders);
      case 'PUT':
        return handleUpdateMapping(payload, supabase, user.id, corsHeaders);
      case 'DELETE':
        return handleDeleteMapping(payload, supabase, user.id, corsHeaders);
      case 'GET':
        return handleGetMapping(req.url, supabase, corsHeaders);
      default:
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 405,
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

async function handleCreateMapping(payload: any, supabase: any, userId: string, corsHeaders: any) {
  const { rxnormCode, anvisaCode, medicationName, comments } = payload;

  if (!rxnormCode || !anvisaCode || !medicationName) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }

  // Check if the RxNorm code exists
  const { data: rxnormItem, error: rxnormError } = await supabase
    .from('rxnorm_items')
    .select('rxcui')
    .eq('rxcui', rxnormCode)
    .single();

  if (rxnormError || !rxnormItem) {
    // RxNorm code doesn't exist, we need to fetch and insert it
    try {
      const response = await fetch(
        `https://rxnav.nlm.nih.gov/REST/rxcui/${rxnormCode}/allProperties?prop=names`
      );

      if (!response.ok) {
        return new Response(JSON.stringify({ error: 'Invalid RxNorm code' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        });
      }

      const data = await response.json();
      
      if (!data.propConceptGroup) {
        return new Response(JSON.stringify({ error: 'Invalid RxNorm code' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        });
      }
      
      const nameProps = data.propConceptGroup.propConcept.filter(
        (prop: any) => prop.propName === 'RxNorm Name'
      );
      
      if (nameProps.length === 0) {
        return new Response(JSON.stringify({ error: 'Invalid RxNorm code' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        });
      }
      
      // Insert the RxNorm item
      await supabase.from('rxnorm_items').insert({
        rxcui: rxnormCode,
        name: nameProps[0].propValue,
        term_type: 'SCD',
        last_updated: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('Error validating RxNorm code:', error);
      return new Response(JSON.stringify({ error: 'Error validating RxNorm code' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }
  }

  // Insert the mapping
  const { data, error } = await supabase
    .from('rxnorm_anvisa_mappings')
    .insert({
      rxnorm_code: rxnormCode,
      anvisa_code: anvisaCode,
      medication_name: medicationName,
      mapping_date: new Date().toISOString(),
      is_verified: true,
      verified_by: userId,
      comments: comments || null
    });

  if (error) {
    if (error.code === '23505') {
      return new Response(JSON.stringify({ error: 'Mapping already exists' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 409,
      });
    }
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }

  return new Response(JSON.stringify({ success: true, message: 'Mapping created successfully' }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status: 201,
  });
}

async function handleUpdateMapping(payload: any, supabase: any, userId: string, corsHeaders: any) {
  const { id, anvisaCode, medicationName, isVerified, comments } = payload;

  if (!id) {
    return new Response(JSON.stringify({ error: 'Missing mapping ID' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }

  const updates: Record<string, any> = {
    verified_by: userId,
  };

  if (anvisaCode !== undefined) updates.anvisa_code = anvisaCode;
  if (medicationName !== undefined) updates.medication_name = medicationName;
  if (isVerified !== undefined) updates.is_verified = isVerified;
  if (comments !== undefined) updates.comments = comments;

  const { data, error } = await supabase
    .from('rxnorm_anvisa_mappings')
    .update(updates)
    .eq('id', id);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }

  return new Response(JSON.stringify({ success: true, message: 'Mapping updated successfully' }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status: 200,
  });
}

async function handleDeleteMapping(payload: any, supabase: any, userId: string, corsHeaders: any) {
  const { id } = payload;

  if (!id) {
    return new Response(JSON.stringify({ error: 'Missing mapping ID' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }

  const { data, error } = await supabase
    .from('rxnorm_anvisa_mappings')
    .delete()
    .eq('id', id);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }

  return new Response(JSON.stringify({ success: true, message: 'Mapping deleted successfully' }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status: 200,
  });
}

async function handleGetMapping(url: string, supabase: any, corsHeaders: any) {
  const params = new URL(url).searchParams;
  const rxnormCode = params.get('rxnormCode');
  const anvisaCode = params.get('anvisaCode');
  
  let query = supabase.from('rxnorm_anvisa_mappings').select('*');
  
  if (rxnormCode) {
    query = query.eq('rxnorm_code', rxnormCode);
  } else if (anvisaCode) {
    query = query.eq('anvisa_code', anvisaCode);
  } else {
    // If no specific code is provided, return recent mappings
    query = query.order('mapping_date', { ascending: false }).limit(100);
  }
  
  const { data, error } = await query;
  
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
  
  return new Response(JSON.stringify({ mappings: data }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status: 200,
  });
}
