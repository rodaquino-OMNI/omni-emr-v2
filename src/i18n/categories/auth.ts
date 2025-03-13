
export type AuthTranslationKey =
  | 'email'
  | 'password'
  | 'signIn'
  | 'invalidCredentials'
  | 'loginRequired'
  | 'loginRequiredDescription'
  | 'sessionExpiredTitle'
  | 'sessionExpiredDescription'
  | 'sessionExpiringTitle'
  | 'sessionExpiringDescription'
  | 'stayLoggedIn';

export const authTranslations = {
  pt: {
    email: 'Email',
    password: 'Senha',
    signIn: 'Entrar',
    invalidCredentials: 'Email ou senha inválidos',
    loginRequired: 'Login necessário',
    loginRequiredDescription: 'Por favor, faça login para acessar esta página',
    sessionExpiredTitle: 'Sessão expirada',
    sessionExpiredDescription: 'Sua sessão expirou devido a inatividade. Por favor, faça login novamente.',
    sessionExpiringTitle: 'Sessão prestes a expirar',
    sessionExpiringDescription: 'Sua sessão expirará em breve devido a inatividade. Clique em qualquer lugar para continuar.',
    stayLoggedIn: 'Continuar sessão',
  },
  en: {
    email: 'Email',
    password: 'Password',
    signIn: 'Sign In',
    invalidCredentials: 'Invalid email or password',
    loginRequired: 'Login required',
    loginRequiredDescription: 'Please log in to access this page',
    sessionExpiredTitle: 'Session expired',
    sessionExpiredDescription: 'Your session has expired due to inactivity. Please log in again.',
    sessionExpiringTitle: 'Session expiring soon',
    sessionExpiringDescription: 'Your session will expire soon due to inactivity. Click anywhere to stay logged in.',
    stayLoggedIn: 'Stay logged in',
  }
};
