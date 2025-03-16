
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Package, Shield, FileText, Activity, User, Pill, Calendar, MessageSquare } from 'lucide-react';
import { FunctionBlock, FunctionBlockCategory } from '@/types/functionBlocks';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

// Sample function blocks for demonstration
const initialFunctionBlocks: FunctionBlock[] = [
  {
    id: 'patient_management',
    name: 'Patient Management',
    description: 'View and manage patient information, demographics, and access patient records',
    category: 'clinical',
    icon: 'User',
    permissions: ['view_patients', 'edit_patients'],
    relatedPages: ['/patients', '/patients/:id', '/patient-profile'],
    isActive: true,
    availableForRoles: ['doctor', 'nurse', 'admin', 'administrative']
  },
  {
    id: 'medication_management',
    name: 'Medication Management',
    description: 'Prescribe, view, and manage patient medications',
    category: 'medication',
    icon: 'Pill',
    permissions: ['view_medications', 'prescribe_medications'],
    relatedPages: ['/medications', '/medication/:id', '/prescribe'],
    isActive: true,
    availableForRoles: ['doctor', 'nurse', 'pharmacist', 'admin']
  },
  {
    id: 'clinical_documentation',
    name: 'Clinical Documentation',
    description: 'Create and edit clinical notes and medical records',
    category: 'clinical',
    icon: 'FileText',
    permissions: ['create_clinical_notes', 'view_records'],
    relatedPages: ['/records', '/record/:id', '/clinical-documentation'],
    isActive: true,
    availableForRoles: ['doctor', 'nurse', 'admin']
  },
  {
    id: 'appointment_scheduling',
    name: 'Appointment Scheduling',
    description: 'Schedule and manage patient appointments',
    category: 'workflow',
    icon: 'Calendar',
    permissions: ['view_schedule', 'manage_appointments'],
    relatedPages: ['/schedule', '/appointments'],
    isActive: true,
    availableForRoles: ['doctor', 'nurse', 'administrative', 'admin']
  },
  {
    id: 'emergency_care',
    name: 'Emergency Care',
    description: 'Manage emergency triage and urgent care workflows',
    category: 'emergency',
    icon: 'Activity',
    permissions: ['perform_triage', 'view_emergency'],
    relatedPages: ['/emergency-care', '/triage'],
    isActive: true,
    availableForRoles: ['doctor', 'nurse', 'admin']
  },
  {
    id: 'fluid_balance',
    name: 'Fluid Balance Monitoring',
    description: 'Track patient fluid intake and output',
    category: 'care',
    icon: 'Droplet',
    permissions: ['view_fluid_balance', 'manage_fluid_balance'],
    relatedPages: ['/fluid-balance'],
    isActive: true,
    availableForRoles: ['doctor', 'nurse', 'admin']
  },
  {
    id: 'vital_signs',
    name: 'Vital Signs Monitoring',
    description: 'Record and track patient vital signs',
    category: 'care',
    icon: 'Activity',
    permissions: ['view_vitals', 'document_vital_signs'],
    relatedPages: ['/vitals', '/vital-signs'],
    isActive: true,
    availableForRoles: ['doctor', 'nurse', 'admin']
  },
  {
    id: 'messaging',
    name: 'Secure Messaging',
    description: 'Send and receive secure messages to other healthcare providers',
    category: 'communication',
    icon: 'MessageSquare',
    permissions: ['view_messages', 'send_messages'],
    relatedPages: ['/messages'],
    isActive: true,
    availableForRoles: ['doctor', 'nurse', 'administrative', 'admin']
  }
];

// Categories for function blocks
const categories: { id: FunctionBlockCategory; name: string }[] = [
  { id: 'clinical', name: 'Clinical' },
  { id: 'medication', name: 'Medication' },
  { id: 'administrative', name: 'Administrative' },
  { id: 'care', name: 'Patient Care' },
  { id: 'emergency', name: 'Emergency' },
  { id: 'communication', name: 'Communication' },
  { id: 'workflow', name: 'Workflow' },
  { id: 'telemedicine', name: 'Telemedicine' },
  { id: 'laboratory', name: 'Laboratory' },
  { id: 'radiology', name: 'Radiology' }
];

