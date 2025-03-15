
import { RouteObject } from 'react-router-dom';
import TranslationDiagnostics from '@/components/debug/TranslationDiagnostics';

export const translationRoutes: RouteObject[] = [
  {
    path: '/debug/translation-diagnostics',
    element: <TranslationDiagnostics />
  }
];
