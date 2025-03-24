/**
 * Combined Analyzer Tool
 *
 * This script combines the results of the page analyzer and component analyzer
 * to generate a comprehensive report of orphaned components and pages.
 */

const fs = require('fs');
const path = require('path');

// Import types from the page and component analyzers
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

interface PageAnalysisResult {
  pages: PageInfo[];
  routes: any[];
  orphanedPages: PageInfo[];
  clinicalWorkflowPages: {
    prescriptionManagement: PageInfo[];
    clinicalTaskExecution: PageInfo[];
    patientVisitRegistration: PageInfo[];
    other: PageInfo[];
  };
}

interface ComponentAnalysisResult {
  components: ComponentInfo[];
  orphanedComponents: ComponentInfo[];
  clinicalWorkflowComponents: {
    prescriptionManagement: ComponentInfo[];
    clinicalTaskExecution: ComponentInfo[];
    patientVisitRegistration: ComponentInfo[];
    other: ComponentInfo[];
  };
}

interface CombinedAnalysisResult {
  summary: {
    totalPages: number;
    totalComponents: number;
    orphanedPages: number;
    orphanedComponents: number;
    prescriptionManagementOrphans: number;
    clinicalTaskExecutionOrphans: number;
    patientVisitRegistrationOrphans: number;
  };
  orphanedPages: PageInfo[];
  orphanedComponents: ComponentInfo[];
  clinicalWorkflowOrphans: {
    prescriptionManagement: ComponentInfo[];
    clinicalTaskExecution: ComponentInfo[];
    patientVisitRegistration: ComponentInfo[];
  };
  reintegrationRecommendations: {
    highPriority: {
      components: ComponentInfo[];
      pages: PageInfo[];
    };
    mediumPriority: {
      components: ComponentInfo[];
      pages: PageInfo[];
    };
    lowPriority: {
      components: ComponentInfo[];
      pages: PageInfo[];
    };
  };
}

/**
 * Main function to combine analysis results and generate a report
 */
async function combineAnalysisResults() {
  const rootDir = process.cwd();
  const pageAnalysisPath = path.join(rootDir, 'src', 'tools', 'analysis', 'page-analysis-result.json');
  const componentAnalysisPath = path.join(rootDir, 'src', 'tools', 'analysis', 'component-analysis-result.json');
  
  console.log('Starting combined analysis...');
  
  // Check if the analysis results exist
  if (!fs.existsSync(pageAnalysisPath)) {
    console.error(`Page analysis result not found at ${pageAnalysisPath}`);
    console.log('Please run the page analyzer first with: npm run analyze:pages');
    return;
  }
  
  if (!fs.existsSync(componentAnalysisPath)) {
    console.error(`Component analysis result not found at ${componentAnalysisPath}`);
    console.log('Please run the component analyzer first with: npm run analyze:components');
    return;
  }
  
  // Read the analysis results
  const pageAnalysis: PageAnalysisResult = JSON.parse(fs.readFileSync(pageAnalysisPath, 'utf-8'));
  const componentAnalysis: ComponentAnalysisResult = JSON.parse(fs.readFileSync(componentAnalysisPath, 'utf-8'));
  
  // Generate the combined analysis result
  const combinedResult: CombinedAnalysisResult = {
    summary: {
      totalPages: pageAnalysis.pages.length,
      totalComponents: componentAnalysis.components.length,
      orphanedPages: pageAnalysis.orphanedPages.length,
      orphanedComponents: componentAnalysis.orphanedComponents.length,
      prescriptionManagementOrphans: componentAnalysis.clinicalWorkflowComponents.prescriptionManagement.filter(c => c.potentiallyOrphaned).length,
      clinicalTaskExecutionOrphans: componentAnalysis.clinicalWorkflowComponents.clinicalTaskExecution.filter(c => c.potentiallyOrphaned).length,
      patientVisitRegistrationOrphans: componentAnalysis.clinicalWorkflowComponents.patientVisitRegistration.filter(c => c.potentiallyOrphaned).length
    },
    orphanedPages: pageAnalysis.orphanedPages,
    orphanedComponents: componentAnalysis.orphanedComponents,
    clinicalWorkflowOrphans: {
      prescriptionManagement: componentAnalysis.clinicalWorkflowComponents.prescriptionManagement.filter(c => c.potentiallyOrphaned),
      clinicalTaskExecution: componentAnalysis.clinicalWorkflowComponents.clinicalTaskExecution.filter(c => c.potentiallyOrphaned),
      patientVisitRegistration: componentAnalysis.clinicalWorkflowComponents.patientVisitRegistration.filter(c => c.potentiallyOrphaned)
    },
    reintegrationRecommendations: {
      highPriority: {
        components: [],
        pages: []
      },
      mediumPriority: {
        components: [],
        pages: []
      },
      lowPriority: {
        components: [],
        pages: []
      }
    }
  };
  
  // Generate reintegration recommendations
  generateReintegrationRecommendations(combinedResult);
  
  // Write the combined result to a file
  const outputPath = path.join(rootDir, 'src', 'tools', 'analysis', 'combined-analysis-result.json');
  fs.writeFileSync(outputPath, JSON.stringify(combinedResult, null, 2));
  console.log(`Combined analysis result written to ${outputPath}`);
  
  // Generate a markdown report
  generateMarkdownReport(combinedResult);
  
  return combinedResult;
}

