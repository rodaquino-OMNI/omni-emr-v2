/**
 * Report Generator for Orphaned Pages Analysis
 * 
 * This module provides functions for generating reports based on analysis results.
 */

/**
 * Generate a JSON report from analysis results
 * @param {Array} analysisResults - Array of page analysis results
 * @returns {string} - JSON string
 */
export function generateJsonReport(analysisResults) {
  return JSON.stringify(analysisResults, null, 2);
}

/**
 * Generate a Markdown report from analysis results
 * @param {Array} analysisResults - Array of page analysis results
 * @returns {string} - Markdown string
 */
export function generateMarkdownReport(analysisResults) {
  const pagesToReintegrate = analysisResults.filter(page => 
    page.recommendation.decision === 'Reintegrate' || 
    page.recommendation.decision === 'Reintegrate with refactoring' ||
    page.recommendation.decision === 'Reintegrate with major refactoring'
  );
  
  const pagesToDelete = analysisResults.filter(page => 
    page.recommendation.decision === 'Delete' || 
    page.recommendation.decision === 'Consider for deletion or consolidation' ||
    page.recommendation.decision === 'Consider for deletion or replacement'
  );

  // Sort pages by priority
  const priorityOrder = { 'High': 0, 'Medium': 1, 'Low': 2 };
  pagesToReintegrate.sort((a, b) => priorityOrder[a.recommendation.priority] - priorityOrder[b.recommendation.priority]);
  pagesToDelete.sort((a, b) => priorityOrder[a.recommendation.priority] - priorityOrder[b.recommendation.priority]);

  let report = `# Orphaned Pages Analysis Report

## Executive Summary

This report presents a comprehensive analysis of the remaining orphaned pages in the OmniCare EMR system. The analysis evaluated each page based on technical quality and functional uniqueness to determine whether it should be reintegrated or deleted.

### Key Findings

- **Total Orphaned Pages Analyzed**: ${analysisResults.length}
- **Pages Recommended for Reintegration**: ${pagesToReintegrate.length}
- **Pages Recommended for Deletion**: ${pagesToDelete.length}

## Pages to Reintegrate

The following pages are recommended for reintegration based on their technical quality and functional uniqueness:

| Page | Clinical Workflow | User Roles | Priority | Justification |
|------|-------------------|------------|----------|---------------|
`;

  pagesToReintegrate.forEach(page => {
    report += `| ${page.name} | ${page.workflowAndRoles.clinicalWorkflow} | ${page.workflowAndRoles.userRoles.join(', ')} | ${page.recommendation.priority} | ${page.recommendation.justification} |\n`;
  });

  report += `\n## Pages to Delete

The following pages are recommended for deletion or consolidation:

| Page | Clinical Workflow | User Roles | Priority | Justification |
|------|-------------------|------------|----------|---------------|
`;

  pagesToDelete.forEach(page => {
    report += `| ${page.name} | ${page.workflowAndRoles.clinicalWorkflow} | ${page.workflowAndRoles.userRoles.join(', ')} | ${page.recommendation.priority} | ${page.recommendation.justification} |\n`;
  });

  report += `\n## Implementation Roadmap

### Phase 1: High Priority Reintegration

`;

  const highPriorityPages = pagesToReintegrate.filter(page => page.recommendation.priority === 'High');
  highPriorityPages.forEach((page, index) => {
    report += `${index + 1}. **${page.name}**
   - Clinical Workflow: ${page.workflowAndRoles.clinicalWorkflow}
   - User Roles: ${page.workflowAndRoles.userRoles.join(', ')}
   - Strategy: ${page.recommendation.strategy}
   - Technical Considerations: ${page.technicalAssessment.issues.length > 0 ? page.technicalAssessment.issues.join(', ') : 'No significant issues'}
   - Implementation Steps:
${page.implementationSteps.map(step => `     * ${step}`).join('\n')}

`;
  });

  report += `\n### Phase 2: Medium Priority Reintegration

`;

  const mediumPriorityPages = pagesToReintegrate.filter(page => page.recommendation.priority === 'Medium');
  mediumPriorityPages.forEach((page, index) => {
    report += `${index + 1}. **${page.name}**
   - Clinical Workflow: ${page.workflowAndRoles.clinicalWorkflow}
   - User Roles: ${page.workflowAndRoles.userRoles.join(', ')}
   - Strategy: ${page.recommendation.strategy}
   - Technical Considerations: ${page.technicalAssessment.issues.length > 0 ? page.technicalAssessment.issues.join(', ') : 'No significant issues'}
   - Implementation Steps:
${page.implementationSteps.map(step => `     * ${step}`).join('\n')}

`;
  });

  report += `\n### Phase 3: Low Priority Reintegration and Cleanup

`;

  const lowPriorityPages = pagesToReintegrate.filter(page => page.recommendation.priority === 'Low');
  lowPriorityPages.forEach((page, index) => {
    report += `${index + 1}. **${page.name}**
   - Clinical Workflow: ${page.workflowAndRoles.clinicalWorkflow}
   - User Roles: ${page.workflowAndRoles.userRoles.join(', ')}
   - Strategy: ${page.recommendation.strategy}
   - Technical Considerations: ${page.technicalAssessment.issues.length > 0 ? page.technicalAssessment.issues.join(', ') : 'No significant issues'}
   - Implementation Steps:
${page.implementationSteps.map(step => `     * ${step}`).join('\n')}

`;
  });

  report += `\n## Detailed Page Analyses

`;

  analysisResults.forEach(page => {
    report += `### ${page.name}

#### Basic Information
- **File Path**: ${page.filePath}
- **Last Modified**: ${page.lastModified}

#### Technical Assessment
- **Code Quality**: ${page.technicalAssessment.codeQuality}
- **Issues**: ${page.technicalAssessment.issues.length > 0 ? page.technicalAssessment.issues.join(', ') : 'No significant issues'}

#### Functional Assessment
- **Uniqueness**: ${page.functionalAssessment.uniqueness}
- **Primary Functionality**: ${page.functionalAssessment.primaryFunctionality}
- **Unique Features**: ${page.functionalAssessment.uniqueFeatures.join(', ')}
- **Overlap with Existing Functionality**: ${page.functionalAssessment.overlap.length > 0 ? page.functionalAssessment.overlap.join(', ') : 'No significant overlap'}

#### Workflow and Role Mapping
- **Clinical Workflow**: ${page.workflowAndRoles.clinicalWorkflow}
- **Relevant User Roles**: ${page.workflowAndRoles.userRoles.join(', ')}

#### Recommendation
- **Decision**: ${page.recommendation.decision}
- **Justification**: ${page.recommendation.justification}
- **Implementation Priority**: ${page.recommendation.priority}
- **Integration Strategy**: ${page.recommendation.strategy}
- **Implementation Steps**:
${page.implementationSteps.map(step => `  * ${step}`).join('\n')}

`;
  });

  return report;
}

