
import { RouteObject } from 'react-router-dom';
import TranslationDiagnostics from '@/components/debug/TranslationDiagnostics';

export const translationRoutes: RouteObject[] = [
  {
    path: '/translation-diagnostics',
    element: <TranslationDiagnostics />
  }
];
