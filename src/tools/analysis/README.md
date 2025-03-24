# OmniCare EMR Component Analysis Tools

This directory contains tools for analyzing the OmniCare EMR codebase to identify orphaned components and pages, and generate reports with recommendations for reintegration.

## Overview

The analysis tools are designed to help identify components and pages that are no longer referenced in the application but may contain valuable business logic and UX benefits that should be reintegrated. The tools focus on three critical clinical workflows:

1. **Prescription Management**: Components related to prescription creation, medication reconciliation, pharmacy integration, etc.
2. **Clinical Task Execution**: Components related to medication verification, vital signs monitoring, fluid balance recording, etc.
3. **Patient Visit Registration**: Components related to patient check-in, visit documentation, appointment scheduling, etc.

## Tools

### Page Analyzer (`pageAnalyzer.ts`)

This tool analyzes the `src/pages/` directory to identify pages that are not referenced in the routing configuration. It generates a report of potentially orphaned pages and categorizes them by clinical workflow.

### Component Analyzer (`componentAnalyzer.ts`)

This tool analyzes the `src/components/` directory to identify components that are not imported by any page or other component. It generates a report of potentially orphaned components and categorizes them by clinical workflow.

### Combined Analyzer (`combinedAnalyzer.ts`)

This tool combines the results of the page analyzer and component analyzer to generate a comprehensive report with reintegration recommendations. It prioritizes components and pages based on their clinical workflow relevance.

## Running the Tools

### Prerequisites

Make sure you have the required dependencies installed:

```bash
npm install
```

### Running Individual Analyzers

To run the page analyzer:

```bash
npm run analyze:pages
```

To run the component analyzer:

```bash
npm run analyze:components
```

To run the combined analyzer (requires the page and component analyzers to be run first):

```bash
npm run analyze:combined
```

### Running All Analyzers

To run all analyzers in sequence:

```bash
npm run analyze
```

## Output

The tools generate the following output files:

- `src/tools/analysis/page-analysis-result.json`: Raw JSON output from the page analyzer
- `src/tools/analysis/page-analysis-report.md`: Markdown report from the page analyzer
- `src/tools/analysis/component-analysis-result.json`: Raw JSON output from the component analyzer
- `src/tools/analysis/component-analysis-report.md`: Markdown report from the component analyzer
- `src/tools/analysis/combined-analysis-result.json`: Raw JSON output from the combined analyzer
- `src/tools/analysis/orphaned-component-report.md`: Comprehensive markdown report with reintegration recommendations

## Interpreting the Results

### Page Analysis Report

The page analysis report includes:

- A summary of all pages in the application
- A list of potentially orphaned pages
- Pages categorized by clinical workflow

### Component Analysis Report

The component analysis report includes:

- A summary of all components in the application
- A list of potentially orphaned components
- Components categorized by clinical workflow

### Orphaned Component Report

The orphaned component report includes:

- A summary of all orphaned pages and components
- Reintegration recommendations prioritized by clinical workflow relevance
- Detailed lists of orphaned components categorized by clinical workflow
- Next steps for reintegration

## Reintegration Strategy

The reintegration strategy is based on the following priorities:

1. **High Priority**: Components and pages related to prescription management
2. **Medium Priority**: Components and pages related to clinical task execution and patient visit registration
3. **Low Priority**: Other orphaned components and pages

For each component or page, the reintegration process should include:

1. Analyzing the component's functionality and business logic
2. Identifying appropriate integration points in the current application
3. Making necessary modifications to adapt the component to the current architecture
4. Testing the reintegrated component
5. Updating documentation

## Limitations

The analysis tools have the following limitations:

- They use simplified AST traversal and may not catch all import/export patterns
- They rely on naming conventions and keywords to categorize components by clinical workflow
- They do not analyze dynamic imports or lazy-loaded components
- They do not analyze component usage in JSX/TSX code (only import statements)

## Contributing

To improve the analysis tools, consider:

- Enhancing the AST traversal to catch more import/export patterns
- Adding support for dynamic imports and lazy-loaded components
- Improving the categorization of components by clinical workflow
- Adding support for analyzing component usage in JSX/TSX code