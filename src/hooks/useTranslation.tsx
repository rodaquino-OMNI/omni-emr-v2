
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
    // This is a very simple implementation
    // You would normally use a more sophisticated translation service
    
    // Common translations for frequently used text
    const ptToEnMap: Record<string, string> = {
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
      'Sair': 'Logout'
    };
    
    // Try to find a direct translation
    if (ptToEnMap[text]) {
      return ptToEnMap[text];
    }
    
    // If no direct translation is found, return the original text
    return text;
  };
  
  return { t, translateContent, language };
};
