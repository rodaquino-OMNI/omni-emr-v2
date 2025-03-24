import { User } from '../types/auth';

// Mock user data
const mockUsers = [
  {
    id: '1',
    email: 'admin@omnicare.com',
    name: 'Dr. John Smith',
    role: 'doctor',
    permissions: ['all'],
    avatar_url: null,
    app_metadata: {},
    user_metadata: {
      name: 'Dr. John Smith',
      organization: 'OmniCare Hospital',
      approvalStatus: 'approved',
      status: 'active',
    },
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
    last_sign_in_at: '2025-03-21T00:00:00.000Z',
    aud: 'authenticated',
    confirmed_at: '2023-01-01T00:00:00.000Z',
    recovery_sent_at: null,
    confirmation_sent_at: null,
    organization: 'OmniCare Hospital',
    approvalStatus: 'approved',
    status: 'active',
    phoneNumber: null,
    mfaEnabled: false,
    createdAt: new Date('2023-01-01T00:00:00.000Z'),
    lastLogin: new Date('2025-03-21T00:00:00.000Z'),
    profileImageUrl: null,
    country: 'Brazil',
    insurance: null,
  },
  {
    id: '2',
    email: 'nurse@omnicare.com',
    name: 'Emily Johnson',
    role: 'nurse',
    permissions: ['dashboard:view', 'patients:view', 'patients:edit'],
    avatar_url: null,
    app_metadata: {},
    user_metadata: {
      name: 'Emily Johnson',
      organization: 'OmniCare Hospital',
      approvalStatus: 'approved',
      status: 'active',
    },
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
    last_sign_in_at: '2025-03-21T00:00:00.000Z',
    aud: 'authenticated',
    confirmed_at: '2023-01-01T00:00:00.000Z',
    recovery_sent_at: null,
    confirmation_sent_at: null,
    organization: 'OmniCare Hospital',
    approvalStatus: 'approved',
    status: 'active',
    phoneNumber: null,
    mfaEnabled: false,
    createdAt: new Date('2023-01-01T00:00:00.000Z'),
    lastLogin: new Date('2025-03-21T00:00:00.000Z'),
    profileImageUrl: null,
    country: 'Brazil',
    insurance: null,
  }
];

// Mock patients data
export const mockPatients = [
  {
    id: '1',
    name: 'John Smith',
    age: 62,
    gender: 'Masculino',
    room: 'Quarto 402',
    status: 'Hospital',
    condition: 'Critical',
  },
  {
    id: '2',
    name: 'Emily Johnson',
    age: 34,
    gender: 'Feminino',
    room: '',
    status: 'Home',
    condition: 'Stable',
  },
  {
    id: '3',
    name: 'Michael Davis',
    age: 78,
    gender: 'Masculino',
    room: 'Quarto ICU, UTI',
    status: 'Hospital',
    condition: 'Critical',
  },
  {
    id: '4',
    name: 'Jessica Wilson',
    age: 29,
    gender: 'Feminino',
    room: '',
    status: 'Home',
    condition: 'Stable',
  },
  {
    id: '5',
    name: 'David Garcia',
    age: 45,
    gender: 'Masculino',
    room: '',
    status: 'Home',
    condition: 'Improving',
  },
  {
    id: '6',
    name: 'Linda Rodriguez',
    age: 51,
    gender: 'Feminino',
    room: '',
    status: 'Home',
    condition: 'Discharged',
  },
];

// Mock authentication service
export const mockAuth = {
  login: async (email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> => {
    // Simple validation
    if (!email || !password) {
      return { success: false, error: 'Email and password are required' };
    }

    // Find user by email
    const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    // Check if user exists
    if (!user) {
      return { success: false, error: 'Invalid email or password' };
    }
    
    // In a real app, we would check the password hash
    // For mock purposes, any password works
    return { success: true, user: user as User };
  },
  
  logout: async (): Promise<void> => {
    // Nothing to do in mock mode
    console.log('Mock logout successful');
    return;
  },
  
  getSession: async (): Promise<{ user: User | null }> => {
    // For mock purposes, always return the admin user
    return { user: mockUsers[0] as User };
  },
  
  resetPassword: async (email: string): Promise<{ success: boolean; error?: string }> => {
    if (!email) {
      return { success: false, error: 'Email is required' };
    }
    
    const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      return { success: false, error: 'User not found' };
    }
    
    return { success: true };
  },
  
  signUp: async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    if (!email || !password || !name) {
      return { success: false, error: 'All fields are required' };
    }
    
    const existingUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (existingUser) {
      return { success: false, error: 'Email already in use' };
    }
    
    // In a real app, we would create a new user
    // For mock purposes, just return success
    return { success: true };
  }
};

