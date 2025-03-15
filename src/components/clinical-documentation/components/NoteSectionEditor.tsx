
import React from 'react';
import { Textarea } from '@/components/ui/textarea';

interface NoteSectionEditorProps {
  sectionTitle: string;
  content: string;
  onChange: (content: string) => void;
  isRequired?: boolean;
  hasError?: boolean;
}

const NoteSectionEditor = ({ 
  sectionTitle, 
  content, 
  onChange,
  isRequired = false,
  hasError = false
}: NoteSectionEditorProps) => {
  return (
    <div className="space-y-2">
      <div className="font-medium flex items-center">
        {sectionTitle}
        {isRequired && <span className="text-red-500 ml-1">*</span>}
      </div>
      <Textarea
        placeholder={`${sectionTitle}...`}
        value={content}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className={hasError ? "border-red-500 focus:ring-red-500" : ""}
      />
      {hasError && (
        <p className="text-sm text-red-500">This field is required</p>
      )}
    </div>
  );
};

export default NoteSectionEditor;
