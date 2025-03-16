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
  // Expanded medication name translations (English to Portuguese)
  const translations: Record<string, string> = {
    // Common pain relievers and antipyretics
    'acetaminophen': 'Paracetamol',
    'paracetamol': 'Paracetamol',
    'aspirin': 'Ácido Acetilsalicílico',
    'ibuprofen': 'Ibuprofeno',
    'naproxen': 'Naproxeno',
    'diclofenac': 'Diclofenaco',
    'meloxicam': 'Meloxicam',
    'celecoxib': 'Celecoxibe',
    'ketorolac': 'Cetorolaco',
    'indomethacin': 'Indometacina',
    'piroxicam': 'Piroxicam',
    'mefenamic acid': 'Ácido Mefenâmico',
    'ketoprofen': 'Cetoprofeno',
    'etodolac': 'Etodolaco',
    'nimesulide': 'Nimesulida',
    'acetylsalicylic acid': 'Ácido Acetilsalicílico',
    
    // Antibiotics
    'amoxicillin': 'Amoxicilina',
    'amoxicilina': 'Amoxicilina',
    'azithromycin': 'Azitromicina',
    'ciprofloxacin': 'Ciprofloxacino',
    'cephalexin': 'Cefalexina',
    'doxycycline': 'Doxiciclina',
    'penicillin': 'Penicilina',
    'metronidazole': 'Metronidazol',
    'amoxicillin-clavulanate': 'Amoxicilina + Clavulanato',
    'clarithromycin': 'Claritromicina',
    'clindamycin': 'Clindamicina',
    'levofloxacin': 'Levofloxacino',
    'nitrofurantoin': 'Nitrofurantoína',
    'sulfamethoxazole': 'Sulfametoxazol',
    'trimethoprim': 'Trimetoprima',
    'trimethoprim-sulfamethoxazole': 'Trimetoprima + Sulfametoxazol',
    'erythromycin': 'Eritromicina',
    'tetracycline': 'Tetraciclina',
    'vancomycin': 'Vancomicina',
    'gentamicin': 'Gentamicina',
    'ampicillin': 'Ampicilina',
    'meropenem': 'Meropenem',
    'imipenem-cilastatin': 'Imipenem + Cilastatina',
    'ceftriaxone': 'Ceftriaxona',
    'cefuroxime': 'Cefuroxima',
    'cefazolin': 'Cefazolina',
    'cefepime': 'Cefepima',
    'linezolid': 'Linezolida',
    'piperacillin-tazobactam': 'Piperacilina + Tazobactam',
    
    // Antivirals and antifungals
    'acyclovir': 'Aciclovir',
    'fluconazole': 'Fluconazol',
    'valacyclovir': 'Valaciclovir',
    'terbinafine': 'Terbinafina',
    'oseltamivir': 'Oseltamivir',
    'itraconazole': 'Itraconazol',
    'ketoconazole': 'Cetoconazol',
    'nystatin': 'Nistatina',
    'ganciclovir': 'Ganciclovir',
    'ribavirin': 'Ribavirina',
    'voriconazole': 'Voriconazol',
    'posaconazole': 'Posaconazol',
    'clotrimazole': 'Clotrimazol',
    'miconazole': 'Miconazol',
    'amphotericin b': 'Anfotericina B',
    'caspofungin': 'Caspofungina',
    
    // Antihistamines and allergy medications
    'diphenhydramine': 'Difenidramina',
    'loratadine': 'Loratadina',
    'cetirizine': 'Cetirizina',
    'fexofenadine': 'Fexofenadina',
    'desloratadine': 'Desloratadina',
    'levocetirizine': 'Levocetirizina',
    'hydroxyzine': 'Hidroxizina',
    'clemastine': 'Clemastina',
    'cyproheptadine': 'Ciproeptadina',
    'brompheniramine': 'Bromfeniramina',
    'chlorpheniramine': 'Clorfeniramina',
    'doxylamine': 'Doxilamina',
    'promethazine': 'Prometazina',
    
    // Gastrointestinal medications
    'omeprazole': 'Omeprazol',
    'omeprazol': 'Omeprazol',
    'pantoprazole': 'Pantoprazol',
    'lansoprazole': 'Lansoprazol',
    'esomeprazole': 'Esomeprazol',
    'ranitidine': 'Ranitidina',
    'famotidine': 'Famotidina',
    'cimetidine': 'Cimetidina',
    'bismuth subsalicylate': 'Subsalicilato de Bismuto',
    'simethicone': 'Simeticona',
    'loperamide': 'Loperamida',
    'metoclopramide': 'Metoclopramida',
    'ondansetron': 'Ondansetrona',
    'prochlorperazine': 'Proclorperazina',
    'misoprostol': 'Misoprostol',
    'dicyclomine': 'Diciclomina',
    'hyoscyamine': 'Hiosciamina',
    'mesalamine': 'Mesalamina',
    'sulfasalazine': 'Sulfassalazina',
    'lactulose': 'Lactulose',
    'polyethylene glycol': 'Polietilenoglicol',
    'bisacodyl': 'Bisacodil',
    'docusate': 'Docusato',
    'psyllium': 'Psílio',
    'domperidone': 'Domperidona',
    'antacid': 'Antiácido',
    
    // Diabetes medications
    'metformin': 'Metformina',
    'glipizide': 'Glipizida',
    'glyburide': 'Glibenclamida',
    'glimepiride': 'Glimepirida',
    'pioglitazone': 'Pioglitazona',
    'rosiglitazone': 'Rosiglitazona',
    'sitagliptin': 'Sitagliptina',
    'linagliptin': 'Linagliptina',
    'saxagliptin': 'Saxagliptina',
    'alogliptin': 'Alogliptina',
    'empagliflozin': 'Empagliflozina',
    'dapagliflozin': 'Dapagliflozina',
    'canagliflozin': 'Canagliflozina',
    'exenatide': 'Exenatida',
    'liraglutide': 'Liraglutida',
    'dulaglutide': 'Dulaglutida',
    'semaglutide': 'Semaglutida',
    'acarbose': 'Acarbose',
    'miglitol': 'Miglitol',
    'repaglinide': 'Repaglinida',
    'nateglinide': 'Nateglinida',
    'insulin glargine': 'Insulina Glargina',
    'insulin detemir': 'Insulina Detemir',
    'insulin aspart': 'Insulina Asparte',
    'insulin lispro': 'Insulina Lispro',
    'insulin': 'Insulina',
    
    // Cardiovascular medications
    'amlodipine': 'Anlodipino',
    'atorvastatin': 'Atorvastatina',
    'lisinopril': 'Lisinopril',
    'furosemide': 'Furosemida',
    'hydrochlorothiazide': 'Hidroclorotiazida',
    'sertraline': 'Sertralina',
    'simvastatin': 'Sinvastatina',
    'losartan': 'Losartana',
    'metoprolol': 'Metoprolol',
    'propranolol': 'Propranolol',
    'atenolol': 'Atenolol',
    'carvedilol': 'Carvedilol',
    'diltiazem': 'Diltiazem',
    'verapamil': 'Verapamil',
    'nifedipine': 'Nifedipina',
    'felodipine': 'Felodipina',
    'enalapril': 'Enalapril',
    'captopril': 'Captopril',
    'ramipril': 'Ramipril',
    'quinapril': 'Quinapril',
    'benazepril': 'Benazepril',
    'fosinopril': 'Fosinopril',
    'trandolapril': 'Trandolapril',
    'perindopril': 'Perindopril',
    'candesartan': 'Candesartana',
    'irbesartan': 'Irbesartana',
    'telmisartan': 'Telmisartana',
    'valsartan': 'Valsartana',
    'olmesartan': 'Olmesartana',
    'eprosartan': 'Eprosartana',
    'azilsartan': 'Azilsartana',
    'bisoprolol': 'Bisoprolol',
    'labetalol': 'Labetalol',
    'nebivolol': 'Nebivolol',
    'hydralazine': 'Hidralazina',
    'minoxidil': 'Minoxidil',
    'clonidine': 'Clonidina',
    'methyldopa': 'Metildopa',
    'doxazosin': 'Doxazosina',
    'terazosin': 'Terazosina',
    'prazosin': 'Prazosina',
    'spironolactone': 'Espironolactona',
    'eplerenone': 'Eplerenona',
    'digoxin': 'Digoxina',
    'isosorbide dinitrate': 'Dinitrato de Isossorbida',
    'isosorbide mononitrate': 'Mononitrato de Isossorbida',
    'nitroglycerin': 'Nitroglicerina',
    'amiodarone': 'Amiodarona',
    'sotalol': 'Sotalol',
    'flecainide': 'Flecainida',
    'propafenone': 'Propafenona',
    'warfarin': 'Varfarina',
    'clopidogrel': 'Clopidogrel',
    'prasugrel': 'Prasugrel',
    'ticagrelor': 'Ticagrelor',
    'dipyridamole': 'Dipiridamol',
    'cilostazol': 'Cilostazol',
    'rivaroxaban': 'Rivaroxabana',
    'apixaban': 'Apixabana',
    'dabigatran': 'Dabigatrana',
    'edoxaban': 'Edoxabana',
    'lovastatin': 'Lovastatina',
    'pravastatin': 'Pravastatina',
    'rosuvastatin': 'Rosuvastatina',
    'fluvastatin': 'Fluvastatina',
    'pitavastatin': 'Pitavastatina',
    'ezetimibe': 'Ezetimiba',
    'fenofibrate': 'Fenofibrato',
    'gemfibrozil': 'Genfibrozila',
    'niacin': 'Niacina',
    'icosapent ethyl': 'Etil Icosapentato',
    'omega-3 fatty acids': 'Ácidos Graxos Ômega-3',
    'bumetanide': 'Bumetanida',
    'torsemide': 'Torasemida',
    'chlorthalidone': 'Clortalidona',
    'indapamide': 'Indapamida',
    'metolazone': 'Metolazona',
    'triamterene': 'Triantereno',
    'amiloride': 'Amilorida',
    
    // Psychotropic medications
    'fluoxetine': 'Fluoxetina',
    'clonazepam': 'Clonazepam',
    'alprazolam': 'Alprazolam',
    'diazepam': 'Diazepam',
    'lorazepam': 'Lorazepam',
    'escitalopram': 'Escitalopram',
    'trazodone': 'Trazodona',
    'citalopram': 'Citalopram',
    'paroxetine': 'Paroxetina',
    'venlafaxine': 'Venlafaxina',
    'duloxetine': 'Duloxetina',
    'bupropion': 'Bupropiona',
    'mirtazapine': 'Mirtazapina',
    'quetiapine': 'Quetiapina',
    'risperidone': 'Risperidona',
    'aripiprazole': 'Aripiprazol',
    'olanzapine': 'Olanzapina',
    'haloperidol': 'Haloperidol',
    'lithium': 'Lítio',
    'valproic acid': 'Ácido Valproico',
    'divalproex sodium': 'Valproato de Sódio',
    'carbamazepine': 'Carbamazepina',
    'oxcarbazepine': 'Oxcarbazepina',
    'lamotrigine': 'Lamotrigina',
    'topiramate': 'Topiramato',
    'gabapentin': 'Gabapentina',
    'pregabalin': 'Pregabalina',
    'levetiracetam': 'Levetiracetam',
    'phenytoin': 'Fenitoína',
    'phenobarbital': 'Fenobarbital',
    'primidone': 'Primidona',
    'zonisamide': 'Zonisamida',
    'vigabatrin': 'Vigabatrina',
    'tiagabine': 'Tiagabina',
    'clozapine': 'Clozapina',
    'paliperidone': 'Paliperidona',
    'ziprasidone': 'Ziprasidona',
    'lurasidone': 'Lurasidona',
    'buspirone': 'Buspirona',
    'amitriptyline': 'Amitriptilina',
    'nortriptyline': 'Nortriptilina',
    'desipramine': 'Desipramina',
    'imipramine': 'Imipramina',
    'doxepin': 'Doxepina',
    'trimipramine': 'Trimipramina',
    'clomipramine': 'Clomipramina',
    'desvenlafaxine': 'Desvenlafaxina',
    'levomilnacipran': 'Levomilnaciprona',
    'vilazodone': 'Vilazodona',
    'vortioxetine': 'Vortioxetina',
    'fluvoxamine': 'Fluvoxamina',
    'temazepam': 'Temazepam',
    'chlordiazepoxide': 'Clordiazepóxido',
    'oxazepam': 'Oxazepam',
    'triazolam': 'Triazolam',
    'zolpidem': 'Zolpidem',
    'eszopiclone': 'Eszopiclona',
    'zaleplon': 'Zaleplon',
    'ramelteon': 'Ramelteon',
    'suvorexant': 'Suvorexante',
    
    // Respiratory medications
    'albuterol': 'Salbutamol',
    'fluticasone': 'Fluticasona',
    'montelukast': 'Montelucaste',
    'tiotropium': 'Tiotrópio',
    'ipratropium': 'Ipratrópio',
    'salmeterol': 'Salmeterol',
    'formoterol': 'Formoterol',
    'budesonide': 'Budesonida',
    'beclomethasone': 'Beclometasona',
    'mometasone': 'Mometasona',
    'ciclesonide': 'Ciclesonida',
    'flunisolide': 'Flunisolida',
    'theophylline': 'Teofilina',
    'zafirlukast': 'Zafirlucaste',
    'zileuton': 'Zileutona',
    'roflumilast': 'Roflumilaste',
    'cromolyn': 'Cromolina',
    'nedocromil': 'Nedocromil',
    'epinephrine': 'Epinefrina',
    'terbutaline': 'Terbutalina',
    'levalbuterol': 'Levalbuterol',
    'arformoterol': 'Arformoterol',
    'indacaterol': 'Indacaterol',
    'aclidinium': 'Aclidínio',
    'umeclidinium': 'Umeclidínio',
    'glycopyrrolate': 'Glicopirrolato',
    'benzonatate': 'Benzonatato',
    'guaifenesin': 'Guaifenesina',
    'dextromethorphan': 'Dextrometorfano',
    'codeine': 'Codeína',
    
    // Steroids and hormones
    'prednisone': 'Prednisona',
    'hydrocortisone': 'Hidrocortisona',
    'dexamethasone': 'Dexametasona',
    'methylprednisolone': 'Metilprednisolona',
    'prednisolone': 'Prednisolona',
    'fludrocortisone': 'Fludrocortisona',
    'cortisone': 'Cortisona',
    'triamcinolone': 'Triancinolona',
    'betamethasone': 'Betametasona',
    'estradiol': 'Estradiol',
    'progesterone': 'Progesterona',
    'testosterone': 'Testosterona',
    'levothyroxine': 'Levotiroxina',
    'liothyronine': 'Liotironina',
    'medroxyprogesterone': 'Medroxiprogesterona',
    'norethindrone': 'Noretindrona',
    'ethinyl estradiol': 'Etinilestradiol',
    'desogestrel': 'Desogestrel',
    'norgestimate': 'Norgestimato',
    'drospirenone': 'Drospirenona',
    'levonorgestrel': 'Levonorgestrel',
    'etonogestrel': 'Etonogestrel',
    'finasteride': 'Finasterida',
    'tamoxifen': 'Tamoxifeno',
    'raloxifene': 'Raloxifeno',
    'oxandrolone': 'Oxandrolona',
    
    // Pain medications (opioids)
    'tramadol': 'Tramadol',
    'morphine': 'Morfina',
    'oxycodone': 'Oxicodona',
    'hydrocodone': 'Hidrocodona',
    'hydromorphone': 'Hidromorfona',
    'fentanyl': 'Fentanil',
    'methadone': 'Metadona',
    'buprenorphine': 'Buprenorfina',
    'tapentadol': 'Tapentadol',
    'oxymorphone': 'Oximorfona',
    'meperidine': 'Meperidina',
    'naloxone': 'Naloxona',
    'naltrexone': 'Naltrexona',
    
    // Muscle relaxants
    'cyclobenzaprine': 'Ciclobenzaprina',
    'baclofen': 'Baclofeno',
    'methocarbamol': 'Metocarbamol',
    'carisoprodol': 'Carisoprodol',
    'tizanidine': 'Tizanidina',
    'orphenadrine': 'Orfenadrina',
    'metaxalone': 'Metaxalona',
    'dantrolene': 'Dantroleno',
    
    // Gout medications
    'allopurinol': 'Alopurinol',
    'febuxostat': 'Febuxostate',
    'colchicine': 'Colchicina',
    'probenecid': 'Probenecida',
    
    // Men's health
    'sildenafil': 'Sildenafila',
    'tadalafil': 'Tadalafila',
    'vardenafil': 'Vardenafila',
    'avanafil': 'Avanafila',
    'tamsulosin': 'Tansulosina',
    'alfuzosin': 'Alfuzosina',
    'dutasteride': 'Dutasterida',
    
    // Misc medications
    'meclizine': 'Meclizina',
    'sumatriptan': 'Sumatriptana',
    'ibandronate': 'Ibandronato',
    'vitamin d': 'Vitamina D',
    'zinc oxide': 'Óxido de Zinco'
  };
  
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
