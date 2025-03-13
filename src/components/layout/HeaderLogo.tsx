
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const HeaderLogo = () => {
  const { isAuthenticated } = useAuth();
  const homePath = isAuthenticated ? "/dashboard" : "/";
  
  return (
    <div className="flex items-center gap-2">
      <Link to={homePath} className="text-xl font-semibold tracking-tight text-primary hover:opacity-90 transition-opacity">
        OmniCare
      </Link>
    </div>
  );
};

export default HeaderLogo;
