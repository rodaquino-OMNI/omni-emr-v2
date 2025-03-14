
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const RoleDashboardKPIs = () => {
  const { user } = useAuth();
  const { language } = useTranslation();

  // Function to get role-specific KPI content
  const getRoleKPIContent = () => {
    if (!user) return null;

    switch (user.role) {
      case 'doctor':
        return <DoctorKPIs />;
      case 'nurse':
        return <NurseKPIs />;
      case 'admin':
        return <AdminKPIs />;
      default:
        return null;
    }
  };

  const content = getRoleKPIContent();
  if (!content) return null;

  return (
    <div className="glass-card p-6">
      <h2 className="text-lg font-semibold mb-4">
        {language === 'pt' ? 'Métricas de Desempenho' : 'Performance Metrics'}
      </h2>
      {content}
    </div>
  );
};

// Doctor specific KPIs
const DoctorKPIs = () => {
  const { language } = useTranslation();
  
  // Sample data for doctor KPIs
  const patientLoadData = [
    { name: language === 'pt' ? 'Seg' : 'Mon', value: 12 },
    { name: language === 'pt' ? 'Ter' : 'Tue', value: 15 },
    { name: language === 'pt' ? 'Qua' : 'Wed', value: 18 },
    { name: language === 'pt' ? 'Qui' : 'Thu', value: 14 },
    { name: language === 'pt' ? 'Sex' : 'Fri', value: 10 },
    { name: language === 'pt' ? 'Sáb' : 'Sat', value: 6 },
    { name: language === 'pt' ? 'Dom' : 'Sun', value: 4 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-md font-medium mb-2">
          {language === 'pt' ? 'Carga de Pacientes - Última Semana' : 'Patient Load - Last Week'}
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={patientLoadData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// Nurse specific KPIs
const NurseKPIs = () => {
  const { language } = useTranslation();
  
  // Sample data for nurse KPIs
  const medicationDueData = [
    { name: '08:00', value: 7 },
    { name: '12:00', value: 5 },
    { name: '16:00', value: 3 },
    { name: '20:00', value: 6 },
    { name: '00:00', value: 2 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-md font-medium mb-2">
          {language === 'pt' ? 'Medicações por Horário - Hoje' : 'Medications by Time - Today'}
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={medicationDueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// Admin specific KPIs
const AdminKPIs = () => {
  const { language } = useTranslation();
  
  // Sample data for admin KPIs
  const bedOccupancyData = [
    { name: language === 'pt' ? 'Ocupados' : 'Occupied', value: 78 },
    { name: language === 'pt' ? 'Disponíveis' : 'Available', value: 22 },
  ];

  const COLORS = ['#0088FE', '#FFBB28'];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-md font-medium mb-2">
          {language === 'pt' ? 'Ocupação de Leitos' : 'Bed Occupancy'}
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={bedOccupancyData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {bedOccupancyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default RoleDashboardKPIs;