/**
 * Generate reintegration recommendations based on the analysis results
 */
function generateReintegrationRecommendations(result: CombinedAnalysisResult) {
  // High priority: Components related to prescription management
  result.clinicalWorkflowOrphans.prescriptionManagement.forEach(component => {
    result.reintegrationRecommendations.highPriority.components.push(component);
  });
  
  // Medium priority: Components related to clinical task execution
  result.clinicalWorkflowOrphans.clinicalTaskExecution.forEach(component => {
    result.reintegrationRecommendations.mediumPriority.components.push(component);
  });
  
  // Medium priority: Components related to patient visit registration
  result.clinicalWorkflowOrphans.patientVisitRegistration.forEach(component => {
    result.reintegrationRecommendations.mediumPriority.components.push(component);
  });
  
  // Low priority: Other orphaned components
  const otherOrphanedComponents = result.orphanedComponents.filter(component => 
    !result.reintegrationRecommendations.highPriority.components.includes(component) &&
    !result.reintegrationRecommendations.mediumPriority.components.includes(component)
  );
  
  otherOrphanedComponents.forEach(component => {
    result.reintegrationRecommendations.lowPriority.components.push(component);
  });
  
  // Pages
  result.orphanedPages.forEach(page => {
    // Check if the page is related to any clinical workflow
    if (page.clinicalWorkflows.includes('prescriptionManagement')) {
      result.reintegrationRecommendations.highPriority.pages.push(page);
    } else if (
      page.clinicalWorkflows.includes('clinicalTaskExecution') ||
      page.clinicalWorkflows.includes('patientVisitRegistration')
    ) {
      result.reintegrationRecommendations.mediumPriority.pages.push(page);
    } else {
      result.reintegrationRecommendations.lowPriority.pages.push(page);
    }
  });
}

/**
 * Generate a markdown report of the combined analysis
 */
