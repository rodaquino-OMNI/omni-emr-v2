/**
 * Page Analyzer Tool
 *
 * This script analyzes the pages directory to identify potential orphaned components
 * and generate a report of the findings.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { parse } from '@typescript-eslint/typescript-estree';

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Types for our analysis
/**
 * @typedef {Object} PageInfo
 * @property {string} path - Path to the page file
 * @property {string} name - Name of the page component
 * @property {string[]} imports - Imports used by the page
 * @property {string[]} exports - Exports from the page
 * @property {string[]} referencedIn - Routes that reference this page
 * @property {boolean} isReferenced - Whether the page is referenced in routes
 * @property {boolean} potentiallyOrphaned - Whether the page is potentially orphaned
 * @property {string[]} clinicalWorkflows - Clinical workflows the page belongs to
 */

/**
 * @typedef {Object} RouteInfo
 * @property {string} path - Route path
 * @property {string} component - Component rendered by the route
 * @property {boolean} [exact] - Whether the route is exact
 * @property {boolean} [authRequired] - Whether authentication is required
 * @property {string[]} [permissions] - Required permissions
 */

/**
 * @typedef {Object} AnalysisResult
 * @property {PageInfo[]} pages - All pages
 * @property {RouteInfo[]} routes - All routes
 * @property {PageInfo[]} orphanedPages - Orphaned pages
 * @property {Object} clinicalWorkflowPages - Pages categorized by clinical workflow
 * @property {PageInfo[]} clinicalWorkflowPages.prescriptionManagement - Prescription management pages
 * @property {PageInfo[]} clinicalWorkflowPages.clinicalTaskExecution - Clinical task execution pages
 * @property {PageInfo[]} clinicalWorkflowPages.patientVisitRegistration - Patient visit registration pages
 * @property {PageInfo[]} clinicalWorkflowPages.other - Other pages
 */

// Clinical workflow keywords for categorization
const workflowKeywords = {
  prescriptionManagement: [
    'prescription', 'medication', 'drug', 'pharmacy', 'dose', 'medicine', 'prescribe'
  ],
  clinicalTaskExecution: [
    'task', 'vital', 'sign', 'fluid', 'balance', 'monitor', 'verification', 'execute'
  ],
  patientVisitRegistration: [
    'visit', 'registration', 'check-in', 'appointment', 'schedule', 'booking'
  ]
};

/**
 * Main function to analyze pages and generate a report
 */
async function analyzePages() {
  const rootDir = process.cwd();
  const pagesDir = path.join(rootDir, 'src', 'pages');
  const routesDir = path.join(rootDir, 'src', 'routes');
  
  console.log('Starting page analysis...');
  console.log(`Pages directory: ${pagesDir}`);
  console.log(`Routes directory: ${routesDir}`);
  
  // Validate directories exist
  if (!fs.existsSync(pagesDir)) {
    console.error(`Pages directory not found: ${pagesDir}`);
    return null;
  }

  if (!fs.existsSync(routesDir)) {
    console.error(`Routes directory not found: ${routesDir}`);
    return null;
  }
  
  // Get all pages
  const pages = await getAllPages(pagesDir);
  console.log(`Found ${pages.length} pages`);
  
  // Validate pages were found
  if (pages.length === 0) {
    console.warn('No pages found. Check the pages directory path and file patterns.');
  }
  
  // Get all routes
  const routes = await getAllRoutes(routesDir);
  console.log(`Found ${routes.length} routes`);
  
  // Validate routes were found
  if (routes.length === 0) {
    console.warn('No routes found. Check the routes directory path and file patterns.');
  }
  
  // Check which pages are referenced in routes
  const pagesWithReferenceInfo = checkPageReferences(pages, routes);
  
  // Identify orphaned pages
  const orphanedPages = pagesWithReferenceInfo.filter(page => page.potentiallyOrphaned);
  console.log(`Found ${orphanedPages.length} potentially orphaned pages`);
  
  // Categorize pages by clinical workflow
  const clinicalWorkflowPages = categorizePagesByWorkflow(pagesWithReferenceInfo);
  
  // Generate the analysis result
  const result = {
    pages: pagesWithReferenceInfo,
    routes,
    orphanedPages,
    clinicalWorkflowPages
  };
  
  // Write the result to a file
  const outputPath = path.join(rootDir, 'src', 'tools', 'analysis', 'page-analysis-result.json');
  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
  console.log(`Analysis result written to ${outputPath}`);
  
  // Generate a markdown report
  generateMarkdownReport(result);
  
  return result;
}

