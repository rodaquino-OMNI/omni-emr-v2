
import React, { useState } from 'react';
import { Save } from 'lucide-react';

const ProfileSettings = () => {
  const [name, setName] = useState('Dr. Alex Johnson');
  const [email, setEmail] = useState('alex.johnson@medcare.com');
  const [role, setRole] = useState('Physician');
  const [department, setDepartment] = useState('Cardiology');
  const [phone, setPhone] = useState('(555) 123-4567');
  const [bio, setBio] = useState('Board certified cardiologist with 10 years of experience in treating complex heart conditions.');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle profile update logic
    console.log('Profile updated');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium mb-4">Profile Information</h2>
        <p className="text-muted-foreground mb-6">
          Update your account's profile information and settings.
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <input
                id="name"
                type="text"
                className="w-full h-10 px-3 rounded-md border border-border bg-background"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="w-full h-10 px-3 rounded-md border border-border bg-background"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="role" className="text-sm font-medium">
                Role
              </label>
              <input
                id="role"
                type="text"
                className="w-full h-10 px-3 rounded-md border border-border bg-background"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="department" className="text-sm font-medium">
                Department
              </label>
              <input
                id="department"
                type="text"
                className="w-full h-10 px-3 rounded-md border border-border bg-background"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">
                Phone
              </label>
              <input
                id="phone"
                type="text"
                className="w-full h-10 px-3 rounded-md border border-border bg-background"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="bio" className="text-sm font-medium">
                Bio
              </label>
              <textarea
                id="bio"
                rows={4}
                className="w-full px-3 py-2 rounded-md border border-border bg-background"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>
            
            <div className="md:col-span-2">
              <button
                type="submit"
                className="h-10 bg-primary text-white rounded-md px-4 text-sm font-medium flex items-center gap-1 mt-2"
              >
                <Save className="h-4 w-4" />
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileSettings;
