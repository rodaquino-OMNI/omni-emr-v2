
import React from 'react';
import { Save, Loader2, KeyRound, Database, Cloud, Shield, Lock } from 'lucide-react';
import { ProfileFormData } from './types';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/hooks/useTranslation';

interface ProfileFormProps {
  formData: ProfileFormData;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onInputChange: (field: keyof ProfileFormData, value: string) => void;
}

const ProfileForm = ({ formData, loading, onSubmit, onInputChange }: ProfileFormProps) => {
  const { language } = useTranslation();

  return (
    <form onSubmit={onSubmit} className="relative">
      <div className="absolute -top-12 right-0 flex items-center gap-2 text-xs text-cyan-700 dark:text-cyan-300">
        <Cloud className="h-4 w-4" />
        <span>{language === 'pt' ? 'Conectado à Supabase' : 'Connected to Supabase'}</span>
        <Badge variant="data" className="ml-1">
          <Database className="h-3 w-3 mr-1" />
          {language === 'pt' ? 'Armazenamento Seguro' : 'Secure Storage'}
        </Badge>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium flex items-center">
            {language === 'pt' ? 'Nome' : 'Name'}
            <span className="ml-2 text-xs text-muted-foreground">
              ({language === 'pt' ? 'Público' : 'Public'})
            </span>
          </label>
          <div className="relative">
            <input
              id="name"
              type="text"
              className="w-full h-10 px-3 rounded-md border border-input bg-background"
              value={formData.name}
              onChange={(e) => onInputChange('name', e.target.value)}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium flex items-center">
            {language === 'pt' ? 'Email' : 'Email'}
            <Badge variant="secondary" className="ml-2 text-[10px]">
              <KeyRound className="h-2.5 w-2.5 mr-1" />
              {language === 'pt' ? 'Vinculado à Autenticação' : 'Linked to Auth'}
            </Badge>
          </label>
          <div className="relative">
            <input
              id="email"
              type="email"
              className="w-full h-10 px-3 rounded-md border border-input bg-background pl-8"
              value={formData.email}
              onChange={(e) => onInputChange('email', e.target.value)}
              disabled={true}
            />
            <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
              <Shield className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="role" className="text-sm font-medium flex items-center">
            {language === 'pt' ? 'Função' : 'Role'}
            <Badge variant="outline" className="ml-2 text-[10px]">
              <Shield className="h-2.5 w-2.5 mr-1" />
              {language === 'pt' ? 'Protegido' : 'Protected'}
            </Badge>
          </label>
          <div className="relative">
            <input
              id="role"
              type="text"
              className="w-full h-10 px-3 rounded-md border border-input bg-background pl-8"
              value={formData.role}
              disabled={true}
            />
            <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
              <Lock className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="department" className="text-sm font-medium">
            {language === 'pt' ? 'Departamento' : 'Department'}
          </label>
          <input
            id="department"
            type="text"
            className="w-full h-10 px-3 rounded-md border border-input bg-background"
            value={formData.department}
            onChange={(e) => onInputChange('department', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium">
            {language === 'pt' ? 'Telefone' : 'Phone'}
          </label>
          <input
            id="phone"
            type="text"
            className="w-full h-10 px-3 rounded-md border border-input bg-background"
            value={formData.phone}
            onChange={(e) => onInputChange('phone', e.target.value)}
          />
        </div>
        
        <div className="space-y-2 md:col-span-2">
          <label htmlFor="bio" className="text-sm font-medium">
            {language === 'pt' ? 'Biografia' : 'Bio'}
          </label>
          <textarea
            id="bio"
            rows={4}
            className="w-full px-3 py-2 rounded-md border border-input bg-background"
            value={formData.bio}
            onChange={(e) => onInputChange('bio', e.target.value)}
          />
        </div>
        
        <div className="md:col-span-2 flex items-center justify-between">
          <div className="flex items-center text-xs text-muted-foreground">
            <Database className="h-4 w-4 mr-1" />
            {language === 'pt' 
              ? 'Alterações são sincronizadas automaticamente' 
              : 'Changes are automatically synced'}
          </div>
          
          <button
            type="submit"
            className="h-10 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-md px-4 text-sm font-medium flex items-center gap-1 shadow-sm"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {language === 'pt' ? 'Salvando...' : 'Saving...'}
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {language === 'pt' ? 'Salvar Alterações' : 'Save Changes'}
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default ProfileForm;
