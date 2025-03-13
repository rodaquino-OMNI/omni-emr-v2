
import React from "react";
import { Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HeaderSettingsButton = () => {
  const navigate = useNavigate();
  
  return (
    <button 
      className="p-2 rounded-full hover:bg-secondary transition-colors"
      onClick={() => navigate('/settings')}
    >
      <Settings className="h-5 w-5 text-muted-foreground" />
    </button>
  );
};

export default HeaderSettingsButton;
