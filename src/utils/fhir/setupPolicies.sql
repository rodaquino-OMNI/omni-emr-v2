
-- This file contains SQL to set up RLS policies for FHIR-compliant tables
-- Note: This is just a reference file and should be executed separately in Supabase SQL editor

-- Observations RLS Policies
CREATE POLICY "Healthcare providers can select observations"
ON public.observations
FOR SELECT
USING (auth.uid() IN (
  SELECT user_id FROM practitioners
) OR (
  SELECT role FROM profiles WHERE id = auth.uid()
) IN ('admin', 'doctor', 'nurse'));

CREATE POLICY "Practitioners can insert observations"
ON public.observations
FOR INSERT
WITH CHECK (auth.uid() IN (
  SELECT user_id FROM practitioners
) OR (
  SELECT role FROM profiles WHERE id = auth.uid()
) IN ('admin', 'doctor', 'nurse'));

CREATE POLICY "Practitioners can update their observations"
ON public.observations
FOR UPDATE
USING (performer_id IN (
  SELECT id FROM practitioners WHERE user_id = auth.uid()
) OR (
  SELECT role FROM profiles WHERE id = auth.uid()
) = 'admin');

-- Conditions RLS Policies
CREATE POLICY "Healthcare providers can select conditions"
ON public.conditions
FOR SELECT
USING (auth.uid() IN (
  SELECT user_id FROM practitioners
) OR (
  SELECT role FROM profiles WHERE id = auth.uid()
) IN ('admin', 'doctor', 'nurse'));

CREATE POLICY "Practitioners can insert conditions"
ON public.conditions
FOR INSERT
WITH CHECK (auth.uid() IN (
  SELECT user_id FROM practitioners
) OR (
  SELECT role FROM profiles WHERE id = auth.uid()
) IN ('admin', 'doctor', 'nurse'));

CREATE POLICY "Practitioners can update their conditions"
ON public.conditions
FOR UPDATE
USING (recorder_id IN (
  SELECT id FROM practitioners WHERE user_id = auth.uid()
) OR (
  SELECT role FROM profiles WHERE id = auth.uid()
) = 'admin');

-- AllergyIntolerances RLS Policies
CREATE POLICY "Healthcare providers can select allergies"
ON public.allergy_intolerances
FOR SELECT
USING (auth.uid() IN (
  SELECT user_id FROM practitioners
) OR (
  SELECT role FROM profiles WHERE id = auth.uid()
) IN ('admin', 'doctor', 'nurse'));

CREATE POLICY "Practitioners can insert allergies"
ON public.allergy_intolerances
FOR INSERT
WITH CHECK (auth.uid() IN (
  SELECT user_id FROM practitioners
) OR (
  SELECT role FROM profiles WHERE id = auth.uid()
) IN ('admin', 'doctor', 'nurse'));

CREATE POLICY "Practitioners can update their allergies"
ON public.allergy_intolerances
FOR UPDATE
USING (recorder_id IN (
  SELECT id FROM practitioners WHERE user_id = auth.uid()
) OR (
  SELECT role FROM profiles WHERE id = auth.uid()
) = 'admin');

-- MedicationRequests RLS Policies
CREATE POLICY "Healthcare providers can select medications"
ON public.medication_requests
FOR SELECT
USING (auth.uid() IN (
  SELECT user_id FROM practitioners
) OR (
  SELECT role FROM profiles WHERE id = auth.uid()
) IN ('admin', 'doctor', 'nurse'));

CREATE POLICY "Practitioners can insert medications"
ON public.medication_requests
FOR INSERT
WITH CHECK (auth.uid() IN (
  SELECT user_id FROM practitioners
) OR (
  SELECT role FROM profiles WHERE id = auth.uid()
) IN ('admin', 'doctor', 'nurse'));

CREATE POLICY "Practitioners can update their medications"
ON public.medication_requests
FOR UPDATE
USING (requester_id IN (
  SELECT id FROM practitioners WHERE user_id = auth.uid()
) OR (
  SELECT role FROM profiles WHERE id = auth.uid()
) = 'admin');

-- Encounters RLS Policies
CREATE POLICY "Healthcare providers can select encounters"
ON public.encounters
FOR SELECT
USING (auth.uid() IN (
  SELECT user_id FROM practitioners
) OR (
  SELECT role FROM profiles WHERE id = auth.uid()
) IN ('admin', 'doctor', 'nurse'));

CREATE POLICY "Practitioners can insert encounters"
ON public.encounters
FOR INSERT
WITH CHECK (auth.uid() IN (
  SELECT user_id FROM practitioners
) OR (
  SELECT role FROM profiles WHERE id = auth.uid()
) IN ('admin', 'doctor', 'nurse'));

-- Devices RLS Policies
CREATE POLICY "Healthcare providers can select devices"
ON public.devices
FOR SELECT
USING (auth.uid() IN (
  SELECT user_id FROM practitioners
) OR (
  SELECT role FROM profiles WHERE id = auth.uid()
) IN ('admin', 'doctor', 'nurse'));

CREATE POLICY "Practitioners can insert devices"
ON public.devices
FOR INSERT
WITH CHECK (auth.uid() IN (
  SELECT user_id FROM practitioners
) OR (
  SELECT role FROM profiles WHERE id = auth.uid()
) IN ('admin', 'doctor', 'nurse'));

-- Practitioners RLS Policies
CREATE POLICY "Practitioners can see their own data"
ON public.practitioners
FOR SELECT
USING (user_id = auth.uid() OR (
  SELECT role FROM profiles WHERE id = auth.uid()
) IN ('admin'));

CREATE POLICY "Practitioners can update their own data"
ON public.practitioners
FOR UPDATE
USING (user_id = auth.uid() OR (
  SELECT role FROM profiles WHERE id = auth.uid()
) = 'admin');
