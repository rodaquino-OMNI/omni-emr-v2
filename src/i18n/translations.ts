
import { CommonTranslationKey, commonTranslations } from './categories/common';
import { PatientsTranslationKey, patientsTranslations } from './categories/patients';
import { MedicationsTranslationKey, medicationsTranslations } from './categories/medications';
import { AppointmentsTranslationKey, appointmentsTranslations } from './categories/appointments';
import { TasksTranslationKey, tasksTranslations } from './categories/tasks';
import { AuthTranslationKey, authTranslations } from './categories/auth';
import { ValidationTranslationKey, validationTranslations } from './categories/validations';
import { UsersTranslationKey, usersTranslations } from './categories/users';

// Union type of all possible translation keys
export type TranslationKey =
  | CommonTranslationKey
  | PatientsTranslationKey
  | MedicationsTranslationKey
  | AppointmentsTranslationKey
  | TasksTranslationKey
  | AuthTranslationKey
  | UsersTranslationKey
  | ValidationTranslationKey;

// Combine all translation categories
export const translations = {
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
  
  const missingInEnglish = uniqueKeys.filter(key => translations.en[key as TranslationKey] === undefined);
  const missingInPortuguese = uniqueKeys.filter(key => translations.pt[key as TranslationKey] === undefined);
  
  return {
    missingInEnglish,
    missingInPortuguese
  };
};
