
import React from 'react';
import { Search } from 'lucide-react';
import { TableRow, TableCell } from '@/components/ui/table';

const EmptyLogsState: React.FC = () => {
  return (
    <TableRow>
      <TableCell colSpan={6} className="p-4 text-center text-muted-foreground">
        <div className="flex flex-col items-center justify-center py-6 space-y-2">
          <Search className="h-8 w-8 text-muted-foreground/60" />
          <p>No audit logs found.</p>
          <p className="text-sm text-muted-foreground/60">
            Try adjusting your filters or search parameters.
          </p>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default EmptyLogsState;
