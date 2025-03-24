-- Create user roles (using an enum for type safety)
CREATE TYPE public.user_role AS ENUM (
    'doctor', 'physician', 'nurse', 'pharmacist', 'lab_technician',
    'radiologist', 'therapist', 'patient', 'receptionist',
    'medical_assistant', 'insurance_staff', 'researcher',
    'coordinator', 'student', 'guest', 'specialist',
    'administrative', 'caregiver', 'radiology_technician',
    'medical_staff', 'admin', 'system_administrator'
);