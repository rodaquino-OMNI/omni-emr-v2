#!/bin/bash

# Analyze Orphaned Pages
# This script runs the orphaned pages analysis tools

echo "Starting Orphaned Pages Analysis..."

# Change to the analysis directory
cd src/tools/analysis

# Run the analysis
node runAnalysis.js

# Check if the analysis was successful
if [ $? -eq 0 ]; then
  echo "Analysis completed successfully!"
  echo "Reports generated:"
  echo "  - orphaned-pages-detailed-analysis.json"
  echo "  - Orphaned-Pages-Final-Analysis-Report.md"
  echo "  - orphaned-pages-hierarchy-diagram.md"
  
  # Ask if the user wants to open the report
  read -p "Would you like to open the Markdown report? (y/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    # Open the report using the default application
    if [[ "$OSTYPE" == "darwin"* ]]; then
      # macOS
      open Orphaned-Pages-Final-Analysis-Report.md
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
      # Linux
      xdg-open Orphaned-Pages-Final-Analysis-Report.md
    elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
      # Windows
      start Orphaned-Pages-Final-Analysis-Report.md
    else
      echo "Could not determine how to open the report on your system."
      echo "Please open it manually: Orphaned-Pages-Final-Analysis-Report.md"
    fi
  fi
else
  echo "Analysis failed. Please check the error messages above."
fi

# Return to the original directory
cd - > /dev/null