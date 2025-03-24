/**
 * Recommendation Generator for Orphaned Pages
 * 
 * This module provides functions for generating recommendations based on analysis results.
 */

/**
 * Generate a recommendation for a page based on analysis results
 * @param {string} pageName - Name of the page component
 * @param {Object} codeQuality - Code quality analysis results
 * @param {Object} functionalUniqueness - Functional uniqueness analysis results
 * @param {string} clinicalWorkflow - Clinical workflow
 * @returns {Object} - Recommendation
 */
export function generateRecommendation(pageName, codeQuality, functionalUniqueness, clinicalWorkflow) {
  // Special cases
  if (pageName === 'NotFound' && pageName === 'PageNotFound') {
    return {
      decision: 'Delete',
      justification: 'Duplicate functionality with PageNotFound page',
      priority: 'Low',
      strategy: 'Remove the file and ensure PageNotFound is properly integrated'
    };
  }

  // Decision matrix
  if (codeQuality.quality === 'High' && functionalUniqueness.uniqueness === 'High') {
    return {
      decision: 'Reintegrate',
      justification: 'High code quality and unique functionality',
      priority: 'High',
      strategy: 'Reintegrate as-is with proper route and sidebar configuration'
    };
  } else if (codeQuality.quality === 'High' && functionalUniqueness.uniqueness === 'Medium') {
    return {
      decision: 'Reintegrate',
      justification: 'High code quality with moderately unique functionality',
      priority: 'Medium',
      strategy: 'Reintegrate as-is with proper route and sidebar configuration'
    };
  } else if (codeQuality.quality === 'High' && functionalUniqueness.uniqueness === 'Low') {
    return {
      decision: 'Consider for deletion or consolidation',
      justification: 'High code quality but low functional uniqueness',
      priority: 'Low',
      strategy: 'Consider consolidating functionality with existing pages'
    };
  } else if (codeQuality.quality === 'Medium' && functionalUniqueness.uniqueness === 'High') {
    return {
      decision: 'Reintegrate with refactoring',
      justification: 'Medium code quality but high functional uniqueness',
      priority: 'High',
      strategy: 'Refactor the code to improve quality, then reintegrate'
    };
  } else if (codeQuality.quality === 'Medium' && functionalUniqueness.uniqueness === 'Medium') {
    return {
      decision: 'Reintegrate with refactoring',
      justification: 'Medium code quality and medium functional uniqueness',
      priority: 'Medium',
      strategy: 'Refactor the code to improve quality, then reintegrate'
    };
  } else if (codeQuality.quality === 'Medium' && functionalUniqueness.uniqueness === 'Low') {
    return {
      decision: 'Consider for deletion or consolidation',
      justification: 'Medium code quality but low functional uniqueness',
      priority: 'Low',
      strategy: 'Consider consolidating functionality with existing pages'
    };
  } else if (codeQuality.quality === 'Low' && functionalUniqueness.uniqueness === 'High') {
    return {
      decision: 'Reintegrate with major refactoring',
      justification: 'Low code quality but high functional uniqueness',
      priority: 'Medium',
      strategy: 'Perform major refactoring to improve code quality, then reintegrate'
    };
  } else if (codeQuality.quality === 'Low' && functionalUniqueness.uniqueness === 'Medium') {
    return {
      decision: 'Consider for deletion or replacement',
      justification: 'Low code quality and medium functional uniqueness',
      priority: 'Low',
      strategy: 'Consider replacing with new implementation or consolidating with existing pages'
    };
  } else {
    return {
      decision: 'Delete',
      justification: 'Low code quality and low functional uniqueness',
      priority: 'Low',
      strategy: 'Remove the file and ensure functionality is available elsewhere'
    };
  }
}

/**
 * Get implementation steps based on recommendation
 * @param {Object} recommendation - Recommendation object
 * @param {string} pageName - Name of the page component
 * @param {string} filePath - Path to the page file
 * @returns {string[]} - Implementation steps
 */
export function getImplementationSteps(recommendation, pageName, filePath) {
  const steps = [];

  switch (recommendation.decision) {
    case 'Reintegrate':
      steps.push(`1. Add route definition for ${pageName} in src/routes/RouteConfig.ts`);
      steps.push(`2. Add sidebar entry for ${pageName} in src/config/sidebarConfig.ts if needed`);
      steps.push(`3. Add required permissions in src/constants/permissions.ts if needed`);
      steps.push(`4. Add translations in src/i18n/translations.ts if needed`);
      steps.push(`5. Add component import and route in src/routes/index.tsx`);
      steps.push(`6. Test the page to ensure it works correctly`);
      break;
    case 'Reintegrate with refactoring':
      steps.push(`1. Refactor ${pageName} to address code quality issues`);
      steps.push(`2. Add route definition for ${pageName} in src/routes/RouteConfig.ts`);
      steps.push(`3. Add sidebar entry for ${pageName} in src/config/sidebarConfig.ts if needed`);
      steps.push(`4. Add required permissions in src/constants/permissions.ts if needed`);
      steps.push(`5. Add translations in src/i18n/translations.ts if needed`);
      steps.push(`6. Add component import and route in src/routes/index.tsx`);
      steps.push(`7. Test the page to ensure it works correctly`);
      break;
    case 'Reintegrate with major refactoring':
      steps.push(`1. Perform major refactoring of ${pageName} to address code quality issues`);
      steps.push(`2. Consider rewriting parts of the component using modern patterns`);
      steps.push(`3. Add route definition for ${pageName} in src/routes/RouteConfig.ts`);
      steps.push(`4. Add sidebar entry for ${pageName} in src/config/sidebarConfig.ts if needed`);
      steps.push(`5. Add required permissions in src/constants/permissions.ts if needed`);
      steps.push(`6. Add translations in src/i18n/translations.ts if needed`);
      steps.push(`7. Add component import and route in src/routes/index.tsx`);
      steps.push(`8. Test the page to ensure it works correctly`);
      break;
    case 'Consider for deletion or consolidation':
      steps.push(`1. Identify existing pages that provide similar functionality`);
      steps.push(`2. Determine if any unique functionality from ${pageName} should be preserved`);
      steps.push(`3. If needed, migrate unique functionality to existing pages`);
      steps.push(`4. Remove ${filePath} if no unique functionality needs to be preserved`);
      break;
    case 'Consider for deletion or replacement':
      steps.push(`1. Evaluate if the functionality provided by ${pageName} is still needed`);
      steps.push(`2. If needed, create a new implementation with better code quality`);
      steps.push(`3. Remove ${filePath} after replacement is complete`);
      break;
    case 'Delete':
      steps.push(`1. Verify that the functionality provided by ${pageName} is available elsewhere or no longer needed`);
      steps.push(`2. Remove ${filePath}`);
      break;
  }

  return steps;
}