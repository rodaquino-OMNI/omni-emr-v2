
/**
 * Mock translations database for offline mode
 * Used when the application cannot connect to the Supabase backend
 */

// Record mapping English medication names to Portuguese
export const medicationTranslations: Record<string, string> = {
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
};

/**
 * Function to get Portuguese medication name in offline mode
 */
export const getOfflinePortugueseName = (englishName: string): string | null => {
  if (!englishName) return null;
  
  const lowercaseEnglishName = englishName.toLowerCase();
  
  // First check for exact match
  if (medicationTranslations[lowercaseEnglishName]) {
    return medicationTranslations[lowercaseEnglishName];
  }
  
  // Then check for partial match
  for (const [eng, pt] of Object.entries(medicationTranslations)) {
    if (lowercaseEnglishName.includes(eng.toLowerCase())) {
      // Replace the matched part with Portuguese equivalent
      const regex = new RegExp(eng, 'i');
      return englishName.replace(regex, pt);
    }
  }
  
  return null;
};

/**
 * Get Portuguese suggestions for a search term in offline mode
 */
export const getOfflinePortugueseSuggestions = (searchTerm: string, limit = 10): string[] => {
  if (!searchTerm || searchTerm.length < 2) return [];
  
  const lowercaseTerm = searchTerm.toLowerCase();
  const suggestions: string[] = [];
  
  // Look for Portuguese names that include the search term
  for (const pt of Object.values(medicationTranslations)) {
    if (pt.toLowerCase().includes(lowercaseTerm)) {
      suggestions.push(pt);
      if (suggestions.length >= limit) break;
    }
  }
  
  return suggestions;
};

/**
 * Function to get English medication name from Portuguese name in offline mode
 */
export const getOfflineEnglishName = (portugueseName: string): string | null => {
  if (!portugueseName) return null;
  
  const lowercasePortugueseName = portugueseName.toLowerCase();
  
  for (const [eng, pt] of Object.entries(medicationTranslations)) {
    if (pt.toLowerCase() === lowercasePortugueseName) {
      return eng;
    }
  }
  
  return null;
};
