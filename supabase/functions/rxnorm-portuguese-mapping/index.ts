import { serve } from 'https://deno.land/std@0.131.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { createClient } from '@supabase/supabase-js';

const allowedOrigin = Deno.env.get('SUPABASE_URL');

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { rxnorm_ids: rxnormIds } = await req.json();

    if (!rxnormIds || !Array.isArray(rxnormIds)) {
      return new Response(JSON.stringify({ error: 'rxnorm_ids must be a non-empty array' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}` } } }
    );

    const { data: englishToPortuguese, error } = await supabaseClient
      .from('rxnorm_portuguese_mapping')
      .select('rxnorm_id, portuguese_name')
      .in('rxnorm_id', rxnormIds);

    if (error) {
      console.error('Supabase error:', error);
      return new Response(JSON.stringify({ error: 'Failed to fetch translations from Supabase' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch drug data from another source (replace with your actual data source)
    const drugData = [
      { id: '1169994', english_name: 'Acetaminophen 325 MG Oral Tablet', portuguese_name: 'Paracetamol 325 MG Comprimido Oral' },
      { id: '204331', english_name: 'Ibuprofen 200 MG Oral Tablet', portuguese_name: 'Ibuprofeno 200 MG Comprimido Oral' },
      { id: '657002', english_name: 'Aspirin 81 MG Oral Tablet', portuguese_name: 'Aspirina 81 MG Comprimido Oral' },
      { id: '1333760', english_name: 'Vitamin D 400 IU Oral Capsule', portuguese_name: 'Vitamina D 400 UI Cápsula Oral' },
      { id: '159477', english_name: 'Loratadine 10 MG Oral Tablet', portuguese_name: 'Loratadina 10 MG Comprimido Oral' },
    ];

    const translations = rxnormIds.map(rxnormId => {
      const translation = englishToPortuguese?.find(item => item.rxnorm_id === rxnormId);
      const englishName = drugData.find(drug => drug.id === rxnormId)?.english_name || 'Unknown';

      // Prioritize translation from rxnorm_portuguese_mapping, then use drugData, and fallback to English name
      const portugueseName = drugData.find(drug => 
        drug.id === rxnormId
      )?.portuguese_name || englishName;

      return {
        rxnorm_id: rxnormId,
        portuguese_name: translation?.portuguese_name || portugueseName,
        english_name: englishName,
      };
    });

    return new Response(JSON.stringify({ data: translations }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Function error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
