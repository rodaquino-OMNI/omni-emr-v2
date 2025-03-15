
import { NoteTemplate, NoteType } from "@/types/clinicalNotes";

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
   * Get all templates available by type
   */
  getTemplatesByType: (type?: NoteType): Promise<NoteTemplate[]> => {
    return new Promise((resolve) => {
      // Simulate API delay
      setTimeout(() => {
        if (type) {
          // Return only templates of the specified type
          resolve([defaultTemplates[type]]);
        } else {
          // Return all templates
          resolve(Object.values(defaultTemplates));
        }
      }, 300);
    });
  },

  /**
   * Get a specific template by ID
   */
  getTemplateById: (id: string): Promise<NoteTemplate | null> => {
    return new Promise((resolve) => {
      // Simulate API delay
      setTimeout(() => {
        const allTemplates = Object.values(defaultTemplates);
        const template = allTemplates.find(t => t.id === id);
        resolve(template || null);
      }, 200);
    });
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