// Mock lab results data
export const mockLabResults = [
  {
    id: '1',
    patient_id: '1',
    test_name: 'Blood Glucose',
    result: '180 mg/dL',
    result_date: '2025-03-15T10:30:00.000Z',
    critical: true,
    abnormal: true,
    notes: 'Patient fasting glucose levels are elevated'
  },
  {
    id: '2',
    patient_id: '1',
    test_name: 'Hemoglobin A1C',
    result: '7.8%',
    result_date: '2025-03-10T14:20:00.000Z',
    critical: false,
    abnormal: true,
    notes: 'Indicates poor glucose control over past 3 months'
  },
  {
    id: '3',
    patient_id: '2',
    test_name: 'Complete Blood Count',
    result: 'Normal',
    result_date: '2025-03-12T09:15:00.000Z',
    critical: false,
    abnormal: false,
    notes: 'All values within normal range'
  }
];

// Mock diagnoses data
export const mockDiagnoses = [
  {
    id: '1',
    patient_id: '1',
    diagnosis: 'Type 2 Diabetes',
    diagnosed_date: '2024-11-15T00:00:00.000Z',
    status: 'active',
    notes: 'Patient requires regular monitoring of blood glucose'
  },
  {
    id: '2',
    patient_id: '1',
    diagnosis: 'Hypertension',
    diagnosed_date: '2024-10-20T00:00:00.000Z',
    status: 'active',
    notes: 'Blood pressure consistently elevated'
  }
];

// Mock prescriptions data
export const mockPrescriptions = [
  {
    id: '1',
    patient_id: '1',
    prescriber_id: '1',
    date_prescribed: '2025-02-15T00:00:00.000Z',
    status: 'active'
  },
  {
    id: '2',
    patient_id: '2',
    prescriber_id: '1',
    date_prescribed: '2025-02-20T00:00:00.000Z',
    status: 'active'
  }
];

// Mock prescription items data
export const mockPrescriptionItems = [
  {
    id: '1',
    prescription_id: '1',
    name: 'Metformin',
    dosage: '500mg',
    frequency: 'Twice daily',
    status: 'active'
  },
  {
    id: '2',
    prescription_id: '1',
    name: 'Lisinopril',
    dosage: '10mg',
    frequency: 'Once daily',
    status: 'active'
  }
];

// Mock data service
export const mockDataService = {
  getPatients: async () => {
    return mockPatients;
  },
  
  getPatientById: async (id: string) => {
    return mockPatients.find(p => p.id === id);
  },
  
  getLabResults: async (patientId: string) => {
    return mockLabResults.filter(lab => lab.patient_id === patientId);
  },
  
  getDiagnoses: async (patientId: string) => {
    return mockDiagnoses.filter(diag => diag.patient_id === patientId);
  },
  
  getPrescriptions: async (patientId: string) => {
    return mockPrescriptions.filter(rx => rx.patient_id === patientId);
  },
  
  getPrescriptionItems: async (prescriptionId: string) => {
    return mockPrescriptionItems.filter(item => item.prescription_id === prescriptionId);
  }
};

// Flag to determine if we're in mock mode
export const isMockMode = true;

