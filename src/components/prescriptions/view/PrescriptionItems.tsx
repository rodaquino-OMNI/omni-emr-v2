
import React from 'react';
import { Prescription } from '@/services/prescriptions';
import PrescriptionItemCard from '../PrescriptionItemCard';

type PrescriptionItemsProps = {
  prescription: Prescription;
};

const PrescriptionItems = ({ prescription }: PrescriptionItemsProps) => {
  return (
    <div className="glass-card p-6">
      <h2 className="text-xl font-medium mb-4">Prescription Items</h2>
      
      {prescription.items.length > 0 ? (
        <div className="space-y-4">
          {prescription.items.map((item) => (
            <PrescriptionItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          No items in this prescription
        </div>
      )}
    </div>
  );
};

export default PrescriptionItems;
