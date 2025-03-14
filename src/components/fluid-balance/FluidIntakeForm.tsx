
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Droplet, Plus } from 'lucide-react';
import { useFluidIntakeForm } from '@/hooks/useFluidIntakeForm';
import { fluidTypeLabels, FluidIntakeType, defaultFluidTypes } from '@/utils/fluidTypes';
import { useTranslation } from '@/hooks/useTranslation';

interface FluidIntakeFormProps {
  patientId: string;
  onSuccess?: () => void;
}

const FluidIntakeForm: React.FC<FluidIntakeFormProps> = ({ patientId, onSuccess }) => {
  const { language } = useTranslation();
  const {
    fluidType,
    setFluidType,
    amount,
    setAmount,
    timestamp,
    setTimestamp,
    notes,
    setNotes,
    isSubmitting,
    error,
    handleSubmit
  } = useFluidIntakeForm({ patientId, onSuccess });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Droplet className="h-5 w-5 text-blue-500" />
          {language === 'pt' ? 'Registrar Entrada de Líquidos' : 'Record Fluid Intake'}
        </CardTitle>
        <CardDescription>
          {language === 'pt' 
            ? 'Registre a quantidade de líquidos consumidos pelo paciente' 
            : 'Record the amount of fluids consumed by the patient'}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fluid-type">
                {language === 'pt' ? 'Tipo de Fluido' : 'Fluid Type'}
              </Label>
              <div className="flex flex-wrap gap-2">
                {defaultFluidTypes.map((type) => (
                  <Button
                    key={type}
                    type="button"
                    variant={fluidType === type ? "default" : "outline"}
                    onClick={() => setFluidType(type)}
                    className="flex-1"
                  >
                    {fluidTypeLabels[type][language === 'pt' ? 'pt' : 'en']}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">
                {language === 'pt' ? 'Quantidade (ml)' : 'Amount (ml)'}
              </Label>
              <Input
                id="amount"
                type="number"
                min="0"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="timestamp">
              {language === 'pt' ? 'Data e Hora' : 'Date and Time'}
            </Label>
            <Input
              id="timestamp"
              type="datetime-local"
              value={timestamp.toISOString().slice(0, 16)}
              onChange={(e) => setTimestamp(new Date(e.target.value))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">
              {language === 'pt' ? 'Observações' : 'Notes'}
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={language === 'pt' ? 'Observações adicionais...' : 'Additional notes...'}
              rows={3}
            />
          </div>
          {error && (
            <div className="text-sm font-medium text-destructive">
              {error}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full"
          >
            <Plus className="mr-2 h-4 w-4" />
            {isSubmitting 
              ? (language === 'pt' ? 'Registrando...' : 'Recording...') 
              : (language === 'pt' ? 'Registrar Entrada' : 'Record Intake')}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default FluidIntakeForm;
