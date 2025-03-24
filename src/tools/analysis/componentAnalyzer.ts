/**
 * Component Analyzer Tool
 *
 * This script analyzes the components directory to identify potential orphaned components
 * and generate a report of the findings.
 */

const fs = require('fs');
const path = require('path');
const { parse: parseTypescript } = require('@typescript-eslint/typescript-estree');

// Types for our analysis
interface ComponentInfo {
  path: string;
  name: string;
  imports: string[];
  exports: string[];
  importedBy: string[];
  isImported: boolean;
  potentiallyOrphaned: boolean;
  clinicalWorkflows: string[];
}

interface AnalysisResult {
  components: ComponentInfo[];
  orphanedComponents: ComponentInfo[];
  clinicalWorkflowComponents: {
    prescriptionManagement: ComponentInfo[];
    clinicalTaskExecution: ComponentInfo[];
    patientVisitRegistration: ComponentInfo[];
    other: ComponentInfo[];
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
 * Main function to analyze components and generate a report
 */
async function analyzeComponents() {
  const rootDir = process.cwd();
  const componentsDir = path.join(rootDir, 'src', 'components');
  const pagesDir = path.join(rootDir, 'src', 'pages');
  
  console.log('Starting component analysis...');
  console.log(`Components directory: ${componentsDir}`);
  console.log(`Pages directory: ${pagesDir}`);
  
  // Get all components
  const components = await getAllComponents(componentsDir);
  console.log(`Found ${components.length} components`);
  
  // Create a map of component paths to component info
  const componentMap = new Map<string, ComponentInfo>();
  components.forEach(component => {
    componentMap.set(component.path, component);
  });
  
  // Check which components are imported by pages
  await checkComponentImportsInDirectory(pagesDir, componentMap);
  
  // Check which components are imported by other components
  await checkComponentImportsInDirectory(componentsDir, componentMap);
  
  // Update component info with import information
  const componentsWithImportInfo = Array.from(componentMap.values());
  
  // Identify orphaned components
  const orphanedComponents = componentsWithImportInfo.filter(component => component.potentiallyOrphaned);
  console.log(`Found ${orphanedComponents.length} potentially orphaned components`);
  
  // Categorize components by clinical workflow
  const clinicalWorkflowComponents = categorizeComponentsByWorkflow(componentsWithImportInfo);
  
  // Generate the analysis result
  const result: AnalysisResult = {
    components: componentsWithImportInfo,
    orphanedComponents,
    clinicalWorkflowComponents
  };
  
  // Write the result to a file
  const outputPath = path.join(rootDir, 'src', 'tools', 'analysis', 'component-analysis-result.json');
  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
  console.log(`Analysis result written to ${outputPath}`);
  
  // Generate a markdown report
  generateMarkdownReport(result);
  
  return result;
}

/**
 * Get all components from the components directory
 */
async function getAllComponents(componentsDir: string): Promise<ComponentInfo[]> {
  const components: ComponentInfo[] = [];
  
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
        const relativePath = path.relative(componentsDir, fullPath);
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
          
          components.push({
            path: relativePath,
            name,
            imports,
            exports,
            importedBy: [],
            isImported: false,
            potentiallyOrphaned: true, // Assume orphaned until proven otherwise
            clinicalWorkflows: []
          });
        } catch (error) {
          console.error(`Error parsing ${fullPath}:`, error);
        }
      }
    }
  }
  
  await scanDirectory(componentsDir);
  return components;
}

/**
 * Check which components are imported by files in a directory
 */
async function checkComponentImportsInDirectory(dir: string, componentMap: Map<string, ComponentInfo>) {
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
          // Parse the file to extract imports
          const ast = parseTypescript(content, {
            jsx: true,
            loc: true,
          });
          
          // Extract imports (simplified)
          for (const node of ast.body) {
            if (node.type === 'ImportDeclaration') {
              const importPath = node.source.value as string;
              
              // Check if the import is a component
              if (importPath.includes('@/components/') || importPath.includes('../components/')) {
                // Extract the component path from the import
                const componentPath = importPath
                  .replace('@/components/', '')
                  .replace('../components/', '');
                
                // Find the component in the map
                for (const [path, component] of componentMap.entries()) {
                  // Check if the import matches the component path
                  // This is a simplified check - in a real implementation, we would need to handle
                  // different import styles and path resolution
                  if (path.includes(componentPath) || componentPath.includes(path)) {
                    component.importedBy.push(fullPath);
                    component.isImported = true;
                    component.potentiallyOrphaned = false;
                    break;
                  }
                }
              }
            }
          }
        } catch (error) {
          console.error(`Error parsing ${fullPath}:`, error);
        }
      }
    }
  }
  
  await scanDirectory(dir);
}

/**
 * Categorize components by clinical workflow
 */
