import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NewOrder = () => {
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate('/orders');
  };

  return (
    <div className="container mx-auto p-4">
      <Button variant="ghost" onClick={handleCancel} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Orders
      </Button>

      <div className="text-2xl font-bold mb-4">New Order</div>

      {/* Order Entry Form will go here */}
      <div>
        Order Entry Form Coming Soon...
      </div>
    </div>
  );
};

export default NewOrder;