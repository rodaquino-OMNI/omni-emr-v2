/**
 * Run Orphaned Pages Analysis
 * 
 * This script runs the orphaned pages analysis and generates reports.
 * 
 * Usage:
 * node src/tools/analysis/runAnalysis.js
 */

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the analyzer script
const ANALYZER_SCRIPT = path.join(__dirname, 'orphanedPagesAnalyzer.js');

/**
 * Run the analyzer script
 */
function runAnalyzer() {
  console.log('Running orphaned pages analyzer...');
  
  // Spawn the analyzer process
  const analyzer = spawn('node', [ANALYZER_SCRIPT], {
    stdio: 'inherit', // Inherit stdio to see output in real-time
    shell: true // Use shell to ensure proper path resolution
  });
  
  // Handle process events
  analyzer.on('close', (code) => {
    if (code === 0) {
      console.log('Analysis completed successfully!');
      console.log('Reports have been generated in the project root directory.');
    } else {
      console.error(`Analysis failed with code ${code}`);
    }
  });
  
  analyzer.on('error', (error) => {
    console.error('Error running analyzer:', error);
  });
}

// Run the analyzer
runAnalyzer();