import React, { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle
} from '@/components/ui/sheet';
import { useAuth } from '@/context/AuthContext';
import { FileText, FilePlus, Search } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import NotesList from '@/components/clinical-documentation/NotesList';
import NoteTemplateSelector from '@/components/clinical-documentation/NoteTemplateSelector';
import NoteEditor from '@/components/clinical-documentation/NoteEditor';
import { ClinicalNote, NoteTemplate, NoteStatus, NoteType } from '@/types/clinicalNotes';

const ClinicalDocumentationPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const patientId = searchParams.get('patientId');
  const { user } = useAuth();
  const { language } = useTranslation();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [noteTypeFilter, setNoteTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isNewNoteOpen, setIsNewNoteOpen] = useState(false);
  const [isEditingNote, setIsEditingNote] = useState(false);
  
  const [selectedTemplate, setSelectedTemplate] = useState<NoteTemplate | null>(null);
  const [selectedNoteType, setSelectedNoteType] = useState<NoteType | undefined>(undefined);
  const [currentNote, setCurrentNote] = useState<ClinicalNote | null>(null);
  
  const [notes, setNotes] = useState<ClinicalNote[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchNotes();
  }, [patientId, noteTypeFilter, statusFilter]);
  
  const fetchNotes = async () => {
    setLoading(true);
    try {
      // This would be an API call in a real app
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock data
      const mockNotes: ClinicalNote[] = [
        {
          id: '1',
          patientId: patientId || '1',
          authorId: '123',
          authorName: 'Dr. Sarah Johnson',
          type: 'progress',
          title: 'Daily Progress Note',
          content: '## Subjective\nPatient reports feeling better today. Pain has decreased from 7/10 to 3/10.\n\n## Objective\nVital signs stable. Temperature 36.7°C, BP 122/78, HR 72.\n\n## Assessment\nImproving as expected post-procedure.\n\n## Plan\nContinue current medications. Follow up in 1 week.',
          status: 'signed',
          createdAt: new Date('2023-06-15T10:30:00'),
          updatedAt: new Date('2023-06-15T11:15:00'),
          signedAt: new Date('2023-06-15T11:15:00'),
          aiGenerated: false
        },
        {
          id: '2',
          patientId: patientId || '1',
          authorId: '456',
          authorName: 'Dr. Michael Chen',
          type: 'consultation',
          title: 'Cardiology Consultation',
          content: '## Reason for Consultation\nEvaluation of newly diagnosed atrial fibrillation.\n\n## History\nPatient with new onset palpitations and dyspnea on exertion.\n\n## Examination\nIrregularly irregular rhythm noted. No S3 or S4 gallops.\n\n## Impression\nParoxysmal atrial fibrillation.\n\n## Recommendations\nInitiate rate control with metoprolol. Consider anticoagulation based on CHA2DS2-VASc score.',
          status: 'signed',
          createdAt: new Date('2023-06-10T14:00:00'),
          updatedAt: new Date('2023-06-10T15:30:00'),
          signedAt: new Date('2023-06-10T15:30:00'),
          aiGenerated: false
        },
        {
          id: '3',
          patientId: patientId || '1',
          authorId: '123',
          authorName: 'Dr. Sarah Johnson',
          type: 'progress',
          title: 'Follow-up Note',
          content: '## Subjective\nPatient continues to improve. No new symptoms reported.\n\n## Objective\nVital signs: Temperature 36.5°C, BP 118/76, HR 68.\n\n## Assessment\nContinued improvement. All lab values returning to normal range.\n\n## Plan\nDecrease follow-up frequency to biweekly. Continue medications as prescribed.',
          status: 'draft',
          createdAt: new Date('2023-06-18T09:15:00'),
          updatedAt: new Date('2023-06-18T09:45:00'),
          aiGenerated: true
        }
      ];
      
      // Filter notes based on type and status
      let filteredNotes = [...mockNotes];
      
      if (noteTypeFilter !== 'all') {
        filteredNotes = filteredNotes.filter(note => note.type === noteTypeFilter);
      }
      
      if (statusFilter !== 'all') {
        filteredNotes = filteredNotes.filter(note => note.status === statusFilter);
      }
      
      if (searchTerm) {
        filteredNotes = filteredNotes.filter(note => 
          note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          note.authorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          note.content.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      setNotes(filteredNotes);
    } catch (error) {
      console.error('Error fetching notes:', error);
      toast.error(language === 'pt' ? 'Erro ao carregar notas clínicas' : 'Error loading clinical notes');
    } finally {
      setLoading(false);
    }
  };
  
  const handleNoteCreated = (note: ClinicalNote, status: NoteStatus) => {
    setNotes(prev => [note, ...prev]);
    setIsNewNoteOpen(false);
    setSelectedTemplate(null);
    
    toast.success(language === 'pt' ? 'Nota salva' : 'Note saved', {
      description: language === 'pt' 
        ? `A nota foi ${status === 'signed' ? 'assinada e salva' : 'salva como rascunho'}.` 
        : `The note has been ${status === 'signed' ? 'signed and saved' : 'saved as a draft'}.`
    });
  };
  
  const handleViewNote = (noteId: string) => {
    // In a real app, this would navigate to a note detail page
    const note = notes.find(n => n.id === noteId);
    if (note) {
      setCurrentNote(note);
      // Navigate to note view page
      navigate(`/clinical-notes/${noteId}`);
    }
  };
  
  const handleEditNote = (noteId: string) => {
    const note = notes.find(n => n.id === noteId);
    if (note) {
      setCurrentNote(note);
      setIsEditingNote(true);
      setIsNewNoteOpen(true);
    }
  };
  
  const handleSelectTemplate = (template: NoteTemplate) => {
    setSelectedTemplate(template);
  };
  
  const handleTemplateTypeChange = (type: NoteType) => {
    setSelectedNoteType(type);
    setSelectedTemplate(null);
  };
  
  const noteTypes = [
    { value: 'all', label: language === 'pt' ? 'Todos os Tipos' : 'All Types' },
    { value: 'progress', label: language === 'pt' ? 'Nota de Evolução' : 'Progress Note' },
    { value: 'admission', label: language === 'pt' ? 'Nota de Admissão' : 'Admission Note' },
    { value: 'consultation', label: language === 'pt' ? 'Consulta' : 'Consultation' },
    { value: 'procedure', label: language === 'pt' ? 'Procedimento' : 'Procedure Note' },
    { value: 'discharge', label: language === 'pt' ? 'Resumo de Alta' : 'Discharge Summary' }
  ];
  
  const statuses = [
    { value: 'all', label: language === 'pt' ? 'Todos os Status' : 'All Statuses' },
    { value: 'draft', label: language === 'pt' ? 'Rascunho' : 'Draft' },
    { value: 'signed', label: language === 'pt' ? 'Assinado' : 'Signed' },
    { value: 'pending_cosign', label: language === 'pt' ? 'Aguardando Assinatura' : 'Pending Cosign' },
    { value: 'cosigned', label: language === 'pt' ? 'Coassinado' : 'Cosigned' }
  ];
  
  const canCreateNotes = user && (
    user.role === 'doctor' || 
    user.role === 'nurse' || 
    user.role === 'specialist'
  );
  
  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto animate-fade-in">
          <div className="max-w-6xl mx-auto w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <h1 className="text-2xl font-semibold">
                {language === 'pt' ? 'Documentação Clínica' : 'Clinical Documentation'}
              </h1>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder={language === 'pt' ? "Buscar notas..." : "Search notes..."}
                    className="w-full h-9 pl-3 pr-9 rounded-md border"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
                
                <Select
                  value={noteTypeFilter}
                  onValueChange={setNoteTypeFilter}
                >
                  <SelectTrigger className="h-9 w-[180px]">
                    <SelectValue placeholder={language === 'pt' ? "Tipo de nota" : "Note type"} />
                  </SelectTrigger>
                  <SelectContent>
                    {noteTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger className="h-9 w-[180px]">
                    <SelectValue placeholder={language === 'pt' ? "Status" : "Status"} />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {canCreateNotes && (
                  <Button 
                    className="h-9 flex items-center gap-1"
                    onClick={() => setIsNewNoteOpen(true)}
                  >
                    <FilePlus className="h-4 w-4" />
                    {language === 'pt' ? 'Nova Nota' : 'New Note'}
                  </Button>
                )}
              </div>
            </div>
            
            <div className="glass-card p-6">
              <NotesList 
                notes={notes} 
                loading={loading}
                onViewNote={handleViewNote}
                onEditNote={canCreateNotes ? handleEditNote : undefined}
              />
            </div>
            
            <Sheet 
              open={isNewNoteOpen} 
              onOpenChange={(open) => {
                setIsNewNoteOpen(open);
                if (!open) {
                  setSelectedTemplate(null);
                  setCurrentNote(null);
                  setIsEditingNote(false);
                  setSelectedNoteType(undefined);
                }
              }}
            >
              <SheetContent className="sm:max-w-xl md:max-w-2xl lg:max-w-4xl overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>
                    {isEditingNote 
                      ? (language === 'pt' ? 'Editar Nota' : 'Edit Note')
                      : (language === 'pt' ? 'Nova Nota Clínica' : 'New Clinical Note')
                    }
                  </SheetTitle>
                </SheetHeader>
                
                <div className="mt-6">
                  {!selectedTemplate ? (
                    <NoteTemplateSelector 
                      onSelectTemplate={handleSelectTemplate}
                      selectedType={selectedNoteType}
                      onTypeChange={handleTemplateTypeChange}
                    />
                  ) : (
                    <NoteEditor 
                      template={selectedTemplate}
                      patientId={patientId || '1'}
                      existingNote={isEditingNote ? currentNote || undefined : undefined}
                      onSave={handleNoteCreated}
                      onCancel={() => {
                        if (isEditingNote) {
                          setIsEditingNote(false);
                          setCurrentNote(null);
                        } else {
                          setSelectedTemplate(null);
                        }
                      }}
                    />
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ClinicalDocumentationPage;
