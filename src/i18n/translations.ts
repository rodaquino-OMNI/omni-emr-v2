
import { CommonTranslationKey, commonTranslations } from './categories/common';
import { PatientsTranslationKey, patientsTranslations } from './categories/patients';
import { MedicationsTranslationKey, medicationsTranslations } from './categories/medications';
import { AppointmentsTranslationKey, appointmentsTranslations } from './categories/appointments';
import { TasksTranslationKey, tasksTranslations } from './categories/tasks';
import { AuthTranslationKey, authTranslations } from './categories/auth';
import { ValidationTranslationKey, validationTranslations } from './categories/validations';
import { UsersTranslationKey, usersTranslations } from './categories/users';

// Make TranslationKey a string to allow any string literal
export type TranslationKey = string;

// Define translations as a simple Record type with string keys
export type TranslationsType = Record<string, string>;

// Combine all translation categories
export const translations: Record<string, TranslationsType> = {
  en: {
    ...commonTranslations.en,
    ...patientsTranslations?.en,
    ...medicationsTranslations?.en,
    ...appointmentsTranslations?.en,
    ...tasksTranslations?.en,
    ...authTranslations?.en,
    ...usersTranslations?.en,
    ...validationTranslations?.en,
  },
  pt: {
    ...commonTranslations.pt,
    ...patientsTranslations?.pt,
    ...medicationsTranslations?.pt,
    ...appointmentsTranslations?.pt,
    ...tasksTranslations?.pt,
    ...authTranslations?.pt,
    ...usersTranslations?.pt,
    ...validationTranslations?.pt,
  }
};

// Create a debug function to identify missing translations
export const validateAllTranslations = (): {
  missingInEnglish: string[];
  missingInPortuguese: string[];
} => {
  const allKeys = Object.keys(translations.en).concat(Object.keys(translations.pt));
  const uniqueKeys = [...new Set(allKeys)];
  
  const missingInEnglish = uniqueKeys.filter(key => translations.en[key] === undefined);
  const missingInPortuguese = uniqueKeys.filter(key => translations.pt[key] === undefined);
  
  return {
    missingInEnglish,
    missingInPortuguese
  };
};
