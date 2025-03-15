
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
  ChevronLeft
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
import NewVisitNoteForm from "@/components/visit-notes/NewVisitNoteForm";
import { visitNoteService, VisitNote } from "@/services/visitNotes/visitNoteService";
import VisitNoteDetail from "@/components/visit-notes/VisitNoteDetail";
import { useAuth } from "@/context/AuthContext";
import { usePermissions } from "@/hooks/usePermissions";

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
    toast.info(t('dischargePatient'), {
      description: `Starting discharge process for patient ${patientId}`,
      duration: 3000,
    });
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

  // Filter notes based on active tab
  const filteredNotes = notes.filter(note => 
    activeTab === "all" || 
    (activeTab === "active" && note.status === "active") ||
    (activeTab === "discharged" && note.status === "discharged")
  );

  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">{t('visitNotes')}</h1>
      
      {selectedNote ? (
        <>
          <div className="mb-6">
            <Button variant="ghost" onClick={handleBackToList}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              {language === 'pt' ? 'Voltar para a lista' : 'Back to list'}
            </Button>
          </div>
          <VisitNoteDetail note={selectedNote} onRefresh={refreshNotes} />
        </>
      ) : (
        <>
          <div className="flex items-center justify-between mb-6">
            <div className="relative w-64">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder={`${t('search')} ${t('visitNotes').toLowerCase()}`}
                className="pl-8"
              />
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                {t('filter')}
              </Button>
              
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                {t('dateRange')}
              </Button>
              
              {canCreateNotes && (
                <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      {t('new')} {t('visitNote')}
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
              <TabsTrigger value="active">{t('active')}</TabsTrigger>
              <TabsTrigger value="discharged">{t('discharged')}</TabsTrigger>
              <TabsTrigger value="all">{t('all')}</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab}>
              {loading ? (
                <div className="flex justify-center py-10">
                  <div className="h-8 w-8 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
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
                                    <FileText className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/records/${note.id}`);
                                  }}>
                                    <FileText className="h-4 w-4 mr-2" />
                                    {t('view')}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                    <Clock className="h-4 w-4 mr-2" />
                                    {t('history')}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={(e) => {
                                    e.stopPropagation();
                                    handleDischarge(note.patientId);
                                  }}>
                                    <LogOut className="h-4 w-4 mr-2" />
                                    {t('discharge')}
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
                              {t('viewPatient')}
                            </Button>
                            
                            {note.status === "active" ? (
                              <div className="flex items-center text-sm font-medium text-green-600">
                                <Check className="h-4 w-4 mr-1" />
                                {t('active')}
                              </div>
                            ) : (
                              <div className="flex items-center text-sm font-medium text-muted-foreground">
                                <X className="h-4 w-4 mr-1" />
                                {t('discharged')}
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
                        {language === 'pt' ? 'Nenhuma nota de visita encontrada' : 'No visit notes found'}
                      </h3>
                      <p className="text-muted-foreground mt-2">
                        {language === 'pt' 
                          ? 'Não há notas de visita que correspondam aos seus filtros atuais.'
                          : 'There are no visit notes that match your current filters.'}
                      </p>
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
