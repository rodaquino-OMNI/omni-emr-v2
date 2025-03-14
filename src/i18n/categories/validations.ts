
export type ValidationTranslationKey =
  | 'required'
  | 'invalidEmail'
  | 'minLength'
  | 'maxLength'
  | 'invalidPassword'
  | 'passwordMismatch'
  | 'invalidPhone'
  | 'invalidDate'
  | 'invalidNumber'
  | 'minValue'
  | 'maxValue'
  | 'invalidFormat'
  | 'fileTooBig'
  | 'fileTypeNotSupported';

export const validationTranslations = {
  pt: {
    required: 'Este campo é obrigatório',
    invalidEmail: 'Por favor, insira um endereço de e-mail válido',
    minLength: 'Este campo deve ter pelo menos {min} caracteres',
    maxLength: 'Este campo deve ter no máximo {max} caracteres',
    invalidPassword: 'A senha deve conter pelo menos 8 caracteres, uma letra maiúscula, uma minúscula e um número',
    passwordMismatch: 'As senhas não coincidem',
    invalidPhone: 'Por favor, insira um número de telefone válido',
    invalidDate: 'Por favor, insira uma data válida',
    invalidNumber: 'Por favor, insira um número válido',
    minValue: 'O valor deve ser maior ou igual a {min}',
    maxValue: 'O valor deve ser menor ou igual a {max}',
    invalidFormat: 'Formato inválido',
    fileTooBig: 'O arquivo é muito grande. O tamanho máximo é {maxSize}MB',
    fileTypeNotSupported: 'Tipo de arquivo não suportado. Tipos suportados: {types}'
  },
  en: {
    required: 'This field is required',
    invalidEmail: 'Please enter a valid email address',
    minLength: 'This field must be at least {min} characters',
    maxLength: 'This field must be at most {max} characters',
    invalidPassword: 'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one number',
    passwordMismatch: 'Passwords do not match',
    invalidPhone: 'Please enter a valid phone number',
    invalidDate: 'Please enter a valid date',
    invalidNumber: 'Please enter a valid number',
    minValue: 'Value must be greater than or equal to {min}',
    maxValue: 'Value must be less than or equal to {max}',
    invalidFormat: 'Invalid format',
    fileTooBig: 'File is too large. Maximum size is {maxSize}MB',
    fileTypeNotSupported: 'File type not supported. Supported types: {types}'
  }
};
