
import { useAuth } from "../context/AuthContext";
import { translations, TranslationKey } from "../i18n/translations";

export const useTranslation = () => {
  const { language } = useAuth();
  
  // Function to translate a key with validation
  const t = (key: TranslationKey): string => {
    // Get translation in current language
    const translation = translations[language]?.[key];
    
    // Fallback to Portuguese if translation is missing
    const fallback = translations.pt[key];
    
    // Validation in development mode
    if (process.env.NODE_ENV === 'development') {
      if (!translation) {
        console.warn(`Missing translation for key "${String(key)}" in language "${language}"`);
      }
    }
    
    return translation || fallback || String(key);
  };
  
  // Function to translate a plain text (not from translation keys)
  const translateContent = (text: string): string => {
    if (language === 'pt') {
      return text; // Already in Portuguese (our default)
    }
    
    // For English translation from Portuguese
    // This is a simple implementation with common dashboard terms
    const ptToEnMap: Record<string, string> = {
      // Dashboard terms
      'Painel': 'Dashboard',
      'Total de Pacientes': 'Total Patients',
      'Pacientes no Hospital': 'Hospital Patients',
      'Pacientes em Casa': 'Home Care Patients',
      'Agendados Hoje': 'Scheduled Today',
      'do último mês': 'from last month',
      'da última semana': 'from last week',
      'Pacientes Recentes': 'Recent Patients',
      'Ver todos os pacientes': 'View all patients',
      'Recuperação pós-operatória': 'Post-op recovery',
      'Pneumonia': 'Pneumonia',
      'Insuficiência cardíaca crônica': 'Chronic heart failure',
      'Gerenciamento de diabetes': 'Diabetes management',
      'Substituição de quadril': 'Hip replacement',
      
      // Original entries
      'Paciente': 'Patient',
      'Pacientes': 'Patients',
      'Médico': 'Doctor',
      'Médicos': 'Doctors',
      'Consulta': 'Appointment',
      'Consultas': 'Appointments',
      'Prescrição': 'Prescription',
      'Prescrições': 'Prescriptions',
      'Medicamento': 'Medication',
      'Medicamentos': 'Medications',
      'Nome': 'Name',
      'Status': 'Status',
      'Ativo': 'Active',
      'Inativo': 'Inactive',
      'Salvar': 'Save',
      'Cancelar': 'Cancel',
      'Configurações': 'Settings',
      'Última Visita': 'Last Visit',
      'Próxima Consulta': 'Next Appointment',
      'Ver Perfil': 'View Profile',
      'Adicionar': 'Add',
      'Editar': 'Edit',
      'Excluir': 'Delete',
      'Imprimir': 'Print',
      'Voltar': 'Back',
      'Usuário': 'User',
      'Senha': 'Password',
      'Entrar': 'Sign In',
      'Sair': 'Logout',
      'Hospital': 'Hospital',
      'Casa': 'Home',
      'Crítico': 'Critical',
      'Estável': 'Stable',
      'Melhorando': 'Improving',
      'anos': 'yrs',
      'Masculino': 'Male',
      'Feminino': 'Female',
      'Quarto': 'Room',
      'UTI': 'ICU'
    };
    
    // Try to find a direct translation for the current language context
    if (language === 'en') {
      // When in English mode, if we find the text in our Portuguese-to-English map,
      // return the English translation
      return ptToEnMap[text] || text;
    }
    
    // If no direct translation is found or we're not in English mode, return the original text
    return text;
  };
  
  // Function to validate all translations - useful for testing
  const validateTranslations = () => {
    const missingKeys = {
      en: [] as string[],
      pt: [] as string[]
    };
    
    // Check all keys for each language
    Object.keys(translations.en).forEach((key) => {
      if (!translations.pt[key as TranslationKey]) {
        missingKeys.pt.push(key);
      }
    });
    
    Object.keys(translations.pt).forEach((key) => {
      if (!translations.en[key as TranslationKey]) {
        missingKeys.en.push(key);
      }
    });
    
    return missingKeys;
  };
  
  return { t, translateContent, language, validateTranslations };
};
