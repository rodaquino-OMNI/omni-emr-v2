
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { ClinicalNote, NoteTemplate, NoteStatus } from '@/types/clinicalNotes';
import { Save, Check, ClipboardCheck, FileText, Wand2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';

interface NoteEditorProps {
  template: NoteTemplate;
  patientId: string;
  existingNote?: ClinicalNote;
  onSave: (note: ClinicalNote, status: NoteStatus) => void;
  onCancel: () => void;
}

const NoteEditor = ({ 
  template, 
  patientId, 
  existingNote, 
  onSave, 
  onCancel 
}: NoteEditorProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { language } = useTranslation();
  const [note, setNote] = useState<Partial<ClinicalNote>>({
    patientId,
    type: template.type,
    title: existingNote?.title || template.name,
    content: existingNote?.content || '',
    status: existingNote?.status || 'draft',
    aiGenerated: existingNote?.aiGenerated || false
  });
  const [sections, setSections] = useState<{ [key: string]: string }>({});
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [isRequestingAI, setIsRequestingAI] = useState(false);

  useEffect(() => {
    // Initialize sections from template
    const initialSections: { [key: string]: string } = {};
    template.sections.forEach(section => {
      initialSections[section.title] = existingNote?.content.includes(section.title) 
        ? extractSectionContent(existingNote.content, section.title) 
        : '';
    });
    setSections(initialSections);
  }, [template, existingNote]);

  const extractSectionContent = (content: string, sectionTitle: string) => {
    const regex = new RegExp(`## ${sectionTitle}\\s*([\\s\\S]*?)(?=## |$)`, 'i');
    const match = content.match(regex);
    return match ? match[1].trim() : '';
  };

  const compileNoteContent = () => {
    let compiledContent = '';
    template.sections.forEach(section => {
      const sectionContent = sections[section.title] || '';
      compiledContent += `## ${section.title}\n${sectionContent}\n\n`;
    });
    return compiledContent.trim();
  };

  const handleSectionChange = (sectionTitle: string, content: string) => {
    setSections(prev => ({
      ...prev,
      [sectionTitle]: content
    }));
  };

  const handleSave = (status: NoteStatus) => {
    if (!user) return;
    
    const content = compileNoteContent();
    const updatedNote: ClinicalNote = {
      id: existingNote?.id || `note-${Date.now()}`,
      patientId,
      authorId: user.id,
      authorName: user.name,
      type: template.type,
      title: note.title || template.name,
      content,
      status,
      createdAt: existingNote?.createdAt || new Date(),
      updatedAt: new Date(),
      aiGenerated: note.aiGenerated || false
    };
    
    onSave(updatedNote, status);
  };

  const requestAIAssistance = async () => {
    if (!user) return;
    
    setIsRequestingAI(true);
    try {
      // This would be an API call to an AI service in a real app
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock AI generated content based on note type
      const aiSections: { [key: string]: string } = { ...sections };
      
      if (template.type === 'progress') {
        aiSections['Subjective'] = "Patient reports feeling better today. Pain has decreased from 7/10 to 3/10. Denies fever, chills, or new symptoms.";
        aiSections['Objective'] = "Vital signs stable. Temperature 36.7°C, BP 122/78, HR 72, RR 16, O2 Sat 98% on room air. Lungs clear to auscultation. Abdomen soft, non-tender.";
        aiSections['Assessment'] = "Improving as expected post-procedure. Pain well controlled with current regimen.";
        aiSections['Plan'] = "Continue current medications. Follow up in 1 week. Call if symptoms worsen.";
      } else if (template.type === 'admission') {
        // Add mock AI content for admission notes
        aiSections['Chief Complaint'] = "Shortness of breath and chest pain for 3 days.";
        aiSections['History of Present Illness'] = "Patient is a 65-year-old male with a history of COPD who presents with worsening shortness of breath and chest pain for the past 3 days. Symptoms worse with exertion and improved with rest.";
      }
      
      setSections(aiSections);
      setNote(prev => ({ ...prev, aiGenerated: true }));
      
      toast({
        title: language === 'pt' ? 'Assistência de IA concluída' : 'AI Assistance Completed',
        description: language === 'pt' ? 'Conteúdo gerado por IA adicionado à nota' : 'AI-generated content has been added to the note',
      });
    } catch (error) {
      console.error('Error requesting AI assistance:', error);
      toast({
        variant: 'destructive',
        title: language === 'pt' ? 'Erro' : 'Error',
        description: language === 'pt' ? 'Não foi possível gerar conteúdo com IA' : 'Failed to generate AI content',
      });
    } finally {
      setIsRequestingAI(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Input
            value={note.title}
            onChange={e => setNote(prev => ({ ...prev, title: e.target.value }))}
            placeholder={language === 'pt' ? 'Título da nota' : 'Note title'}
            className="text-lg font-semibold"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={onCancel}
          >
            {language === 'pt' ? 'Cancelar' : 'Cancel'}
          </Button>
          <Button 
            variant="outline" 
            onClick={() => handleSave('draft')}
          >
            <Save className="mr-1 h-4 w-4" />
            {language === 'pt' ? 'Salvar rascunho' : 'Save draft'}
          </Button>
          <Button 
            onClick={() => handleSave('signed')}
          >
            <Check className="mr-1 h-4 w-4" />
            {language === 'pt' ? 'Assinar e salvar' : 'Sign & save'}
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-md">
              {language === 'pt' ? 'Editor de nota' : 'Note Editor'}
            </CardTitle>
            <Tabs defaultValue="editor" value={activeTab} onValueChange={(value) => setActiveTab(value as 'editor' | 'preview')}>
              <TabsList>
                <TabsTrigger value="editor">
                  <FileText className="h-4 w-4 mr-1" />
                  {language === 'pt' ? 'Editor' : 'Editor'}
                </TabsTrigger>
                <TabsTrigger value="preview">
                  <ClipboardCheck className="h-4 w-4 mr-1" />
                  {language === 'pt' ? 'Visualizar' : 'Preview'}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Button
              variant="outline"
              className="w-full justify-center"
              onClick={requestAIAssistance}
              disabled={isRequestingAI}
            >
              {isRequestingAI ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                  {language === 'pt' ? 'Gerando com IA...' : 'Generating with AI...'}
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  {language === 'pt' ? 'Gerar conteúdo com IA' : 'Generate content with AI'}
                </>
              )}
            </Button>
          </div>
          
          <TabsContent value="editor" className="space-y-4 mt-2">
            {template.sections.map((section, index) => (
              <div key={index} className="space-y-2">
                <div className="font-medium">{section.title}</div>
                <Textarea
                  placeholder={`${section.title}...`}
                  value={sections[section.title] || ''}
                  onChange={(e) => handleSectionChange(section.title, e.target.value)}
                  rows={4}
                />
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="preview" className="mt-2">
            <div className="prose prose-sm max-w-none">
              <h1>{note.title}</h1>
              {template.sections.map((section, index) => (
                <div key={index} className="mb-4">
                  <h2>{section.title}</h2>
                  <div className="whitespace-pre-wrap">
                    {sections[section.title] || (
                      <span className="text-muted-foreground italic">
                        {language === 'pt' ? 'Sem conteúdo' : 'No content'}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </CardContent>
      </Card>
    </div>
  );
};

export default NoteEditor;
