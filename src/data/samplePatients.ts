
import { Patient } from '../components/patients/PatientCard';

// Sample patient data
export const samplePatients: Patient[] = [
  {
    id: "1",
    name: "John Doe",
    age: 65,
    gender: "Male",
    roomNumber: "203",
    status: "hospital",
    diagnosis: "Post-op recovery",
    isAssigned: false,
    mrn: "MRN-001"
  },
  {
    id: "2",
    name: "Emma Thompson",
    age: 72,
    gender: "Female",
    status: "critical",
    roomNumber: "ICU-5",
    diagnosis: "Pneumonia",
    isAssigned: true,
    mrn: "MRN-002",
    isCritical: true
  },
  {
    id: "3",
    name: "Michael Johnson",
    age: 58,
    gender: "Male",
    status: "home",
    diagnosis: "Chronic heart failure",
    isAssigned: false,
    mrn: "MRN-003"
  },
  {
    id: "4",
    name: "Sophia Martinez",
    age: 45,
    gender: "Female",
    roomNumber: "105",
    status: "improving",
    diagnosis: "Diabetes management",
    isAssigned: false,
    mrn: "MRN-004"
  },
  {
    id: "5",
    name: "Robert Chen",
    age: 68,
    gender: "Male",
    status: "stable",
    roomNumber: "218",
    diagnosis: "Hip replacement",
    isAssigned: false,
    mrn: "MRN-005"
  },
  {
    id: "6",
    name: "Olivia Wilson",
    age: 83,
    gender: "Female",
    status: "home",
    diagnosis: "Rehabilitation",
    isAssigned: false,
    mrn: "MRN-006"
  },
  {
    id: "7",
    name: "William Davis",
    age: 71,
    gender: "Male",
    status: "discharged",
    diagnosis: "Recovered",
    isAssigned: false,
    mrn: "MRN-007"
  }
];
