# Orphaned Pages Analysis Tools

This directory contains tools for analyzing orphaned pages in the OmniCare EMR system.

## Overview

The analysis tools are designed to evaluate orphaned pages based on:
- Technical quality
- Functional uniqueness
- Clinical workflow relevance
- User role applicability

Based on this analysis, the tools generate recommendations for each page, categorizing them into:
- Pages to reintegrate (as-is or with refactoring)
- Pages to delete or consolidate

## Directory Structure

```
analysis/
├── analyzers/                  # Analysis modules
│   ├── codeQualityAnalyzer.js  # Code quality analysis
│   ├── functionalAnalyzer.js   # Functional uniqueness analysis
│   ├── recommendationGenerator.js # Recommendation generation
│   └── workflowAnalyzer.js     # Clinical workflow and role mapping
├── reporters/                  # Report generation modules
│   └── reportGenerator.js      # JSON and Markdown report generation
├── utils/                      # Utility modules
│   └── fileUtils.js            # File operation utilities
├── orphanedPagesAnalyzer.js    # Main analyzer script
├── runAnalysis.js              # Script to run the analysis
└── README.md                   # This file
```

## Usage

To run the analysis, execute the following command from the project root:

```bash
node src/tools/analysis/runAnalysis.js
```

This will:
1. Analyze all remaining orphaned pages
2. Generate a detailed JSON analysis in `orphaned-pages-detailed-analysis.json`
3. Generate a Markdown report in `Orphaned-Pages-Final-Analysis-Report.md`
4. Generate a hierarchical diagram in `orphaned-pages-hierarchy-diagram.md`

## Output Files

### JSON Analysis

The `orphaned-pages-detailed-analysis.json` file contains detailed analysis results for each page, including:
- Technical assessment
- Functional assessment
- Workflow and role mapping
- Recommendation
- Implementation steps

### Markdown Report

The `Orphaned-Pages-Final-Analysis-Report.md` file provides a human-readable report with:
- Executive summary
- Pages to reintegrate (with priorities)
- Pages to delete
- Implementation roadmap
- Detailed page analyses

### Hierarchical Diagram

The `orphaned-pages-hierarchy-diagram.md` file contains a Mermaid diagram showing:
- Clinical workflows
- Pages
- User roles
- Relationships between them

## Customization

To analyze different pages, modify the `REMAINING_ORPHANED_PAGES` array in `orphanedPagesAnalyzer.js`.

## Extending the Analysis

To add new analysis criteria:
1. Create a new analyzer module in the `analyzers` directory
2. Import and use it in `orphanedPagesAnalyzer.js`
3. Update the report generation in `reporters/reportGenerator.js`