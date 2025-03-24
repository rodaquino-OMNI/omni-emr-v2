/**
 * Functional Analyzer for Orphaned Pages
 * 
 * This module provides functions for analyzing the functional uniqueness of React components.
 */

/**
 * Analyze the functional uniqueness of a component
 * @param {string} pageName - Name of the page component
 * @param {string} content - Component file content
 * @param {Object} existingAnalysis - Existing analysis data if available
 * @returns {Object} - Analysis results
 */
export function analyzeFunctionalUniqueness(pageName, content, existingAnalysis) {
  if (!content) return { uniqueness: 'Unknown', overlap: ['Could not read file content'] };

  // Get existing analysis if available
  const existingPageAnalysis = existingAnalysis?.categories ? 
    Object.values(existingAnalysis.categories)
      .flatMap(category => category.pages)
      .find(page => page.name === pageName) : null;

  // Extract component imports to understand dependencies
  const importMatches = content.match(/import\s+{([^}]+)}\s+from\s+['"][^'"]+['"]/g) || [];
  const imports = importMatches.flatMap(match => {
    const components = match.match(/import\s+{([^}]+)}\s+from/)?.[1] || '';
    return components.split(',').map(c => c.trim());
  }).filter(Boolean);

  // Extract hooks usage to understand functionality
  const hooksMatches = content.match(/use[A-Z][a-zA-Z]+/g) || [];
  const hooks = [...new Set(hooksMatches)];

  // Determine primary functionality based on imports, hooks, and content
  let primaryFunctionality = '';
  let overlap = [];
  let uniqueFeatures = [];

  // Check for patient-related functionality
  if (
    content.includes('patient') || 
    imports.some(i => i.toLowerCase().includes('patient')) ||
    hooks.some(h => h.toLowerCase().includes('patient'))
  ) {
    primaryFunctionality = 'Patient management';
    if (pageName !== 'Patients' && pageName !== 'PatientDetail' && pageName !== 'PatientProfile') {
      overlap.push('Some overlap with Patients/PatientDetail pages');
    } else {
      uniqueFeatures.push('Core patient management functionality');
    }
  }

  // Check for medication-related functionality
  if (
    content.includes('medication') || 
    imports.some(i => i.toLowerCase().includes('med')) ||
    hooks.some(h => h.toLowerCase().includes('med'))
  ) {
    primaryFunctionality = primaryFunctionality ? `${primaryFunctionality}, Medication management` : 'Medication management';
    if (pageName !== 'Medications' && pageName !== 'MedicationAdministration' && pageName !== 'MedicationView') {
      overlap.push('Some overlap with Medications pages');
    } else {
      uniqueFeatures.push('Core medication management functionality');
    }
  }

  // Check for administrative functionality
  if (
    pageName.includes('Admin') || 
    content.includes('admin') || 
    imports.some(i => i.toLowerCase().includes('admin')) ||
    hooks.some(h => h.toLowerCase().includes('admin'))
  ) {
    primaryFunctionality = primaryFunctionality ? `${primaryFunctionality}, Administrative` : 'Administrative';
    uniqueFeatures.push('Administrative functionality');
  }

  // Check for emergency care functionality
  if (
    pageName.includes('Emergency') || 
    content.includes('emergency') || 
    imports.some(i => i.toLowerCase().includes('emergency')) ||
    hooks.some(h => h.toLowerCase().includes('emergency'))
  ) {
    primaryFunctionality = primaryFunctionality ? `${primaryFunctionality}, Emergency care` : 'Emergency care';
    uniqueFeatures.push('Emergency care functionality');
  }

  // Check for authentication functionality
  if (
    pageName === 'Login' || 
    pageName === 'Register' || 
    pageName === 'ResetPassword' ||
    content.includes('auth') || 
    imports.some(i => i.toLowerCase().includes('auth')) ||
    hooks.some(h => h.toLowerCase().includes('auth'))
  ) {
    primaryFunctionality = primaryFunctionality ? `${primaryFunctionality}, Authentication` : 'Authentication';
    if (pageName === 'Login' || pageName === 'Register' || pageName === 'ResetPassword') {
      uniqueFeatures.push('Core authentication functionality');
    } else {
      overlap.push('Some authentication-related functionality');
    }
  }

  // Check for documentation/records functionality
  if (
    pageName.includes('Record') || 
    pageName.includes('Documentation') || 
    pageName.includes('Notes') ||
    content.includes('record') || 
    content.includes('documentation') || 
    content.includes('notes') ||
    imports.some(i => i.toLowerCase().includes('record') || i.toLowerCase().includes('doc') || i.toLowerCase().includes('note'))
  ) {
    primaryFunctionality = primaryFunctionality ? `${primaryFunctionality}, Clinical documentation` : 'Clinical documentation';
    uniqueFeatures.push('Documentation functionality');
  }

  // Use existing analysis if available
  if (existingPageAnalysis) {
    if (existingPageAnalysis.functionality?.primary) {
      primaryFunctionality = existingPageAnalysis.functionality.primary;
    }
    if (existingPageAnalysis.functionality?.features) {
      uniqueFeatures = [...uniqueFeatures, ...existingPageAnalysis.functionality.features];
    }
  }

  // If we couldn't determine functionality, use a generic description
  if (!primaryFunctionality) {
    primaryFunctionality = `${pageName} functionality`;
    uniqueFeatures.push(`${pageName}-specific functionality`);
  }

  // Determine uniqueness level
  let uniqueness;
  if (uniqueFeatures.length > 2 && overlap.length === 0) {
    uniqueness = 'High';
  } else if (uniqueFeatures.length > 0 && overlap.length <= 1) {
    uniqueness = 'Medium';
  } else {
    uniqueness = 'Low';
  }

  return { 
    uniqueness, 
    overlap, 
    uniqueFeatures, 
    primaryFunctionality,
    imports,
    hooks,
    details: {
      importCount: imports.length,
      hookCount: hooks.length,
      uniqueFeaturesCount: uniqueFeatures.length,
      overlapCount: overlap.length
    }
  };
}