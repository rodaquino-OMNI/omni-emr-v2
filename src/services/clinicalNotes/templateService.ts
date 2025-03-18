import { NoteTemplate, NoteType } from "@/types/clinicalNotes";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

// Default templates for different note types
const defaultTemplates: Record<NoteType, NoteTemplate> = {
  progress: {
    id: "default-progress",
    type: "progress",
    name: "SOAP Progress Note",
    isDefault: true,
    template: "",
    sections: [
      { title: "Subjective", content: "", required: true },
      { title: "Objective", content: "", required: true },
      { title: "Assessment", content: "", required: true },
      { title: "Plan", content: "", required: true }
    ]
  },
  admission: {
    id: "default-admission",
    type: "admission",
    name: "Hospital Admission Note",
    isDefault: true,
    template: "",
    sections: [
      { title: "Chief Complaint", content: "", required: true },
      { title: "History of Present Illness", content: "", required: true },
      { title: "Past Medical History", content: "", required: false },
      { title: "Medications", content: "", required: true },
      { title: "Allergies", content: "", required: true },
      { title: "Review of Systems", content: "", required: false },
      { title: "Physical Examination", content: "", required: true },
      { title: "Assessment", content: "", required: true },
      { title: "Plan", content: "", required: true }
    ]
  },
  consultation: {
    id: "default-consultation",
    type: "consultation",
    name: "Specialist Consultation",
    isDefault: true,
    template: "",
    sections: [
      { title: "Reason for Consultation", content: "", required: true },
      { title: "History", content: "", required: false },
      { title: "Examination", content: "", required: true },
      { title: "Impression", content: "", required: true },
      { title: "Recommendations", content: "", required: true }
    ]
  },
  procedure: {
    id: "default-procedure",
    type: "procedure",
    name: "Procedure Note",
    isDefault: true,
    template: "",
    sections: [
      { title: "Procedure Performed", content: "", required: true },
      { title: "Indication", content: "", required: true },
      { title: "Procedure Description", content: "", required: true },
      { title: "Findings", content: "", required: true },
      { title: "Complications", content: "", required: false },
      { title: "Post-procedure Plan", content: "", required: true }
    ]
  },
  discharge: {
    id: "default-discharge",
    type: "discharge",
    name: "Discharge Summary",
    isDefault: true,
    template: "",
    sections: [
      { title: "Admission Date", content: "", required: true },
      { title: "Discharge Date", content: "", required: true },
      { title: "Admission Diagnosis", content: "", required: true },
      { title: "Discharge Diagnosis", content: "", required: true },
      { title: "Hospital Course", content: "", required: true },
      { title: "Medications at Discharge", content: "", required: true },
      { title: "Follow-up Instructions", content: "", required: true }
    ]
  }
};

// Template service to manage clinical note templates
export const templateService = {
  /**
   * Get all templates available by type and user role
   */
  getTemplatesByType: async (type?: NoteType, userRole?: string): Promise<NoteTemplate[]> => {
    try {
      // Try to fetch templates from Supabase if available
      const { data, error } = await supabase
        .from('clinical_note_templates')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching templates:", error);
        throw error;
      }

      // If we have templates in the database, filter and return them
      if (data && data.length > 0) {
        let templates = data.map(item => ({
          id: item.id,
          type: item.note_type as NoteType,
          name: item.template_name,
          isDefault: item.is_default,
          template: item.template_content || "",
          sections: item.sections || []
        }));

        // Filter by type if provided
        if (type) {
          templates = templates.filter(t => t.type === type);
        }

        // Filter by role if provided
        if (userRole) {
          templates = templates.filter(t => 
            !t.roles || (t.roles && t.roles.includes(userRole))
          );
        }

        return templates;
      }

      // Fallback to default templates if no database templates found
      if (type) {
        // Return only templates of the specified type
        return [defaultTemplates[type]];
      } else {
        // Return all templates
        return Object.values(defaultTemplates);
      }
    } catch (error) {
      console.error("Error in getTemplatesByType:", error);
      
      // Fallback to default templates on error
      if (type) {
        return [defaultTemplates[type]];
      } else {
        return Object.values(defaultTemplates);
      }
    }
  },

  /**
   * Get a specific template by ID
   */
  getTemplateById: async (id: string): Promise<NoteTemplate | null> => {
    try {
      // Try to fetch template from Supabase
      const { data, error } = await supabase
        .from('clinical_note_templates')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error("Error fetching template by ID:", error);
        throw error;
      }

      // If found in the database, return it
      if (data) {
        return {
          id: data.id,
          type: data.note_type as NoteType,
          name: data.template_name,
          isDefault: data.is_default,
          template: data.template_content || "",
          sections: data.sections || []
        };
      }

      // Fallback to checking default templates
      const allTemplates = Object.values(defaultTemplates);
      const template = allTemplates.find(t => t.id === id);
      return template || null;
    } catch (error) {
      console.error("Error in getTemplateById:", error);
      
      // Fallback to check in default templates
      const allTemplates = Object.values(defaultTemplates);
      const template = allTemplates.find(t => t.id === id);
      return template || null;
    }
  },

  /**
   * Save a new template or update an existing one
   */
  saveTemplate: async (template: NoteTemplate): Promise<NoteTemplate | null> => {
    try {
      const { data, error } = await supabase
        .from('clinical_note_templates')
        .upsert({
          id: template.id,
          note_type: template.type,
          template_name: template.name,
          template_content: template.template,
          is_default: template.isDefault,
          sections: template.sections
        })
        .select()
        .single();

      if (error) {
        console.error("Error saving template:", error);
        throw error;
      }

      return {
        id: data.id,
        type: data.note_type as NoteType,
        name: data.template_name,
        isDefault: data.is_default,
        template: data.template_content || "",
        sections: data.sections || []
      };
    } catch (error) {
      console.error("Error in saveTemplate:", error);
      return null;
    }
  },

  /**
   * Get templates appropriate for a user's role
   */
  getRoleSpecificTemplates: async (userRole: string): Promise<NoteTemplate[]> => {
    try {
      // Try to fetch role-specific templates from Supabase
      const { data, error } = await supabase
        .from('clinical_note_templates')
        .select('*')
        .eq('is_active', true)
        .contains('allowed_roles', [userRole])
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching role-specific templates:", error);
        throw error;
      }

      if (data && data.length > 0) {
        return data.map(item => ({
          id: item.id,
          type: item.note_type as NoteType,
          name: item.template_name,
          isDefault: item.is_default,
          template: item.template_content || "",
          sections: item.sections || []
        }));
      }

      // Fallback to default templates based on role
      switch (userRole) {
        case 'doctor':
        case 'physician':
          return [
            defaultTemplates.progress,
            defaultTemplates.admission,
            defaultTemplates.discharge,
            defaultTemplates.procedure
          ];
        case 'nurse':
          return [
            defaultTemplates.progress
          ];
        default:
          return Object.values(defaultTemplates);
      }
    } catch (error) {
      console.error("Error in getRoleSpecificTemplates:", error);
      return Object.values(defaultTemplates);
    }
  },

  /**
   * Validate if a note contains all required sections
   */
  validateRequiredSections: (template: NoteTemplate, sections: { [key: string]: string }): string[] => {
    const missingFields: string[] = [];
    
    template.sections.forEach(section => {
      if (section.required && (!sections[section.title] || sections[section.title].trim() === '')) {
        missingFields.push(section.title);
      }
    });
    
    return missingFields;
  }
};
