
import { RouteObject } from 'react-router-dom';
import TranslationDiagnostics from '../components/debug/TranslationDiagnostics';
import MedicationTranslationsAdmin from '../components/admin/MedicationTranslationsAdmin';

export const translationRoutes: RouteObject[] = [
  { path: "/translations/diagnostics", element: <TranslationDiagnostics /> },
  { path: "/translations/admin", element: <MedicationTranslationsAdmin /> }
];
