
import React, { useState } from 'react';
import { Save } from 'lucide-react';

const NotificationSettings = () => {
  const [emailNotifications, setEmailNotifications] = useState({
    appointments: true,
    records: true,
    medications: true,
    system: false
  });
  
  const [pushNotifications, setPushNotifications] = useState({
    appointments: true,
    records: false,
    medications: true,
    system: true
  });
  
  const [smsNotifications, setSmsNotifications] = useState({
    appointments: true,
    records: false,
    medications: false,
    system: false
  });
  
  const handleEmailChange = (key: keyof typeof emailNotifications) => {
    setEmailNotifications({
      ...emailNotifications,
      [key]: !emailNotifications[key]
    });
  };
  
  const handlePushChange = (key: keyof typeof pushNotifications) => {
    setPushNotifications({
      ...pushNotifications,
      [key]: !pushNotifications[key]
    });
  };
  
  const handleSmsChange = (key: keyof typeof smsNotifications) => {
    setSmsNotifications({
      ...smsNotifications,
      [key]: !smsNotifications[key]
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle notification settings update logic
    console.log('Notification settings updated');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium mb-4">Notification Preferences</h2>
        <p className="text-muted-foreground mb-6">
          Customize how you receive notifications and updates.
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <h3 className="text-md font-medium mb-3">Email Notifications</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <div>
                    <h4 className="font-medium">Appointment Reminders</h4>
                    <p className="text-sm text-muted-foreground">Get notified about upcoming appointments.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={emailNotifications.appointments}
                      onChange={() => handleEmailChange('appointments')}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <div>
                    <h4 className="font-medium">Medical Records Updates</h4>
                    <p className="text-sm text-muted-foreground">Get notified when new records are added.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={emailNotifications.records}
                      onChange={() => handleEmailChange('records')}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <div>
                    <h4 className="font-medium">Medication Alerts</h4>
                    <p className="text-sm text-muted-foreground">Get notified about medication changes or refills.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={emailNotifications.medications}
                      onChange={() => handleEmailChange('medications')}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div>
                    <h4 className="font-medium">System Updates</h4>
                    <p className="text-sm text-muted-foreground">Get notified about system changes or maintenance.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={emailNotifications.system}
                      onChange={() => handleEmailChange('system')}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-md font-medium mb-3">Push Notifications</h3>
              <div className="space-y-2">
                {/* Similar structure as email notifications, for push notifications */}
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <div>
                    <h4 className="font-medium">Appointment Reminders</h4>
                    <p className="text-sm text-muted-foreground">Get push notifications about upcoming appointments.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={pushNotifications.appointments}
                      onChange={() => handlePushChange('appointments')}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                
                {/* Add more push notification options similar to above */}
              </div>
            </div>
            
            <div>
              <h3 className="text-md font-medium mb-3">SMS Notifications</h3>
              <div className="space-y-2">
                {/* Similar structure as email notifications, for SMS */}
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <div>
                    <h4 className="font-medium">Appointment Reminders</h4>
                    <p className="text-sm text-muted-foreground">Get SMS notifications about upcoming appointments.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={smsNotifications.appointments}
                      onChange={() => handleSmsChange('appointments')}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                
                {/* Add more SMS notification options similar to above */}
              </div>
            </div>
            
            <button
              type="submit"
              className="h-10 bg-primary text-white rounded-md px-4 text-sm font-medium flex items-center gap-1 mt-6"
            >
              <Save className="h-4 w-4" />
              Save Notification Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NotificationSettings;
