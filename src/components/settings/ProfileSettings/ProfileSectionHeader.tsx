
import React from 'react';
import { Database } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/hooks/useTranslation';

interface ProfileSectionHeaderProps {
  title: string;
  description: string;
}

const ProfileSectionHeader = ({ title, description }: ProfileSectionHeaderProps) => {
  const { language } = useTranslation();
  
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-medium">{title}</h2>
        <Badge variant="data">
          <Database className="h-3 w-3 mr-1" />
          {language === 'pt' ? 'Supabase' : 'Supabase'}
        </Badge>
      </div>
      <p className="text-muted-foreground mt-1">{description}</p>
    </div>
  );
};

export default ProfileSectionHeader;
