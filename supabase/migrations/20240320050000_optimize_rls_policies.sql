-- Optimize RLS policies to avoid re-evaluating auth.role() for each row
-- This addresses the 'auth_rls_initplan' warnings

-- Drop and recreate policy for users table
DROP POLICY IF EXISTS "Users are viewable by authenticated users" ON public.users;
CREATE POLICY "Users are viewable by authenticated users" ON public.users
    FOR SELECT USING ((SELECT auth.role()) = 'authenticated');

-- Drop and recreate policy for patients table
DROP POLICY IF EXISTS "Patients are viewable by authenticated users" ON public.patients;
CREATE POLICY "Patients are viewable by authenticated users" ON public.patients
    FOR SELECT USING ((SELECT auth.role()) = 'authenticated');

-- Drop and recreate policy for appointments table
DROP POLICY IF EXISTS "Appointments are viewable by authenticated users" ON public.appointments;
CREATE POLICY "Appointments are viewable by authenticated users" ON public.appointments
    FOR SELECT USING ((SELECT auth.role()) = 'authenticated');

-- Drop and recreate policy for visits table
DROP POLICY IF EXISTS "Visits are viewable by authenticated users" ON public.visits;
CREATE POLICY "Visits are viewable by authenticated users" ON public.visits
    FOR SELECT USING ((SELECT auth.role()) = 'authenticated');

-- Drop and recreate policy for clinical_notes table
DROP POLICY IF EXISTS "Clinical notes are viewable by authenticated users" ON public.clinical_notes;
CREATE POLICY "Clinical notes are viewable by authenticated users" ON public.clinical_notes
    FOR SELECT USING ((SELECT auth.role()) = 'authenticated');

-- Drop and recreate policy for prescriptions table
DROP POLICY IF EXISTS "Prescriptions are viewable by authenticated users" ON public.prescriptions;
CREATE POLICY "Prescriptions are viewable by authenticated users" ON public.prescriptions
    FOR SELECT USING ((SELECT auth.role()) = 'authenticated');

-- Drop and recreate policy for medications table
DROP POLICY IF EXISTS "Medications are viewable by authenticated users" ON public.medications;
CREATE POLICY "Medications are viewable by authenticated users" ON public.medications
    FOR SELECT USING ((SELECT auth.role()) = 'authenticated');

-- Drop and recreate policy for allergies table
DROP POLICY IF EXISTS "Allergies are viewable by authenticated users" ON public.allergies;
CREATE POLICY "Allergies are viewable by authenticated users" ON public.allergies
    FOR SELECT USING ((SELECT auth.role()) = 'authenticated');

-- Drop and recreate policy for vital_signs table
DROP POLICY IF EXISTS "Vital signs are viewable by authenticated users" ON public.vital_signs;
CREATE POLICY "Vital signs are viewable by authenticated users" ON public.vital_signs
    FOR SELECT USING ((SELECT auth.role()) = 'authenticated');

-- Drop and recreate policy for audit_logs table
DROP POLICY IF EXISTS "Audit logs are viewable by authenticated users" ON public.audit_logs;
CREATE POLICY "Audit logs are viewable by authenticated users" ON public.audit_logs
    FOR SELECT USING ((SELECT auth.role()) = 'authenticated');

-- Drop and recreate policy for tasks table
DROP POLICY IF EXISTS "Tasks are viewable by authenticated users" ON public.tasks;
CREATE POLICY "Tasks are viewable by authenticated users" ON public.tasks
    FOR SELECT USING ((SELECT auth.role()) = 'authenticated');

-- Drop and recreate policy for fluid_balance table
DROP POLICY IF EXISTS "Fluid balance records are viewable by authenticated users" ON public.fluid_balance;
CREATE POLICY "Fluid balance records are viewable by authenticated users" ON public.fluid_balance
    FOR SELECT USING ((SELECT auth.role()) = 'authenticated');

-- Drop and recreate policy for messages table
DROP POLICY IF EXISTS "Messages are viewable by authenticated users" ON public.messages;
CREATE POLICY "Messages are viewable by authenticated users" ON public.messages
    FOR SELECT USING ((SELECT auth.role()) = 'authenticated');

-- Drop and recreate policy for alerts table
DROP POLICY IF EXISTS "Alerts are viewable by authenticated users" ON public.alerts;
CREATE POLICY "Alerts are viewable by authenticated users" ON public.alerts
    FOR SELECT USING ((SELECT auth.role()) = 'authenticated');

-- Drop and recreate policy for user_permissions table
DROP POLICY IF EXISTS "User permissions are viewable by authenticated users" ON public.user_permissions;
CREATE POLICY "User permissions are viewable by authenticated users" ON public.user_permissions
    FOR SELECT USING ((SELECT auth.role()) = 'authenticated');

-- Drop and recreate policy for permissions table
DROP POLICY IF EXISTS "Permissions are viewable by authenticated users" ON public.permissions;
CREATE POLICY "Permissions are viewable by authenticated users" ON public.permissions
    FOR SELECT USING ((SELECT auth.role()) = 'authenticated');

-- Drop and recreate policy for user_sector_access table
DROP POLICY IF EXISTS "User sector access records are viewable by authenticated users" ON public.user_sector_access;
CREATE POLICY "User sector access records are viewable by authenticated users" ON public.user_sector_access
    FOR SELECT USING ((SELECT auth.role()) = 'authenticated');

-- Drop and recreate policy for sectors table
DROP POLICY IF EXISTS "Sectors are viewable by authenticated users" ON public.sectors;
CREATE POLICY "Sectors are viewable by authenticated users" ON public.sectors
    FOR SELECT USING ((SELECT auth.role()) = 'authenticated');

-- Drop and recreate policy for rxnorm_ndc_cache table
DROP POLICY IF EXISTS "RxNorm NDC cache is viewable by authenticated users" ON public.rxnorm_ndc_cache;
CREATE POLICY "RxNorm NDC cache is viewable by authenticated users" ON public.rxnorm_ndc_cache
    FOR SELECT USING ((SELECT auth.role()) = 'authenticated');

-- Drop and recreate policy for rxnorm_displayterms_cache table
DROP POLICY IF EXISTS "RxNorm display terms cache is viewable by authenticated users" ON public.rxnorm_displayterms_cache;
CREATE POLICY "RxNorm display terms cache is viewable by authenticated users" ON public.rxnorm_displayterms_cache
    FOR SELECT USING ((SELECT auth.role()) = 'authenticated');

-- Drop and recreate policy for rxnorm_interactions_cache table
DROP POLICY IF EXISTS "RxNorm interactions cache is viewable by authenticated users" ON public.rxnorm_interactions_cache;
CREATE POLICY "RxNorm interactions cache is viewable by authenticated users" ON public.rxnorm_interactions_cache
    FOR SELECT USING ((SELECT auth.role()) = 'authenticated');