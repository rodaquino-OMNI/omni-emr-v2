/**
 * Orphaned Pages Analyzer
 * 
 * This script analyzes the remaining orphaned pages in the OmniCare EMR system to determine
 * their technical quality and functional uniqueness. It generates a comprehensive report
 * that categorizes pages into "to be reintegrated" and "recommended for deletion".
 * 
 * Usage:
 * node src/tools/analysis/orphanedPagesAnalyzer.js
 */

import path from 'path';
import { fileURLToPath } from 'url';

// Import utility modules
import { readFile, writeFile, getFileStats, findFile, fileExists } from './utils/fileUtils.js';

// Import analyzer modules
import { analyzeCodeQuality } from './analyzers/codeQualityAnalyzer.js';
import { analyzeFunctionalUniqueness } from './analyzers/functionalAnalyzer.js';
import { mapToClinicaWorkflow, determineUserRoles } from './analyzers/workflowAnalyzer.js';
import { generateRecommendation, getImplementationSteps } from './analyzers/recommendationGenerator.js';

// Import reporter modules
import { generateJsonReport, generateMarkdownReport, generateHierarchicalDiagram } from './reporters/reportGenerator.js';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '../../..');

// Paths to the files we need to analyze
const PAGES_DIR = path.join(PROJECT_ROOT, 'src', 'pages');
const ORPHANED_PAGES_ANALYSIS_JSON = path.join(PROJECT_ROOT, 'orphaned-pages-analysis.json');

// Output paths
const ANALYSIS_OUTPUT_PATH = path.join(PROJECT_ROOT, 'orphaned-pages-detailed-analysis.json');
const REPORT_OUTPUT_PATH = path.join(PROJECT_ROOT, 'Orphaned-Pages-Final-Analysis-Report.md');
const DIAGRAM_OUTPUT_PATH = path.join(PROJECT_ROOT, 'orphaned-pages-hierarchy-diagram.md');

// List of remaining orphaned pages from the Clinical Workflow Pages Implementation Report
const REMAINING_ORPHANED_PAGES = [
  'FunctionBlocks',
  'EmergencyCare',
  'Help',
  'HospitalWorkflows',
  'Index',
  'MedicalHistory',
  'Messages',
  'NewOrder',
  'Notifications',
  'PageNotFound',
  'RecordView',
  'Records',
  'Register',
  'ResetPassword',
  'RxNormManagement',
  'SectorSelection',
  'NotFound'
];

/**
 * Find the file path for a page
 * @param {string} pageName - Name of the page
 * @returns {string|null} - File path or null if not found
 */
function findPageFile(pageName) {
  // Check for direct match in pages directory
  const directPath = path.join(PAGES_DIR, `${pageName}.tsx`);
  if (fileExists(directPath)) {
    return directPath;
  }

  // Check for match in Admin subdirectory
  const adminPath = path.join(PAGES_DIR, 'Admin', `${pageName}.tsx`);
  if (fileExists(adminPath)) {
    return adminPath;
  }

  // Search recursively in pages directory
  return findFile(PAGES_DIR, `${pageName}.tsx`);
}

/**
 * Analyze a single orphaned page
 * @param {string} pageName - Name of the page
 * @param {Object} existingAnalysis - Existing analysis data if available
 * @returns {Object} - Analysis results
 */
function analyzeOrphanedPage(pageName, existingAnalysis) {
  console.log(`Analyzing ${pageName}...`);

  // Find the page file
  const filePath = findPageFile(pageName);
  if (!filePath) {
    console.error(`Could not find file for ${pageName}`);
    return {
      name: pageName,
      status: 'error',
      error: 'File not found'
    };
  }

  // Get file stats
  const stats = getFileStats(filePath);
  const lastModified = stats ? new Date(stats.mtime).toISOString() : 'Unknown';

  // Read the file content
  const content = readFile(filePath);
  if (!content) {
    return {
      name: pageName,
      filePath,
      lastModified,
      status: 'error',
      error: 'Could not read file content'
    };
  }

  // Analyze code quality
  const codeQuality = analyzeCodeQuality(content);

  // Analyze functional uniqueness
  const functionalUniqueness = analyzeFunctionalUniqueness(pageName, content, existingAnalysis);

  // Map to clinical workflow
  const clinicalWorkflow = mapToClinicaWorkflow(pageName, functionalUniqueness);

  // Determine relevant user roles
  const userRoles = determineUserRoles(pageName, clinicalWorkflow);

  // Make recommendation
  const recommendation = generateRecommendation(pageName, codeQuality, functionalUniqueness, clinicalWorkflow);

  // Get implementation steps
  const implementationSteps = getImplementationSteps(recommendation, pageName, filePath);

  // Return the analysis
  return {
    name: pageName,
    filePath,
    lastModified,
    status: 'analyzed',
    technicalAssessment: {
      codeQuality: codeQuality.quality,
      issues: codeQuality.issues,
      score: codeQuality.score,
      details: codeQuality.details
    },
    functionalAssessment: {
      uniqueness: functionalUniqueness.uniqueness,
      primaryFunctionality: functionalUniqueness.primaryFunctionality,
      uniqueFeatures: functionalUniqueness.uniqueFeatures,
      overlap: functionalUniqueness.overlap,
      imports: functionalUniqueness.imports,
      hooks: functionalUniqueness.hooks,
      details: functionalUniqueness.details
    },
    workflowAndRoles: {
      clinicalWorkflow,
      userRoles
    },
    recommendation,
    implementationSteps
  };
}

/**
 * Main function
 */
async function main() {
  console.log('Starting orphaned pages analysis...');

  // Load existing analysis if available
  let existingAnalysis = null;
  try {
    if (fileExists(ORPHANED_PAGES_ANALYSIS_JSON)) {
      const existingAnalysisContent = readFile(ORPHANED_PAGES_ANALYSIS_JSON);
      if (existingAnalysisContent) {
        existingAnalysis = JSON.parse(existingAnalysisContent);
        console.log('Loaded existing analysis from orphaned-pages-analysis.json');
      }
    }
  } catch (error) {
    console.warn('Could not load existing analysis:', error);
  }

  // Analyze each orphaned page
  const analysisResults = [];
  for (const pageName of REMAINING_ORPHANED_PAGES) {
    const analysis = analyzeOrphanedPage(pageName, existingAnalysis);
    analysisResults.push(analysis);
  }

  // Generate and write the JSON report
  const jsonReport = generateJsonReport(analysisResults);
  writeFile(ANALYSIS_OUTPUT_PATH, jsonReport);
  console.log(`Detailed analysis written to ${ANALYSIS_OUTPUT_PATH}`);

  // Generate and write the Markdown report
  const markdownReport = generateMarkdownReport(analysisResults);
  writeFile(REPORT_OUTPUT_PATH, markdownReport);
  console.log(`Markdown report written to ${REPORT_OUTPUT_PATH}`);

  // Generate and write the hierarchical diagram
  const hierarchicalDiagram = generateHierarchicalDiagram(analysisResults);
  writeFile(DIAGRAM_OUTPUT_PATH, `# Orphaned Pages Hierarchical Diagram

\`\`\`mermaid
${hierarchicalDiagram}
\`\`\`
`);
  console.log(`Hierarchical diagram written to ${DIAGRAM_OUTPUT_PATH}`);

  console.log('Analysis complete!');
}

// Run the script
main().catch(error => {
  console.error('Error running analysis:', error);
  process.exit(1);
});
