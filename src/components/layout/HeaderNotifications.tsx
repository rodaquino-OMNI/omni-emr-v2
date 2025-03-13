
import React from "react";
import { Bell } from "lucide-react";
import { Link } from "react-router-dom";

const HeaderNotifications = () => {
  return (
    <Link to="/messages" className="p-2 rounded-full hover:bg-secondary transition-colors relative">
      <Bell className="h-5 w-5 text-muted-foreground" />
      <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
    </Link>
  );
};

export default HeaderNotifications;
