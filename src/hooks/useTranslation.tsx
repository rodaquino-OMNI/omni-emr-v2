
import { useAuth } from "../context/AuthContext";
import { translations, TranslationKey } from "../i18n/translations";

export const useTranslation = () => {
  const { language } = useAuth();
  
  // Function to translate a key
  const t = (key: TranslationKey): string => {
    // Get translation in current language or fallback to Portuguese
    const translation = translations[language]?.[key] || translations.pt[key] || key;
    return translation;
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
    
    // English to Portuguese map for reverse lookup
    const enToPtMap: Record<string, string> = {};
    Object.entries(ptToEnMap).forEach(([pt, en]) => {
      enToPtMap[en] = pt;
    });
    
    // Try to find a direct translation
    if (language === 'en' && enToPtMap[text]) {
      return text; // Keep English text when in English mode
    } else if (language === 'pt' && ptToEnMap[text]) {
      return text; // Already in Portuguese
    } else if (language === 'en' && ptToEnMap[text]) {
      return ptToEnMap[text]; // Translate Portuguese to English
    }
    
    // If no direct translation is found, return the original text
    return text;
  };
  
  return { t, translateContent, language };
};
