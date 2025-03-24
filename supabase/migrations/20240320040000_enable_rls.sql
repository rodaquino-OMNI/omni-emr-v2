-- Enable Row Level Security (RLS) on all tables in the public schema
-- This addresses the 'rls_disabled_in_public' warnings

-- Enable RLS on users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Enable RLS on patients table
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;

-- Enable RLS on appointments table
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Enable RLS on visits table
ALTER TABLE public.visits ENABLE ROW LEVEL SECURITY;

-- Enable RLS on clinical_notes table
ALTER TABLE public.clinical_notes ENABLE ROW LEVEL SECURITY;

-- Enable RLS on prescriptions table
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;

-- Enable RLS on medications table
ALTER TABLE public.medications ENABLE ROW LEVEL SECURITY;

-- Enable RLS on allergies table
ALTER TABLE public.allergies ENABLE ROW LEVEL SECURITY;

-- Enable RLS on vital_signs table
ALTER TABLE public.vital_signs ENABLE ROW LEVEL SECURITY;

-- Enable RLS on audit_logs table
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Enable RLS on tasks table
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Enable RLS on fluid_balance table
ALTER TABLE public.fluid_balance ENABLE ROW LEVEL SECURITY;

-- Enable RLS on messages table
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Enable RLS on alerts table
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;

-- Enable RLS on user_permissions table
ALTER TABLE public.user_permissions ENABLE ROW LEVEL SECURITY;

-- Enable RLS on permissions table
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;

-- Enable RLS on user_sector_access table
ALTER TABLE public.user_sector_access ENABLE ROW LEVEL SECURITY;

-- Enable RLS on sectors table
ALTER TABLE public.sectors ENABLE ROW LEVEL SECURITY;

-- Enable RLS on rxnorm_ndc_cache table
ALTER TABLE public.rxnorm_ndc_cache ENABLE ROW LEVEL SECURITY;

-- Enable RLS on rxnorm_displayterms_cache table
ALTER TABLE public.rxnorm_displayterms_cache ENABLE ROW LEVEL SECURITY;

-- Enable RLS on rxnorm_interactions_cache table
ALTER TABLE public.rxnorm_interactions_cache ENABLE ROW LEVEL SECURITY;

-- Create default policies for each table
-- These are basic policies that can be refined based on specific requirements

-- Default policy for users: authenticated users can read all users
CREATE POLICY "Users are viewable by authenticated users" ON public.users
    FOR SELECT USING (auth.role() = 'authenticated');

-- Default policy for patients: authenticated users can read all patients
CREATE POLICY "Patients are viewable by authenticated users" ON public.patients
    FOR SELECT USING (auth.role() = 'authenticated');

-- Default policy for appointments: authenticated users can read all appointments
CREATE POLICY "Appointments are viewable by authenticated users" ON public.appointments
    FOR SELECT USING (auth.role() = 'authenticated');

-- Default policy for visits: authenticated users can read all visits
CREATE POLICY "Visits are viewable by authenticated users" ON public.visits
    FOR SELECT USING (auth.role() = 'authenticated');

-- Default policy for clinical_notes: authenticated users can read all clinical_notes
CREATE POLICY "Clinical notes are viewable by authenticated users" ON public.clinical_notes
    FOR SELECT USING (auth.role() = 'authenticated');

-- Default policy for prescriptions: authenticated users can read all prescriptions
CREATE POLICY "Prescriptions are viewable by authenticated users" ON public.prescriptions
    FOR SELECT USING (auth.role() = 'authenticated');

-- Default policy for medications: authenticated users can read all medications
CREATE POLICY "Medications are viewable by authenticated users" ON public.medications
    FOR SELECT USING (auth.role() = 'authenticated');

-- Default policy for allergies: authenticated users can read all allergies
CREATE POLICY "Allergies are viewable by authenticated users" ON public.allergies
    FOR SELECT USING (auth.role() = 'authenticated');

-- Default policy for vital_signs: authenticated users can read all vital_signs
CREATE POLICY "Vital signs are viewable by authenticated users" ON public.vital_signs
    FOR SELECT USING (auth.role() = 'authenticated');

-- Default policy for audit_logs: authenticated users can read all audit_logs
CREATE POLICY "Audit logs are viewable by authenticated users" ON public.audit_logs
    FOR SELECT USING (auth.role() = 'authenticated');

-- Default policy for tasks: authenticated users can read all tasks
CREATE POLICY "Tasks are viewable by authenticated users" ON public.tasks
    FOR SELECT USING (auth.role() = 'authenticated');

-- Default policy for fluid_balance: authenticated users can read all fluid_balance
CREATE POLICY "Fluid balance records are viewable by authenticated users" ON public.fluid_balance
    FOR SELECT USING (auth.role() = 'authenticated');

-- Default policy for messages: authenticated users can read all messages
CREATE POLICY "Messages are viewable by authenticated users" ON public.messages
    FOR SELECT USING (auth.role() = 'authenticated');

-- Default policy for alerts: authenticated users can read all alerts
CREATE POLICY "Alerts are viewable by authenticated users" ON public.alerts
    FOR SELECT USING (auth.role() = 'authenticated');

-- Default policy for user_permissions: authenticated users can read all user_permissions
CREATE POLICY "User permissions are viewable by authenticated users" ON public.user_permissions
    FOR SELECT USING (auth.role() = 'authenticated');

-- Default policy for permissions: authenticated users can read all permissions
CREATE POLICY "Permissions are viewable by authenticated users" ON public.permissions
    FOR SELECT USING (auth.role() = 'authenticated');

-- Default policy for user_sector_access: authenticated users can read all user_sector_access
CREATE POLICY "User sector access records are viewable by authenticated users" ON public.user_sector_access
    FOR SELECT USING (auth.role() = 'authenticated');

-- Default policy for sectors: authenticated users can read all sectors
CREATE POLICY "Sectors are viewable by authenticated users" ON public.sectors
    FOR SELECT USING (auth.role() = 'authenticated');

-- Default policy for rxnorm_ndc_cache: authenticated users can read all rxnorm_ndc_cache
CREATE POLICY "RxNorm NDC cache is viewable by authenticated users" ON public.rxnorm_ndc_cache
    FOR SELECT USING (auth.role() = 'authenticated');

-- Default policy for rxnorm_displayterms_cache: authenticated users can read all rxnorm_displayterms_cache
CREATE POLICY "RxNorm display terms cache is viewable by authenticated users" ON public.rxnorm_displayterms_cache
    FOR SELECT USING (auth.role() = 'authenticated');

-- Default policy for rxnorm_interactions_cache: authenticated users can read all rxnorm_interactions_cache
CREATE POLICY "RxNorm interactions cache is viewable by authenticated users" ON public.rxnorm_interactions_cache
    FOR SELECT USING (auth.role() = 'authenticated');