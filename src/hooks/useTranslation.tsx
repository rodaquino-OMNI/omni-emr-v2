
import { useAuth } from "../context/AuthContext";
import { translations, TranslationKey } from "../i18n/translations";

export const useTranslation = () => {
  const { language } = useAuth();
  
  const t = (key: TranslationKey): string => {
    return translations[language][key] || translations.en[key] || key;
  };
  
  return { t, language };
};