/**
 * Get all pages from the pages directory
 * @param {string} pagesDir - Path to the pages directory
 * @returns {Promise<PageInfo[]>} - Array of page info objects
 */
async function getAllPages(pagesDir) {
  const pages = [];
  
  // Function to recursively scan directories
  async function scanDirectory(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        // Recursively scan subdirectories
        await scanDirectory(fullPath);
      } else if (entry.isFile() && /\.(tsx|jsx|ts|js)$/.test(entry.name)) {
        // Process TypeScript/JavaScript files
        const relativePath = path.relative(pagesDir, fullPath);
        const content = fs.readFileSync(fullPath, 'utf-8');
        
        try {
          // Parse the file to extract imports and exports
          const ast = parse(content, {
            jsx: true,
            loc: true,
          });
          
          // Extract imports and exports (simplified)
          const imports = [];
          const exports = [];
          
          // Very simplified AST traversal - in a real implementation, we would use a proper AST traversal
          for (const node of ast.body) {
            if (node.type === 'ImportDeclaration') {
              imports.push(node.source.value);
            } else if (node.type === 'ExportNamedDeclaration' || node.type === 'ExportDefaultDeclaration') {
              // For simplicity, we're just counting exports
              exports.push('export');
            }
          }
          
          // Get component name from file name
          const name = path.basename(fullPath, path.extname(fullPath));
          
          pages.push({
            path: relativePath,
            name,
            imports,
            exports,
            referencedIn: [],
            isReferenced: false,
            potentiallyOrphaned: false,
            clinicalWorkflows: []
          });
        } catch (error) {
          console.error(`Error parsing ${fullPath}:`, error);
        }
      }
    }
  }
  
  await scanDirectory(pagesDir);
  return pages;
}

/**
 * Get all routes from the routes directory
 * @param {string} routesDir - Path to the routes directory
 * @returns {Promise<RouteInfo[]>} - Array of route info objects
 */
