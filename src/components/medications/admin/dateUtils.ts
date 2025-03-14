
/**
 * Formats a date based on the current language
 */
export const formatDate = (date: Date | null, language: string): string => {
  if (!date) return '--';
  
  return new Intl.DateTimeFormat(language === 'pt' ? 'pt-BR' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};
