
/**
 * Mock translations database for offline mode
 * Used when the application cannot connect to the Supabase backend
 */

// Import translations by category
import { painMedicationTranslations } from './translations/painMeds';
import { antibioticTranslations } from './translations/antibiotics';
import { antiviralAntifungalTranslations } from './translations/antivirals';
import { antihistamineTranslations } from './translations/antihistamines';
import { gastrointestinalTranslations } from './translations/gastrointestinal';
import { diabetesTranslations } from './translations/diabetes';
import { cardiovascularTranslations } from './translations/cardiovascular';
import { psychotropicTranslations } from './translations/psychotropic';
import { respiratoryTranslations } from './translations/respiratory';
import { hormoneTranslations } from './translations/hormones';
import { miscTranslations } from './translations/misc';

// Record mapping English medication names to Portuguese
export const medicationTranslations: Record<string, string> = {
  ...painMedicationTranslations,
  ...antibioticTranslations,
  ...antiviralAntifungalTranslations,
  ...antihistamineTranslations,
  ...gastrointestinalTranslations,
  ...diabetesTranslations,
  ...cardiovascularTranslations,
  ...psychotropicTranslations,
  ...respiratoryTranslations,
  ...hormoneTranslations,
  ...miscTranslations
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
