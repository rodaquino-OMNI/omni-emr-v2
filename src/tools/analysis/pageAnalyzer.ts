/**
 * Page Analyzer Tool
 *
 * This script analyzes the pages directory to identify potential orphaned components
 * and generate a report of the findings.
 */

const fs = require('fs');
const path = require('path');
const { parse: parseTypescript } = require('@typescript-eslint/typescript-estree');

// Types for our analysis
interface PageInfo {
  path: string;
  name: string;
  imports: string[];
  exports: string[];
  referencedIn: string[];
  isReferenced: boolean;
  potentiallyOrphaned: boolean;
  clinicalWorkflows: string[];
}

interface RouteInfo {
  path: string;
  component: string;
  exact?: boolean;
  authRequired?: boolean;
  permissions?: string[];
}

interface AnalysisResult {
  pages: PageInfo[];
  routes: RouteInfo[];
  orphanedPages: PageInfo[];
  clinicalWorkflowPages: {
    prescriptionManagement: PageInfo[];
    clinicalTaskExecution: PageInfo[];
    patientVisitRegistration: PageInfo[];
    other: PageInfo[];
  };
}

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
  
  // Get all pages
  const pages = await getAllPages(pagesDir);
  console.log(`Found ${pages.length} pages`);
  
  // Get all routes
  const routes = await getAllRoutes(routesDir);
  console.log(`Found ${routes.length} routes`);
  
  // Check which pages are referenced in routes
  const pagesWithReferenceInfo = checkPageReferences(pages, routes);
  
  // Identify orphaned pages
  const orphanedPages = pagesWithReferenceInfo.filter(page => page.potentiallyOrphaned);
  console.log(`Found ${orphanedPages.length} potentially orphaned pages`);
  
  // Categorize pages by clinical workflow
  const clinicalWorkflowPages = categorizePagesByWorkflow(pagesWithReferenceInfo);
  
  // Generate the analysis result
  const result: AnalysisResult = {
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
 */
async function getAllPages(pagesDir: string): Promise<PageInfo[]> {
  const pages: PageInfo[] = [];
  
  // Function to recursively scan directories
  async function scanDirectory(dir: string) {
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
          const ast = parseTypescript(content, {
            jsx: true,
            loc: true,
          });
          
          // Extract imports and exports (simplified)
          const imports: string[] = [];
          const exports: string[] = [];
          
          // Very simplified AST traversal - in a real implementation, we would use a proper AST traversal
          for (const node of ast.body) {
            if (node.type === 'ImportDeclaration') {
              imports.push(node.source.value as string);
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
 */
async function getAllRoutes(routesDir: string): Promise<RouteInfo[]> {
  const routes: RouteInfo[] = [];
  
  // Function to recursively scan directories
  async function scanDirectory(dir: string) {
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
          // Extract route definitions (simplified)
          // In a real implementation, we would use a proper AST traversal
          const routeMatches = content.match(/path:\s*['"]([^'"]+)['"]/g) || [];
          const componentMatches = content.match(/component:\s*<([^>]+)>|element:\s*<([^>]+)>/g) || [];
          
          // For simplicity, we're just counting routes
          for (let i = 0; i < routeMatches.length; i++) {
            const pathMatch = routeMatches[i].match(/path:\s*['"]([^'"]+)['"]/);
            const componentMatch = componentMatches[i]?.match(/component:\s*<([^>]+)>|element:\s*<([^>]+)>/);
            
            if (pathMatch && componentMatch) {
              routes.push({
                path: pathMatch[1],
                component: (componentMatch[1] || componentMatch[2]).trim()
              });
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
 */
function checkPageReferences(pages: PageInfo[], routes: RouteInfo[]): PageInfo[] {
  // Create a map of component names to pages
  const pageMap = new Map<string, PageInfo>();
  pages.forEach(page => {
    pageMap.set(page.name, page);
  });
  
  // Check which pages are referenced in routes
  routes.forEach(route => {
    const componentName = route.component;
    
    // Check if the component is a page
    if (pageMap.has(componentName)) {
      const page = pageMap.get(componentName)!;
      page.referencedIn.push(route.path);
      page.isReferenced = true;
    }
  });
  
  // Mark pages as potentially orphaned if they are not referenced
  pages.forEach(page => {
    page.potentiallyOrphaned = !page.isReferenced;
  });
  
  return pages;
}

/**
 * Categorize pages by clinical workflow
 */
function categorizePagesByWorkflow(pages: PageInfo[]): {
  prescriptionManagement: PageInfo[];
  clinicalTaskExecution: PageInfo[];
  patientVisitRegistration: PageInfo[];
  other: PageInfo[];
} {
  const result = {
    prescriptionManagement: [] as PageInfo[],
    clinicalTaskExecution: [] as PageInfo[],
    patientVisitRegistration: [] as PageInfo[],
    other: [] as PageInfo[]
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
 */
function generateMarkdownReport(result: AnalysisResult) {
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