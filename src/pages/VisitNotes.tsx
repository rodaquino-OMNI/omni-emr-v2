
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FileText, 
  Plus, 
  Filter, 
  Clock, 
  LogOut, 
  Check, 
  X, 
  Calendar, 
  Search,
  ChevronLeft,
  Pencil
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "@/hooks/useTranslation";
import { toast } from "sonner";
import { 
  Dialog, 
  DialogContent, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import VisitNoteDetail from "@/components/visit-notes/VisitNoteDetail";
import { useAuth } from "@/context/AuthContext";
import { usePermissions } from "@/hooks/usePermissions";

// Updated with types for visit notes
export interface VitalSigns {
  heartRate?: number;
  bloodPressure?: string;
  temperature?: number;
  oxygenSaturation?: number;
  respiratoryRate?: number;
  painLevel?: number;
  recordedAt?: string;
  recordedBy?: string;
  recordedById?: string;
  notes?: string;
}

export interface VisitNote {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  status: 'active' | 'discharged' | 'draft' | 'completed';
  title: string;
  summary: string;
  createdBy?: string;
  createdById?: string;
  updatedAt?: string;
  vitalSigns?: VitalSigns;
}

// Create a mock service for visit notes (in a real app, this would interact with the backend)
const visitNoteService = {
  getAllNotes: async (): Promise<VisitNote[]> => {
    // For demo purposes, return mock data
    return [
      {
        id: '1',
        patientId: '101',
        patientName: 'John Doe',
        date: new Date().toISOString(),
        status: 'active',
        title: 'Initial Assessment',
        summary: 'Patient presented with symptoms of upper respiratory infection. Prescribed rest and fluids.',
        createdBy: 'Dr. Sarah Chen',
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        patientId: '102',
        patientName: 'Jane Smith',
        date: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        status: 'discharged',
        title: 'Follow-up Visit',
        summary: 'Patient's condition has improved. Cleared for discharge.',
        createdBy: 'Dr. Michael Johnson',
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
        vitalSigns: {
          heartRate: 72,
          bloodPressure: '120/80',
          temperature: 36.8,
          oxygenSaturation: 98,
          respiratoryRate: 16,
          painLevel: 1
        }
      },
      {
        id: '3',
        patientId: '103',
        patientName: 'Robert Brown',
        date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        status: 'active',
        title: 'Pre-operative Assessment',
        summary: 'Patient is scheduled for appendectomy tomorrow. All pre-op tests completed.',
        createdBy: 'Dr. Emily Jackson',
        updatedAt: new Date(Date.now() - 172800000).toISOString(),
      },
    ];
  },
  getNoteById: async (id: string): Promise<VisitNote | null> => {
    // In a real app, this would fetch from an API
    const allNotes = await visitNoteService.getAllNotes();
    return allNotes.find(note => note.id === id) || null;
  }
};

interface NewVisitNoteFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const NewVisitNoteForm: React.FC<NewVisitNoteFormProps> = ({ onClose, onSuccess }) => {
  const { language } = useTranslation();
  const [formData, setFormData] = useState({
    patientId: '',
    patientName: '',
    title: '',
    summary: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.patientId || !formData.patientName || !formData.title || !formData.summary) {
      toast.error(
        language === 'pt' ? 'Todos os campos são obrigatórios' : 'All fields are required'
      );
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, this would call an API to create the note
      setTimeout(() => {
        // Simulate success
        toast.success(
          language === 'pt' ? 'Nota de visita criada com sucesso' : 'Visit note created successfully'
        );
        onSuccess();
      }, 1000);
    } catch (error) {
      console.error('Error creating note:', error);
      toast.error(
        language === 'pt' 
          ? 'Erro ao criar nota de visita' 
          : 'Error creating visit note'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">
        {language === 'pt' ? 'Nova Nota de Visita' : 'New Visit Note'}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            {language === 'pt' ? 'ID do Paciente' : 'Patient ID'}
          </label>
          <Input
            name="patientId"
            value={formData.patientId}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            {language === 'pt' ? 'Nome do Paciente' : 'Patient Name'}
          </label>
          <Input
            name="patientName"
            value={formData.patientName}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">
          {language === 'pt' ? 'Título' : 'Title'}
        </label>
        <Input
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">
          {language === 'pt' ? 'Resumo' : 'Summary'}
        </label>
        <textarea
          name="summary"
          value={formData.summary}
          onChange={handleChange}
          rows={6}
          className="w-full border border-border rounded-md p-2"
          required
        ></textarea>
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onClose}
          disabled={isSubmitting}
        >
          {language === 'pt' ? 'Cancelar' : 'Cancel'}
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting}
        >
          {isSubmitting 
            ? (language === 'pt' ? 'Criando...' : 'Creating...') 
            : (language === 'pt' ? 'Criar Nota' : 'Create Note')}
        </Button>
      </div>
    </form>
  );
};

const VisitNotes: React.FC = () => {
  const { t, language } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { hasPermission } = usePermissions(user);
  const [activeTab, setActiveTab] = useState("active");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [notes, setNotes] = useState<VisitNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNote, setSelectedNote] = useState<VisitNote | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Check if user has permission to create notes
  const canCreateNotes = hasPermission('create_clinical_notes');
  // Check if user has permission to view vital signs
  const canViewVitalSigns = hasPermission('view_vitals') || hasPermission('view_own_vitals');
  
  // Fetch notes on component mount and when activeTab changes
  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      try {
        const fetchedNotes = await visitNoteService.getAllNotes();
        setNotes(fetchedNotes);
      } catch (error) {
        console.error('Error fetching notes:', error);
        toast.error(
          language === 'pt' ? 'Erro ao carregar notas' : 'Error loading notes',
          {
            description: language === 'pt' 
              ? 'Não foi possível carregar as notas de visita' 
              : 'Could not load visit notes'
          }
        );
      } finally {
        setLoading(false);
      }
    };
    
    fetchNotes();
  }, [language]);
  
  const handleDischarge = (patientId: string) => {
    // This would typically open a discharge form or process
    toast.info(
      language === 'pt' ? 'Iniciar processo de alta' : 'Start discharge process',
      {
        description: 
          language === 'pt'
            ? `Iniciando processo de alta para o paciente ${patientId}`
            : `Starting discharge process for patient ${patientId}`,
        duration: 3000,
      }
    );
    // In a real app, you might navigate to a discharge form or open a modal
    // navigate(`/patients/${patientId}/discharge`);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
  };
  
  const handleFormSuccess = () => {
    refreshNotes();
  };
  
  const handleNoteClick = (note: VisitNote) => {
    setSelectedNote(note);
  };
  
  const handleBackToList = () => {
    setSelectedNote(null);
  };
  
  const refreshNotes = async () => {
    try {
      const refreshedNotes = await visitNoteService.getAllNotes();
      setNotes(refreshedNotes);
      
      // If a note was selected, refresh its data
      if (selectedNote) {
        const refreshedNote = await visitNoteService.getNoteById(selectedNote.id);
        if (refreshedNote) {
          setSelectedNote(refreshedNote);
        }
      }
    } catch (error) {
      console.error('Error refreshing notes:', error);
    }
  };

  // Filter notes based on active tab and search term
  const filteredNotes = notes.filter(note => 
    (activeTab === "all" || 
    (activeTab === "active" && note.status === "active") ||
    (activeTab === "discharged" && note.status === "discharged")) &&
    (!searchTerm || 
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.summary.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">
        {language === 'pt' ? 'Notas de Visita' : 'Visit Notes'}
      </h1>
      
      {selectedNote ? (
        <>
          <div className="mb-6">
            <Button variant="ghost" onClick={handleBackToList}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              {language === 'pt' ? 'Voltar para a lista' : 'Back to list'}
            </Button>
          </div>
          <VisitNoteDetail 
            note={selectedNote} 
            onRefresh={refreshNotes} 
          />
        </>
      ) : (
        <>
          <div className="flex items-center justify-between mb-6">
            <div className="relative w-64">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder={
                  language === 'pt' 
                    ? "Buscar notas de visita..." 
                    : "Search visit notes..."
                }
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                {language === 'pt' ? 'Filtrar' : 'Filter'}
              </Button>
              
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                {language === 'pt' ? 'Período' : 'Date Range'}
              </Button>
              
              {canCreateNotes && (
                <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      {language === 'pt' ? 'Nova Nota de Visita' : 'New Visit Note'}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[800px]">
                    <NewVisitNoteForm 
                      onClose={handleFormClose} 
                      onSuccess={handleFormSuccess}
                    />
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
          
          <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="active">
                {language === 'pt' ? 'Ativos' : 'Active'}
              </TabsTrigger>
              <TabsTrigger value="discharged">
                {language === 'pt' ? 'Alta' : 'Discharged'}
              </TabsTrigger>
              <TabsTrigger value="all">
                {language === 'pt' ? 'Todos' : 'All'}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab}>
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, index) => (
                    <Card key={index}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between">
                          <Skeleton className="h-6 w-36" />
                          <Skeleton className="h-6 w-16" />
                        </div>
                        <Skeleton className="h-4 w-24 mt-1" />
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-4 w-full mt-2" />
                        <Skeleton className="h-4 w-full mt-2" />
                        <div className="flex justify-between items-center mt-4">
                          <Skeleton className="h-8 w-24" />
                          <Skeleton className="h-5 w-16" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredNotes.map(note => (
                      <Card 
                        key={note.id} 
                        className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => handleNoteClick(note)}
                      >
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-base">{note.title}</CardTitle>
                            
                            {note.status === "active" && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
                                    <span className="sr-only">Open menu</span>
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/records/${note.id}`);
                                  }}>
                                    <FileText className="h-4 w-4 mr-2" />
                                    {language === 'pt' ? 'Visualizar' : 'View'}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                    <Clock className="h-4 w-4 mr-2" />
                                    {language === 'pt' ? 'Histórico' : 'History'}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={(e) => {
                                    e.stopPropagation();
                                    handleDischarge(note.patientId);
                                  }}>
                                    <LogOut className="h-4 w-4 mr-2" />
                                    {language === 'pt' ? 'Alta' : 'Discharge'}
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {note.patientName} - {new Date(note.date).toLocaleDateString()}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground line-clamp-2">{note.summary}</p>
                          
                          <div className="flex justify-between items-center mt-4">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/patients/${note.patientId}`);
                              }}
                            >
                              {language === 'pt' ? 'Ver Paciente' : 'View Patient'}
                            </Button>
                            
                            {note.status === "active" ? (
                              <div className="flex items-center text-sm font-medium text-green-600">
                                <Check className="h-4 w-4 mr-1" />
                                {language === 'pt' ? 'Ativo' : 'Active'}
                              </div>
                            ) : (
                              <div className="flex items-center text-sm font-medium text-muted-foreground">
                                <X className="h-4 w-4 mr-1" />
                                {language === 'pt' ? 'Alta' : 'Discharged'}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  {filteredNotes.length === 0 && (
                    <div className="text-center py-10">
                      <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
                      <h3 className="mt-4 text-lg font-medium">
                        {language === 'pt' 
                          ? 'Nenhuma nota de visita encontrada' 
                          : 'No visit notes found'}
                      </h3>
                      <p className="text-muted-foreground mt-2">
                        {language === 'pt' 
                          ? 'Não há notas de visita que correspondam aos seus filtros atuais.'
                          : 'There are no visit notes that match your current filters.'}
                      </p>
                      
                      {searchTerm && (
                        <Button 
                          variant="outline" 
                          className="mt-4"
                          onClick={() => setSearchTerm('')}
                        >
                          {language === 'pt' ? 'Limpar busca' : 'Clear search'}
                        </Button>
                      )}
                    </div>
                  )}
                </>
              )}
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default VisitNotes;
