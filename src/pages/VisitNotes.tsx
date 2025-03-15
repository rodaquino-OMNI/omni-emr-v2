
import React, { useState } from "react";
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
  Search 
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

const VisitNotes: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("active");
  
  const handleDischarge = (patientId: string) => {
    // This would typically open a discharge form or process
    toast.info(t('dischargePatient'), {
      description: `Starting discharge process for patient ${patientId}`,
      duration: 3000,
    });
    // In a real app, you might navigate to a discharge form or open a modal
    // navigate(`/patients/${patientId}/discharge`);
  };

  // Mock visit notes data
  const visitNotes = [
    {
      id: "vn1",
      patientId: "p123",
      patientName: "John Doe",
      date: "2023-10-15",
      status: "active",
      title: "Follow-up Consultation",
      summary: "Patient is recovering well from surgery. Vital signs stable."
    },
    {
      id: "vn2",
      patientId: "p456",
      patientName: "Jane Smith",
      date: "2023-10-14",
      status: "active",
      title: "Initial Assessment",
      summary: "New patient with hypertension. Started on medication."
    },
    {
      id: "vn3",
      patientId: "p789",
      patientName: "Robert Johnson",
      date: "2023-09-30",
      status: "discharged",
      title: "Post-Op Check",
      summary: "Patient discharged. Recovery progressing as expected."
    }
  ];

  // Filter notes based on active tab
  const filteredNotes = visitNotes.filter(note => 
    activeTab === "all" || 
    (activeTab === "active" && note.status === "active") ||
    (activeTab === "discharged" && note.status === "discharged")
  );

  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">{t('visitNotes')}</h1>
      
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
          
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            {t('new')} {t('visitNotes')}
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="active">{t('active')}</TabsTrigger>
          <TabsTrigger value="discharged">{t('discharged')}</TabsTrigger>
          <TabsTrigger value="all">{t('all')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredNotes.map(note => (
              <Card key={note.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base">{note.title}</CardTitle>
                    
                    {note.status === "active" && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <FileText className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate(`/records/${note.id}`)}>
                            <FileText className="h-4 w-4 mr-2" />
                            {t('view')}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Clock className="h-4 w-4 mr-2" />
                            {t('history')}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDischarge(note.patientId)}>
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
                      onClick={() => navigate(`/patients/${note.patientId}`)}
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
              <h3 className="mt-4 text-lg font-medium">No visit notes found</h3>
              <p className="text-muted-foreground mt-2">
                There are no visit notes that match your current filters.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VisitNotes;