function categorizeComponentsByWorkflow(components: ComponentInfo[]): {
  prescriptionManagement: ComponentInfo[];
  clinicalTaskExecution: ComponentInfo[];
  patientVisitRegistration: ComponentInfo[];
  other: ComponentInfo[];
} {
  const result = {
    prescriptionManagement: [] as ComponentInfo[],
    clinicalTaskExecution: [] as ComponentInfo[],
    patientVisitRegistration: [] as ComponentInfo[],
    other: [] as ComponentInfo[]
  };
  
  components.forEach(component => {
    // Check if the component name or path contains keywords related to clinical workflows
    const componentName = component.name.toLowerCase();
    const componentPath = component.path.toLowerCase();
    
    // Check for prescription management keywords
    if (workflowKeywords.prescriptionManagement.some(keyword => 
      componentName.includes(keyword) || componentPath.includes(keyword)
    )) {
      component.clinicalWorkflows.push('prescriptionManagement');
      result.prescriptionManagement.push(component);
    }
    
    // Check for clinical task execution keywords
    if (workflowKeywords.clinicalTaskExecution.some(keyword => 
      componentName.includes(keyword) || componentPath.includes(keyword)
    )) {
      component.clinicalWorkflows.push('clinicalTaskExecution');
      result.clinicalTaskExecution.push(component);
    }
    
    // Check for patient visit registration keywords
    if (workflowKeywords.patientVisitRegistration.some(keyword => 
      componentName.includes(keyword) || componentPath.includes(keyword)
    )) {
      component.clinicalWorkflows.push('patientVisitRegistration');
      result.patientVisitRegistration.push(component);
    }
    
    // If the component doesn't belong to any clinical workflow, add it to the "other" category
    if (component.clinicalWorkflows.length === 0) {
      result.other.push(component);
    }
  });
  
  return result;
}

/**
 * Generate a markdown report of the analysis
 */
function generateMarkdownReport(result: AnalysisResult) {
  const { components, orphanedComponents, clinicalWorkflowComponents } = result;
  
  let markdown = `# OmniCare EMR Component Analysis Report\n\n`;
  markdown += `*Generated on ${new Date().toLocaleString()}*\n\n`;
  
  // Summary
  markdown += `## Summary\n\n`;
  markdown += `- Total Components: ${components.length}\n`;
  markdown += `- Potentially Orphaned Components: ${orphanedComponents.length}\n`;
  markdown += `- Prescription Management Components: ${clinicalWorkflowComponents.prescriptionManagement.length}\n`;
  markdown += `- Clinical Task Execution Components: ${clinicalWorkflowComponents.clinicalTaskExecution.length}\n`;
  markdown += `- Patient Visit Registration Components: ${clinicalWorkflowComponents.patientVisitRegistration.length}\n`;
  markdown += `- Other Components: ${clinicalWorkflowComponents.other.length}\n\n`;
  
  // Orphaned Components
  markdown += `## Potentially Orphaned Components\n\n`;
  if (orphanedComponents.length === 0) {
    markdown += `No potentially orphaned components found.\n\n`;
  } else {
    markdown += `| Component | Path | Clinical Workflows |\n`;
    markdown += `|-----------|------|--------------------|\n`;
    orphanedComponents.forEach(component => {
      markdown += `| ${component.name} | ${component.path} | ${component.clinicalWorkflows.join(', ') || 'None'} |\n`;
    });
    markdown += `\n`;
  }
  
  // Clinical Workflow Components
  markdown += `## Clinical Workflow Components\n\n`;
  
  // Prescription Management
  markdown += `### Prescription Management\n\n`;
  if (clinicalWorkflowComponents.prescriptionManagement.length === 0) {
    markdown += `No prescription management components found.\n\n`;
  } else {
    markdown += `| Component | Path | Orphaned |\n`;
    markdown += `|-----------|------|----------|\n`;
    clinicalWorkflowComponents.prescriptionManagement.forEach(component => {
      markdown += `| ${component.name} | ${component.path} | ${component.potentiallyOrphaned ? 'Yes' : 'No'} |\n`;
    });
    markdown += `\n`;
  }
  
  // Clinical Task Execution
  markdown += `### Clinical Task Execution\n\n`;
  if (clinicalWorkflowComponents.clinicalTaskExecution.length === 0) {
    markdown += `No clinical task execution components found.\n\n`;
  } else {
    markdown += `| Component | Path | Orphaned |\n`;
    markdown += `|-----------|------|----------|\n`;
    clinicalWorkflowComponents.clinicalTaskExecution.forEach(component => {
      markdown += `| ${component.name} | ${component.path} | ${component.potentiallyOrphaned ? 'Yes' : 'No'} |\n`;
    });
    markdown += `\n`;
  }
  
  // Patient Visit Registration
  markdown += `### Patient Visit Registration\n\n`;
  if (clinicalWorkflowComponents.patientVisitRegistration.length === 0) {
    markdown += `No patient visit registration components found.\n\n`;
  } else {
    markdown += `| Component | Path | Orphaned |\n`;
    markdown += `|-----------|------|----------|\n`;
    clinicalWorkflowComponents.patientVisitRegistration.forEach(component => {
      markdown += `| ${component.name} | ${component.path} | ${component.potentiallyOrphaned ? 'Yes' : 'No'} |\n`;
    });
    markdown += `\n`;
  }
  
  // Write the markdown report to a file
  const outputPath = path.join(process.cwd(), 'src', 'tools', 'analysis', 'component-analysis-report.md');
  fs.writeFileSync(outputPath, markdown);
  console.log(`Markdown report written to ${outputPath}`);
}

// Run the analysis
analyzeComponents().catch(error => {
  console.error('Error running component analysis:', error);
});