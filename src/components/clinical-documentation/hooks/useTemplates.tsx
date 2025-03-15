
import { useState, useEffect } from 'react';
import { NoteTemplate, NoteType } from '@/types/clinicalNotes';
import { templateService } from '@/services/clinicalNotes/templateService';
import { offlineStorage } from '@/services/clinicalNotes/offlineStorage';

export const useTemplates = (selectedType?: NoteType) => {
  const [templates, setTemplates] = useState<NoteTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Update online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const fetchTemplates = async () => {
      setLoading(true);
      try {
        let fetchedTemplates: NoteTemplate[] = [];
        
        if (isOnline) {
          // Try to fetch from service
          fetchedTemplates = await templateService.getTemplatesByType(selectedType);
          
          // Store templates for offline use
          offlineStorage.saveTemplates(fetchedTemplates);
        } else {
          // Use cached templates when offline
          fetchedTemplates = offlineStorage.getTemplates();
          
          // If no offline templates, use fallback templates
          if (fetchedTemplates.length === 0) {
            fetchedTemplates = await templateService.getTemplatesByType(selectedType);
          }
          
          // Filter by selected type if needed
          if (selectedType && fetchedTemplates.length > 0) {
            fetchedTemplates = fetchedTemplates.filter(t => t.type === selectedType);
          }
        }
        
        setTemplates(fetchedTemplates);
      } catch (error) {
        console.error('Error fetching templates:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTemplates();
  }, [selectedType, isOnline]);

  return {
    templates,
    loading,
    isOnline
  };
};
