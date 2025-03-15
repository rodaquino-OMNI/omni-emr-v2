
import { RouteObject } from 'react-router-dom';
import TranslationDiagnostics from '@/components/debug/TranslationDiagnostics';
import MedicationAutocompleteDemoPage from '@/components/debug/MedicationAutocompleteDemoPage';

export const translationRoutes: RouteObject[] = [
  {
    path: '/debug/translation-diagnostics',
    element: <TranslationDiagnostics />
  },
  {
    path: '/debug/medication-autocomplete-demo',
    element: <MedicationAutocompleteDemoPage />
  }
];