async function getAllRoutes(routesDir) {
  const routes = [];
  
  // Function to recursively scan directories
  async function scanDirectory(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        // Recursively scan subdirectories
        await scanDirectory(fullPath);
      } else if (entry.isFile() && /\.(tsx|jsx|ts|js)$/.test(entry.name)) {
        // Process TypeScript/JavaScript files
        const content = fs.readFileSync(fullPath, 'utf-8');
        
        try {
          // Special handling for RouteConfig.ts
          if (fullPath.endsWith('RouteConfig.ts') || fullPath.endsWith('RouteConfig.js')) {
            try {
              const routeDefMatches = content.match(/path:\s*['"]([^'"]+)['"]\s*,\s*component:\s*['"]([^'"]+)['"]/g) || [];
              
              for (const match of routeDefMatches) {
                const pathMatch = match.match(/path:\s*['"]([^'"]+)['"]/);
                const componentMatch = match.match(/component:\s*['"]([^'"]+)['"]/);
                
                if (pathMatch && componentMatch) {
                  routes.push({
                    path: pathMatch[1],
                    component: componentMatch[1].trim()
                  });
                }
              }
            } catch (error) {
              console.error(`Error parsing RouteConfig at ${fullPath}:`, error);
            }
          } else if (fullPath.endsWith('index.tsx') || fullPath.endsWith('index.jsx')) {
            // Special handling for index.tsx which uses lazy loading
            try {
              // Extract lazy loaded components
              const lazyLoadMatches = content.match(/const\s+(\w+)\s*=\s*lazy\(\s*\(\)\s*=>\s*import\([^)]*['"]\.\.\/pages\/([^'"]+)['"]\)/g) || [];
              
              for (const match of lazyLoadMatches) {
                const componentMatch = match.match(/const\s+(\w+)\s*=/);
                const importMatch = match.match(/import\([^)]*['"]\.\.\/pages\/([^'"]+)['"]\)/);
                
                if (componentMatch && importMatch) {
                  const componentName = componentMatch[1];
                  const importPath = importMatch[1].replace(/\.tsx$|\.jsx$|\.ts$|\.js$/, '');
                  
                  // Find route paths that use this component
                  const routeRegex = new RegExp(`path:\\s*['"]([^'"]+)['"][^}]*${componentName}`, 'g');
                  const routeMatches = content.match(routeRegex) || [];
                  
                  for (const routeMatch of routeMatches) {
                    const pathMatch = routeMatch.match(/path:\s*['"]([^'"]+)['"]/);
                    if (pathMatch) {
                      routes.push({
                        path: pathMatch[1],
                        component: importPath.split('/').pop() // Get the base name of the import path
                      });
                    }
                  }
                }
              }
              
              // Also look for direct element references
              const elementMatches = content.match(/element:\s*<([^>]+)>/g) || [];
              const pathMatches = content.match(/path:\s*['"]([^'"]+)['"]/g) || [];
              
              for (let i = 0; i < Math.min(elementMatches.length, pathMatches.length); i++) {
                const pathMatch = pathMatches[i].match(/path:\s*['"]([^'"]+)['"]/);
                const elementMatch = elementMatches[i].match(/element:\s*<([^>]+)>/);
                
                if (pathMatch && elementMatch) {
                  const componentName = elementMatch[1].split(' ')[0]; // Get the component name without props
                  routes.push({
                    path: pathMatch[1],
                    component: componentName
                  });
                }
              }
            } catch (error) {
              console.error(`Error parsing index.tsx at ${fullPath}:`, error);
            }
          } else {
            // Extract route definitions (simplified)
            // In a real implementation, we would use a proper AST traversal
            const routeMatches = content.match(/path:\s*['"]([^'"]+)['"]/g) || [];
            // Updated regex to match both JSX and string formats
            const componentMatches = content.match(/component:\s*(?:<([^>]+)>|['"]([^'"]+)['"])|element:\s*(?:<([^>]+)>|['"]([^'"]+)['"])/g) || [];
            
            console.log(`Found ${routeMatches.length} paths and ${componentMatches.length} components in ${fullPath}`);
            
            // For simplicity, we're just counting routes
            for (let i = 0; i < routeMatches.length; i++) {
              const pathMatch = routeMatches[i].match(/path:\s*['"]([^'"]+)['"]/);
              const componentMatch = componentMatches[i]?.match(/component:\s*(?:<([^>]+)>|['"]([^'"]+)['"])|element:\s*(?:<([^>]+)>|['"]([^'"]+)['"])/);
              
              if (pathMatch && componentMatch) {
                const component = componentMatch[1] || componentMatch[2] || componentMatch[3] || componentMatch[4];
                // Clean up component name (remove props, etc.)
                const cleanComponent = component.trim().split(' ')[0];
                routes.push({
                  path: pathMatch[1],
                  component: cleanComponent
                });
              }
            }
          }
        } catch (error) {
          console.error(`Error parsing ${fullPath}:`, error);
        }
      }
    }
  }
  
  await scanDirectory(routesDir);
  return routes;
}

/**
 * Check which pages are referenced in routes
 * @param {PageInfo[]} pages - Array of page info objects
 * @param {RouteInfo[]} routes - Array of route info objects
 * @returns {PageInfo[]} - Array of page info objects with reference information
 */
