
import { allTranslations, TranslationCategories, TranslationKey } from './categories';

export type { TranslationKey };

export type Language = 'en' | 'pt';

// Flatten the translations for each language
const flattenTranslations = <T extends Record<string, any>>(obj: T, prefix = ''): Record<string, string> => {
  return Object.keys(obj).reduce((acc, k) => {
    const pre = prefix.length ? `${prefix}.` : '';
    if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
      Object.assign(acc, flattenTranslations(obj[k], `${pre}${k}`));
    } else {
      acc[`${pre}${k}`] = obj[k];
    }
    return acc;
  }, {} as Record<string, string>);
};

export const translations: Record<Language, Record<TranslationKey, string>> = {
  en: {} as Record<TranslationKey, string>,
  pt: {} as Record<TranslationKey, string>
};

// Loop through each category and add to the flattened translations
Object.keys(allTranslations).forEach((category) => {
  const categoryKey = category as keyof TranslationCategories;
  const categoryTranslations = allTranslations[categoryKey];
  
  // Add English translations
  Object.entries(categoryTranslations.en).forEach(([key, value]) => {
    translations.en[key as TranslationKey] = value;
  });
  
  // Add Portuguese translations
  Object.entries(categoryTranslations.pt).forEach(([key, value]) => {
    translations.pt[key as TranslationKey] = value;
  });
});
