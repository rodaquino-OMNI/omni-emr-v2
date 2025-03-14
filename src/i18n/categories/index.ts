
import { authTranslations, AuthTranslationKey } from './auth';
import { commonTranslations, CommonTranslationKey } from './common';
import { patientsTranslations, PatientsTranslationKey } from './patients';
import { appointmentsTranslations, AppointmentsTranslationKey } from './appointments';
import { medicationsTranslations, MedicationsTranslationKey } from './medications';
import { tasksTranslations, TasksTranslationKey } from './tasks';
import { usersTranslations, UsersTranslationKey } from './users';
import { ordersTranslations, OrdersTranslationKey } from './orders';
import { medicalHistoryTranslations, MedicalHistoryTranslationKey } from './medicalHistory';
import { vitalsTranslations, VitalsTranslationKey } from './vitals';

// Export all translation key types
export type {
  AuthTranslationKey,
  CommonTranslationKey,
  PatientsTranslationKey,
  AppointmentsTranslationKey,
  MedicationsTranslationKey,
  TasksTranslationKey,
  UsersTranslationKey,
  OrdersTranslationKey,
  MedicalHistoryTranslationKey,
  VitalsTranslationKey
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
  ordersTranslations,
  medicalHistoryTranslations,
  vitalsTranslations
};