// Mock Supabase client
export const mockSupabase = {
  auth: {
    getSession: async () => {
      console.log('Mock: Getting session');
      return { data: { session: { user: mockUsers[0] } }, error: null };
    },
    signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
      console.log('Mock: Signing in with password', { email });
      const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        return { data: { user: null, session: null }, error: { message: 'Invalid email or password' } };
      }
      return { data: { user, session: { user } }, error: null };
    },
    signOut: async () => {
      console.log('Mock: Signing out');
      return { error: null };
    },
    resetPasswordForEmail: async (email: string) => {
      console.log('Mock: Resetting password for', email);
      return { error: null };
    },
    updateUser: async (updates: any) => {
      console.log('Mock: Updating user', updates);
      return { data: { user: { ...mockUsers[0], ...updates } }, error: null };
    }
  },
  from: (table: string) => {
    console.log('Mock: Accessing table', table);
    return {
      select: (columns?: string) => {
        console.log('Mock: Selecting columns', columns);
        return {
          in: (column: string, values: any[]) => {
            console.log('Mock: Filtering by', column, 'in', values);
            
            // Handle different tables
            if (table === 'vital_signs') {
              // Mock vital signs data
              const mockVitalSigns = [
                {
                  id: '1',
                  patient_id: '1',
                  timestamp: '2025-03-20T10:00:00.000Z',
                  blood_pressure_systolic: 120,
                  blood_pressure_diastolic: 80,
                  heart_rate: 72,
                  temperature: 36.8,
                  oxygen_saturation: 98,
                  respiratory_rate: 16
                },
                {
                  id: '2',
                  patient_id: '2',
                  timestamp: '2025-03-19T14:30:00.000Z',
                  blood_pressure_systolic: 118,
                  blood_pressure_diastolic: 75,
                  heart_rate: 68,
                  temperature: 36.6,
                  oxygen_saturation: 99,
                  respiratory_rate: 14
                }
              ];
              
              const filteredVitalSigns = mockVitalSigns.filter(vs =>
                values.includes(vs.patient_id)
              );
              
              return {
                order: (orderColumn: string, options: { ascending: boolean }) => {
                  console.log('Mock: Ordering vital signs by', orderColumn);
                  return {
                    limit: (limit: number) => {
                      console.log('Mock: Limiting vital signs to', limit);
                      return { data: filteredVitalSigns.slice(0, limit), error: null };
                    }
                  };
                }
              };
            }
            
            // Default fallback
            return {
              order: (orderColumn: string, options: { ascending: boolean }) => {
                return {
                  limit: (limit: number) => {
                    return { data: [], error: null };
                  }
                };
              }
            };
          },
          
          eq: (column: string, value: any) => {
            console.log('Mock: Filtering by', column, '=', value);
            
            // Return appropriate mock data based on table and filter
            if (table === 'patients' && column === 'id') {
              const patient = mockPatients.find(p => p.id === value);
              return {
                single: () => {
                  console.log('Mock: Getting single patient record');
                  return { data: patient || null, error: null };
                },
                maybeSingle: () => {
                  console.log('Mock: Getting maybe single patient record');
                  return { data: patient || null, error: null };
                },
                limit: (limit: number) => {
                  console.log('Mock: Limiting to', limit);
                  return { data: patient ? [patient] : [], error: null };
                }
              };
            }
            
            if (table === 'patients' && column === 'sector_id') {
              // Mock patients for a sector
              const sectorPatients = mockPatients.slice(0, 3).map(p => ({ id: p.id })); // Just return first 3 patients with only id
              return {
                data: sectorPatients,
                error: null
              };
            }
            
            if (table === 'lab_results' && column === 'patient_id') {
              const labResults = mockLabResults.filter(lab => lab.patient_id === value);
              return {
                single: () => {
                  console.log('Mock: Getting single lab result');
                  return { data: labResults.length > 0 ? labResults[0] : null, error: null };
                },
                limit: (limit: number) => {
                  console.log('Mock: Limiting lab results to', limit);
                  return { data: labResults.slice(0, limit), error: null };
                },
                order: (column: string, options: { ascending: boolean }) => {
                  console.log('Mock: Ordering lab results by', column);
                  // Simple sorting logic
                  const sorted = [...labResults].sort((a: any, b: any) => {
                    return options.ascending ?
                      a[column] > b[column] ? 1 : -1 :
                      a[column] < b[column] ? 1 : -1;
                  });
                  return {
                    limit: (limit: number) => {
                      return { data: sorted.slice(0, limit), error: null };
                    }
                  };
                }
              };
            }
            
            if (table === 'diagnoses' && column === 'patient_id') {
              const diagnoses = mockDiagnoses.filter(d => d.patient_id === value);
              return {
                limit: (limit: number) => {
                  console.log('Mock: Limiting diagnoses to', limit);
                  return { data: diagnoses.slice(0, limit), error: null };
                },
                order: (column: string, options: { ascending: boolean }) => {
                  console.log('Mock: Ordering diagnoses by', column);
                  return {
                    limit: (limit: number) => {
                      return { data: diagnoses.slice(0, limit), error: null };
                    }
                  };
                }
              };
            }
            
            if (table === 'prescription_items') {
              if (column === 'prescription_id') {
                const items = mockPrescriptionItems.filter(item => item.prescription_id === value);
                return {
                  limit: (limit: number) => {
                    return { data: items.slice(0, limit), error: null };
                  }
                };
              }
            }
            
            // Default fallback
            return {
              single: () => {
                console.log('Mock: Getting single record (default)');
                return { data: null, error: null };
              },
              maybeSingle: () => {
                console.log('Mock: Getting maybe single record (default)');
                return { data: null, error: null };
              },
              limit: (limit: number) => {
                console.log('Mock: Limiting to', limit, '(default)');
                return { data: [], error: null };
              }
            };
          },
          limit: (limit: number) => {
            console.log('Mock: Limiting to', limit);
            
            // Return appropriate mock data based on table
            if (table === 'profiles') {
              return { data: [{ id: mockUsers[0].id }], error: null };
            }
            
            if (table === 'patients') {
              return { data: mockPatients.slice(0, limit), error: null };
            }
            
            if (table === 'lab_results') {
              return { data: mockLabResults.slice(0, limit), error: null };
            }
            
            if (table === 'diagnoses') {
              return { data: mockDiagnoses.slice(0, limit), error: null };
            }
            
            if (table === 'prescriptions') {
              return { data: mockPrescriptions.slice(0, limit), error: null };
            }
            
            // Default fallback
            return { data: [], error: null };
          }
        };
      },
      insert: (data: any) => {
        console.log('Mock: Inserting data', data);
        return { data, error: null };
      },
      update: (data: any) => {
        console.log('Mock: Updating data', data);
        return { data, error: null };
      },
      delete: () => {
        console.log('Mock: Deleting data');
        return { data: null, error: null };
      }
    };
  },
  rpc: (functionName: string, params?: any) => {
    console.log('Mock: Calling RPC function', functionName, params);
    if (functionName === 'check_connection') {
      return { data: true, error: null };
    }
    if (functionName === 'check_table_exists') {
      return { data: true, error: null };
    }
    return { data: null, error: null };
  }
};