export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      allergies: {
        Row: {
          allergen: string
          created_at: string
          date_identified: string | null
          id: string
          is_active: boolean | null
          notes: string | null
          patient_id: string
          reaction: string | null
          recorded_by: string | null
          recorder_name: string
          severity: string | null
          updated_at: string
        }
        Insert: {
          allergen: string
          created_at?: string
          date_identified?: string | null
          id?: string
          is_active?: boolean | null
          notes?: string | null
          patient_id: string
          reaction?: string | null
          recorded_by?: string | null
          recorder_name: string
          severity?: string | null
          updated_at?: string
        }
        Update: {
          allergen?: string
          created_at?: string
          date_identified?: string | null
          id?: string
          is_active?: boolean | null
          notes?: string | null
          patient_id?: string
          reaction?: string | null
          recorded_by?: string | null
          recorder_name?: string
          severity?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "allergies_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patient_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "allergies_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      allergy_intolerances: {
        Row: {
          asserter_id: string | null
          category: Json | null
          clinical_status: Json | null
          code: Json
          created_at: string
          criticality: string | null
          encounter_id: string | null
          id: string
          identifier: Json | null
          last_occurrence: string | null
          note: Json | null
          onset_age: Json | null
          onset_date_time: string | null
          onset_period: Json | null
          onset_range: Json | null
          onset_string: string | null
          patient_id: string
          reaction: Json | null
          recorded_date: string
          recorder_id: string | null
          type: string | null
          updated_at: string
          verification_status: Json | null
        }
        Insert: {
          asserter_id?: string | null
          category?: Json | null
          clinical_status?: Json | null
          code: Json
          created_at?: string
          criticality?: string | null
          encounter_id?: string | null
          id?: string
          identifier?: Json | null
          last_occurrence?: string | null
          note?: Json | null
          onset_age?: Json | null
          onset_date_time?: string | null
          onset_period?: Json | null
          onset_range?: Json | null
          onset_string?: string | null
          patient_id: string
          reaction?: Json | null
          recorded_date?: string
          recorder_id?: string | null
          type?: string | null
          updated_at?: string
          verification_status?: Json | null
        }
        Update: {
          asserter_id?: string | null
          category?: Json | null
          clinical_status?: Json | null
          code?: Json
          created_at?: string
          criticality?: string | null
          encounter_id?: string | null
          id?: string
          identifier?: Json | null
          last_occurrence?: string | null
          note?: Json | null
          onset_age?: Json | null
          onset_date_time?: string | null
          onset_period?: Json | null
          onset_range?: Json | null
          onset_string?: string | null
          patient_id?: string
          reaction?: Json | null
          recorded_date?: string
          recorder_id?: string | null
          type?: string | null
          updated_at?: string
          verification_status?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "allergy_intolerances_asserter_id_fkey"
            columns: ["asserter_id"]
            isOneToOne: false
            referencedRelation: "practitioners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "allergy_intolerances_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patient_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "allergy_intolerances_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "allergy_intolerances_recorder_id_fkey"
            columns: ["recorder_id"]
            isOneToOne: false
            referencedRelation: "practitioners"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
        Row: {
          created_at: string
          date: string
          duration: number
          id: string
          location: string | null
          notes: string | null
          patient_id: string
          patient_name: string
          provider_id: string
          provider_name: string
          reminder_sent: boolean | null
          status: string
          time: string
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          date: string
          duration: number
          id?: string
          location?: string | null
          notes?: string | null
          patient_id: string
          patient_name: string
          provider_id: string
          provider_name: string
          reminder_sent?: boolean | null
          status?: string
          time: string
          title: string
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          date?: string
          duration?: number
          id?: string
          location?: string | null
          notes?: string | null
          patient_id?: string
          patient_name?: string
          provider_id?: string
          provider_name?: string
          reminder_sent?: boolean | null
          status?: string
          time?: string
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          id: string
          ip_address: string | null
          resource_id: string | null
          resource_type: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          resource_id?: string | null
          resource_type: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          resource_id?: string | null
          resource_type?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      auth_settings_migrations: {
        Row: {
          enabled: boolean
          id: number
          migration_date: string | null
          notes: string | null
          setting_name: string
        }
        Insert: {
          enabled?: boolean
          id?: number
          migration_date?: string | null
          notes?: string | null
          setting_name: string
        }
        Update: {
          enabled?: boolean
          id?: number
          migration_date?: string | null
          notes?: string | null
          setting_name?: string
        }
        Relationships: []
      }
      billing_records: {
        Row: {
          adjustment_amount: number | null
          balance: number | null
          billing_date: string | null
          charge_amount: number
          cpt_code: string | null
          created_at: string
          diagnostic_codes: Json | null
          encounter_id: string | null
          id: string
          insurance_billed: boolean | null
          insurance_id: string | null
          notes: string | null
          patient_id: string
          payment_amount: number | null
          payment_date: string | null
          procedure_description: string
          service_date: string
          status: string | null
          updated_at: string
        }
        Insert: {
          adjustment_amount?: number | null
          balance?: number | null
          billing_date?: string | null
          charge_amount: number
          cpt_code?: string | null
          created_at?: string
          diagnostic_codes?: Json | null
          encounter_id?: string | null
          id?: string
          insurance_billed?: boolean | null
          insurance_id?: string | null
          notes?: string | null
          patient_id: string
          payment_amount?: number | null
          payment_date?: string | null
          procedure_description: string
          service_date: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          adjustment_amount?: number | null
          balance?: number | null
          billing_date?: string | null
          charge_amount?: number
          cpt_code?: string | null
          created_at?: string
          diagnostic_codes?: Json | null
          encounter_id?: string | null
          id?: string
          insurance_billed?: boolean | null
          insurance_id?: string | null
          notes?: string | null
          patient_id?: string
          payment_amount?: number | null
          payment_date?: string | null
          procedure_description?: string
          service_date?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "billing_records_insurance_id_fkey"
            columns: ["insurance_id"]
            isOneToOne: false
            referencedRelation: "insurance_information"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "billing_records_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patient_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "billing_records_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      care_plans: {
        Row: {
          activity: Json | null
          addresses: Json | null
          author_id: string | null
          care_team: Json | null
          category: Json | null
          contributor: Json | null
          created: string | null
          created_at: string | null
          description: string | null
          encounter_id: string | null
          goal: Json | null
          id: string
          identifier: Json | null
          intent: string
          note: Json | null
          period_end: string | null
          period_start: string | null
          status: string
          subject_id: string
          supporting_info: Json | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          activity?: Json | null
          addresses?: Json | null
          author_id?: string | null
          care_team?: Json | null
          category?: Json | null
          contributor?: Json | null
          created?: string | null
          created_at?: string | null
          description?: string | null
          encounter_id?: string | null
          goal?: Json | null
          id?: string
          identifier?: Json | null
          intent: string
          note?: Json | null
          period_end?: string | null
          period_start?: string | null
          status: string
          subject_id: string
          supporting_info?: Json | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          activity?: Json | null
          addresses?: Json | null
          author_id?: string | null
          care_team?: Json | null
          category?: Json | null
          contributor?: Json | null
          created?: string | null
          created_at?: string | null
          description?: string | null
          encounter_id?: string | null
          goal?: Json | null
          id?: string
          identifier?: Json | null
          intent?: string
          note?: Json | null
          period_end?: string | null
          period_start?: string | null
          status?: string
          subject_id?: string
          supporting_info?: Json | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      care_teams: {
        Row: {
          created_at: string
          end_date: string | null
          id: string
          notes: string | null
          patient_id: string
          primary_provider: boolean | null
          provider_id: string
          provider_name: string
          role: string
          specialty: string | null
          start_date: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          end_date?: string | null
          id?: string
          notes?: string | null
          patient_id: string
          primary_provider?: boolean | null
          provider_id: string
          provider_name: string
          role: string
          specialty?: string | null
          start_date?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          end_date?: string | null
          id?: string
          notes?: string | null
          patient_id?: string
          primary_provider?: boolean | null
          provider_id?: string
          provider_name?: string
          role?: string
          specialty?: string | null
          start_date?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "care_teams_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patient_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "care_teams_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      clinical_notes: {
        Row: {
          author_id: string | null
          author_name: string
          created_at: string
          encounter_date: string
          id: string
          note_content: string
          note_title: string
          note_type: string
          patient_id: string
          signed: boolean | null
          signed_date: string | null
          updated_at: string
          version: number | null
        }
        Insert: {
          author_id?: string | null
          author_name: string
          created_at?: string
          encounter_date?: string
          id?: string
          note_content: string
          note_title: string
          note_type: string
          patient_id: string
          signed?: boolean | null
          signed_date?: string | null
          updated_at?: string
          version?: number | null
        }
        Update: {
          author_id?: string | null
          author_name?: string
          created_at?: string
          encounter_date?: string
          id?: string
          note_content?: string
          note_title?: string
          note_type?: string
          patient_id?: string
          signed?: boolean | null
          signed_date?: string | null
          updated_at?: string
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "clinical_notes_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patient_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clinical_notes_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      conditions: {
        Row: {
          abatement_age: Json | null
          abatement_date_time: string | null
          abatement_period: Json | null
          abatement_range: Json | null
          abatement_string: string | null
          asserter_id: string | null
          body_site: Json | null
          category: Json | null
          clinical_status: Json | null
          code: Json
          created_at: string
          encounter_id: string | null
          evidence: Json | null
          id: string
          identifier: Json | null
          note: Json | null
          onset_age: Json | null
          onset_date_time: string | null
          onset_period: Json | null
          onset_range: Json | null
          onset_string: string | null
          recorded_date: string
          recorder_id: string | null
          severity: Json | null
          stage: Json | null
          subject_id: string
          updated_at: string
          verification_status: Json | null
        }
        Insert: {
          abatement_age?: Json | null
          abatement_date_time?: string | null
          abatement_period?: Json | null
          abatement_range?: Json | null
          abatement_string?: string | null
          asserter_id?: string | null
          body_site?: Json | null
          category?: Json | null
          clinical_status?: Json | null
          code: Json
          created_at?: string
          encounter_id?: string | null
          evidence?: Json | null
          id?: string
          identifier?: Json | null
          note?: Json | null
          onset_age?: Json | null
          onset_date_time?: string | null
          onset_period?: Json | null
          onset_range?: Json | null
          onset_string?: string | null
          recorded_date?: string
          recorder_id?: string | null
          severity?: Json | null
          stage?: Json | null
          subject_id: string
          updated_at?: string
          verification_status?: Json | null
        }
        Update: {
          abatement_age?: Json | null
          abatement_date_time?: string | null
          abatement_period?: Json | null
          abatement_range?: Json | null
          abatement_string?: string | null
          asserter_id?: string | null
          body_site?: Json | null
          category?: Json | null
          clinical_status?: Json | null
          code?: Json
          created_at?: string
          encounter_id?: string | null
          evidence?: Json | null
          id?: string
          identifier?: Json | null
          note?: Json | null
          onset_age?: Json | null
          onset_date_time?: string | null
          onset_period?: Json | null
          onset_range?: Json | null
          onset_string?: string | null
          recorded_date?: string
          recorder_id?: string | null
          severity?: Json | null
          stage?: Json | null
          subject_id?: string
          updated_at?: string
          verification_status?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "conditions_asserter_id_fkey"
            columns: ["asserter_id"]
            isOneToOne: false
            referencedRelation: "practitioners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conditions_recorder_id_fkey"
            columns: ["recorder_id"]
            isOneToOne: false
            referencedRelation: "practitioners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conditions_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "patient_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conditions_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      data_retention_policies: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          policy_description: string | null
          resource_type: string
          retention_period: unknown
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          policy_description?: string | null
          resource_type: string
          retention_period: unknown
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          policy_description?: string | null
          resource_type?: string
          retention_period?: unknown
          updated_at?: string | null
        }
        Relationships: []
      }
      devices: {
        Row: {
          contact: Json | null
          created_at: string
          definition: Json | null
          device_name: Json | null
          distinct_identifier: string | null
          expiration_date: string | null
          id: string
          identifier: Json | null
          location: Json | null
          lot_number: string | null
          manufacture_date: string | null
          manufacturer: string | null
          model_number: string | null
          note: Json | null
          owner_id: string | null
          parent_id: string | null
          part_number: string | null
          patient_id: string | null
          property: Json | null
          safety: Json | null
          serial_number: string | null
          specialization: Json | null
          status: string | null
          status_reason: Json | null
          type: Json | null
          udicarrier: Json | null
          updated_at: string
          url: string | null
          version: Json | null
        }
        Insert: {
          contact?: Json | null
          created_at?: string
          definition?: Json | null
          device_name?: Json | null
          distinct_identifier?: string | null
          expiration_date?: string | null
          id?: string
          identifier?: Json | null
          location?: Json | null
          lot_number?: string | null
          manufacture_date?: string | null
          manufacturer?: string | null
          model_number?: string | null
          note?: Json | null
          owner_id?: string | null
          parent_id?: string | null
          part_number?: string | null
          patient_id?: string | null
          property?: Json | null
          safety?: Json | null
          serial_number?: string | null
          specialization?: Json | null
          status?: string | null
          status_reason?: Json | null
          type?: Json | null
          udicarrier?: Json | null
          updated_at?: string
          url?: string | null
          version?: Json | null
        }
        Update: {
          contact?: Json | null
          created_at?: string
          definition?: Json | null
          device_name?: Json | null
          distinct_identifier?: string | null
          expiration_date?: string | null
          id?: string
          identifier?: Json | null
          location?: Json | null
          lot_number?: string | null
          manufacture_date?: string | null
          manufacturer?: string | null
          model_number?: string | null
          note?: Json | null
          owner_id?: string | null
          parent_id?: string | null
          part_number?: string | null
          patient_id?: string | null
          property?: Json | null
          safety?: Json | null
          serial_number?: string | null
          specialization?: Json | null
          status?: string | null
          status_reason?: Json | null
          type?: Json | null
          udicarrier?: Json | null
          updated_at?: string
          url?: string | null
          version?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "devices_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "practitioners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "devices_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "devices_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patient_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "devices_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      diagnoses: {
        Row: {
          created_at: string
          diagnosed_by: string | null
          diagnosed_date: string | null
          diagnosis: string
          diagnostician_name: string
          icd_code: string | null
          id: string
          notes: string | null
          patient_id: string
          status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          diagnosed_by?: string | null
          diagnosed_date?: string | null
          diagnosis: string
          diagnostician_name: string
          icd_code?: string | null
          id?: string
          notes?: string | null
          patient_id: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          diagnosed_by?: string | null
          diagnosed_date?: string | null
          diagnosis?: string
          diagnostician_name?: string
          icd_code?: string | null
          id?: string
          notes?: string | null
          patient_id?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "diagnoses_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patient_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "diagnoses_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      diagnostic_reports: {
        Row: {
          based_on: Json | null
          category: Json | null
          code: Json
          conclusion: string | null
          conclusion_code: Json | null
          created_at: string | null
          effective_datetime: string | null
          effective_period: Json | null
          encounter_id: string | null
          id: string
          identifier: Json | null
          imaging_study: Json | null
          issued: string | null
          media: Json | null
          performer: Json | null
          presented_form: Json | null
          result: Json | null
          result_interpreter: Json | null
          specimen: Json | null
          status: string
          subject_id: string
          updated_at: string | null
        }
        Insert: {
          based_on?: Json | null
          category?: Json | null
          code: Json
          conclusion?: string | null
          conclusion_code?: Json | null
          created_at?: string | null
          effective_datetime?: string | null
          effective_period?: Json | null
          encounter_id?: string | null
          id?: string
          identifier?: Json | null
          imaging_study?: Json | null
          issued?: string | null
          media?: Json | null
          performer?: Json | null
          presented_form?: Json | null
          result?: Json | null
          result_interpreter?: Json | null
          specimen?: Json | null
          status: string
          subject_id: string
          updated_at?: string | null
        }
        Update: {
          based_on?: Json | null
          category?: Json | null
          code?: Json
          conclusion?: string | null
          conclusion_code?: Json | null
          created_at?: string | null
          effective_datetime?: string | null
          effective_period?: Json | null
          encounter_id?: string | null
          id?: string
          identifier?: Json | null
          imaging_study?: Json | null
          issued?: string | null
          media?: Json | null
          performer?: Json | null
          presented_form?: Json | null
          result?: Json | null
          result_interpreter?: Json | null
          specimen?: Json | null
          status?: string
          subject_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      document_references: {
        Row: {
          authenticator_id: string | null
          author_id: string | null
          category: Json | null
          content: Json
          context: Json | null
          created_at: string | null
          custodian_id: string | null
          date: string | null
          description: string | null
          docstatus: string | null
          id: string
          identifier: Json | null
          relates_to: Json | null
          security_label: Json | null
          status: string
          subject_id: string
          type: Json | null
          updated_at: string | null
        }
        Insert: {
          authenticator_id?: string | null
          author_id?: string | null
          category?: Json | null
          content: Json
          context?: Json | null
          created_at?: string | null
          custodian_id?: string | null
          date?: string | null
          description?: string | null
          docstatus?: string | null
          id?: string
          identifier?: Json | null
          relates_to?: Json | null
          security_label?: Json | null
          status: string
          subject_id: string
          type?: Json | null
          updated_at?: string | null
        }
        Update: {
          authenticator_id?: string | null
          author_id?: string | null
          category?: Json | null
          content?: Json
          context?: Json | null
          created_at?: string | null
          custodian_id?: string | null
          date?: string | null
          description?: string | null
          docstatus?: string | null
          id?: string
          identifier?: Json | null
          relates_to?: Json | null
          security_label?: Json | null
          status?: string
          subject_id?: string
          type?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      document_versions: {
        Row: {
          change_summary: string | null
          content: Json
          created_at: string | null
          document_id: string
          document_type: string
          id: string
          modified_at: string | null
          modified_by: string
          version_number: number
        }
        Insert: {
          change_summary?: string | null
          content: Json
          created_at?: string | null
          document_id: string
          document_type: string
          id?: string
          modified_at?: string | null
          modified_by: string
          version_number: number
        }
        Update: {
          change_summary?: string | null
          content?: Json
          created_at?: string | null
          document_id?: string
          document_type?: string
          id?: string
          modified_at?: string | null
          modified_by?: string
          version_number?: number
        }
        Relationships: []
      }
      emergency_access_logs: {
        Row: {
          access_ended: string | null
          access_started: string | null
          approval_time: string | null
          approved: boolean | null
          approved_by: string | null
          created_at: string | null
          details: Json | null
          id: string
          ip_address: string | null
          patient_id: string
          reason: string
          updated_at: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          access_ended?: string | null
          access_started?: string | null
          approval_time?: string | null
          approved?: boolean | null
          approved_by?: string | null
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: string | null
          patient_id: string
          reason: string
          updated_at?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          access_ended?: string | null
          access_started?: string | null
          approval_time?: string | null
          approved?: boolean | null
          approved_by?: string | null
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: string | null
          patient_id?: string
          reason?: string
          updated_at?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      encounters: {
        Row: {
          account: Json | null
          appointment: Json | null
          class: Json
          created_at: string
          diagnosis: Json | null
          episode_of_care: Json | null
          hospitalization: Json | null
          id: string
          identifier: Json | null
          length: number | null
          location: Json | null
          part_of_id: string | null
          participant: Json | null
          period_end: string | null
          period_start: string
          priority: Json | null
          reason_code: Json | null
          reason_reference: Json | null
          service_provider: Json | null
          service_type: Json | null
          status: string
          subject_id: string
          type: Json | null
          updated_at: string
        }
        Insert: {
          account?: Json | null
          appointment?: Json | null
          class: Json
          created_at?: string
          diagnosis?: Json | null
          episode_of_care?: Json | null
          hospitalization?: Json | null
          id?: string
          identifier?: Json | null
          length?: number | null
          location?: Json | null
          part_of_id?: string | null
          participant?: Json | null
          period_end?: string | null
          period_start?: string
          priority?: Json | null
          reason_code?: Json | null
          reason_reference?: Json | null
          service_provider?: Json | null
          service_type?: Json | null
          status: string
          subject_id: string
          type?: Json | null
          updated_at?: string
        }
        Update: {
          account?: Json | null
          appointment?: Json | null
          class?: Json
          created_at?: string
          diagnosis?: Json | null
          episode_of_care?: Json | null
          hospitalization?: Json | null
          id?: string
          identifier?: Json | null
          length?: number | null
          location?: Json | null
          part_of_id?: string | null
          participant?: Json | null
          period_end?: string | null
          period_start?: string
          priority?: Json | null
          reason_code?: Json | null
          reason_reference?: Json | null
          service_provider?: Json | null
          service_type?: Json | null
          status?: string
          subject_id?: string
          type?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "encounters_part_of_id_fkey"
            columns: ["part_of_id"]
            isOneToOne: false
            referencedRelation: "encounters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "encounters_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "patient_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "encounters_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      extended_audit_logs: {
        Row: {
          access_reason: string | null
          access_type: string | null
          action: string
          created_at: string | null
          details: Json | null
          emergency_reason: string | null
          id: string
          ip_address: string | null
          is_emergency_access: boolean | null
          patient_id: string | null
          resource_id: string | null
          resource_type: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          access_reason?: string | null
          access_type?: string | null
          action: string
          created_at?: string | null
          details?: Json | null
          emergency_reason?: string | null
          id?: string
          ip_address?: string | null
          is_emergency_access?: boolean | null
          patient_id?: string | null
          resource_id?: string | null
          resource_type: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          access_reason?: string | null
          access_type?: string | null
          action?: string
          created_at?: string | null
          details?: Json | null
          emergency_reason?: string | null
          id?: string
          ip_address?: string | null
          is_emergency_access?: boolean | null
          patient_id?: string | null
          resource_id?: string | null
          resource_type?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      fluid_intakes: {
        Row: {
          amount: number
          created_at: string
          id: string
          notes: string | null
          patient_id: string
          recorded_by: string
          recorder_name: string
          timestamp: string
          type: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          notes?: string | null
          patient_id: string
          recorded_by: string
          recorder_name: string
          timestamp?: string
          type: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          notes?: string | null
          patient_id?: string
          recorded_by?: string
          recorder_name?: string
          timestamp?: string
          type?: string
        }
        Relationships: []
      }
      fluid_outputs: {
        Row: {
          amount: number
          created_at: string
          id: string
          notes: string | null
          patient_id: string
          recorded_by: string
          recorder_name: string
          timestamp: string
          type: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          notes?: string | null
          patient_id: string
          recorded_by: string
          recorder_name: string
          timestamp?: string
          type: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          notes?: string | null
          patient_id?: string
          recorded_by?: string
          recorder_name?: string
          timestamp?: string
          type?: string
        }
        Relationships: []
      }
      goals: {
        Row: {
          achievement_status: Json | null
          addresses: Json | null
          category: Json | null
          created_at: string | null
          description: Json
          expressed_by_id: string | null
          id: string
          identifier: Json | null
          lifecycle_status: string
          note: Json | null
          outcome_code: Json | null
          outcome_reference: Json | null
          priority: Json | null
          start_date: Json | null
          status_date: string | null
          status_reason: string | null
          subject_id: string
          target: Json | null
          updated_at: string | null
        }
        Insert: {
          achievement_status?: Json | null
          addresses?: Json | null
          category?: Json | null
          created_at?: string | null
          description: Json
          expressed_by_id?: string | null
          id?: string
          identifier?: Json | null
          lifecycle_status: string
          note?: Json | null
          outcome_code?: Json | null
          outcome_reference?: Json | null
          priority?: Json | null
          start_date?: Json | null
          status_date?: string | null
          status_reason?: string | null
          subject_id: string
          target?: Json | null
          updated_at?: string | null
        }
        Update: {
          achievement_status?: Json | null
          addresses?: Json | null
          category?: Json | null
          created_at?: string | null
          description?: Json
          expressed_by_id?: string | null
          id?: string
          identifier?: Json | null
          lifecycle_status?: string
          note?: Json | null
          outcome_code?: Json | null
          outcome_reference?: Json | null
          priority?: Json | null
          start_date?: Json | null
          status_date?: string | null
          status_reason?: string | null
          subject_id?: string
          target?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      hospital_sectors: {
        Row: {
          code: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      immunizations: {
        Row: {
          created_at: string | null
          dose_quantity: Json | null
          education: Json | null
          encounter_id: string | null
          expiration_date: string | null
          funding_source: Json | null
          id: string
          identifier: Json | null
          is_subpotent: boolean | null
          location_id: string | null
          lot_number: string | null
          manufacturer: Json | null
          note: Json | null
          occurrence_date_time: string | null
          patient_id: string
          performer: Json | null
          primary_source: boolean | null
          programmatic_eligibility: Json | null
          protocol_applied: Json | null
          reaction: Json | null
          reason_code: Json | null
          reason_reference: Json | null
          recorded_date: string | null
          report_origin: Json | null
          route: Json | null
          site: Json | null
          status: string
          status_reason: Json | null
          subpotent_reason: Json | null
          updated_at: string | null
          vaccine_code: Json
        }
        Insert: {
          created_at?: string | null
          dose_quantity?: Json | null
          education?: Json | null
          encounter_id?: string | null
          expiration_date?: string | null
          funding_source?: Json | null
          id?: string
          identifier?: Json | null
          is_subpotent?: boolean | null
          location_id?: string | null
          lot_number?: string | null
          manufacturer?: Json | null
          note?: Json | null
          occurrence_date_time?: string | null
          patient_id: string
          performer?: Json | null
          primary_source?: boolean | null
          programmatic_eligibility?: Json | null
          protocol_applied?: Json | null
          reaction?: Json | null
          reason_code?: Json | null
          reason_reference?: Json | null
          recorded_date?: string | null
          report_origin?: Json | null
          route?: Json | null
          site?: Json | null
          status: string
          status_reason?: Json | null
          subpotent_reason?: Json | null
          updated_at?: string | null
          vaccine_code: Json
        }
        Update: {
          created_at?: string | null
          dose_quantity?: Json | null
          education?: Json | null
          encounter_id?: string | null
          expiration_date?: string | null
          funding_source?: Json | null
          id?: string
          identifier?: Json | null
          is_subpotent?: boolean | null
          location_id?: string | null
          lot_number?: string | null
          manufacturer?: Json | null
          note?: Json | null
          occurrence_date_time?: string | null
          patient_id?: string
          performer?: Json | null
          primary_source?: boolean | null
          programmatic_eligibility?: Json | null
          protocol_applied?: Json | null
          reaction?: Json | null
          reason_code?: Json | null
          reason_reference?: Json | null
          recorded_date?: string | null
          report_origin?: Json | null
          route?: Json | null
          site?: Json | null
          status?: string
          status_reason?: Json | null
          subpotent_reason?: Json | null
          updated_at?: string | null
          vaccine_code?: Json
        }
        Relationships: []
      }
      insurance_information: {
        Row: {
          copay_amount: number | null
          coverage_end_date: string | null
          coverage_start_date: string | null
          created_at: string
          deductible_amount: number | null
          group_number: string | null
          id: string
          insurance_provider: string
          is_primary: boolean | null
          notes: string | null
          patient_id: string
          policy_number: string
          relationship_to_subscriber: string | null
          subscriber_id: string | null
          subscriber_name: string | null
          updated_at: string
          verification_date: string | null
        }
        Insert: {
          copay_amount?: number | null
          coverage_end_date?: string | null
          coverage_start_date?: string | null
          created_at?: string
          deductible_amount?: number | null
          group_number?: string | null
          id?: string
          insurance_provider: string
          is_primary?: boolean | null
          notes?: string | null
          patient_id: string
          policy_number: string
          relationship_to_subscriber?: string | null
          subscriber_id?: string | null
          subscriber_name?: string | null
          updated_at?: string
          verification_date?: string | null
        }
        Update: {
          copay_amount?: number | null
          coverage_end_date?: string | null
          coverage_start_date?: string | null
          created_at?: string
          deductible_amount?: number | null
          group_number?: string | null
          id?: string
          insurance_provider?: string
          is_primary?: boolean | null
          notes?: string | null
          patient_id?: string
          policy_number?: string
          relationship_to_subscriber?: string | null
          subscriber_id?: string | null
          subscriber_name?: string | null
          updated_at?: string
          verification_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "insurance_information_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patient_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "insurance_information_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      lab_results: {
        Row: {
          abnormal: boolean | null
          collection_date: string | null
          created_at: string
          critical: boolean | null
          id: string
          notes: string | null
          order_id: string | null
          ordered_by: string | null
          ordering_provider: string
          patient_id: string
          reference_range: string | null
          result: string
          result_date: string
          test_code: string | null
          test_name: string
          unit: string | null
          updated_at: string
        }
        Insert: {
          abnormal?: boolean | null
          collection_date?: string | null
          created_at?: string
          critical?: boolean | null
          id?: string
          notes?: string | null
          order_id?: string | null
          ordered_by?: string | null
          ordering_provider: string
          patient_id: string
          reference_range?: string | null
          result: string
          result_date?: string
          test_code?: string | null
          test_name: string
          unit?: string | null
          updated_at?: string
        }
        Update: {
          abnormal?: boolean | null
          collection_date?: string | null
          created_at?: string
          critical?: boolean | null
          id?: string
          notes?: string | null
          order_id?: string | null
          ordered_by?: string | null
          ordering_provider?: string
          patient_id?: string
          reference_range?: string | null
          result?: string
          result_date?: string
          test_code?: string | null
          test_name?: string
          unit?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lab_results_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patient_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lab_results_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          address: Json | null
          alias: Json | null
          availability_exceptions: string | null
          created_at: string | null
          description: string | null
          endpoint: Json | null
          hours_of_operation: Json | null
          id: string
          identifier: Json | null
          managing_organization: Json | null
          mode: string | null
          name: string | null
          operational_status: Json | null
          part_of_id: string | null
          physical_type: Json | null
          position: Json | null
          status: string
          telecom: Json | null
          type: Json | null
          updated_at: string | null
        }
        Insert: {
          address?: Json | null
          alias?: Json | null
          availability_exceptions?: string | null
          created_at?: string | null
          description?: string | null
          endpoint?: Json | null
          hours_of_operation?: Json | null
          id?: string
          identifier?: Json | null
          managing_organization?: Json | null
          mode?: string | null
          name?: string | null
          operational_status?: Json | null
          part_of_id?: string | null
          physical_type?: Json | null
          position?: Json | null
          status: string
          telecom?: Json | null
          type?: Json | null
          updated_at?: string | null
        }
        Update: {
          address?: Json | null
          alias?: Json | null
          availability_exceptions?: string | null
          created_at?: string | null
          description?: string | null
          endpoint?: Json | null
          hours_of_operation?: Json | null
          id?: string
          identifier?: Json | null
          managing_organization?: Json | null
          mode?: string | null
          name?: string | null
          operational_status?: Json | null
          part_of_id?: string | null
          physical_type?: Json | null
          position?: Json | null
          status?: string
          telecom?: Json | null
          type?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      medical_entry_systems: {
        Row: {
          created_at: string
          entry_id: string
          findings: string
          id: string
          system_name: string
        }
        Insert: {
          created_at?: string
          entry_id: string
          findings: string
          id?: string
          system_name: string
        }
        Update: {
          created_at?: string
          entry_id?: string
          findings?: string
          id?: string
          system_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "medical_entry_systems_entry_id_fkey"
            columns: ["entry_id"]
            isOneToOne: false
            referencedRelation: "medical_history_entries"
            referencedColumns: ["id"]
          },
        ]
      }
      medical_history_entries: {
        Row: {
          created_at: string
          entry_date: string
          id: string
          notes: string | null
          patient_id: string
          provider_id: string
          provider_name: string
          title: string
        }
        Insert: {
          created_at?: string
          entry_date?: string
          id?: string
          notes?: string | null
          patient_id: string
          provider_id: string
          provider_name: string
          title: string
        }
        Update: {
          created_at?: string
          entry_date?: string
          id?: string
          notes?: string | null
          patient_id?: string
          provider_id?: string
          provider_name?: string
          title?: string
        }
        Relationships: []
      }
      medication_requests: {
        Row: {
          authored_on: string
          based_on: Json | null
          category: Json | null
          course_of_therapy_type: Json | null
          created_at: string
          detected_issue: Json | null
          dispense_request: Json | null
          do_not_perform: boolean | null
          dosage_instruction: Json | null
          encounter_id: string | null
          event_history: Json | null
          group_identifier: Json | null
          id: string
          identifier: Json | null
          instantiates_canonical: Json | null
          instantiates_uri: Json | null
          insurance: Json | null
          intent: string
          medication_codeable_concept: Json | null
          medication_reference: Json | null
          note: Json | null
          performer_id: string | null
          performer_type: Json | null
          prior_prescription: Json | null
          priority: string | null
          reason_code: Json | null
          reason_reference: Json | null
          recorder_id: string | null
          reported_boolean: boolean | null
          reported_reference: Json | null
          requester_id: string | null
          status: string
          status_reason: Json | null
          subject_id: string
          substitution: Json | null
          supporting_information: Json | null
          updated_at: string
        }
        Insert: {
          authored_on?: string
          based_on?: Json | null
          category?: Json | null
          course_of_therapy_type?: Json | null
          created_at?: string
          detected_issue?: Json | null
          dispense_request?: Json | null
          do_not_perform?: boolean | null
          dosage_instruction?: Json | null
          encounter_id?: string | null
          event_history?: Json | null
          group_identifier?: Json | null
          id?: string
          identifier?: Json | null
          instantiates_canonical?: Json | null
          instantiates_uri?: Json | null
          insurance?: Json | null
          intent: string
          medication_codeable_concept?: Json | null
          medication_reference?: Json | null
          note?: Json | null
          performer_id?: string | null
          performer_type?: Json | null
          prior_prescription?: Json | null
          priority?: string | null
          reason_code?: Json | null
          reason_reference?: Json | null
          recorder_id?: string | null
          reported_boolean?: boolean | null
          reported_reference?: Json | null
          requester_id?: string | null
          status: string
          status_reason?: Json | null
          subject_id: string
          substitution?: Json | null
          supporting_information?: Json | null
          updated_at?: string
        }
        Update: {
          authored_on?: string
          based_on?: Json | null
          category?: Json | null
          course_of_therapy_type?: Json | null
          created_at?: string
          detected_issue?: Json | null
          dispense_request?: Json | null
          do_not_perform?: boolean | null
          dosage_instruction?: Json | null
          encounter_id?: string | null
          event_history?: Json | null
          group_identifier?: Json | null
          id?: string
          identifier?: Json | null
          instantiates_canonical?: Json | null
          instantiates_uri?: Json | null
          insurance?: Json | null
          intent?: string
          medication_codeable_concept?: Json | null
          medication_reference?: Json | null
          note?: Json | null
          performer_id?: string | null
          performer_type?: Json | null
          prior_prescription?: Json | null
          priority?: string | null
          reason_code?: Json | null
          reason_reference?: Json | null
          recorder_id?: string | null
          reported_boolean?: boolean | null
          reported_reference?: Json | null
          requester_id?: string | null
          status?: string
          status_reason?: Json | null
          subject_id?: string
          substitution?: Json | null
          supporting_information?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "medication_requests_performer_id_fkey"
            columns: ["performer_id"]
            isOneToOne: false
            referencedRelation: "practitioners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medication_requests_recorder_id_fkey"
            columns: ["recorder_id"]
            isOneToOne: false
            referencedRelation: "practitioners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medication_requests_requester_id_fkey"
            columns: ["requester_id"]
            isOneToOne: false
            referencedRelation: "practitioners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medication_requests_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "patient_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medication_requests_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      medications: {
        Row: {
          amount: Json | null
          batch: Json | null
          code: Json | null
          created_at: string | null
          form: Json | null
          id: string
          identifier: Json | null
          ingredient: Json | null
          manufacturer: Json | null
          status: string
          updated_at: string | null
        }
        Insert: {
          amount?: Json | null
          batch?: Json | null
          code?: Json | null
          created_at?: string | null
          form?: Json | null
          id?: string
          identifier?: Json | null
          ingredient?: Json | null
          manufacturer?: Json | null
          status: string
          updated_at?: string | null
        }
        Update: {
          amount?: Json | null
          batch?: Json | null
          code?: Json | null
          created_at?: string | null
          form?: Json | null
          id?: string
          identifier?: Json | null
          ingredient?: Json | null
          manufacturer?: Json | null
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      medications_inventory: {
        Row: {
          controlled_substance: boolean | null
          controlled_substance_schedule: string | null
          created_at: string
          dosage_form: string | null
          expiration_date: string | null
          generic_name: string | null
          id: string
          location: string | null
          lot_number: string | null
          manufacturer: string | null
          medication_name: string
          ndc_code: string | null
          quantity: number
          reorder_level: number | null
          strength: string | null
          unit: string | null
          updated_at: string
        }
        Insert: {
          controlled_substance?: boolean | null
          controlled_substance_schedule?: string | null
          created_at?: string
          dosage_form?: string | null
          expiration_date?: string | null
          generic_name?: string | null
          id?: string
          location?: string | null
          lot_number?: string | null
          manufacturer?: string | null
          medication_name: string
          ndc_code?: string | null
          quantity: number
          reorder_level?: number | null
          strength?: string | null
          unit?: string | null
          updated_at?: string
        }
        Update: {
          controlled_substance?: boolean | null
          controlled_substance_schedule?: string | null
          created_at?: string
          dosage_form?: string | null
          expiration_date?: string | null
          generic_name?: string | null
          id?: string
          location?: string | null
          lot_number?: string | null
          manufacturer?: string | null
          medication_name?: string
          ndc_code?: string | null
          quantity?: number
          reorder_level?: number | null
          strength?: string | null
          unit?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          body: string
          created_at: string | null
          encryption_metadata: Json | null
          id: string
          is_encrypted: boolean | null
          is_read: boolean | null
          read_at: string | null
          recipient_id: string
          sender_id: string
          subject: string | null
          updated_at: string | null
        }
        Insert: {
          body: string
          created_at?: string | null
          encryption_metadata?: Json | null
          id?: string
          is_encrypted?: boolean | null
          is_read?: boolean | null
          read_at?: string | null
          recipient_id: string
          sender_id: string
          subject?: string | null
          updated_at?: string | null
        }
        Update: {
          body?: string
          created_at?: string | null
          encryption_metadata?: Json | null
          id?: string
          is_encrypted?: boolean | null
          is_read?: boolean | null
          read_at?: string | null
          recipient_id?: string
          sender_id?: string
          subject?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      migration_status: {
        Row: {
          id: string
          migration_completed: boolean | null
          migration_date: string | null
          notes: string | null
          record_count: number | null
          table_name: string
        }
        Insert: {
          id?: string
          migration_completed?: boolean | null
          migration_date?: string | null
          notes?: string | null
          record_count?: number | null
          table_name: string
        }
        Update: {
          id?: string
          migration_completed?: boolean | null
          migration_date?: string | null
          notes?: string | null
          record_count?: number | null
          table_name?: string
        }
        Relationships: []
      }
      observations: {
        Row: {
          body_site: Json | null
          category: Json | null
          code: Json
          component: Json | null
          created_at: string
          data_absent_reason: string | null
          effective_date_time: string
          encounter_id: string | null
          id: string
          interpretation: Json | null
          issued: string
          method: Json | null
          note: Json | null
          performer_id: string | null
          reference_range: Json | null
          status: string
          subject_id: string
          updated_at: string
          value_boolean: boolean | null
          value_codeable_concept: Json | null
          value_date_time: string | null
          value_integer: number | null
          value_period: Json | null
          value_quantity: Json | null
          value_range: Json | null
          value_ratio: Json | null
          value_string: string | null
          value_time: string | null
        }
        Insert: {
          body_site?: Json | null
          category?: Json | null
          code: Json
          component?: Json | null
          created_at?: string
          data_absent_reason?: string | null
          effective_date_time?: string
          encounter_id?: string | null
          id?: string
          interpretation?: Json | null
          issued?: string
          method?: Json | null
          note?: Json | null
          performer_id?: string | null
          reference_range?: Json | null
          status: string
          subject_id: string
          updated_at?: string
          value_boolean?: boolean | null
          value_codeable_concept?: Json | null
          value_date_time?: string | null
          value_integer?: number | null
          value_period?: Json | null
          value_quantity?: Json | null
          value_range?: Json | null
          value_ratio?: Json | null
          value_string?: string | null
          value_time?: string | null
        }
        Update: {
          body_site?: Json | null
          category?: Json | null
          code?: Json
          component?: Json | null
          created_at?: string
          data_absent_reason?: string | null
          effective_date_time?: string
          encounter_id?: string | null
          id?: string
          interpretation?: Json | null
          issued?: string
          method?: Json | null
          note?: Json | null
          performer_id?: string | null
          reference_range?: Json | null
          status?: string
          subject_id?: string
          updated_at?: string
          value_boolean?: boolean | null
          value_codeable_concept?: Json | null
          value_date_time?: string | null
          value_integer?: number | null
          value_period?: Json | null
          value_quantity?: Json | null
          value_range?: Json | null
          value_ratio?: Json | null
          value_string?: string | null
          value_time?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "observations_performer_id_fkey"
            columns: ["performer_id"]
            isOneToOne: false
            referencedRelation: "practitioners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "observations_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "patient_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "observations_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          active: boolean | null
          address: Json | null
          alias: Json | null
          contact: Json | null
          created_at: string | null
          endpoint: Json | null
          id: string
          identifier: Json | null
          name: string
          part_of_id: string | null
          telecom: Json | null
          type: Json | null
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          address?: Json | null
          alias?: Json | null
          contact?: Json | null
          created_at?: string | null
          endpoint?: Json | null
          id?: string
          identifier?: Json | null
          name: string
          part_of_id?: string | null
          telecom?: Json | null
          type?: Json | null
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          address?: Json | null
          alias?: Json | null
          contact?: Json | null
          created_at?: string | null
          endpoint?: Json | null
          id?: string
          identifier?: Json | null
          name?: string
          part_of_id?: string | null
          telecom?: Json | null
          type?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      patient_consents: {
        Row: {
          consent_type: string
          created_at: string | null
          document_reference: string | null
          end_date: string | null
          id: string
          patient_id: string
          scope: string[] | null
          start_date: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          consent_type: string
          created_at?: string | null
          document_reference?: string | null
          end_date?: string | null
          id?: string
          patient_id: string
          scope?: string[] | null
          start_date?: string | null
          status: string
          updated_at?: string | null
        }
        Update: {
          consent_type?: string
          created_at?: string | null
          document_reference?: string | null
          end_date?: string | null
          id?: string
          patient_id?: string
          scope?: string[] | null
          start_date?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_consents_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patient_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_consents_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_documents: {
        Row: {
          created_at: string
          description: string | null
          document_date: string | null
          document_type: string
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id: string
          patient_id: string
          tags: Json | null
          title: string
          updated_at: string
          upload_date: string
          uploaded_by: string | null
          uploader_name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          document_date?: string | null
          document_type: string
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id?: string
          patient_id: string
          tags?: Json | null
          title: string
          updated_at?: string
          upload_date?: string
          uploaded_by?: string | null
          uploader_name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          document_date?: string | null
          document_type?: string
          file_name?: string
          file_path?: string
          file_size?: number
          file_type?: string
          id?: string
          patient_id?: string
          tags?: Json | null
          title?: string
          updated_at?: string
          upload_date?: string
          uploaded_by?: string | null
          uploader_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "patient_documents_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patient_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_documents_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_sectors: {
        Row: {
          admission_date: string
          created_at: string
          discharge_date: string | null
          id: string
          is_active: boolean
          patient_id: string
          sector_id: string
          updated_at: string
        }
        Insert: {
          admission_date?: string
          created_at?: string
          discharge_date?: string | null
          id?: string
          is_active?: boolean
          patient_id: string
          sector_id: string
          updated_at?: string
        }
        Update: {
          admission_date?: string
          created_at?: string
          discharge_date?: string | null
          id?: string
          is_active?: boolean
          patient_id?: string
          sector_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "patient_sectors_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patient_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_sectors_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_sectors_sector_id_fkey"
            columns: ["sector_id"]
            isOneToOne: false
            referencedRelation: "hospital_sectors"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          address: string | null
          blood_type: string | null
          city: string | null
          created_at: string
          date_of_birth: string
          email: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          first_name: string
          gender: string | null
          id: string
          identifiers: Json | null
          last_name: string
          mrn: string
          phone: string | null
          room_number: string | null
          state: string | null
          status: string | null
          updated_at: string
          user_id: string | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          blood_type?: string | null
          city?: string | null
          created_at?: string
          date_of_birth: string
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          first_name: string
          gender?: string | null
          id?: string
          identifiers?: Json | null
          last_name: string
          mrn: string
          phone?: string | null
          room_number?: string | null
          state?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          blood_type?: string | null
          city?: string | null
          created_at?: string
          date_of_birth?: string
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          first_name?: string
          gender?: string | null
          id?: string
          identifiers?: Json | null
          last_name?: string
          mrn?: string
          phone?: string | null
          room_number?: string | null
          state?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      practitioners: {
        Row: {
          active: boolean | null
          address: Json | null
          birth_date: string | null
          communication: Json | null
          created_at: string
          gender: string | null
          id: string
          identifier: Json | null
          name: Json
          photo: string | null
          qualification: Json | null
          telecom: Json | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          active?: boolean | null
          address?: Json | null
          birth_date?: string | null
          communication?: Json | null
          created_at?: string
          gender?: string | null
          id?: string
          identifier?: Json | null
          name: Json
          photo?: string | null
          qualification?: Json | null
          telecom?: Json | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          active?: boolean | null
          address?: Json | null
          birth_date?: string | null
          communication?: Json | null
          created_at?: string
          gender?: string | null
          id?: string
          identifier?: Json | null
          name?: Json
          photo?: string | null
          qualification?: Json | null
          telecom?: Json | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      prescription_items: {
        Row: {
          created_at: string
          details: string | null
          dosage: string | null
          duration: string | null
          end_date: string | null
          frequency: string | null
          id: string
          instructions: string | null
          name: string
          prescription_id: string
          start_date: string | null
          status: string
          type: string
        }
        Insert: {
          created_at?: string
          details?: string | null
          dosage?: string | null
          duration?: string | null
          end_date?: string | null
          frequency?: string | null
          id?: string
          instructions?: string | null
          name: string
          prescription_id: string
          start_date?: string | null
          status: string
          type: string
        }
        Update: {
          created_at?: string
          details?: string | null
          dosage?: string | null
          duration?: string | null
          end_date?: string | null
          frequency?: string | null
          id?: string
          instructions?: string | null
          name?: string
          prescription_id?: string
          start_date?: string | null
          status?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "prescription_items_prescription_id_fkey"
            columns: ["prescription_id"]
            isOneToOne: false
            referencedRelation: "prescriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      prescriptions: {
        Row: {
          created_at: string
          date: string
          doctor_id: string
          id: string
          notes: string | null
          patient_id: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          date?: string
          doctor_id: string
          id?: string
          notes?: string | null
          patient_id: string
          status: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          date?: string
          doctor_id?: string
          id?: string
          notes?: string | null
          patient_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      procedures: {
        Row: {
          based_on: Json | null
          body_site: Json | null
          category: Json | null
          code: Json
          complication: Json | null
          complication_detail: Json | null
          created_at: string | null
          encounter_id: string | null
          follow_up: Json | null
          id: string
          identifier: Json | null
          instantiates_canonical: Json | null
          instantiates_uri: Json | null
          location: Json | null
          note: Json | null
          outcome: Json | null
          part_of: Json | null
          performed_datetime: string | null
          performed_period_end: string | null
          performed_period_start: string | null
          performer: Json | null
          reason_code: Json | null
          reason_reference: Json | null
          report: Json | null
          status: string
          status_reason: Json | null
          subject_id: string
          updated_at: string | null
          used_code: Json | null
          used_reference: Json | null
        }
        Insert: {
          based_on?: Json | null
          body_site?: Json | null
          category?: Json | null
          code: Json
          complication?: Json | null
          complication_detail?: Json | null
          created_at?: string | null
          encounter_id?: string | null
          follow_up?: Json | null
          id?: string
          identifier?: Json | null
          instantiates_canonical?: Json | null
          instantiates_uri?: Json | null
          location?: Json | null
          note?: Json | null
          outcome?: Json | null
          part_of?: Json | null
          performed_datetime?: string | null
          performed_period_end?: string | null
          performed_period_start?: string | null
          performer?: Json | null
          reason_code?: Json | null
          reason_reference?: Json | null
          report?: Json | null
          status: string
          status_reason?: Json | null
          subject_id: string
          updated_at?: string | null
          used_code?: Json | null
          used_reference?: Json | null
        }
        Update: {
          based_on?: Json | null
          body_site?: Json | null
          category?: Json | null
          code?: Json
          complication?: Json | null
          complication_detail?: Json | null
          created_at?: string | null
          encounter_id?: string | null
          follow_up?: Json | null
          id?: string
          identifier?: Json | null
          instantiates_canonical?: Json | null
          instantiates_uri?: Json | null
          location?: Json | null
          note?: Json | null
          outcome?: Json | null
          part_of?: Json | null
          performed_datetime?: string | null
          performed_period_end?: string | null
          performed_period_start?: string | null
          performer?: Json | null
          reason_code?: Json | null
          reason_reference?: Json | null
          report?: Json | null
          status?: string
          status_reason?: Json | null
          subject_id?: string
          updated_at?: string | null
          used_code?: Json | null
          used_reference?: Json | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          approval_status: string | null
          bio: string | null
          created_at: string
          department: string | null
          email: string | null
          id: string
          mfa_enabled: boolean | null
          name: string | null
          phone: string | null
          role: string
          updated_at: string
        }
        Insert: {
          approval_status?: string | null
          bio?: string | null
          created_at?: string
          department?: string | null
          email?: string | null
          id: string
          mfa_enabled?: boolean | null
          name?: string | null
          phone?: string | null
          role: string
          updated_at?: string
        }
        Update: {
          approval_status?: string | null
          bio?: string | null
          created_at?: string
          department?: string | null
          email?: string | null
          id?: string
          mfa_enabled?: boolean | null
          name?: string | null
          phone?: string | null
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      provider_patient_assignments: {
        Row: {
          assignment_date: string
          created_at: string
          end_date: string | null
          id: string
          is_active: boolean
          patient_id: string
          provider_id: string
          sector_id: string
          updated_at: string
        }
        Insert: {
          assignment_date?: string
          created_at?: string
          end_date?: string | null
          id?: string
          is_active?: boolean
          patient_id: string
          provider_id: string
          sector_id: string
          updated_at?: string
        }
        Update: {
          assignment_date?: string
          created_at?: string
          end_date?: string | null
          id?: string
          is_active?: boolean
          patient_id?: string
          provider_id?: string
          sector_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "provider_patient_assignments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patient_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "provider_patient_assignments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "provider_patient_assignments_sector_id_fkey"
            columns: ["sector_id"]
            isOneToOne: false
            referencedRelation: "hospital_sectors"
            referencedColumns: ["id"]
          },
        ]
      }
      query_performance_logs: {
        Row: {
          created_at: string | null
          execution_time: number
          id: string
          query_plan: Json | null
          query_text: string
          resource_type: string | null
          rows_returned: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          execution_time: number
          id?: string
          query_plan?: Json | null
          query_text: string
          resource_type?: string | null
          rows_returned?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          execution_time?: number
          id?: string
          query_plan?: Json | null
          query_text?: string
          resource_type?: string | null
          rows_returned?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      rxnorm_anvisa_mappings: {
        Row: {
          anvisa_code: string
          comments: string | null
          id: string
          is_verified: boolean
          mapping_date: string
          medication_name: string
          rxnorm_code: string
          verified_by: string | null
        }
        Insert: {
          anvisa_code: string
          comments?: string | null
          id?: string
          is_verified?: boolean
          mapping_date?: string
          medication_name: string
          rxnorm_code: string
          verified_by?: string | null
        }
        Update: {
          anvisa_code?: string
          comments?: string | null
          id?: string
          is_verified?: boolean
          mapping_date?: string
          medication_name?: string
          rxnorm_code?: string
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rxnorm_anvisa_mappings_rxnorm_code_fkey"
            columns: ["rxnorm_code"]
            isOneToOne: false
            referencedRelation: "rxnorm_items"
            referencedColumns: ["rxcui"]
          },
        ]
      }
      rxnorm_details_cache: {
        Row: {
          created_at: string
          details: Json
          id: string
          rxcui: string
        }
        Insert: {
          created_at?: string
          details: Json
          id?: string
          rxcui: string
        }
        Update: {
          created_at?: string
          details?: Json
          id?: string
          rxcui?: string
        }
        Relationships: [
          {
            foreignKeyName: "rxnorm_details_cache_rxcui_fkey"
            columns: ["rxcui"]
            isOneToOne: true
            referencedRelation: "rxnorm_items"
            referencedColumns: ["rxcui"]
          },
        ]
      }
      rxnorm_displayterms_cache: {
        Row: {
          created_at: string
          id: string
          search_term: string
          terms: Json
        }
        Insert: {
          created_at?: string
          id?: string
          search_term: string
          terms: Json
        }
        Update: {
          created_at?: string
          id?: string
          search_term?: string
          terms?: Json
        }
        Relationships: []
      }
      rxnorm_interactions_cache: {
        Row: {
          created_at: string
          id: string
          interaction_key: string
          interactions: Json
          rxcuis: string[]
        }
        Insert: {
          created_at?: string
          id?: string
          interaction_key: string
          interactions: Json
          rxcuis: string[]
        }
        Update: {
          created_at?: string
          id?: string
          interaction_key?: string
          interactions?: Json
          rxcuis?: string[]
        }
        Relationships: []
      }
      rxnorm_items: {
        Row: {
          active: boolean
          last_updated: string
          name: string
          rxcui: string
          term_type: string
        }
        Insert: {
          active?: boolean
          last_updated?: string
          name: string
          rxcui: string
          term_type?: string
        }
        Update: {
          active?: boolean
          last_updated?: string
          name?: string
          rxcui?: string
          term_type?: string
        }
        Relationships: []
      }
      rxnorm_ndc_cache: {
        Row: {
          created_at: string
          id: string
          ndcs: Json
          rxcui: string
        }
        Insert: {
          created_at?: string
          id?: string
          ndcs: Json
          rxcui: string
        }
        Update: {
          created_at?: string
          id?: string
          ndcs?: Json
          rxcui?: string
        }
        Relationships: []
      }
      rxnorm_portuguese_mappings: {
        Row: {
          anvisa_code: string | null
          comments: string | null
          created_at: string
          created_by: string | null
          english_name: string
          id: string
          is_verified: boolean
          last_updated: string
          portuguese_name: string
          rxnorm_code: string
        }
        Insert: {
          anvisa_code?: string | null
          comments?: string | null
          created_at?: string
          created_by?: string | null
          english_name: string
          id?: string
          is_verified?: boolean
          last_updated?: string
          portuguese_name: string
          rxnorm_code: string
        }
        Update: {
          anvisa_code?: string | null
          comments?: string | null
          created_at?: string
          created_by?: string | null
          english_name?: string
          id?: string
          is_verified?: boolean
          last_updated?: string
          portuguese_name?: string
          rxnorm_code?: string
        }
        Relationships: []
      }
      rxnorm_search_cache: {
        Row: {
          created_at: string
          id: string
          results: Json
          search_term: string
          search_type: string
        }
        Insert: {
          created_at?: string
          id?: string
          results: Json
          search_term: string
          search_type: string
        }
        Update: {
          created_at?: string
          id?: string
          results?: Json
          search_term?: string
          search_type?: string
        }
        Relationships: []
      }
      rxnorm_sync_log: {
        Row: {
          errors: string[] | null
          id: string
          items_synced: number
          sync_date: string
          sync_type: string
        }
        Insert: {
          errors?: string[] | null
          id?: string
          items_synced?: number
          sync_date?: string
          sync_type: string
        }
        Update: {
          errors?: string[] | null
          id?: string
          items_synced?: number
          sync_date?: string
          sync_type?: string
        }
        Relationships: []
      }
      security_alerts: {
        Row: {
          alert_type: string
          created_at: string
          details: Json | null
          id: string
          ip_address: string | null
          is_resolved: boolean | null
          message: string
          resolved_at: string | null
          resolved_by: string | null
          severity: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          alert_type: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          is_resolved?: boolean | null
          message: string
          resolved_at?: string | null
          resolved_by?: string | null
          severity: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          alert_type?: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          is_resolved?: boolean | null
          message?: string
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      telehealth_sessions: {
        Row: {
          actual_start: string | null
          appointment_id: string | null
          created_at: string | null
          duration_minutes: number | null
          end_time: string | null
          id: string
          patient_id: string
          provider_id: string
          recording_available: boolean | null
          recording_url: string | null
          scheduled_start: string
          session_key: string | null
          session_token: string | null
          session_url: string | null
          status: string
          technical_issues: string | null
          updated_at: string | null
        }
        Insert: {
          actual_start?: string | null
          appointment_id?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          end_time?: string | null
          id?: string
          patient_id: string
          provider_id: string
          recording_available?: boolean | null
          recording_url?: string | null
          scheduled_start: string
          session_key?: string | null
          session_token?: string | null
          session_url?: string | null
          status: string
          technical_issues?: string | null
          updated_at?: string | null
        }
        Update: {
          actual_start?: string | null
          appointment_id?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          end_time?: string | null
          id?: string
          patient_id?: string
          provider_id?: string
          recording_available?: boolean | null
          recording_url?: string | null
          scheduled_start?: string
          session_key?: string | null
          session_token?: string | null
          session_url?: string | null
          status?: string
          technical_issues?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "telehealth_sessions_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
        ]
      }
      user_sector_access: {
        Row: {
          access_level: string
          created_at: string
          id: string
          sector_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          access_level?: string
          created_at?: string
          id?: string
          sector_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          access_level?: string
          created_at?: string
          id?: string
          sector_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_sector_access_sector_id_fkey"
            columns: ["sector_id"]
            isOneToOne: false
            referencedRelation: "hospital_sectors"
            referencedColumns: ["id"]
          },
        ]
      }
      vital_signs: {
        Row: {
          created_at: string
          diastolic_bp: number | null
          heart_rate: number | null
          id: string
          notes: string | null
          oxygen_saturation: number | null
          pain_level: number | null
          patient_id: string
          recorded_by: string | null
          recorder_name: string
          respiratory_rate: number | null
          systolic_bp: number | null
          temperature: number | null
          temperature_unit: string | null
          timestamp: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          diastolic_bp?: number | null
          heart_rate?: number | null
          id?: string
          notes?: string | null
          oxygen_saturation?: number | null
          pain_level?: number | null
          patient_id: string
          recorded_by?: string | null
          recorder_name: string
          respiratory_rate?: number | null
          systolic_bp?: number | null
          temperature?: number | null
          temperature_unit?: string | null
          timestamp?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          diastolic_bp?: number | null
          heart_rate?: number | null
          id?: string
          notes?: string | null
          oxygen_saturation?: number | null
          pain_level?: number | null
          patient_id?: string
          recorded_by?: string | null
          recorder_name?: string
          respiratory_rate?: number | null
          systolic_bp?: number | null
          temperature?: number | null
          temperature_unit?: string | null
          timestamp?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "vital_signs_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patient_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vital_signs_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      patient_latest_vitals: {
        Row: {
          diastolic_bp: number | null
          heart_rate: number | null
          oxygen_saturation: number | null
          pain_level: number | null
          patient_id: string | null
          respiratory_rate: number | null
          systolic_bp: number | null
          temperature: number | null
          timestamp: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vital_signs_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patient_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vital_signs_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_summary: {
        Row: {
          active_medication_count: number | null
          allergy_count: number | null
          condition_count: number | null
          current_sector_id: string | null
          current_sector_name: string | null
          date_of_birth: string | null
          first_name: string | null
          gender: string | null
          id: string | null
          last_name: string | null
          mrn: string | null
          status: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      apply_data_retention_policies: {
        Args: Record<PropertyKey, never>
        Returns: {
          table_name: string
          rows_deleted: number
        }[]
      }
      check_connection: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      check_database_connection: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      check_fhir_resource_exists: {
        Args: {
          resource_type: string
          resource_id: string
        }
        Returns: boolean
      }
      check_table_exists: {
        Args: {
          table_name: string
        }
        Returns: boolean
      }
      clean_rxnorm_cache: {
        Args: {
          retention_days?: number
        }
        Returns: {
          table_name: string
          rows_deleted: number
        }[]
      }
      detect_duplicate_indexes: {
        Args: Record<PropertyKey, never>
        Returns: {
          table_schema: string
          table_name: string
          duplicate_indexes: Json
          recommendation: string
        }[]
      }
      detect_duplicate_rls_policies: {
        Args: Record<PropertyKey, never>
        Returns: {
          table_schema: string
          table_name: string
          operation: string
          role_name: string
          policy_count: number
          policy_names: string[]
          recommendation: string
        }[]
      }
      get_auth_uid: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_auth_user_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_auth_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_fhir_resource_by_reference: {
        Args: {
          reference: string
        }
        Returns: Json
      }
      get_frequently_prescribed_medications: {
        Args: {
          limit_count?: number
        }
        Returns: {
          medication_name: string
          rxnorm_code: string
          prescription_count: number
        }[]
      }
      get_latest_vitals: {
        Args: {
          p_patient_id: string
        }
        Returns: {
          id: string
          patient_id: string
          measurement_time: string
          temperature: number
          heart_rate: number
          respiratory_rate: number
          systolic_bp: number
          diastolic_bp: number
          oxygen_saturation: number
          pain_level: number
        }[]
      }
      get_patient_medication_history: {
        Args: {
          patient_id_param: string
        }
        Returns: {
          rxcui: string
          medication_name: string
          start_date: string
          end_date: string
          status: string
        }[]
      }
      get_rxnorm_displayterms_cache: {
        Args: {
          term_param: string
        }
        Returns: {
          id: string
          search_term: string
          terms: Json
          created_at: string
        }[]
      }
      get_rxnorm_interactions_cache: {
        Args: {
          key_param: string
        }
        Returns: {
          id: string
          interaction_key: string
          rxcuis: string[]
          interactions: Json
          created_at: string
        }[]
      }
      get_rxnorm_ndc_cache: {
        Args: {
          rxcui_param: string
        }
        Returns: {
          id: string
          rxcui: string
          ndcs: Json
          created_at: string
        }[]
      }
      get_sector_patients: {
        Args: {
          p_sector_id: string
        }
        Returns: {
          id: string
          first_name: string
          last_name: string
          date_of_birth: string
          gender: string
          mrn: string
          status: string
          is_assigned: boolean
        }[]
      }
      get_upcoming_appointments: {
        Args: {
          p_user_id: string
          p_is_provider?: boolean
          p_days_forward?: number
        }
        Returns: {
          id: string
          patient_id: string
          patient_name: string
          provider_id: string
          provider_name: string
          date: string
          time: string
          title: string
          duration: number
          status: string
          type: string
          location: string
        }[]
      }
      get_user_role: {
        Args: {
          user_id: string
        }
        Returns: string
      }
      get_user_role_cached: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_sectors: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          name: string
          code: string
          description: string
          is_active: boolean
        }[]
      }
      gtrgm_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_decompress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_options: {
        Args: {
          "": unknown
        }
        Returns: undefined
      }
      gtrgm_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      insert_rxnorm_displayterms_cache: {
        Args: {
          term_param: string
          terms_param: Json
        }
        Returns: string
      }
      insert_rxnorm_interactions_cache: {
        Args: {
          key_param: string
          rxcuis_param: string[]
          interactions_param: Json
        }
        Returns: string
      }
      insert_rxnorm_ndc_cache: {
        Args: {
          rxcui_param: string
          ndcs_param: Json
        }
        Returns: string
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_authenticated: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      maintain_database_performance: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      migrate_to_fhir_model: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      monitor_index_usage: {
        Args: Record<PropertyKey, never>
        Returns: {
          schema_name: string
          table_name: string
          index_name: string
          index_size: string
          index_scans: number
        }[]
      }
      policy_exists: {
        Args: {
          p_table_name: string
          p_policy_name: string
        }
        Returns: boolean
      }
      refresh_materialized_view: {
        Args: {
          view_name: string
        }
        Returns: undefined
      }
      run_database_health_check: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      safe_cast_uuid: {
        Args: {
          p_text: string
        }
        Returns: string
      }
      set_limit: {
        Args: {
          "": number
        }
        Returns: number
      }
      show_limit: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      show_trgm: {
        Args: {
          "": string
        }
        Returns: string[]
      }
      update_expired_prescriptions: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      user_has_permission:
        | {
            Args: {
              p_user_id: string
              p_permission_code: string
            }
            Returns: boolean
          }
        | {
            Args: {
              permission: string
              resource_type?: string
            }
            Returns: boolean
          }
      user_has_role: {
        Args: {
          requested_role: string
        }
        Returns: boolean
      }
      user_is_healthcare_provider: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      user_is_medical_staff: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      user_is_practitioner: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      validate_fhir_resource: {
        Args: {
          resource_type: string
          resource_data: Json
        }
        Returns: {
          is_valid: boolean
          validation_errors: string[]
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
