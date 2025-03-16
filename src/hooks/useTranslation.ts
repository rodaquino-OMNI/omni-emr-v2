
import { useContext } from 'react';
import { LanguageContext } from '@/context/LanguageContext';
import { Languages } from '@/types/auth';

// Basic translations
const translations = {
  en: {
    overview: 'Overview',
    records: 'Records',
    prescriptions: 'Prescriptions',
    aiInsights: 'AI Insights',
    patientNotFound: 'Patient not found',
    loadingPatients: 'Loading patients...',
    noSectorSelected: 'No sector selected',
    noPatientFound: 'No patients found',
    newPatient: 'New Patient',
    viewAllPatients: 'View all patients',
    assigned: 'Assigned',
    // Add more translations as needed
  },
  pt: {
    overview: 'Visão Geral',
    records: 'Registros',
    prescriptions: 'Prescrições',
    aiInsights: 'Insights IA',
    patientNotFound: 'Paciente não encontrado',
    loadingPatients: 'Carregando pacientes...',
    noSectorSelected: 'Nenhum setor selecionado',
    noPatientFound: 'Nenhum paciente encontrado',
    newPatient: 'Novo Paciente',
    viewAllPatients: 'Ver todos os pacientes',
    assigned: 'Atribuído',
    // Add more translations as needed
  }
};

export const useTranslation = () => {
  const { language, setLanguage } = useContext(LanguageContext);
  
  // Translation function
  const t = (key: string): string => {
    if (language === 'pt' && translations.pt[key as keyof typeof translations.pt]) {
      return translations.pt[key as keyof typeof translations.pt];
    }
    
    if (translations.en[key as keyof typeof translations.en]) {
      return translations.en[key as keyof typeof translations.en];
    }
    
    // Return the key if no translation is found
    return key;
  };

  // Function to check if a translation exists
  const hasTranslation = (key: string): boolean => {
    return (
      (language === 'pt' && !!translations.pt[key as keyof typeof translations.pt]) ||
      !!translations.en[key as keyof typeof translations.en]
    );
  };
  
  return { t, language, setLanguage, hasTranslation };
};
