import React, { useState, useEffect } from 'react';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "@/hooks/use-toast"
import { SearchIcon, AlertTriangle } from 'lucide-react';
import {
  checkMedicationInteractions,
  searchMedications,
  MedicationSearchResult,
  MedicationInteraction
} from '@/services/medications';
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Medication name must be at least 2 characters.",
  }),
  dosage: z.string().min(1, {
    message: "Dosage is required.",
  }),
  route: z.string().min(2, {
    message: "Route must be at least 2 characters.",
  }),
  frequency: z.string().min(2, {
    message: "Frequency must be at least 2 characters.",
  }),
  duration: z.string().min(1, {
    message: "Duration is required.",
  }),
  notes: z.string().optional(),
  type: z.enum(['tablet', 'capsule', 'injection', 'cream', 'liquid']),
})

interface NewMedicationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
}

const NewMedicationForm: React.FC<NewMedicationFormProps> = ({ open, onOpenChange, onSubmit }) => {
  const [medications, setMedications] = useState<MedicationSearchResult[]>([]);
  const [selectedMedication, setSelectedMedication] = useState<MedicationSearchResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [interactions, setInteractions] = useState<MedicationInteraction[]>([]);
  const [isCheckingInteractions, setIsCheckingInteractions] = useState(false);
  const [rxcui, setRxcui] = useState('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      dosage: "",
      route: "",
      frequency: "",
      duration: "",
      type: 'tablet'
    },
  })

  useEffect(() => {
    if (selectedMedication) {
      form.setValue('name', selectedMedication.name);
      setRxcui(selectedMedication.rxcui);
    }
  }, [selectedMedication, form]);

  const search = async (term: string) => {
    setIsSearching(true);
    try {
      const results = await searchMedications(term);
      setMedications(results);
    } catch (error) {
      console.error('Failed to search medications:', error);
      toast({
        title: 'Error',
        description: 'Failed to search medications',
        variant: 'destructive'
      });
      setMedications([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Fix the checkInteractions function call
  const checkInteractions = async (rxcui: string) => {
    try {
      setIsCheckingInteractions(true);
      const result = await checkMedicationInteractions(rxcui);
      setInteractions(result);
    } catch (error) {
      console.error('Failed to check interactions:', error);
      setInteractions([]);
    } finally {
      setIsCheckingInteractions(false);
    }
  };

  const onSubmitHandler = (values: z.infer<typeof formSchema>) => {
    onSubmit(values);
    onOpenChange(false);
    toast({
      title: "Medication added.",
      description: "Your medication has been added to the list.",
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Add New Medication</AlertDialogTitle>
          <AlertDialogDescription>
            Enter the details for the new medication.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmitHandler)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Medication Name</FormLabel>
                  <div className="flex rounded-md shadow-sm">
                    <FormControl>
                      <Input
                        className="rounded-r-none"
                        placeholder="Search medication..."
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          search(e.target.value);
                          setSelectedMedication(null);
                        }}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="rounded-l-none"
                      isLoading={isSearching}
                    >
                      <SearchIcon className="h-4 w-4 mr-2" />
                      Search
                    </Button>
                  </div>
                  <FormDescription>
                    Select a medication from the list or enter a new one.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {medications.length > 0 && (
              <ScrollArea className="max-h-40 rounded-md border p-2">
                {medications.map((medication) => (
                  <Button
                    key={medication.rxcui}
                    variant="ghost"
                    className="w-full justify-start rounded-md hover:bg-secondary"
                    onClick={() => {
                      setSelectedMedication(medication);
                      setMedications([]);
                      checkInteractions(medication.rxcui);
                    }}
                  >
                    {medication.name}
                  </Button>
                ))}
              </ScrollArea>
            )}
            {interactions.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  <AlertTriangle className="h-4 w-4 mr-2 text-amber-500 inline-block align-middle" />
                  Drug Interactions
                </Label>
                <ScrollArea className="max-h-40 rounded-md border p-2">
                  {interactions.map((interaction, index) => (
                    <Badge key={index} variant="destructive" className="mr-1">
                      {interaction.severity}: {interaction.description}
                    </Badge>
                  ))}
                </ScrollArea>
              </div>
            )}
            <FormField
              control={form.control}
              name="dosage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dosage</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter dosage" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter the dosage for the medication.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="route"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Route</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter route" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter the route for the medication.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="frequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Frequency</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter frequency" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter the frequency for the medication.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter duration" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter the duration for the medication.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="tablet">Tablet</SelectItem>
                      <SelectItem value="capsule">Capsule</SelectItem>
                      <SelectItem value="injection">Injection</SelectItem>
                      <SelectItem value="cream">Cream</SelectItem>
                      <SelectItem value="liquid">Liquid</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the type of medication.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter any notes about the medication."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Additional notes or instructions.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <Button type="submit" isLoading={form.formState.isSubmitting}>
                Add Medication
              </Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default NewMedicationForm;
