/**
 * Code Quality Analyzer for Orphaned Pages
 * 
 * This module provides functions for analyzing the code quality of React components.
 */

/**
 * Analyze the code quality of a component
 * @param {string} content - Component file content
 * @returns {Object} - Analysis results
 */
export function analyzeCodeQuality(content) {
  if (!content) return { quality: 'Unknown', issues: ['Could not read file content'] };

  const issues = [];
  let qualityScore = 0;

  // Check for component structure
  if (content.includes('export default function') || content.includes('export default const')) {
    qualityScore += 1;
  } else if (content.includes('class') && content.includes('extends React.Component')) {
    // Class components are considered slightly less modern
    qualityScore += 0.5;
  }

  // Check for TypeScript usage
  if (content.includes(': React.FC<') || content.includes(': Props')) {
    qualityScore += 1;
  }

  // Check for hooks usage (modern React)
  const hooksCount = (content.match(/use[A-Z][a-zA-Z]+/g) || []).length;
  if (hooksCount > 0) {
    qualityScore += Math.min(hooksCount * 0.2, 1); // Cap at 1 point
  }

  // Check for error handling
  if (content.includes('try {') && content.includes('catch (')) {
    qualityScore += 0.5;
  }

  // Check for comments and documentation
  const commentLines = (content.match(/\/\//g) || []).length + (content.match(/\/\*|\*\//g) || []).length;
  const totalLines = content.split('\n').length;
  const commentRatio = commentLines / totalLines;
  if (commentRatio > 0.1) {
    qualityScore += 0.5;
  } else {
    issues.push('Limited or no comments/documentation');
  }

  // Check for excessive line length (code readability)
  const longLines = content.split('\n').filter(line => line.length > 100).length;
  const longLineRatio = longLines / totalLines;
  if (longLineRatio > 0.2) {
    issues.push('Many excessively long lines (> 100 characters)');
    qualityScore -= 0.5;
  }

  // Check for complex functions
  const functionMatches = content.match(/function\s+\w+\s*\([^)]*\)\s*{[^}]*}/g) || [];
  for (const functionMatch of functionMatches) {
    const functionLines = functionMatch.split('\n').length;
    if (functionLines > 50) {
      issues.push('Contains very large functions (> 50 lines)');
      qualityScore -= 0.5;
      break;
    }
  }

  // Check for prop types or interface definitions
  if (content.includes('PropTypes.') || content.includes('interface Props')) {
    qualityScore += 0.5;
  } else {
    issues.push('Missing prop types or interface definitions');
  }

  // Check for accessibility considerations
  if (content.includes('aria-') || content.includes('role=')) {
    qualityScore += 0.5;
  } else {
    issues.push('Limited accessibility considerations');
  }

  // Determine quality level
  let quality;
  if (qualityScore >= 2.5) {
    quality = 'High';
  } else if (qualityScore >= 1.5) {
    quality = 'Medium';
  } else {
    quality = 'Low';
  }

  return { 
    quality, 
    issues, 
    score: qualityScore,
    details: {
      componentStructure: content.includes('export default function') ? 'Functional component' : 
                          content.includes('class') ? 'Class component' : 'Unknown',
      usesTypeScript: content.includes(': React.FC<') || content.includes(': Props'),
      hooksCount,
      hasErrorHandling: content.includes('try {') && content.includes('catch ('),
      commentRatio,
      longLineRatio
    }
  };
}