
import React from 'react';
import { RefreshCw, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderActionsProps {
  onRefresh: () => void;
  onExport: () => void;
}

const HeaderActions: React.FC<HeaderActionsProps> = ({ onRefresh, onExport }) => {
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={onRefresh}>
        <RefreshCw className="h-4 w-4 mr-1" />
        Refresh
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onExport}>
            Export as CSV
          </DropdownMenuItem>
          <DropdownMenuItem>
            Export as JSON
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            Schedule regular export
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default HeaderActions;
