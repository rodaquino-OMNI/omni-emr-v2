
import React from "react";
import { Link } from "react-router-dom";

const HeaderLogo = () => {
  return (
    <div className="flex items-center gap-2">
      <Link to="/" className="text-xl font-semibold tracking-tight text-primary hover:opacity-90 transition-opacity">
        OmniCare
      </Link>
    </div>
  );
};

export default HeaderLogo;