function generateMarkdownReport(result: CombinedAnalysisResult) {
  const { summary, orphanedPages, orphanedComponents, clinicalWorkflowOrphans, reintegrationRecommendations } = result;
  
  let markdown = `# OmniCare EMR Orphaned Component Analysis Report\n\n`;
  markdown += `*Generated on ${new Date().toLocaleString()}*\n\n`;
  
  // Summary
  markdown += `## Summary\n\n`;
  markdown += `- Total Pages: ${summary.totalPages}\n`;
  markdown += `- Total Components: ${summary.totalComponents}\n`;
  markdown += `- Orphaned Pages: ${summary.orphanedPages}\n`;
  markdown += `- Orphaned Components: ${summary.orphanedComponents}\n`;
  markdown += `- Prescription Management Orphans: ${summary.prescriptionManagementOrphans}\n`;
  markdown += `- Clinical Task Execution Orphans: ${summary.clinicalTaskExecutionOrphans}\n`;
  markdown += `- Patient Visit Registration Orphans: ${summary.patientVisitRegistrationOrphans}\n\n`;
  
  // Reintegration Recommendations
  markdown += `## Reintegration Recommendations\n\n`;
  
  // High Priority
  markdown += `### High Priority\n\n`;
  markdown += `#### Components\n\n`;
  if (reintegrationRecommendations.highPriority.components.length === 0) {
    markdown += `No high priority components found.\n\n`;
  } else {
    markdown += `| Component | Path | Clinical Workflows |\n`;
    markdown += `|-----------|------|--------------------|\n`;
    reintegrationRecommendations.highPriority.components.forEach(component => {
      markdown += `| ${component.name} | ${component.path} | ${component.clinicalWorkflows.join(', ')} |\n`;
    });
    markdown += `\n`;
  }
  
  markdown += `#### Pages\n\n`;
  if (reintegrationRecommendations.highPriority.pages.length === 0) {
    markdown += `No high priority pages found.\n\n`;
  } else {
    markdown += `| Page | Path | Clinical Workflows |\n`;
    markdown += `|------|------|--------------------|\n`;
    reintegrationRecommendations.highPriority.pages.forEach(page => {
      markdown += `| ${page.name} | ${page.path} | ${page.clinicalWorkflows.join(', ')} |\n`;
    });
    markdown += `\n`;
  }
  
  // Medium Priority
  markdown += `### Medium Priority\n\n`;
  markdown += `#### Components\n\n`;
  if (reintegrationRecommendations.mediumPriority.components.length === 0) {
    markdown += `No medium priority components found.\n\n`;
  } else {
    markdown += `| Component | Path | Clinical Workflows |\n`;
    markdown += `|-----------|------|--------------------|\n`;
    reintegrationRecommendations.mediumPriority.components.forEach(component => {
      markdown += `| ${component.name} | ${component.path} | ${component.clinicalWorkflows.join(', ')} |\n`;
    });
    markdown += `\n`;
  }
  
  markdown += `#### Pages\n\n`;
  if (reintegrationRecommendations.mediumPriority.pages.length === 0) {
    markdown += `No medium priority pages found.\n\n`;
  } else {
    markdown += `| Page | Path | Clinical Workflows |\n`;
    markdown += `|------|------|--------------------|\n`;
    reintegrationRecommendations.mediumPriority.pages.forEach(page => {
      markdown += `| ${page.name} | ${page.path} | ${page.clinicalWorkflows.join(', ')} |\n`;
    });
    markdown += `\n`;
  }
  
  // Low Priority
  markdown += `### Low Priority\n\n`;
  markdown += `#### Components\n\n`;
  if (reintegrationRecommendations.lowPriority.components.length === 0) {
    markdown += `No low priority components found.\n\n`;
  } else {
    markdown += `| Component | Path | Clinical Workflows |\n`;
    markdown += `|-----------|------|--------------------|\n`;
    reintegrationRecommendations.lowPriority.components.forEach(component => {
      markdown += `| ${component.name} | ${component.path} | ${component.clinicalWorkflows.join(', ')} |\n`;
    });
    markdown += `\n`;
  }
  
  markdown += `#### Pages\n\n`;
  if (reintegrationRecommendations.lowPriority.pages.length === 0) {
    markdown += `No low priority pages found.\n\n`;
  } else {
    markdown += `| Page | Path | Clinical Workflows |\n`;
    markdown += `|------|------|--------------------|\n`;
    reintegrationRecommendations.lowPriority.pages.forEach(page => {
      markdown += `| ${page.name} | ${page.path} | ${page.clinicalWorkflows.join(', ')} |\n`;
    });
    markdown += `\n`;
  }
  
  // Clinical Workflow Orphans
  markdown += `## Clinical Workflow Orphans\n\n`;
  
  // Prescription Management
  markdown += `### Prescription Management\n\n`;
  if (clinicalWorkflowOrphans.prescriptionManagement.length === 0) {
    markdown += `No prescription management orphans found.\n\n`;
  } else {
    markdown += `| Component | Path |\n`;
    markdown += `|-----------|------|\n`;
    clinicalWorkflowOrphans.prescriptionManagement.forEach(component => {
      markdown += `| ${component.name} | ${component.path} |\n`;
    });
    markdown += `\n`;
  }
  
  // Clinical Task Execution
  markdown += `### Clinical Task Execution\n\n`;
  if (clinicalWorkflowOrphans.clinicalTaskExecution.length === 0) {
    markdown += `No clinical task execution orphans found.\n\n`;
  } else {
    markdown += `| Component | Path |\n`;
    markdown += `|-----------|------|\n`;
    clinicalWorkflowOrphans.clinicalTaskExecution.forEach(component => {
      markdown += `| ${component.name} | ${component.path} |\n`;
    });
    markdown += `\n`;
  }
  
  // Patient Visit Registration
  markdown += `### Patient Visit Registration\n\n`;
  if (clinicalWorkflowOrphans.patientVisitRegistration.length === 0) {
    markdown += `No patient visit registration orphans found.\n\n`;
  } else {
    markdown += `| Component | Path |\n`;
    markdown += `|-----------|------|\n`;
    clinicalWorkflowOrphans.patientVisitRegistration.forEach(component => {
      markdown += `| ${component.name} | ${component.path} |\n`;
    });
    markdown += `\n`;
  }
  
  // Next Steps
  markdown += `## Next Steps\n\n`;
  markdown += `1. Review the high priority components and pages for reintegration\n`;
  markdown += `2. Analyze each component's functionality and determine how it can be reintegrated\n`;
  markdown += `3. Create a detailed plan for reintegrating each component\n`;
  markdown += `4. Implement the reintegration plan\n`;
  markdown += `5. Test the reintegrated components\n`;
  markdown += `6. Update documentation\n\n`;
  
  // Write the markdown report to a file
  const outputPath = path.join(process.cwd(), 'src', 'tools', 'analysis', 'orphaned-component-report.md');
  fs.writeFileSync(outputPath, markdown);
  console.log(`Markdown report written to ${outputPath}`);
}

// Run the combined analysis
combineAnalysisResults().catch(error => {
  console.error('Error running combined analysis:', error);
});