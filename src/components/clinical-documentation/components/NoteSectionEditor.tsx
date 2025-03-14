
import React from 'react';
import { Textarea } from '@/components/ui/textarea';

interface NoteSectionEditorProps {
  sectionTitle: string;
  content: string;
  onChange: (content: string) => void;
}

const NoteSectionEditor = ({ 
  sectionTitle, 
  content, 
  onChange 
}: NoteSectionEditorProps) => {
  return (
    <div className="space-y-2">
      <div className="font-medium">{sectionTitle}</div>
      <Textarea
        placeholder={`${sectionTitle}...`}
        value={content}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
      />
    </div>
  );
};

export default NoteSectionEditor;
