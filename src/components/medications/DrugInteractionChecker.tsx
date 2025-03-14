import React, { useState } from 'react';
import { AlertCircle, Plus, Trash2, Search, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/hooks/useTranslation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

import { searchMedicationsByName, checkDrugInteractions } from '@/services/rxnorm/rxnormService';
import { RxNormMedication, RxNormInteraction } from '@/types/rxnorm';
import RxNormMedicationSelector from './RxNormMedicationSelector';

const DrugInteractionChecker: React.FC = () => {
  const { t, language } = useTranslation();
  const [medications, setMedications] = useState<RxNormMedication[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<RxNormMedication[]>([]);
  const [interactions, setInteractions] = useState<any[]>([]);
  const [isCheckingInteractions, setIsCheckingInteractions] = useState(false);
  const [showMedicationSelector, setShowMedicationSelector] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm || searchTerm.length < 3) return;

    setIsSearching(true);
    setSearchResults([]);
    
    try {
      const results = await searchMedicationsByName(searchTerm);
      setSearchResults(results);
      
      if (results.length === 0) {
        toast(t('noMedicationsFound'), {
          description: language === 'pt' 
            ? "Tente um termo de pesquisa diferente" 
            : "Try a different search term",
          icon: <AlertCircle className="h-5 w-5 text-amber-500" />
        });
      }
    } catch (error) {
      console.error('Error searching for medications:', error);
      toast.error(language === 'pt' 
        ? "Erro ao pesquisar medicamentos" 
        : "Error searching for medications");
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddMedication = (medication: RxNormMedication) => {
    if (medications.some(med => med.rxcui === medication.rxcui)) {
      toast.info(language === 'pt'
        ? "Este medicamento já foi adicionado"
        : "This medication is already added");
      return;
    }
    
    setMedications([...medications, medication]);
    setSearchTerm('');
    setSearchResults([]);
  };

  const handleRemoveMedication = (rxcui: string) => {
    setMedications(medications.filter(med => med.rxcui !== rxcui));
    if (medications.length <= 2) {
      setInteractions([]);
    }
  };

  const handleCheckInteractions = async () => {
    if (medications.length < 2) {
      toast.info(language === 'pt'
        ? "Adicione pelo menos dois medicamentos para verificar interações"
        : "Add at least two medications to check interactions");
      return;
    }

    setIsCheckingInteractions(true);
    setInteractions([]);
    
    try {
      const rxcuis = medications.map(med => med.rxcui);
      const results = await checkDrugInteractions(rxcuis);
      
      if (results.length === 0 || !results[0]?.interactionPair?.length) {
        toast.info(language === 'pt'
          ? "Nenhuma interação conhecida encontrada entre estes medicamentos"
          : "No known interactions found between these medications");
      } else {
        setInteractions(results[0].interactionPair);
      }
    } catch (error) {
      console.error('Error checking interactions:', error);
      toast.error(language === 'pt' 
        ? "Erro ao verificar interações" 
        : "Error checking interactions");
    } finally {
      setIsCheckingInteractions(false);
    }
  };
  
  const handleMedicationSelect = (medicationData: any) => {
    if (medicationData?.rxnormCode) {
      const medication: RxNormMedication = {
        rxcui: medicationData.rxnormCode,
        name: medicationData.name
      };
      handleAddMedication(medication);
      setShowMedicationSelector(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch(severity?.toLowerCase()) {
      case 'high':
        return 'bg-destructive text-destructive-foreground';
      case 'moderate':
        return 'bg-warning text-warning-foreground';
      case 'low':
        return 'bg-info text-info-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {language === 'pt' ? 'Verificador de Interações Medicamentosas' : 'Drug Interaction Checker'}
        </CardTitle>
        <CardDescription>
          {language === 'pt' 
            ? 'Verifique possíveis interações entre medicamentos'
            : 'Check for potential interactions between medications'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Label htmlFor="medication-search" className="mb-1 block">
              {language === 'pt' ? 'Adicionar Medicamento' : 'Add Medication'}
            </Label>
            <div className="relative">
              <Input
                id="medication-search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={language === 'pt' ? 'Buscar por nome' : 'Search by name'}
                className="pl-9"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSearch();
                  }
                }}
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          <Button 
            onClick={handleSearch}
            disabled={isSearching || searchTerm.length < 3}
            size="sm"
          >
            {isSearching ? (
              <RefreshCw className="h-4 w-4 animate-spin mr-1" />
            ) : (
              <Search className="h-4 w-4 mr-1" />
            )}
            {language === 'pt' ? 'Buscar' : 'Search'}
          </Button>
          
          <Dialog open={showMedicationSelector} onOpenChange={setShowMedicationSelector}>
            <DialogTrigger asChild>
              <Button variant="secondary" size="sm">
                <Plus className="h-4 w-4 mr-1" />
                {language === 'pt' ? 'Avançado' : 'Advanced'}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {language === 'pt' ? 'Busca Avançada de Medicamentos' : 'Advanced Medication Search'}
                </DialogTitle>
              </DialogHeader>
              <RxNormMedicationSelector onMedicationSelect={handleMedicationSelect} />
            </DialogContent>
          </Dialog>
        </div>
        
        {searchResults.length > 0 && (
          <div className="border rounded-md mb-4">
            <div className="px-3 py-2 bg-muted/50 font-medium border-b text-sm">
              {language === 'pt' ? 'Resultados' : 'Results'} ({searchResults.length})
            </div>
            <div className="max-h-40 overflow-y-auto">
              {searchResults.map((med) => (
                <div
                  key={med.rxcui}
                  className="px-3 py-2 border-b last:border-0 hover:bg-muted cursor-pointer flex justify-between items-center"
                  onClick={() => handleAddMedication(med)}
                >
                  <div>
                    <div className="font-medium">{med.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {t('rxnormCode')}: {med.rxcui}
                    </div>
                  </div>
                  <Plus className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div>
          <Label className="mb-1 block">
            {language === 'pt' ? 'Medicamentos Selecionados' : 'Selected Medications'}
          </Label>
          {medications.length === 0 ? (
            <div className="text-center py-4 border rounded-md text-muted-foreground">
              {language === 'pt' 
                ? 'Adicione medicamentos para verificar interações'
                : 'Add medications to check for interactions'}
            </div>
          ) : (
            <div className="border rounded-md">
              {medications.map((med) => (
                <div key={med.rxcui} className="px-3 py-2 border-b last:border-0 flex justify-between items-center">
                  <div>
                    <div className="font-medium">{med.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {t('rxnormCode')}: {med.rxcui}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveMedication(med.rxcui)}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <Button 
          onClick={handleCheckInteractions}
          disabled={isCheckingInteractions || medications.length < 2}
          className="w-full"
        >
          {isCheckingInteractions ? (
            <RefreshCw className="h-4 w-4 animate-spin mr-2" />
          ) : null}
          {language === 'pt' ? 'Verificar Interações' : 'Check Interactions'}
        </Button>
        
        {interactions.length > 0 && (
          <div className="mt-4 space-y-4">
            <h3 className="font-medium text-lg">
              {language === 'pt' ? 'Interações Encontradas' : 'Interactions Found'}
            </h3>
            
            {interactions.map((interaction, index) => (
              <Alert key={index} variant="outline" className="border-l-4 border-l-warning">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle className="flex items-center gap-2">
                  {language === 'pt' ? 'Interação' : 'Interaction'} 
                  <Badge className={getSeverityColor(interaction.severity)}>
                    {interaction.severity || 'N/A'}
                  </Badge>
                </AlertTitle>
                <AlertDescription className="mt-2">
                  <div>
                    <p className="text-sm font-medium mb-1">
                      {language === 'pt' ? 'Medicamentos' : 'Medications'}:
                    </p>
                    <p className="text-sm">
                      {interaction.interactionConcept.map((concept: any) => 
                        concept.minConceptItem.name
                      ).join(' + ')}
                    </p>
                  </div>
                  <p className="mt-2 text-sm">{interaction.description}</p>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DrugInteractionChecker;
