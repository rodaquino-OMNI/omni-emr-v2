
import {
  AuthTranslationKey,
  CommonTranslationKey,
  PatientsTranslationKey,
  AppointmentsTranslationKey,
  MedicationsTranslationKey,
  TasksTranslationKey,
  UsersTranslationKey,
  authTranslations,
  commonTranslations,
  patientsTranslations,
  appointmentsTranslations,
  medicationsTranslations,
  tasksTranslations,
  usersTranslations
} from './categories';

// Combined translation key type
export type TranslationKey =
  | AuthTranslationKey
  | CommonTranslationKey
  | PatientsTranslationKey
  | AppointmentsTranslationKey
  | MedicationsTranslationKey
  | TasksTranslationKey
  | UsersTranslationKey;

// Merge all translations into a single object
export const translations: Record<'en' | 'pt', Record<TranslationKey, string>> = {
  pt: {
    ...authTranslations.pt,
    ...commonTranslations.pt,
    ...patientsTranslations.pt,
    ...appointmentsTranslations.pt,
    ...medicationsTranslations.pt,
    ...tasksTranslations.pt,
    ...usersTranslations.pt
  },
  en: {
    ...authTranslations.en,
    ...commonTranslations.en,
    ...patientsTranslations.en,
    ...appointmentsTranslations.en,
    ...medicationsTranslations.en,
    ...tasksTranslations.en,
    ...usersTranslations.en
  }
};
