
import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LucideIcon, Package, FileText, Activity, User, Pill, Calendar, MessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

// Interface for function blocks
interface FunctionBlock {
  id: string;
  name: string;
  description: string;
  icon: string;
  permissions: string[];
  isActive: boolean;
  category: string;
}

// Sample function blocks for the demo
const sampleFunctionBlocks: FunctionBlock[] = [
  {
    id: '1',
    name: 'Patient Management',
    description: 'View and manage patient information, medical history, and demographics',
    icon: 'User',
    permissions: ['view_patients', 'edit_patients'],
    isActive: true,
    category: 'clinical'
  },
  {
    id: '2',
    name: 'Medication Administration',
    description: 'Record and track medication administration to patients',
    icon: 'Pill',
    permissions: ['view_medications', 'administer_medications'],
    isActive: true,
    category: 'medication'
  },
  {
    id: '3',
    name: 'Appointment Scheduling',
    description: 'Schedule and manage patient appointments',
    icon: 'Calendar',
    permissions: ['view_schedule', 'schedule_appointments'],
    isActive: true,
    category: 'administrative'
  },
  {
    id: '4',
    name: 'Clinical Documentation',
    description: 'Create and edit clinical notes and medical records',
    icon: 'FileText',
    permissions: ['create_clinical_notes', 'edit_records'],
    isActive: true,
    category: 'clinical'
  },
  {
    id: '5',
    name: 'Vital Signs Monitoring',
    description: 'Record and track patient vital signs',
    icon: 'Activity',
    permissions: ['view_vitals', 'document_vital_signs'],
    isActive: true,
    category: 'care'
  },
  {
    id: '6',
    name: 'Messaging',
    description: 'Send and receive messages to/from other healthcare providers',
    icon: 'MessageSquare',
    permissions: ['view_messages', 'send_messages'],
    isActive: true,
    category: 'communication'
  }
];

// Categories for function blocks
const categories = [
  { id: 'clinical', name: 'Clinical' },
  { id: 'medication', name: 'Medication' },
  { id: 'administrative', name: 'Administrative' },
  { id: 'care', name: 'Patient Care' },
  { id: 'emergency', name: 'Emergency' },
  { id: 'communication', name: 'Communication' }
];

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
  User,
  Pill,
  Calendar,
  FileText,
  Activity,
  MessageSquare,
  Package
};

const FunctionBlocksManager = () => {
  const { toast } = useToast();
  const [functionBlocks, setFunctionBlocks] = useState<FunctionBlock[]>(sampleFunctionBlocks);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState<FunctionBlock | null>(null);
  
  // Form state
  const [formState, setFormState] = useState<Partial<FunctionBlock>>({
    name: '',
    description: '',
    icon: 'Package',
    permissions: [],
    isActive: true,
    category: 'clinical'
  });

  const handleAddBlock = () => {
    setFormState({
      name: '',
      description: '',
      icon: 'Package',
      permissions: [],
      isActive: true,
      category: 'clinical'
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
      id: Date.now().toString(),
      name: formState.name || '',
      description: formState.description || '',
      icon: formState.icon || 'Package',
      permissions: formState.permissions || [],
      isActive: formState.isActive ?? true,
      category: formState.category || 'clinical'
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
              isActive: formState.isActive ?? block.isActive,
              category: formState.category || block.category
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
    const IconComponent = iconMap[iconName] || Package;
    return <IconComponent className="h-5 w-5" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Function Blocks</h3>
          <p className="text-sm text-muted-foreground">Manage function blocks that can be assigned to user roles</p>
        </div>
        <Button onClick={handleAddBlock}>
          <Package className="mr-2 h-4 w-4" />
          Add Function Block
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {functionBlocks.map(block => (
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
                value={formState.category}
                onValueChange={(value) => setFormState(prev => ({ ...prev, category: value }))}
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
                value={formState.category}
                onValueChange={(value) => setFormState(prev => ({ ...prev, category: value }))}
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

export default FunctionBlocksManager;
