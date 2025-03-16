
import React from 'react';

interface HeaderTitleProps {
  title: string;
  subtitle: string;
}

const HeaderTitle: React.FC<HeaderTitleProps> = ({ title, subtitle }) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold">{title}</h2>
      <p className="text-muted-foreground mt-1">{subtitle}</p>
    </div>
  );
};

export default HeaderTitle;
