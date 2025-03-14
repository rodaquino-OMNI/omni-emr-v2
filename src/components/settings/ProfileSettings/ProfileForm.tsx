
import React from 'react';
import { Save, Loader2 } from 'lucide-react';
import { ProfileFormData } from './types';

interface ProfileFormProps {
  formData: ProfileFormData;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onInputChange: (field: keyof ProfileFormData, value: string) => void;
}

const ProfileForm = ({ formData, loading, onSubmit, onInputChange }: ProfileFormProps) => {
  return (
    <form onSubmit={onSubmit}>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Name
          </label>
          <input
            id="name"
            type="text"
            className="w-full h-10 px-3 rounded-md border border-input bg-background"
            value={formData.name}
            onChange={(e) => onInputChange('name', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="w-full h-10 px-3 rounded-md border border-input bg-background"
            value={formData.email}
            onChange={(e) => onInputChange('email', e.target.value)}
            disabled={true} // Email can't be changed as it's tied to auth
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="role" className="text-sm font-medium">
            Role
          </label>
          <input
            id="role"
            type="text"
            className="w-full h-10 px-3 rounded-md border border-input bg-background"
            value={formData.role}
            disabled={true} // Role can't be changed by users
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="department" className="text-sm font-medium">
            Department
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
            Phone
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
            Bio
          </label>
          <textarea
            id="bio"
            rows={4}
            className="w-full px-3 py-2 rounded-md border border-input bg-background"
            value={formData.bio}
            onChange={(e) => onInputChange('bio', e.target.value)}
          />
        </div>
        
        <div className="md:col-span-2">
          <button
            type="submit"
            className="h-10 bg-primary text-white rounded-md px-4 text-sm font-medium flex items-center gap-1 mt-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default ProfileForm;
