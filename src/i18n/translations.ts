
import { CommonTranslationKey, commonTranslations } from './categories/common';
import { PatientTranslationKey, patientTranslations } from './categories/patients';
import { MedicationTranslationKey, medicationTranslations } from './categories/medications';
import { AppointmentTranslationKey, appointmentTranslations } from './categories/appointments';
import { TaskTranslationKey, taskTranslations } from './categories/tasks';
import { AuthTranslationKey, authTranslations } from './categories/auth';
import { SettingsTranslationKey, settingsTranslations } from './categories/settings';
import { UsersTranslationKey, usersTranslations } from './categories/users';
import { ValidationTranslationKey, validationTranslations } from './categories/validations';

// Union type of all possible translation keys
export type TranslationKey =
  | CommonTranslationKey
  | PatientTranslationKey
  | MedicationTranslationKey
  | AppointmentTranslationKey
  | TaskTranslationKey
  | AuthTranslationKey
  | SettingsTranslationKey
  | UsersTranslationKey
  | ValidationTranslationKey;

// Combine all translation categories
export const translations = {
  en: {
    ...commonTranslations.en,
    ...patientTranslations?.en,
    ...medicationTranslations?.en,
    ...appointmentTranslations?.en,
    ...taskTranslations?.en,
    ...authTranslations?.en,
    ...settingsTranslations?.en,
    ...usersTranslations?.en,
    ...validationTranslations?.en,
  },
  pt: {
    ...commonTranslations.pt,
    ...patientTranslations?.pt,
    ...medicationTranslations?.pt,
    ...appointmentTranslations?.pt,
    ...taskTranslations?.pt,
    ...authTranslations?.pt,
    ...settingsTranslations?.pt,
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
