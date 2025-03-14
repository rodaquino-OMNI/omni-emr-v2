
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { NoteTemplate } from '@/types/clinicalNotes';
import TemplateCard from './TemplateCard';
import { useInView } from 'react-intersection-observer';

interface TemplateGridProps {
  templates: NoteTemplate[];
  onSelectTemplate: (template: NoteTemplate) => void;
}

const INITIAL_ITEMS_TO_LOAD = 6;
const ITEMS_PER_BATCH = 6;

const TemplateGrid = ({ templates, onSelectTemplate }: TemplateGridProps) => {
  const [visibleCount, setVisibleCount] = useState(INITIAL_ITEMS_TO_LOAD);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Create a reference for lazy loading more templates
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });
  
  // Function to load more templates
  const loadMoreTemplates = useCallback(() => {
    setVisibleCount(prev => 
      Math.min(prev + ITEMS_PER_BATCH, templates.length)
    );
  }, [templates.length]);
  
  // Load more templates when the load more element comes into view
  useEffect(() => {
    if (inView) {
      loadMoreTemplates();
    }
  }, [inView, loadMoreTemplates]);
  
  // Create an array of templates to display
  const visibleTemplates = templates.slice(0, visibleCount);
  const hasMoreTemplates = visibleCount < templates.length;
  
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
      
      {hasMoreTemplates && (
        <div 
          ref={loadMoreRef}
          className="col-span-full flex justify-center py-4 h-20"
        >
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}
    </div>
  );
};

export default TemplateGrid;