function checkPageReferences(pages, routes) {
  console.log('Starting page reference check...');
  console.log(`Pages count: ${pages.length}, Routes count: ${routes.length}`);
  
  // Debug: Log all page names and route components
  console.log('Page names:', pages.map(p => p.name));
  console.log('Route components:', routes.map(r => r.component));
  
  // Create a map of component names to pages with multiple ways to match
  const pageMap = new Map();
  pages.forEach(page => {
    // Standard mapping
    pageMap.set(page.name, page);
    
    // Case-insensitive mapping
    pageMap.set(page.name.toLowerCase(), page);
    
    // Handle common variations (e.g., "PageNotFound" might be referenced as "NotFound")
    if (page.name.endsWith('Page')) {
      pageMap.set(page.name.replace(/Page$/, ''), page);
    }
    
    // Handle potential path-based matching
    const baseName = page.path.split('/').pop().replace(/\.(tsx|jsx|ts|js)$/, '');
    if (baseName !== page.name) {
      pageMap.set(baseName, page);
    }
  });
  
  // Check which pages are referenced in routes
  let matchCount = 0;
  routes.forEach(route => {
    const componentName = route.component;
    console.log(`Checking route component: ${componentName}`);
    
    // Try exact match first
    if (pageMap.has(componentName)) {
      console.log(`✅ Found exact match for ${componentName}`);
      const page = pageMap.get(componentName);
      page.referencedIn.push(route.path);
      page.isReferenced = true;
      matchCount++;
    }
    // Try case-insensitive match
    else if (pageMap.has(componentName.toLowerCase())) {
      console.log(`✅ Found case-insensitive match for ${componentName}`);
      const page = pageMap.get(componentName.toLowerCase());
      page.referencedIn.push(route.path);
      page.isReferenced = true;
      matchCount++;
    }
    else {
      console.log(`❌ No match found for ${componentName}`);
    }
  });
  
  console.log(`Found ${matchCount} matches out of ${routes.length} routes`);
  
  // Mark pages as potentially orphaned if they are not referenced
  let orphanedCount = 0;
  pages.forEach(page => {
    page.potentiallyOrphaned = !page.isReferenced;
    if (page.potentiallyOrphaned) {
      orphanedCount++;
    }
  });
  
  console.log(`Identified ${orphanedCount} potentially orphaned pages out of ${pages.length} total pages`);
  
  return pages;
}

/**
 * Categorize pages by clinical workflow
 * @param {PageInfo[]} pages - Array of page info objects
 * @returns {Object} - Object with pages categorized by clinical workflow
 */
function categorizePagesByWorkflow(pages) {
  const result = {
    prescriptionManagement: [],
    clinicalTaskExecution: [],
    patientVisitRegistration: [],
    other: []
  };
  
  pages.forEach(page => {
    // Check if the page name or path contains keywords related to clinical workflows
    const pageName = page.name.toLowerCase();
    const pagePath = page.path.toLowerCase();
    
    // Check for prescription management keywords
    if (workflowKeywords.prescriptionManagement.some(keyword => 
      pageName.includes(keyword) || pagePath.includes(keyword)
    )) {
      page.clinicalWorkflows.push('prescriptionManagement');
      result.prescriptionManagement.push(page);
    }
    
    // Check for clinical task execution keywords
    if (workflowKeywords.clinicalTaskExecution.some(keyword => 
      pageName.includes(keyword) || pagePath.includes(keyword)
    )) {
      page.clinicalWorkflows.push('clinicalTaskExecution');
      result.clinicalTaskExecution.push(page);
    }
    
    // Check for patient visit registration keywords
    if (workflowKeywords.patientVisitRegistration.some(keyword => 
      pageName.includes(keyword) || pagePath.includes(keyword)
    )) {
      page.clinicalWorkflows.push('patientVisitRegistration');
      result.patientVisitRegistration.push(page);
    }
    
    // If the page doesn't belong to any clinical workflow, add it to the "other" category
    if (page.clinicalWorkflows.length === 0) {
      result.other.push(page);
    }
  });
  
  return result;
}

