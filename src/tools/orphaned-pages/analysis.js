/**
 * Analysis utilities for the Orphaned Pages Manager
 * Handles analyzing orphaned pages and generating reports
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { 
  readFileWithRetry, 
  writeFileWithErrorHandling, 
  listFiles 
} from './file-utils.js';
import { validatePage } from './validation.js';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../../../..');

/**
 * Analyze orphaned pages in the project
 * @param {Object} options - Analysis options
 * @returns {Promise<Object>} - Analysis results
 */
export async function analyzeOrphanedPages(options = {}) {
  console.log('Analyzing orphaned pages...');
  
  // Find all page components
  const pagesDir = path.join(projectRoot, 'src', 'pages');
  const pageFiles = await listFiles(pagesDir, '.tsx', true);
  
  console.log(`Found ${pageFiles.length} potential page files`);
  
  // Read route configuration
  const routeConfigPath = path.join(projectRoot, 'src', 'routes', 'RouteConfig.ts');
  const routeConfigContent = await readFileWithRetry(routeConfigPath);
  
  // Read routes/index.tsx
  const routesIndexPath = path.join(projectRoot, 'src', 'routes', 'index.tsx');
  const routesIndexContent = await readFileWithRetry(routesIndexPath);
  
  // Read sidebar configuration
  const sidebarConfigPath = path.join(projectRoot, 'src', 'config', 'sidebarConfig.ts');
  const sidebarConfigContent = await readFileWithRetry(sidebarConfigPath);
  
  // Analyze each page
  const pages = [];
  const categories = {
    clinicalWorkflow: {
      name: "Clinical Workflow Pages",
      description: "Pages related to clinical workflows and patient care",
      priority: "high",
      pages: []
    },
    medicationRelated: {
      name: "Medication-Related Pages",
      description: "Pages related to medication management and administration",
      priority: "medium",
      pages: []
    },
    administrative: {
      name: "Administrative Pages",
      description: "Pages related to system administration and management",
      priority: "medium",
      pages: []
    },
    utility: {
      name: "Utility Pages",
      description: "Utility and support pages",
      priority: "low",
      pages: []
    },
    authentication: {
      name: "Authentication Pages",
      description: "Pages related to user authentication",
      priority: "low",
      pages: []
    },
    content: {
      name: "Content Pages",
      description: "Pages displaying various content and information",
      priority: "low",
      pages: []
    }
  };
  
  for (const pageFile of pageFiles) {
    // Extract page name from file path
    const relativePath = path.relative(projectRoot, pageFile);
    const pageName = path.basename(pageFile, '.tsx');
    
    // Skip index files and layout components
    if (pageName.toLowerCase() === 'index' || pageName.toLowerCase().includes('layout')) {
      continue;
    }
    
    // Read the page file
    const pageContent = await readFileWithRetry(pageFile);
    
    // Check if the page is referenced in RouteConfig.ts
    const routeRegex = new RegExp(`component:\\s*['"]${pageName}['"]`, 'i');
    const isInRouteConfig = routeRegex.test(routeConfigContent);
    
    // Check if the page is imported in routes/index.tsx
    const importRegex = new RegExp(`import\\(['\"]\\.\\./${relativePath.replace(/\.tsx$/, '')}['\"]\\)`, 'i');
    const isImported = importRegex.test(routesIndexContent);
    
    // Check if the page is in sidebarConfig.ts
    const sidebarRegex = new RegExp(`name:\\s*['"]${pageName}['"]`, 'i');
    const isInSidebar = sidebarRegex.test(sidebarConfigContent);
    
    // Determine if the page is orphaned
    const isOrphaned = !isInRouteConfig || !isImported;
    
    if (!isOrphaned) {
      // Skip non-orphaned pages
      continue;
    }
    
    // Extract dependencies from imports
    const dependencies = extractDependencies(pageContent);
    
    // Extract potential routes based on naming convention
    const potentialRoutes = generatePotentialRoutes(pageName);
    
    // Determine page category
    const category = determineCategory(pageName, pageContent);
    
    // Create page object
    const page = {
      name: pageName,
      path: relativePath,
      description: extractDescription(pageContent) || `${pageName} page`,
      status: "orphaned",
      dependencies,
      potentialRoutes,
      notes: `Orphaned page found in ${relativePath}`,
      reintegrationStrategy: generateReintegrationStrategy(pageName, category)
    };
    
    // Validate the page
    const validation = validatePage(page);
    if (!validation.valid) {
      console.warn(`Warning: Page ${pageName} has validation issues:`, validation.errors);
    }
    
    // Add to the appropriate category
    if (categories[category]) {
      categories[category].pages.push(page);
    } else {
      // Default to content category if unknown
      categories.content.pages.push(page);
    }
    
    pages.push(page);
  }
  
  // Create the analysis results
  const analysisResults = {
    metadata: {
      totalPages: pages.length,
      analysisDate: new Date().toISOString(),
      categories: Object.keys(categories).filter(cat => categories[cat].pages.length > 0)
    },
    categories: {}
  };
  
  // Add non-empty categories to the results
  for (const [key, category] of Object.entries(categories)) {
    if (category.pages.length > 0) {
      analysisResults.categories[key] = category;
    }
  }
  
  console.log(`Analysis complete. Found ${pages.length} orphaned pages.`);
  
  return analysisResults;
}

