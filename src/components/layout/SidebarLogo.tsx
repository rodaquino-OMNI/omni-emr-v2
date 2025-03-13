
import React from 'react';
import { Link } from 'react-router-dom';

const SidebarLogo = () => {
  return (
    <div className="px-3 py-4">
      <Link to="/" className="flex items-center gap-2 px-3 py-2">
        <div className="bg-primary rounded-md w-8 h-8 flex items-center justify-center text-white font-bold">
          OC
        </div>
        <span className="text-xl font-semibold tracking-tight">OmniCare</span>
      </Link>
    </div>
  );
};

export default SidebarLogo;
