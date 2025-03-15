
import React, { useState } from 'react';
import { Prescription } from '@/services/prescriptions';
import PrescriptionItemCard from '../PrescriptionItemCard';
import { ClipboardList, Filter, Search, Shield, ArrowDownUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';

type PrescriptionItemsProps = {
  prescription: Prescription;
};

const PrescriptionItems = ({ prescription }: PrescriptionItemsProps) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // Filter items based on search term
  const filteredItems = prescription.items.filter(item => 
    item.medicationName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Sort items based on sort order
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.medicationName.localeCompare(b.medicationName);
    } else {
      return b.medicationName.localeCompare(a.medicationName);
    }
  });
  
  return (
    <div className="glass-card p-6 border border-border rounded-lg shadow-sm">
      <div className="flex items-center gap-3 mb-5">
        <div className="h-9 w-9 rounded-full bg-medical-purple/10 flex items-center justify-center">
          <ClipboardList className="h-5 w-5 text-medical-purple" />
        </div>
        <h2 className="text-xl font-medium">{t('prescriptionItems') || 'Prescription Items'}</h2>
        
        <div className="flex-1 flex justify-end">
          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('searchMedications') || "Search medications..."}
                className="pl-9 h-9"
              />
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="h-9 gap-1"
            >
              <ArrowDownUp className="h-4 w-4" />
              {t('sort') || 'Sort'}
            </Button>
          </div>
        </div>
      </div>
      
      {sortedItems.length > 0 ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sortedItems.map((item) => (
              <PrescriptionItemCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-10 bg-background/50 rounded-md border border-border/50">
          <div className="flex flex-col items-center gap-2">
            <ClipboardList className="h-12 w-12 text-muted-foreground/50" />
            <p className="text-muted-foreground font-medium">
              {searchTerm 
                ? t('noMatchingMedications') || 'No matching medications found'
                : t('noItemsInPrescription') || 'No items in this prescription'
              }
            </p>
            {searchTerm && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setSearchTerm('')}
                className="mt-2"
              >
                {t('clearSearch') || 'Clear search'}
              </Button>
            )}
          </div>
        </div>
      )}
      
      {prescription.items.length > 0 && (
        <div className="mt-4 flex items-center text-xs text-muted-foreground pt-3 border-t border-border">
          <Shield className="h-3.5 w-3.5 mr-1 text-green-500" />
          <span>{t('rxNormVerified') || 'RxNorm verified medications'}</span>
        </div>
      )}
    </div>
  );
};

export default PrescriptionItems;
