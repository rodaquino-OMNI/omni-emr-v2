
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Handle CORS preflight requests
function handleCors(req: Request): Response | null {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }
  return null
}

serve(async (req: Request) => {
  // Handle CORS
  const corsResponse = handleCors(req)
  if (corsResponse) return corsResponse

  try {
    // Get environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')
    const supabaseServiceRole = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRole) {
      return new Response(
        JSON.stringify({ error: 'Missing environment variables' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Initialize Supabase client with service role for admin access
    const supabase = createClient(supabaseUrl, supabaseServiceRole)
    
    // Get request method and path
    const { pathname } = new URL(req.url)
    const path = pathname.replace('/rxnorm-portuguese-mapping', '')
    
    console.log(`Processing request: ${req.method} ${path}`)
    
    // Route handler
    if (req.method === 'POST' && path === '/translate') {
      const { englishName, rxnormCode } = await req.json()
      
      if (!englishName && !rxnormCode) {
        return new Response(
          JSON.stringify({ error: 'Missing required fields: englishName or rxnormCode' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
      }
      
      // Check if we already have a translation
      const { data: existingMapping, error: lookupError } = await supabase
        .from('rxnorm_portuguese_mappings')
        .select('*')
        .or(`rxnorm_code.eq.${rxnormCode},english_name.ilike.${englishName}`)
        .maybeSingle()
      
      if (existingMapping) {
        return new Response(
          JSON.stringify({ 
            success: true,
            mapping: existingMapping,
            source: 'database'
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      
      // If not found in our database, attempt to find a translation
      // This would typically involve calling a translation API or service
      // For example, using an external medical dictionary or translation service
      
      // For demonstration purposes, let's simulate a translation based on common patterns
      // In a real implementation, this would connect to ANVISA API or a medical translation service
      let portugueseName = await simulateTranslation(englishName || '')
      
      // Check if we already have ANVISA code for this medication
      const anvisaCode = rxnormCode ? await getAnvisaCodeForRxnorm(rxnormCode, supabase) : null
      
      // Save the new mapping
      const { data: newMapping, error: insertError } = await supabase
        .from('rxnorm_portuguese_mappings')
        .insert({
          rxnorm_code: rxnormCode,
          english_name: englishName,
          portuguese_name: portugueseName,
          anvisa_code: anvisaCode,
          last_updated: new Date().toISOString()
        })
        .select()
        .single()
      
      if (insertError) {
        console.error('Error inserting mapping:', insertError)
        return new Response(
          JSON.stringify({ error: 'Failed to save mapping', details: insertError }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
      }
      
      return new Response(
        JSON.stringify({ 
          success: true,
          mapping: newMapping,
          source: 'translation' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } 
    else if (req.method === 'GET' && path.startsWith('/search')) {
      const url = new URL(req.url)
      const term = url.searchParams.get('term')
      
      if (!term) {
        return new Response(
          JSON.stringify({ error: 'Missing search term' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
      }
      
      // Search for medications in both languages
      const { data: mappings, error: searchError } = await supabase
        .from('rxnorm_portuguese_mappings')
        .select('*')
        .or(`portuguese_name.ilike.%${term}%,english_name.ilike.%${term}%`)
        .limit(20)
      
      if (searchError) {
        console.error('Error searching mappings:', searchError)
        return new Response(
          JSON.stringify({ error: 'Failed to search mappings', details: searchError }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
      }
      
      return new Response(
        JSON.stringify({ 
          success: true,
          results: mappings
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    else if (req.method === 'GET' && path.startsWith('/suggestions')) {
      const url = new URL(req.url)
      const term = url.searchParams.get('term')
      
      if (!term) {
        return new Response(
          JSON.stringify({ error: 'Missing search term' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
      }
      
      // Get Portuguese name suggestions
      const { data: suggestions, error: suggestionsError } = await supabase
        .from('rxnorm_portuguese_mappings')
        .select('portuguese_name')
        .ilike('portuguese_name', `%${term}%`)
        .limit(10)
      
      if (suggestionsError) {
        console.error('Error getting suggestions:', suggestionsError)
        return new Response(
          JSON.stringify({ error: 'Failed to get suggestions', details: suggestionsError }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
      }
      
      return new Response(
        JSON.stringify({ 
          success: true,
          suggestions: suggestions.map(s => s.portuguese_name)
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    // Route not found
    return new Response(
      JSON.stringify({ error: 'Route not found' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
    )
  } catch (error) {
    console.error('Unhandled error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

// Helper function to simulate getting an ANVISA code for an RxNorm code
async function getAnvisaCodeForRxnorm(rxnormCode: string, supabase: any): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('rxnorm_anvisa_mappings')
      .select('anvisa_code')
      .eq('rxnorm_code', rxnormCode)
      .maybeSingle()
      
    if (error || !data) {
      return null
    }
    
    return data.anvisa_code
  } catch (error) {
    console.error('Error getting ANVISA code:', error)
    return null
  }
}

// Helper function to simulate translation
// In a real-world scenario, this would call an external API or use a more sophisticated approach
async function simulateTranslation(englishName: string): Promise<string> {
  // Expanded medication name translations
  const translations: Record<string, string> = {
    'acetaminophen': 'Paracetamol',
    'paracetamol': 'Paracetamol',
    'aspirin': 'Ácido Acetilsalicílico',
    'ibuprofen': 'Ibuprofeno',
    'amoxicillin': 'Amoxicilina',
    'amoxicilina': 'Amoxicilina',
    'diphenhydramine': 'Difenidramina',
    'omeprazole': 'Omeprazol',
    'omeprazol': 'Omeprazol',
    'metformin': 'Metformina',
    'amlodipine': 'Anlodipino',
    'atorvastatin': 'Atorvastatina',
    'lisinopril': 'Lisinopril',
    'azithromycin': 'Azitromicina',
    'loratadine': 'Loratadina',
    'ciprofloxacin': 'Ciprofloxacino',
    'furosemide': 'Furosemida',
    'hydrochlorothiazide': 'Hidroclorotiazida',
    'sertraline': 'Sertralina',
    'simvastatin': 'Sinvastatina',
    'losartan': 'Losartana',
    'metoprolol': 'Metoprolol',
    'prednisone': 'Prednisona',
    'gabapentin': 'Gabapentina',
    'tramadol': 'Tramadol',
    'alprazolam': 'Alprazolam',
    'cephalexin': 'Cefalexina',
    'montelukast': 'Montelucaste',
    'fluoxetine': 'Fluoxetina',
    'hydrocortisone': 'Hidrocortisona',
    'insulin': 'Insulina',
    'clonazepam': 'Clonazepam',
    'clopidogrel': 'Clopidogrel',
    'dexamethasone': 'Dexametasona',
    'diazepam': 'Diazepam',
    'diclofenac': 'Diclofenaco',
    'doxycycline': 'Doxiciclina',
    'enalapril': 'Enalapril',
    'escitalopram': 'Escitalopram',
    'famotidine': 'Famotidina',
    'fenofibrate': 'Fenofibrato',
    'finasteride': 'Finasterida',
    'fluconazole': 'Fluconazol',
    'glimepiride': 'Glimepirida',
    'glipizide': 'Glipizida',
    'hydralazine': 'Hidralazina',
    'ibandronate': 'Ibandronato',
    'indomethacin': 'Indometacina',
    'lamotrigine': 'Lamotrigina',
    'levetiracetam': 'Levetiracetam',
    'levothyroxine': 'Levotiroxina',
    'losartan potassium': 'Losartana Potássica',
    'meclizine': 'Meclizina',
    'meloxicam': 'Meloxicam',
    'methylprednisolone': 'Metilprednisolona',
    'metronidazole': 'Metronidazol',
    'naproxen': 'Naproxeno',
    'nitrofurantoin': 'Nitrofurantoína',
    'nortriptyline': 'Nortriptilina',
    'ondansetron': 'Ondansetrona',
    'oxycodone': 'Oxicodona',
    'pantoprazole': 'Pantoprazol',
    'penicillin': 'Penicilina',
    'pravastatin': 'Pravastatina',
    'propranolol': 'Propranolol',
    'ranitidine': 'Ranitidina',
    'risperidone': 'Risperidona',
    'rosuvastatin': 'Rosuvastatina',
    'sildenafil': 'Sildenafila',
    'spironolactone': 'Espironolactona',
    'sulfamethoxazole': 'Sulfametoxazol',
    'sumatriptan': 'Sumatriptana',
    'tadalafil': 'Tadalafila',
    'tamsulosin': 'Tansulosina',
    'terbinafine': 'Terbinafina',
    'topiramate': 'Topiramato',
    'valacyclovir': 'Valaciclovir',
    'valsartan': 'Valsartana',
    'venlafaxine': 'Venlafaxina',
    'warfarin': 'Varfarina',
    'zolpidem': 'Zolpidem',
    'bupropion': 'Bupropiona',
    'carvedilol': 'Carvedilol',
    'cetirizine': 'Cetirizina',
    'citalopram': 'Citalopram',
    'cyclobenzaprine': 'Ciclobenzaprina',
    'duloxetine': 'Duloxetina',
    'fluvoxamine': 'Fluvoxamina',
    'haloperidol': 'Haloperidol',
    'labetalol': 'Labetalol',
    'lansoprazole': 'Lansoprazol',
    'levofloxacin': 'Levofloxacino',
    'lidocaine': 'Lidocaína',
    'loperamide': 'Loperamida',
    'lorazepam': 'Lorazepam',
    'morphine': 'Morfina',
    'pioglitazone': 'Pioglitazona',
    'pregabalin': 'Pregabalina',
    'quetiapine': 'Quetiapina',
    'ramipril': 'Ramipril',
    'rivaroxaban': 'Rivaroxabana',
    'simethicone': 'Simeticona',
    'telmisartan': 'Telmisartana',
    'tiotropium': 'Tiotrópio',
    'trazodone': 'Trazodona',
    'verapamil': 'Verapamil',
    'vitamin d': 'Vitamina D',
    'zinc oxide': 'Óxido de Zinco'
  }
  
  // Check for direct match (case insensitive)
  const lowercaseEnglishName = englishName.toLowerCase()
  
  for (const [eng, pt] of Object.entries(translations)) {
    if (lowercaseEnglishName.includes(eng.toLowerCase())) {
      // Replace the matched part with Portuguese equivalent
      const regex = new RegExp(eng, 'i')
      return englishName.replace(regex, pt)
    }
  }
  
  // If no direct match, for demo purposes add 'a' to the end if it doesn't end with 'a' or 'e'
  if (!englishName.endsWith('a') && !englishName.endsWith('e')) {
    return englishName + 'a'
  }
  
  // Otherwise just return the original
  return englishName
}