// Icon mapping
const iconMap: Record<string, React.ReactNode> = {
  User: <User className="h-5 w-5" />,
  Pill: <Pill className="h-5 w-5" />,
  Calendar: <Calendar className="h-5 w-5" />,
  FileText: <FileText className="h-5 w-5" />,
  Activity: <Activity className="h-5 w-5" />,
  MessageSquare: <MessageSquare className="h-5 w-5" />,
  Package: <Package className="h-5 w-5" />
};

const FunctionBlocks = () => {
  const { user, hasPermission } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [functionBlocks, setFunctionBlocks] = useState<FunctionBlock[]>(initialFunctionBlocks);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState<FunctionBlock | null>(null);
  
  // Form state
  const [formState, setFormState] = useState<Partial<FunctionBlock>>({
    name: '',
    description: '',
    icon: 'Package',
    permissions: [],
    relatedPages: [],
    isActive: true,
    category: 'clinical',
    availableForRoles: []
  });

  // Check if user has permission to access this page
  useEffect(() => {
    if (!user || !hasPermission('manage_roles')) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the function blocks page",
        variant: "destructive"
      });
      navigate('/unauthorized', { 
        state: { requiredPermission: 'manage_roles' } 
      });
    }
  }, [user, hasPermission, navigate, toast]);

  const handleAddBlock = () => {
    setFormState({
      name: '',
      description: '',
      icon: 'Package',
      permissions: [],
      relatedPages: [],
      isActive: true,
      category: 'clinical',
      availableForRoles: []
    });
    setIsAddDialogOpen(true);
  };

  const handleEditBlock = (block: FunctionBlock) => {
    setSelectedBlock(block);
    setFormState(block);
    setIsEditDialogOpen(true);
  };

  const handleToggleActive = (blockId: string) => {
    setFunctionBlocks(prev => 
      prev.map(block => 
        block.id === blockId 
          ? { ...block, isActive: !block.isActive } 
          : block
      )
    );
    
    toast({
      title: "Status Updated",
      description: "Function block status has been updated",
    });
  };

  const handleSaveNewBlock = () => {
    if (!formState.name || !formState.description) {
      toast({
        title: "Missing Information",
        description: "Please fill out all required fields",
        variant: "destructive",
      });
      return;
    }
    
    const newBlock: FunctionBlock = {
      id: formState.name?.toLowerCase().replace(/\s+/g, '_') || Date.now().toString(),
      name: formState.name || '',
      description: formState.description || '',
      icon: formState.icon || 'Package',
      permissions: formState.permissions || [],
      relatedPages: formState.relatedPages || [],
      isActive: formState.isActive ?? true,
      category: formState.category as FunctionBlockCategory || 'clinical',
      availableForRoles: formState.availableForRoles || []
    };
    
    setFunctionBlocks(prev => [...prev, newBlock]);
    setIsAddDialogOpen(false);
    
    toast({
      title: "Function Block Added",
      description: `"${newBlock.name}" has been added successfully`,
    });
  };

  const handleUpdateBlock = () => {
    if (!selectedBlock || !formState.name || !formState.description) {
      return;
    }
    
    setFunctionBlocks(prev => 
      prev.map(block => 
        block.id === selectedBlock.id 
          ? { 
              ...block, 
              name: formState.name || block.name,
              description: formState.description || block.description,
              icon: formState.icon || block.icon,
              permissions: formState.permissions || block.permissions,
              relatedPages: formState.relatedPages || block.relatedPages,
              isActive: formState.isActive ?? block.isActive,
              category: formState.category as FunctionBlockCategory || block.category,
              availableForRoles: formState.availableForRoles || block.availableForRoles
            } 
          : block
      )
    );
    
    setIsEditDialogOpen(false);
    
    toast({
      title: "Function Block Updated",
      description: `"${formState.name}" has been updated successfully`,
    });
  };

  const handleDeleteBlock = (blockId: string) => {
    setFunctionBlocks(prev => prev.filter(block => block.id !== blockId));
    
    toast({
      title: "Function Block Deleted",
      description: "The function block has been removed",
    });
  };

  const getIconComponent = (iconName: string) => {
    return iconMap[iconName] || <Package className="h-5 w-5" />;
  };

  // Filter function blocks based on category and search term
  const filteredBlocks = functionBlocks.filter(block => {
    const matchesCategory = activeCategory === 'all' || block.category === activeCategory;
    const matchesSearch = block.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         block.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex items-center mb-6">
        <Package className="h-6 w-6 mr-2 text-primary" />
        <h1 className="text-2xl font-bold">Function Blocks Management</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>System Function Blocks</CardTitle>
          <CardDescription>
            Manage modular function blocks that can be assigned to different user roles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Category filters and search */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="w-full md:w-auto">
                <Tabs value={activeCategory} onValueChange={setActiveCategory}>
                  <TabsList className="mb-4 flex flex-wrap">
                    <TabsTrigger value="all">All</TabsTrigger>
                    {categories.map(category => (
                      <TabsTrigger key={category.id} value={category.id}>
                        {category.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>
              
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="relative w-full">
                  <Input
                    placeholder="Search function blocks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Button onClick={handleAddBlock}>
                  <Package className="mr-2 h-4 w-4" />
                  Add Block
                </Button>
              </div>
            </div>
            
            {/* Function blocks grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredBlocks.map(block => (
                <Card key={block.id} className={`hover:shadow-md transition-shadow ${!block.isActive ? 'opacity-60' : ''}`}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        {getIconComponent(block.icon)}
                        <CardTitle className="text-lg">{block.name}</CardTitle>
                      </div>
                      <Badge variant={block.isActive ? "default" : "outline"}>
                        {block.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">{block.description}</p>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {block.permissions.slice(0, 2).map(permission => (
                        <Badge key={permission} variant="secondary" className="text-xs">
                          {permission.replace(/_/g, ' ')}
                        </Badge>
                      ))}
                      {block.permissions.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{block.permissions.length - 2} more
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <Badge variant="outline">{categories.find(c => c.id === block.category)?.name || block.category}</Badge>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditBlock(block)}>
                          Edit
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleToggleActive(block.id)}
                        >
                          {block.isActive ? "Disable" : "Enable"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Function Block Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Function Block</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formState.name || ''}
                onChange={(e) => setFormState(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter block name"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formState.description || ''}
                onChange={(e) => setFormState(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the function block"
                rows={3}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formState.category as string}
                onValueChange={(value) => setFormState(prev => ({ ...prev, category: value as FunctionBlockCategory }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="icon">Icon</Label>
              <Select
                value={formState.icon}
                onValueChange={(value) => setFormState(prev => ({ ...prev, icon: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select icon" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(iconMap).map(icon => (
                    <SelectItem key={icon} value={icon}>
                      <div className="flex items-center gap-2">
                        {getIconComponent(icon)}
                        {icon}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="active-status"
                checked={formState.isActive}
                onCheckedChange={(checked) => setFormState(prev => ({ ...prev, isActive: checked }))}
              />
              <Label htmlFor="active-status">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveNewBlock}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Function Block Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Function Block</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={formState.name || ''}
                onChange={(e) => setFormState(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formState.description || ''}
                onChange={(e) => setFormState(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-category">Category</Label>
              <Select
                value={formState.category as string}
                onValueChange={(value) => setFormState(prev => ({ ...prev, category: value as FunctionBlockCategory }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-icon">Icon</Label>
              <Select
                value={formState.icon}
                onValueChange={(value) => setFormState(prev => ({ ...prev, icon: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select icon" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(iconMap).map(icon => (
                    <SelectItem key={icon} value={icon}>
                      <div className="flex items-center gap-2">
                        {getIconComponent(icon)}
                        {icon}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-active-status"
                checked={formState.isActive}
                onCheckedChange={(checked) => setFormState(prev => ({ ...prev, isActive: checked }))}
              />
              <Label htmlFor="edit-active-status">Active</Label>
            </div>
          </div>
          <DialogFooter className="flex justify-between">
            <Button 
              variant="destructive" 
              onClick={() => {
                if (selectedBlock) {
                  handleDeleteBlock(selectedBlock.id);
                  setIsEditDialogOpen(false);
                }
              }}
            >
              Delete
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateBlock}>
                Update
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FunctionBlocks;