/**
 * Generate reports based on analysis results
 * @param {Object} analysisResults - Analysis results
 * @param {Object} options - Report options
 * @returns {Promise<boolean>} - Whether the reports were generated successfully
 */
export async function generateReports(analysisResults, options = {}) {
  console.log('Generating reports...');
  
  // Generate JSON registry
  const registryPath = path.join(projectRoot, 'orphaned-pages-registry.json');
  await writeFileWithErrorHandling(
    registryPath,
    JSON.stringify(analysisResults, null, 2)
  );
  console.log(`Generated orphaned-pages-registry.json`);
  
  // Generate Markdown report
  const reportPath = path.join(projectRoot, 'Orphaned-Pages-Analysis-Report.md');
  const reportContent = generateMarkdownReport(analysisResults);
  await writeFileWithErrorHandling(reportPath, reportContent);
  console.log(`Generated Orphaned-Pages-Analysis-Report.md`);
  
  // Generate hierarchy diagram
  const diagramPath = path.join(projectRoot, 'orphaned-pages-hierarchy-diagram.md');
  const diagramContent = generateHierarchyDiagram(analysisResults);
  await writeFileWithErrorHandling(diagramPath, diagramContent);
  console.log(`Generated orphaned-pages-hierarchy-diagram.md`);
  
  return true;
}

/**
 * Extract dependencies from page content
 * @param {string} pageContent - Page file content
 * @returns {Array} - Array of dependencies
 */
function extractDependencies(pageContent) {
  const dependencies = [];
  
  // Extract import statements
  const importRegex = /import\s+(?:{([^}]+)}|\*\s+as\s+([a-zA-Z0-9_]+)|([a-zA-Z0-9_]+))\s+from\s+['"]([^'"]+)['"]/g;
  let match;
  
  while ((match = importRegex.exec(pageContent)) !== null) {
    const importedItems = match[1] || match[2] || match[3];
    const importPath = match[4];
    
    if (importedItems && importPath) {
      // Split multiple imports
      if (importedItems.includes(',')) {
        const items = importedItems.split(',').map(item => item.trim());
        
        for (const item of items) {
          if (item) {
            dependencies.push({
              type: 'component',
              name: item,
              path: importPath
            });
          }
        }
      } else {
        dependencies.push({
          type: 'component',
          name: importedItems,
          path: importPath
        });
      }
    }
  }
  
  // Extract hook usage
  const hookRegex = /use[A-Z][a-zA-Z0-9_]+/g;
  const hooks = new Set();
  
  while ((match = hookRegex.exec(pageContent)) !== null) {
    hooks.add(match[0]);
  }
  
  for (const hook of hooks) {
    dependencies.push({
      type: 'hook',
      name: hook,
      path: `src/hooks/${hook}.ts`
    });
  }
  
  return dependencies;
}

/**
 * Extract description from page content
 * @param {string} pageContent - Page file content
 * @returns {string|null} - Description or null if not found
 */
function extractDescription(pageContent) {
  // Look for JSDoc comment
  const jsDocRegex = /\/\*\*\s*\n\s*\*\s*([^\n]+)/;
  const jsDocMatch = jsDocRegex.exec(pageContent);
  
  if (jsDocMatch) {
    return jsDocMatch[1].trim();
  }
  
  // Look for component description in comments
  const commentRegex = /\/\/\s*([^\n]+)/;
  const commentMatch = commentRegex.exec(pageContent);
  
  if (commentMatch) {
    return commentMatch[1].trim();
  }
  
  return null;
}

