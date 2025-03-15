
import React from 'react';
import { Prescription } from '@/services/prescriptions';
import PrescriptionItemCard from '../PrescriptionItemCard';
import { ClipboardList } from 'lucide-react';

type PrescriptionItemsProps = {
  prescription: Prescription;
};

const PrescriptionItems = ({ prescription }: PrescriptionItemsProps) => {
  return (
    <div className="glass-card p-6 border border-border">
      <div className="flex items-center gap-3 mb-5">
        <div className="h-8 w-8 rounded-full bg-medical-purple/10 flex items-center justify-center">
          <ClipboardList className="h-4 w-4 text-medical-purple" />
        </div>
        <h2 className="text-xl font-medium">Prescription Items</h2>
      </div>
      
      {prescription.items.length > 0 ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {prescription.items.map((item) => (
              <PrescriptionItemCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground bg-background/50 rounded-md border border-border/50">
          No items in this prescription
        </div>
      )}
    </div>
  );
};

export default PrescriptionItems;
