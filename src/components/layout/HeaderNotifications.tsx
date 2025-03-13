
import React from "react";
import { Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { mockNotifications } from "../notifications/mockNotifications";

const HeaderNotifications = () => {
  // Count unread notifications
  const unreadCount = mockNotifications.filter(notification => !notification.read).length;
  
  return (
    <Link to="/notifications" className="p-2 rounded-full hover:bg-secondary transition-colors relative">
      <Bell className="h-5 w-5 text-muted-foreground" />
      {unreadCount > 0 && (
        <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 flex items-center justify-center text-[10px] text-white font-medium">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </Link>
  );
};

export default HeaderNotifications;