/**
 * Generate a markdown report of the analysis
 * @param {AnalysisResult} result - Analysis result
 */
function generateMarkdownReport(result) {
  const { pages, routes, orphanedPages, clinicalWorkflowPages } = result;
  
  let markdown = `# OmniCare EMR Page Analysis Report\n\n`;
  markdown += `*Generated on ${new Date().toLocaleString()}*\n\n`;
  
  // Summary
  markdown += `## Summary\n\n`;
  markdown += `- Total Pages: ${pages.length}\n`;
  markdown += `- Total Routes: ${routes.length}\n`;
  markdown += `- Potentially Orphaned Pages: ${orphanedPages.length}\n`;
  markdown += `- Prescription Management Pages: ${clinicalWorkflowPages.prescriptionManagement.length}\n`;
  markdown += `- Clinical Task Execution Pages: ${clinicalWorkflowPages.clinicalTaskExecution.length}\n`;
  markdown += `- Patient Visit Registration Pages: ${clinicalWorkflowPages.patientVisitRegistration.length}\n`;
  markdown += `- Other Pages: ${clinicalWorkflowPages.other.length}\n\n`;
  
  // Orphaned Pages
  markdown += `## Potentially Orphaned Pages\n\n`;
  if (orphanedPages.length === 0) {
    markdown += `No potentially orphaned pages found.\n\n`;
  } else {
    markdown += `| Page | Path | Clinical Workflows |\n`;
    markdown += `|------|------|--------------------|\n`;
    orphanedPages.forEach(page => {
      markdown += `| ${page.name} | ${page.path} | ${page.clinicalWorkflows.join(', ') || 'None'} |\n`;
    });
    markdown += `\n`;
  }
  
  // Clinical Workflow Pages
  markdown += `## Clinical Workflow Pages\n\n`;
  
  // Prescription Management
  markdown += `### Prescription Management\n\n`;
  if (clinicalWorkflowPages.prescriptionManagement.length === 0) {
    markdown += `No prescription management pages found.\n\n`;
  } else {
    markdown += `| Page | Path | Orphaned |\n`;
    markdown += `|------|------|----------|\n`;
    clinicalWorkflowPages.prescriptionManagement.forEach(page => {
      markdown += `| ${page.name} | ${page.path} | ${page.potentiallyOrphaned ? 'Yes' : 'No'} |\n`;
    });
    markdown += `\n`;
  }
  
  // Clinical Task Execution
  markdown += `### Clinical Task Execution\n\n`;
  if (clinicalWorkflowPages.clinicalTaskExecution.length === 0) {
    markdown += `No clinical task execution pages found.\n\n`;
  } else {
    markdown += `| Page | Path | Orphaned |\n`;
    markdown += `|------|------|----------|\n`;
    clinicalWorkflowPages.clinicalTaskExecution.forEach(page => {
      markdown += `| ${page.name} | ${page.path} | ${page.potentiallyOrphaned ? 'Yes' : 'No'} |\n`;
    });
    markdown += `\n`;
  }
  
  // Patient Visit Registration
  markdown += `### Patient Visit Registration\n\n`;
  if (clinicalWorkflowPages.patientVisitRegistration.length === 0) {
    markdown += `No patient visit registration pages found.\n\n`;
  } else {
    markdown += `| Page | Path | Orphaned |\n`;
    markdown += `|------|------|----------|\n`;
    clinicalWorkflowPages.patientVisitRegistration.forEach(page => {
      markdown += `| ${page.name} | ${page.path} | ${page.potentiallyOrphaned ? 'Yes' : 'No'} |\n`;
    });
    markdown += `\n`;
  }
  
  // Write the markdown report to a file
  const outputPath = path.join(process.cwd(), 'src', 'tools', 'analysis', 'page-analysis-report.md');
  fs.writeFileSync(outputPath, markdown);
  console.log(`Markdown report written to ${outputPath}`);
}

// Run the analysis
analyzePages().catch(error => {
  console.error('Error running page analysis:', error);
});