/**
 * Generate a hierarchical diagram in Mermaid format
 * @param {Array} analysisResults - Array of page analysis results
 * @returns {string} - Mermaid diagram code
 */
export function generateHierarchicalDiagram(analysisResults) {
  // Group pages by workflow
  const workflowGroups = {};
  analysisResults.forEach(page => {
    const workflow = page.workflowAndRoles.clinicalWorkflow;
    if (!workflowGroups[workflow]) {
      workflowGroups[workflow] = [];
    }
    workflowGroups[workflow].push(page);
  });

  // Generate diagram
  let diagram = `graph TD
    subgraph "Clinical Workflows"
`;

  // Add workflow nodes
  Object.keys(workflowGroups).forEach((workflow, index) => {
    diagram += `        CW${index + 1}["${workflow}"]\n`;
  });

  diagram += `    end
    
    subgraph "User Roles"
        UR1["Doctor"]
        UR2["Nurse"]
        UR3["Admin"]
        UR4["System Administrator"]
        UR5["Pharmacist"]
    end
    
`;

  // Add page nodes and connect to workflows
  let pageIndex = 1;
  Object.entries(workflowGroups).forEach(([workflow, pages], workflowIndex) => {
    pages.forEach(page => {
      diagram += `    CW${workflowIndex + 1} --- P${pageIndex}["${page.name}"]\n`;
      pageIndex++;
    });
  });

  // Reset page index and connect pages to roles
  pageIndex = 1;
  Object.entries(workflowGroups).forEach(([workflow, pages]) => {
    pages.forEach(page => {
      page.workflowAndRoles.userRoles.forEach(role => {
        let roleIndex;
        switch (role) {
          case 'doctor': roleIndex = 1; break;
          case 'nurse': roleIndex = 2; break;
          case 'admin': roleIndex = 3; break;
          case 'system_administrator': roleIndex = 4; break;
          case 'pharmacist': roleIndex = 5; break;
          default: return; // Skip unknown roles
        }
        diagram += `    P${pageIndex} --- UR${roleIndex}\n`;
      });
      pageIndex++;
    });
  });

  return diagram;
}