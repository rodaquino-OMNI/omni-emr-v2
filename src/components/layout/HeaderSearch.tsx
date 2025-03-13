
import React from "react";
import { Search } from "lucide-react";
import { useTranslation } from "../../hooks/useTranslation";

const HeaderSearch = () => {
  const { t } = useTranslation();
  
  return (
    <div className="flex-1 max-w-md mx-4 lg:mx-8">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <input
          type="text"
          placeholder={`${t('search')} ${t('patients').toLowerCase()}, ${t('records').toLowerCase()}...`}
          className="w-full h-9 pl-10 pr-4 rounded-full bg-secondary border-none focus:ring-1 focus:ring-primary outline-none text-sm"
        />
      </div>
    </div>
  );
};

export default HeaderSearch;