/**
 * Generate potential routes based on page name
 * @param {string} pageName - Page name
 * @returns {Array} - Array of potential routes
 */
function generatePotentialRoutes(pageName) {
  const routes = [];
  
  // Convert CamelCase to kebab-case
  const kebabCase = pageName
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase();
  
  // Add standard route
  routes.push(`/${kebabCase}`);
  
  // Add route with ID parameter if it seems like a detail page
  if (pageName.includes('Detail') || pageName.includes('View') || pageName.includes('Profile')) {
    routes.push(`/${kebabCase}/:id`);
  }
  
  // Add admin route if it seems like an admin page
  if (pageName.includes('Admin') || pageName.includes('Management')) {
    routes.push(`/admin/${kebabCase}`);
  }
  
  return routes;
}

/**
 * Determine the category of a page
 * @param {string} pageName - Page name
 * @param {string} pageContent - Page file content
 * @returns {string} - Category key
 */
function determineCategory(pageName, pageContent) {
  // Check for clinical workflow pages
  if (
    pageName.includes('Patient') ||
    pageName.includes('Clinical') ||
    pageName.includes('Visit') ||
    pageName.includes('Task') ||
    pageName.includes('Critical') ||
    pageName.includes('Fluid') ||
    pageContent.includes('patient') ||
    pageContent.includes('clinical')
  ) {
    return 'clinicalWorkflow';
  }
  
  // Check for medication-related pages
  if (
    pageName.includes('Medication') ||
    pageName.includes('Prescription') ||
    pageName.includes('Drug') ||
    pageName.includes('Pharmacy') ||
    pageName.includes('Telemedicine') ||
    pageContent.includes('medication') ||
    pageContent.includes('prescription')
  ) {
    return 'medicationRelated';
  }
  
  // Check for administrative pages
  if (
    pageName.includes('Admin') ||
    pageName.includes('Management') ||
    pageName.includes('Settings') ||
    pageName.includes('Config') ||
    pageName.includes('Role') ||
    pageName.includes('Function') ||
    pageContent.includes('admin') ||
    pageContent.includes('management')
  ) {
    return 'administrative';
  }
  
  // Check for authentication pages
  if (
    pageName.includes('Login') ||
    pageName.includes('Register') ||
    pageName.includes('Auth') ||
    pageName.includes('Password') ||
    pageContent.includes('login') ||
    pageContent.includes('authentication')
  ) {
    return 'authentication';
  }
  
  // Check for utility pages
  if (
    pageName.includes('Help') ||
    pageName.includes('About') ||
    pageName.includes('NotFound') ||
    pageName.includes('Error') ||
    pageName.includes('Index') ||
    pageName.includes('Sector') ||
    pageContent.includes('help') ||
    pageContent.includes('error')
  ) {
    return 'utility';
  }
  
  // Default to content pages
  return 'content';
}

/**
 * Generate reintegration strategy for a page
 * @param {string} pageName - Page name
 * @param {string} category - Page category
 * @returns {Object} - Reintegration strategy
 */
