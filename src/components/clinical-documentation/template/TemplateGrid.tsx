
import React, { useRef, useEffect, useState } from 'react';
import { NoteTemplate } from '@/types/clinicalNotes';
import TemplateCard from './TemplateCard';

interface TemplateGridProps {
  templates: NoteTemplate[];
  onSelectTemplate: (template: NoteTemplate) => void;
}

const TemplateGrid = ({ templates, onSelectTemplate }: TemplateGridProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleTemplates, setVisibleTemplates] = useState<NoteTemplate[]>([]);
  
  // Simple virtualization implementation for better performance with large lists
  useEffect(() => {
    if (templates.length <= 12) {
      // For small lists, don't bother with virtualization
      setVisibleTemplates(templates);
      return;
    }
    
    // Initial render of visible items
    setVisibleTemplates(templates.slice(0, 12));
    
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const container = containerRef.current;
      const scrollPosition = window.scrollY;
      const viewportHeight = window.innerHeight;
      const totalHeight = container.getBoundingClientRect().height;
      const containerTop = container.getBoundingClientRect().top + scrollPosition;
      
      // If we're scrolling near the bottom, load more templates
      if (scrollPosition + viewportHeight > containerTop + totalHeight - 300) {
        setVisibleTemplates(prev => {
          const nextBatch = templates.slice(0, Math.min(prev.length + 6, templates.length));
          if (nextBatch.length === prev.length) return prev; // No change
          return nextBatch;
        });
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [templates]);
  
  return (
    <div 
      ref={containerRef} 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      {visibleTemplates.map((template) => (
        <TemplateCard 
          key={template.id} 
          template={template} 
          onSelect={onSelectTemplate} 
        />
      ))}
      {visibleTemplates.length < templates.length && (
        <div className="col-span-full flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}
    </div>
  );
};

export default TemplateGrid;
