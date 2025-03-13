
import React from 'react';

interface SessionTimeoutControlProps {
  sessionTimeout: string;
  setSessionTimeout: (value: string) => void;
}

const SessionTimeoutControl = ({ sessionTimeout, setSessionTimeout }: SessionTimeoutControlProps) => {
  return (
    <div className="space-y-2">
      <label htmlFor="sessionTimeout" className="text-sm font-medium">
        Session Timeout (minutes)
      </label>
      <select
        id="sessionTimeout"
        className="w-full md:w-64 h-10 px-3 rounded-md border border-border bg-background"
        value={sessionTimeout}
        onChange={(e) => setSessionTimeout(e.target.value)}
      >
        <option value="15">15 minutes</option>
        <option value="30">30 minutes</option>
        <option value="60">1 hour</option>
        <option value="120">2 hours</option>
        <option value="240">4 hours</option>
      </select>
      <p className="text-xs text-muted-foreground">
        Automatically log out after a period of inactivity for HIPAA compliance.
      </p>
    </div>
  );
};

export default SessionTimeoutControl;
