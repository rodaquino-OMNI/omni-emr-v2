
/**
 * Utility functions to extract data from FHIR resources
 */

/**
 * Extract a text value from a FHIR CodeableConcept
 */
export function extractTextFromCodeableConcept(concept: any, fallback: string = ''): string {
  if (!concept) return fallback;
  
  // If concept has a direct text property
  if (typeof concept === 'object' && 'text' in concept && concept.text) {
    return String(concept.text);
  }
  
  // Try to extract from coding array
  if (typeof concept === 'object' && 'coding' in concept && Array.isArray(concept.coding) && concept.coding.length > 0) {
    // First try display property
    if ('display' in concept.coding[0] && concept.coding[0].display) {
      return String(concept.coding[0].display);
    }
    
    // Fallback to code property
    if ('code' in concept.coding[0] && concept.coding[0].code) {
      return String(concept.coding[0].code);
    }
  }
  
  return fallback;
}

/**
 * Extract a value from a FHIR Quantity
 */
export function extractValueFromQuantity(quantity: any, includeUnits: boolean = true): string {
  if (!quantity || typeof quantity !== 'object') return '';
  
  const value = 'value' in quantity ? quantity.value : '';
  if (!includeUnits) return String(value);
  
  const unit = 'unit' in quantity ? quantity.unit : '';
  return `${value} ${unit}`.trim();
}

/**
 * Extract a note from a FHIR resource
 */
export function extractNoteFromResource(resource: any): string {
  if (!resource || !resource.note) return '';
  
  // Notes are typically arrays of objects with text properties
  if (Array.isArray(resource.note) && resource.note.length > 0) {
    if (typeof resource.note[0] === 'object' && 'text' in resource.note[0]) {
      return String(resource.note[0].text);
    }
  }
  
  return '';
}

/**
 * Extract a practitioner name from a FHIR Practitioner resource
 */
export function extractPractitionerName(practitioner: any): string {
  if (!practitioner) return 'Unknown';
  
  // Handle FHIR HumanName structure
  if (practitioner.name) {
    const nameObj = Array.isArray(practitioner.name) ? practitioner.name[0] : practitioner.name;
    
    if (typeof nameObj === 'object') {
      // Extract given names (typically an array)
      const given = Array.isArray(nameObj.given) 
        ? nameObj.given.join(' ') 
        : (nameObj.given || '');
      
      // Extract family name
      const family = nameObj.family || '';
      
      if (given || family) {
        return `${given} ${family}`.trim();
      }
    }
  }
  
  // Fallback for non-FHIR format
  return practitioner.name || 'Unknown';
}

/**
 * Extract a date from a FHIR resource and format it
 */
export function extractDateFromResource(resource: any, path: string, formatFn?: (date: Date) => string): string {
  if (!resource) return '';
  
  // Navigate the path to get the date value
  const keys = path.split('.');
  let value = resource;
  
  for (const key of keys) {
    if (!value || typeof value !== 'object') return '';
    value = value[key];
  }
  
  if (!value) return '';
  
  // Convert to date and format
  try {
    const date = new Date(value);
    if (isNaN(date.getTime())) return '';
    
    if (formatFn) {
      return formatFn(date);
    }
    
    // Default formatting
    return date.toLocaleDateString();
  } catch (e) {
    return '';
  }
}

/**
 * Extract clinical status from a FHIR resource
 */
export function extractClinicalStatus(resource: any): string {
  if (!resource || !resource.clinical_status) return 'unknown';
  
  const status = resource.clinical_status;
  
  if (typeof status === 'string') return status;
  
  if (typeof status === 'object' && 'coding' in status && 
      Array.isArray(status.coding) && status.coding.length > 0) {
    return status.coding[0].code || status.coding[0].display || 'unknown';
  }
  
  return 'unknown';
}

/**
 * Extract a patient name from a FHIR Patient resource
 */
export function extractPatientName(patient: any): string {
  // Handle legacy format
  if (patient.first_name || patient.last_name) {
    return `${patient.first_name || ''} ${patient.last_name || ''}`.trim();
  }
  
  // Handle FHIR format
  if (patient.name) {
    const nameObj = Array.isArray(patient.name) ? patient.name[0] : patient.name;
    
    if (typeof nameObj === 'object') {
      const given = Array.isArray(nameObj.given) 
        ? nameObj.given.join(' ') 
        : (nameObj.given || '');
      
      const family = nameObj.family || '';
      
      if (given || family) {
        return `${given} ${family}`.trim();
      }
    }
  }
  
  return 'Unknown Patient';
}