function generateReintegrationStrategy(pageName, category) {
  // Convert CamelCase to kebab-case for route path
  const kebabCase = pageName
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase();
  
  // Determine icon based on category and name
  let icon = 'File';
  
  if (category === 'clinicalWorkflow') {
    icon = 'Clipboard';
    if (pageName.includes('Patient')) icon = 'User';
    if (pageName.includes('Critical')) icon = 'AlertTriangle';
    if (pageName.includes('Fluid')) icon = 'Droplet';
    if (pageName.includes('Task')) icon = 'CheckSquare';
    if (pageName.includes('Visit')) icon = 'Calendar';
  } else if (category === 'medicationRelated') {
    icon = 'Pill';
    if (pageName.includes('Telemedicine')) icon = 'Video';
  } else if (category === 'administrative') {
    icon = 'Settings';
    if (pageName.includes('Role')) icon = 'Shield';
    if (pageName.includes('Function')) icon = 'Package';
  } else if (category === 'authentication') {
    icon = 'Lock';
  } else if (category === 'utility') {
    icon = 'HelpCircle';
    if (pageName.includes('NotFound')) icon = 'AlertCircle';
    if (pageName.includes('Sector')) icon = 'Map';
  } else if (category === 'content') {
    icon = 'FileText';
    if (pageName.includes('Message')) icon = 'MessageSquare';
    if (pageName.includes('Notification')) icon = 'Bell';
  }
  
  // Determine function block based on category
  let functionBlock = 'general';
  
  if (category === 'clinicalWorkflow') {
    functionBlock = 'clinical_workflows';
    if (pageName.includes('Critical')) functionBlock = 'clinical_alerts';
    if (pageName.includes('Fluid')) functionBlock = 'patient_monitoring';
    if (pageName.includes('Task')) functionBlock = 'task_management';
  } else if (category === 'medicationRelated') {
    functionBlock = 'medication_management';
  } else if (category === 'administrative') {
    functionBlock = 'system_administration';
  } else if (category === 'authentication') {
    functionBlock = 'authentication';
  } else if (category === 'utility') {
    functionBlock = 'utilities';
  } else if (category === 'content') {
    functionBlock = 'content_management';
  }
  
  // Determine sidebar section based on category
  let section = 'General';
  
  if (category === 'clinicalWorkflow') {
    section = 'Clinical';
  } else if (category === 'medicationRelated') {
    section = 'Medications';
  } else if (category === 'administrative') {
    section = 'Administration';
  } else if (category === 'authentication') {
    section = 'Authentication';
  } else if (category === 'utility') {
    section = 'Utilities';
  } else if (category === 'content') {
    section = 'Content';
  }
  
  // Determine priority based on category
  let priority = 5;
  
  if (category === 'clinicalWorkflow') {
    priority = 1;
  } else if (category === 'medicationRelated') {
    priority = 2;
  } else if (category === 'administrative') {
    priority = 3;
  } else if (category === 'content') {
    priority = 4;
  }
  
  return {
    routeDefinition: {
      path: `/${kebabCase}`,
      component: pageName,
      title: pageName.replace(/([A-Z])/g, ' $1').trim(),
      icon
    },
    sidebarPlacement: {
      priority,
      section,
      icon
    },
    functionBlock
  };
}

/**
 * Generate Markdown report from analysis results
 * @param {Object} analysisResults - Analysis results
 * @returns {string} - Markdown report content
 */
function generateMarkdownReport(analysisResults) {
  const { metadata, categories } = analysisResults;
  
  let report = `# Orphaned Pages Analysis Report\n\n`;
  
  // Add metadata
  report += `## Overview\n\n`;
  report += `- **Total Orphaned Pages:** ${metadata.totalPages}\n`;
  report += `- **Analysis Date:** ${new Date(metadata.analysisDate).toLocaleDateString()}\n`;
  report += `- **Categories:** ${metadata.categories.length}\n\n`;
  
  // Add summary table
  report += `## Summary by Category\n\n`;
  report += `| Category | Priority | Page Count |\n`;
  report += `|----------|----------|------------|\n`;
  
  for (const [key, category] of Object.entries(categories)) {
    report += `| ${category.name} | ${category.priority} | ${category.pages.length} |\n`;
  }
  
  report += `\n`;
  
  // Add detailed category sections
  report += `## Detailed Analysis\n\n`;
  
  for (const [key, category] of Object.entries(categories)) {
    report += `### ${category.name}\n\n`;
    report += `${category.description}\n\n`;
    report += `**Priority:** ${category.priority}\n\n`;
    
    // Add page table
    report += `| Page | Path | Status | Potential Routes |\n`;
    report += `|------|------|--------|----------------|\n`;
    
    for (const page of category.pages) {
      report += `| ${page.name} | ${page.path} | ${page.status} | ${page.potentialRoutes.join(', ')} |\n`;
    }
    
    report += `\n`;
    
    // Add detailed page sections
    for (const page of category.pages) {
      report += `#### ${page.name}\n\n`;
      report += `- **Path:** ${page.path}\n`;
      report += `- **Description:** ${page.description}\n`;
      report += `- **Status:** ${page.status}\n`;
      report += `- **Potential Routes:** ${page.potentialRoutes.join(', ')}\n`;
      
      if (page.dependencies && page.dependencies.length > 0) {
        report += `- **Dependencies:**\n`;
        
        for (const dep of page.dependencies) {
          report += `  - ${dep.type}: ${dep.name} (${dep.path})\n`;
        }
      }
      
      if (page.reintegrationStrategy) {
        report += `- **Reintegration Strategy:**\n`;
        report += `  - **Route:** ${page.reintegrationStrategy.routeDefinition.path}\n`;
        report += `  - **Sidebar Section:** ${page.reintegrationStrategy.sidebarPlacement.section}\n`;
        report += `  - **Function Block:** ${page.reintegrationStrategy.functionBlock}\n`;
      }
      
      if (page.notes) {
        report += `- **Notes:** ${page.notes}\n`;
      }
      
      report += `\n`;
    }
  }
  
  // Add recommendations
  report += `## Recommendations\n\n`;
  report += `1. **High Priority Pages:** Reintegrate the ${categories.clinicalWorkflow?.pages.length || 0} clinical workflow pages first, as they are most critical to user workflows.\n`;
  report += `2. **Batch Processing:** Use the orphaned-pages-manager.js script to reintegrate pages by category.\n`;
  report += `3. **Testing:** After reintegration, thoroughly test each page to ensure it functions correctly.\n`;
  report += `4. **Documentation:** Update documentation to include information about the reintegrated pages.\n\n`;
  
  // Add next steps
  report += `## Next Steps\n\n`;
  report += `1. Review this analysis report and prioritize pages for reintegration\n`;
  report += `2. Run the reintegration script for high-priority pages:\n`;
  report += `   \`\`\`bash\n`;
  report += `   node orphaned-pages-manager.js reintegrate --category=clinicalWorkflow\n`;
  report += `   \`\`\`\n`;
  report += `3. Test the reintegrated pages\n`;
  report += `4. Continue with remaining categories\n`;
  
  return report;
}

