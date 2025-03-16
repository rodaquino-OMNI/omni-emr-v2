
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CalendarIcon, Search, Download, Calendar, Filter } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';

const SecurityAuditLog = () => {
  const { language } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [activityFilter, setActivityFilter] = useState('all');
  const [dateRange, setDateRange] = useState<{ from: Date; to?: Date }>({
    from: new Date(new Date().setDate(new Date().getDate() - 7)),
    to: new Date(),
  });
  
  // Mock audit data
  const auditData = [
    {
      id: 1,
      action: 'login',
      user: 'dr.smith@example.com',
      ip: '192.168.1.1',
      timestamp: new Date(new Date().setHours(new Date().getHours() - 1)),
      details: 'Successful login'
    },
    {
      id: 2,
      action: 'data_access',
      user: 'dr.smith@example.com',
      ip: '192.168.1.1',
      timestamp: new Date(new Date().setHours(new Date().getHours() - 2)),
      details: 'Accessed patient record #12345'
    },
    {
      id: 3,
      action: 'failed_login',
      user: 'nurse.jones@example.com',
      ip: '192.168.1.2',
      timestamp: new Date(new Date().setHours(new Date().getHours() - 5)),
      details: 'Failed login attempt'
    },
    {
      id: 4,
      action: 'settings_change',
      user: 'admin@example.com',
      ip: '192.168.1.3',
      timestamp: new Date(new Date().setHours(new Date().getHours() - 24)),
      details: 'Updated security settings'
    },
    {
      id: 5,
      action: 'data_access',
      user: 'nurse.jones@example.com',
      ip: '192.168.1.2',
      timestamp: new Date(new Date().setDate(new Date().getDate() - 2)),
      details: 'Accessed patient record #67890'
    },
  ];
  
  const getActivityBadge = (action: string) => {
    switch (action) {
      case 'login':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Login</Badge>;
      case 'failed_login':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Failed Login</Badge>;
      case 'data_access':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Data Access</Badge>;
      case 'settings_change':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Settings Change</Badge>;
      default:
        return <Badge variant="outline">{action}</Badge>;
    }
  };
  
  // Filter audit data based on search, activity type, and date range
  const filteredData = auditData.filter(item => {
    const matchesSearch = 
      item.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.ip.includes(searchTerm);
    
    const matchesActivity = activityFilter === 'all' || item.action === activityFilter;
    
    const itemDate = new Date(item.timestamp);
    const matchesDateRange = 
      itemDate >= dateRange.from && 
      (!dateRange.to || itemDate <= dateRange.to);
    
    return matchesSearch && matchesActivity && matchesDateRange;
  });
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          {language === 'pt' ? 'Log de Auditoria de Segurança' : 'Security Audit Log'}
        </CardTitle>
        <CardDescription>
          {language === 'pt' 
            ? 'Acompanhe todas as ações de segurança e acessos no sistema' 
            : 'Track all security actions and system accesses'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={language === 'pt' ? 'Buscar por usuário ou detalhes...' : 'Search by user or details...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            
            <Select value={activityFilter} onValueChange={setActivityFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <div className="flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder={language === 'pt' ? 'Tipo de atividade' : 'Activity type'} />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{language === 'pt' ? 'Todas atividades' : 'All activities'}</SelectItem>
                <SelectItem value="login">{language === 'pt' ? 'Login' : 'Login'}</SelectItem>
                <SelectItem value="failed_login">{language === 'pt' ? 'Login falho' : 'Failed login'}</SelectItem>
                <SelectItem value="data_access">{language === 'pt' ? 'Acesso a dados' : 'Data access'}</SelectItem>
                <SelectItem value="settings_change">{language === 'pt' ? 'Mudança de configurações' : 'Settings change'}</SelectItem>
              </SelectContent>
            </Select>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto justify-start">
                  <Calendar className="mr-2 h-4 w-4" />
                  {dateRange.from && dateRange.to ? (
                    <span>
                      {format(dateRange.from, 'PP')} - {format(dateRange.to, 'PP')}
                    </span>
                  ) : (
                    <span>
                      {language === 'pt' ? 'Selecionar período' : 'Pick a date range'}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange.from}
                  selected={dateRange}
                  onSelect={(range) => {
                    if (range?.from) {
                      setDateRange(range);
                    }
                  }}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">{language === 'pt' ? 'Atividade' : 'Activity'}</TableHead>
                  <TableHead>{language === 'pt' ? 'Usuário' : 'User'}</TableHead>
                  <TableHead>{language === 'pt' ? 'Detalhes' : 'Details'}</TableHead>
                  <TableHead>{language === 'pt' ? 'Endereço IP' : 'IP Address'}</TableHead>
                  <TableHead className="text-right">{language === 'pt' ? 'Data/Hora' : 'Timestamp'}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length > 0 ? (
                  filteredData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{getActivityBadge(item.action)}</TableCell>
                      <TableCell>{item.user}</TableCell>
                      <TableCell>{item.details}</TableCell>
                      <TableCell>{item.ip}</TableCell>
                      <TableCell className="text-right">{format(item.timestamp, 'PPpp')}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      {language === 'pt' ? 'Nenhum registro encontrado' : 'No records found'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          <div className="flex justify-end">
            <Button variant="outline" size="sm" className="flex items-center">
              <Download className="mr-2 h-4 w-4" />
              {language === 'pt' ? 'Exportar Log' : 'Export Log'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecurityAuditLog;
