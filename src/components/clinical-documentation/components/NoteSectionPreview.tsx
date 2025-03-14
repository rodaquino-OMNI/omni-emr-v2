
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';

interface NoteSectionPreviewProps {
  sectionTitle: string;
  content: string;
}

const NoteSectionPreview = ({ 
  sectionTitle, 
  content 
}: NoteSectionPreviewProps) => {
  const { language } = useTranslation();
  
  return (
    <div className="mb-4">
      <h2>{sectionTitle}</h2>
      <div className="whitespace-pre-wrap">
        {content || (
          <span className="text-muted-foreground italic">
            {language === 'pt' ? 'Sem conteúdo' : 'No content'}
          </span>
        )}
      </div>
    </div>
  );
};

export default NoteSectionPreview;
