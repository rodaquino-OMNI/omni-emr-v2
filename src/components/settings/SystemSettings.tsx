
import React, { useState } from 'react';
import { Save } from 'lucide-react';

const SystemSettings = () => {
  const [language, setLanguage] = useState('english');
  const [timezone, setTimezone] = useState('America/New_York');
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');
  const [timeFormat, setTimeFormat] = useState('12hour');
  const [theme, setTheme] = useState('light');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle system settings update logic
    console.log('System settings updated');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium mb-4">System Preferences</h2>
        <p className="text-muted-foreground mb-6">
          Customize your system settings and preferences.
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="language" className="text-sm font-medium">
                Language
              </label>
              <select
                id="language"
                className="w-full h-10 px-3 rounded-md border border-border bg-background"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="english">English</option>
                <option value="spanish">Spanish</option>
                <option value="french">French</option>
                <option value="german">German</option>
                <option value="chinese">Chinese</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="timezone" className="text-sm font-medium">
                Timezone
              </label>
              <select
                id="timezone"
                className="w-full h-10 px-3 rounded-md border border-border bg-background"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
              >
                <option value="America/New_York">Eastern Time (ET)</option>
                <option value="America/Chicago">Central Time (CT)</option>
                <option value="America/Denver">Mountain Time (MT)</option>
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                <option value="Europe/London">Greenwich Mean Time (GMT)</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="dateFormat" className="text-sm font-medium">
                Date Format
              </label>
              <select
                id="dateFormat"
                className="w-full h-10 px-3 rounded-md border border-border bg-background"
                value={dateFormat}
                onChange={(e) => setDateFormat(e.target.value)}
              >
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="timeFormat" className="text-sm font-medium">
                Time Format
              </label>
              <select
                id="timeFormat"
                className="w-full h-10 px-3 rounded-md border border-border bg-background"
                value={timeFormat}
                onChange={(e) => setTimeFormat(e.target.value)}
              >
                <option value="12hour">12-hour (AM/PM)</option>
                <option value="24hour">24-hour</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="theme" className="text-sm font-medium">
                Theme
              </label>
              <select
                id="theme"
                className="w-full h-10 px-3 rounded-md border border-border bg-background"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System Default</option>
              </select>
            </div>
            
            <div className="md:col-span-2">
              <button
                type="submit"
                className="h-10 bg-primary text-white rounded-md px-4 text-sm font-medium flex items-center gap-1 mt-2"
              >
                <Save className="h-4 w-4" />
                Save Preferences
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SystemSettings;