/**
 * Generate hierarchy diagram from analysis results
 * @param {Object} analysisResults - Analysis results
 * @returns {string} - Markdown diagram content
 */
function generateHierarchyDiagram(analysisResults) {
  const { categories } = analysisResults;
  
  let diagram = `# Orphaned Pages Hierarchy Diagram\n\n`;
  
  // Add Mermaid diagram
  diagram += `\`\`\`mermaid\nflowchart TD\n`;
  diagram += `    A[Orphaned Pages] --> B[High Priority]\n`;
  diagram += `    A --> C[Medium Priority]\n`;
  diagram += `    A --> D[Low Priority]\n\n`;
  
  // Add high priority category
  if (categories.clinicalWorkflow) {
    diagram += `    B --> B1[Clinical Workflow]\n`;
    
    for (let i = 0; i < categories.clinicalWorkflow.pages.length; i++) {
      const page = categories.clinicalWorkflow.pages[i];
      diagram += `    B1 --> B1${i+1}[${page.name}]\n`;
    }
    
    diagram += `\n`;
  }
  
  // Add medium priority categories
  let mediumIndex = 1;
  
  for (const [key, category] of Object.entries(categories)) {
    if (category.priority === 'medium') {
      diagram += `    C --> C${mediumIndex}[${category.name}]\n`;
      
      for (let i = 0; i < category.pages.length; i++) {
        const page = category.pages[i];
        diagram += `    C${mediumIndex} --> C${mediumIndex}${i+1}[${page.name}]\n`;
      }
      
      diagram += `\n`;
      mediumIndex++;
    }
  }
  
  // Add low priority categories
  let lowIndex = 1;
  
  for (const [key, category] of Object.entries(categories)) {
    if (category.priority === 'low') {
      diagram += `    D --> D${lowIndex}[${category.name}]\n`;
      
      for (let i = 0; i < category.pages.length; i++) {
        const page = category.pages[i];
        diagram += `    D${lowIndex} --> D${lowIndex}${i+1}[${page.name}]\n`;
      }
      
      diagram += `\n`;
      lowIndex++;
    }
  }
  
  diagram += `\`\`\`\n\n`;
  
  // Add legend
  diagram += `## Legend\n\n`;
  diagram += `- **High Priority:** Pages that are critical to clinical workflows\n`;
  diagram += `- **Medium Priority:** Pages that are important but not critical\n`;
  diagram += `- **Low Priority:** Pages that are useful but not essential\n\n`;
  
  // Add notes
  diagram += `## Notes\n\n`;
  diagram += `This diagram shows the hierarchical organization of orphaned pages by priority and category. `;
  diagram += `It can be used to visualize the scope of the reintegration effort and prioritize work.\n\n`;
  diagram += `The diagram is generated using Mermaid, which can be rendered in GitHub and other Markdown viewers that support it.\n`;
  
  return diagram;
}