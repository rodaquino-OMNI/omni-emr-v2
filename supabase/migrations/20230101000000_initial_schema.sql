-- Create user roles (using an enum for type safety)
CREATE TYPE user_role AS ENUM (
    'doctor', 'physician', 'nurse', 'pharmacist', 'lab_technician',
    'radiologist', 'therapist', 'patient', 'receptionist',
    'medical_assistant', 'insurance_staff', 'researcher',
    'coordinator', 'student', 'guest', 'specialist',
    'administrative', 'caregiver', 'radiology_technician',
    'medical_staff', 'admin', 'system_administrator'
);

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL, -- Store hashed passwords!
    name TEXT,
    role user_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create patients table
CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) UNIQUE, -- One-to-one relationship with users table if patient is also a user
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    gender TEXT,
    address TEXT,
    phone_number TEXT,
    insurance_details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create appointments table
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) NOT NULL,
    doctor_id UUID REFERENCES users(id) NOT NULL, -- Assuming doctors are users
    appointment_time TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT DEFAULT 'scheduled', -- e.g., scheduled, completed, cancelled
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create visits table
CREATE TABLE visits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) NOT NULL,
    doctor_id UUID REFERENCES users(id) NOT NULL,
    visit_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create clinical_notes table
CREATE TABLE clinical_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    visit_id UUID REFERENCES visits(id) NOT NULL,
    note TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create medications table
CREATE TABLE medications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE, -- Medication name should be unique
    description TEXT,
    dosage TEXT,
    manufacturer TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create prescriptions table
CREATE TABLE prescriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) NOT NULL,
    doctor_id UUID REFERENCES users(id) NOT NULL,
    medication_id UUID REFERENCES medications(id) NOT NULL,
    dosage TEXT NOT NULL,
    quantity INTEGER,
    refills_remaining INTEGER,
    prescription_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expiry_date TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    visit_id UUID REFERENCES visits(id), -- Optional link to a specific visit
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create allergies table
CREATE TABLE allergies (
   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
   patient_id UUID REFERENCES patients(id) NOT NULL,
   allergen TEXT NOT NULL,
   reaction TEXT,
   severity TEXT, -- e.g., mild, moderate, severe
   notes TEXT,
   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create vital_signs table
CREATE TABLE vital_signs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    visit_id UUID REFERENCES visits(id) NOT NULL,
    patient_id UUID REFERENCES patients(id) NOT NULL,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    temperature DECIMAL, -- Assuming temperature in Celsius
    heart_rate INTEGER, -- BPM
    blood_pressure_systolic INTEGER,
    blood_pressure_diastolic INTEGER,
    respiratory_rate INTEGER,
    oxygen_saturation DECIMAL, -- Percentage
    height DECIMAL, -- Assuming height in meters
    weight DECIMAL,  -- Assuming weight in kilograms
    notes TEXT
);

-- Create audit_logs table (basic example)
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id UUID,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- New Tables

-- Create tasks table
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) NOT NULL,
    assigned_to UUID REFERENCES users(id) NOT NULL, -- Nurse or technician
    prescription_id UUID REFERENCES prescriptions(id), -- Optional link to prescription
    description TEXT NOT NULL,
    status TEXT DEFAULT 'pending', -- e.g., pending, in progress, completed, cancelled
    due_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create fluid_balance table
CREATE TABLE fluid_balance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    intake DECIMAL,
    output DECIMAL,
    type TEXT, -- e.g., oral, IV, urine, drainage
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create messages table
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID REFERENCES users(id) NOT NULL,
    recipient_id UUID REFERENCES users(id) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    content TEXT NOT NULL,
    read_status BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create alerts table
CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) NOT NULL,
    patient_id UUID REFERENCES patients(id), -- Optional link to patient
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    message TEXT NOT NULL,
    type TEXT, -- e.g., critical, warning, info
    read_status BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Permissions (example structure - adjust based on Supabase's permission system)
CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL, -- e.g., 'patient_data:view', 'medications:prescribe'
    description TEXT
);

CREATE TABLE user_permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) NOT NULL,
    permission_id UUID REFERENCES permissions(id) NOT NULL,
    UNIQUE (user_id, permission_id) -- Prevent duplicate permissions
);

-- Sectors
CREATE TABLE sectors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT
);

-- User Sector Access
CREATE TABLE user_sector_access (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) NOT NULL,
    sector_id UUID REFERENCES sectors(id) NOT NULL,
    UNIQUE (user_id, sector_id)
);

-- Indexes (Crucial for Performance)

-- Indexes on foreign keys
CREATE INDEX idx_patients_user_id ON patients(user_id);
CREATE INDEX idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX idx_appointments_doctor_id ON appointments(doctor_id);
CREATE INDEX idx_visits_patient_id ON visits(patient_id);
CREATE INDEX idx_visits_doctor_id ON visits(doctor_id);
CREATE INDEX idx_clinical_notes_visit_id ON clinical_notes(visit_id);
CREATE INDEX idx_prescriptions_patient_id ON prescriptions(patient_id);
CREATE INDEX idx_prescriptions_doctor_id ON prescriptions(doctor_id);
CREATE INDEX idx_prescriptions_medication_id ON prescriptions(medication_id);
CREATE INDEX idx_allergies_patient_id ON allergies(patient_id);
CREATE INDEX idx_vital_signs_visit_id ON vital_signs(visit_id);
CREATE INDEX idx_vital_signs_patient_id ON vital_signs(patient_id);
CREATE INDEX idx_tasks_patient_id ON tasks(patient_id);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_prescription_id ON tasks(prescription_id);
CREATE INDEX idx_fluid_balance_patient_id ON fluid_balance(patient_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_recipient_id ON messages(recipient_id);
CREATE INDEX idx_alerts_user_id ON alerts(user_id);
CREATE INDEX idx_alerts_patient_id ON alerts(patient_id);
CREATE INDEX idx_user_permissions_user_id ON user_permissions(user_id);
CREATE INDEX idx_user_permissions_permission_id ON user_permissions(permission_id);
CREATE INDEX idx_user_sector_access_user_id ON user_sector_access(user_id);
CREATE INDEX idx_user_sector_access_sector_id ON user_sector_access(sector_id);

-- Indexes on frequently queried columns
CREATE INDEX idx_appointments_appointment_time ON appointments(appointment_time);
CREATE INDEX idx_visits_visit_time ON visits(visit_time);
CREATE INDEX idx_prescriptions_prescription_date ON prescriptions(prescription_date);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_fluid_balance_timestamp ON fluid_balance(timestamp);
CREATE INDEX idx_messages_timestamp ON messages(timestamp);
CREATE INDEX idx_alerts_timestamp ON alerts(timestamp);
CREATE INDEX idx_users_email ON users(email); -- Already unique, but good for lookups
CREATE INDEX idx_medications_name ON medications(name); -- Already unique
