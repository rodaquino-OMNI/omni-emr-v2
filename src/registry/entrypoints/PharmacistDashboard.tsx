
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Pill, CheckSquare, PackageCheck, PackageOpen } from 'lucide-react';

const PharmacistDashboard: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Pharmacy Dashboard</h1>
        <div className="flex space-x-2">
          <Button onClick={() => navigate('/medications')}>
            <Pill className="h-4 w-4 mr-2" />
            Medications
          </Button>
          <Button onClick={() => navigate('/pharmacy/inventory')} variant="outline">
            <PackageCheck className="h-4 w-4 mr-2" />
            Inventory
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg font-medium">
              <CheckSquare className="h-5 w-5 mr-2 text-primary" />
              Prescription Queue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Pending Verification</span>
                <span className="font-semibold">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Ready to Fill</span>
                <span className="font-semibold">8</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Completed Today</span>
                <span className="font-semibold">24</span>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full mt-4"
              onClick={() => navigate('/pharmacy/queue')}
            >
              View Queue
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg font-medium">
              <PackageCheck className="h-5 w-5 mr-2 text-primary" />
              Inventory Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Low Stock Items</span>
                <span className="font-semibold text-amber-500">5</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Expired Medications</span>
                <span className="font-semibold text-red-500">2</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Orders Pending</span>
                <span className="font-semibold">3</span>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full mt-4"
              onClick={() => navigate('/pharmacy/inventory')}
            >
              Manage Inventory
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg font-medium">
              <PackageOpen className="h-5 w-5 mr-2 text-primary" />
              Drug Interactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Severe Interactions</span>
                <span className="font-semibold text-red-500">2</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Moderate Interactions</span>
                <span className="font-semibold text-amber-500">7</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Allergy Alerts</span>
                <span className="font-semibold text-red-500">3</span>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full mt-4"
              onClick={() => navigate('/pharmacy/interactions')}
            >
              View Interactions
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mt-6">
        <CardHeader className="pb-2">
          <CardTitle>Prescription Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending">
            <TabsList className="mb-4">
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="verified">Verified</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            
            <TabsContent value="pending" className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-md">
                <div>
                  <h3 className="font-medium">Maria Silva - Lisinopril 10mg</h3>
                  <p className="text-sm text-muted-foreground">Prescribed by: Dr. João Santos</p>
                  <p className="text-sm text-muted-foreground">Submitted: Today, 09:15</p>
                </div>
                <Button variant="outline" size="sm">Verify</Button>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-md">
                <div>
                  <h3 className="font-medium">Pedro Costa - Metformin 500mg</h3>
                  <p className="text-sm text-muted-foreground">Prescribed by: Dr. Ana Oliveira</p>
                  <p className="text-sm text-muted-foreground">Submitted: Today, 10:30</p>
                </div>
                <Button variant="outline" size="sm">Verify</Button>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-md">
                <div>
                  <h3 className="font-medium">Ana Santos - Atorvastatin 20mg</h3>
                  <p className="text-sm text-muted-foreground">Prescribed by: Dr. Carlos Mendes</p>
                  <p className="text-sm text-muted-foreground">Submitted: Today, 11:45</p>
                </div>
                <Button variant="outline" size="sm">Verify</Button>
              </div>
            </TabsContent>
            
            <TabsContent value="verified" className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-md">
                <div>
                  <h3 className="font-medium">João Pereira - Amoxicillin 500mg</h3>
                  <p className="text-sm text-muted-foreground">Verified at: Today, 08:45</p>
                  <p className="text-sm text-muted-foreground">Ready for pickup</p>
                </div>
                <Button variant="outline" size="sm">Complete</Button>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-md">
                <div>
                  <h3 className="font-medium">Carla Oliveira - Hydrochlorothiazide 25mg</h3>
                  <p className="text-sm text-muted-foreground">Verified at: Today, 09:30</p>
                  <p className="text-sm text-muted-foreground">Ready for pickup</p>
                </div>
                <Button variant="outline" size="sm">Complete</Button>
              </div>
            </TabsContent>
            
            <TabsContent value="completed" className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-md">
                <div>
                  <h3 className="font-medium">Sofia Martins - Levothyroxine 50mcg</h3>
                  <p className="text-sm text-muted-foreground">Completed at: Today, 08:15</p>
                  <p className="text-sm text-muted-foreground">Picked up</p>
                </div>
                <Button variant="ghost" size="sm">Details</Button>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-md">
                <div>
                  <h3 className="font-medium">Ricardo Silva - Simvastatin 20mg</h3>
                  <p className="text-sm text-muted-foreground">Completed at: Today, 07:45</p>
                  <p className="text-sm text-muted-foreground">Delivered to ward</p>
                </div>
                <Button variant="ghost" size="sm">Details</Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default PharmacistDashboard;
