
import { authTranslations, AuthTranslationKey } from './auth';
import { commonTranslations, CommonTranslationKey } from './common';
import { patientsTranslations, PatientsTranslationKey } from './patients';
import { appointmentsTranslations, AppointmentsTranslationKey } from './appointments';
import { medicationsTranslations, MedicationsTranslationKey } from './medications';
import { tasksTranslations, TasksTranslationKey } from './tasks';
import { usersTranslations, UsersTranslationKey } from './users';
import { ordersTranslations, OrdersTranslationKey } from './orders';

// Export all translation key types
export type {
  AuthTranslationKey,
  CommonTranslationKey,
  PatientsTranslationKey,
  AppointmentsTranslationKey,
  MedicationsTranslationKey,
  TasksTranslationKey,
  UsersTranslationKey,
  OrdersTranslationKey
};

// Export all translations
export {
  authTranslations,
  commonTranslations,
  patientsTranslations,
  appointmentsTranslations,
  medicationsTranslations,
  tasksTranslations,
  usersTranslations,
  ordersTranslations
};
