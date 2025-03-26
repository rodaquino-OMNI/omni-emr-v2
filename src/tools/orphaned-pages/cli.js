/**
 * Command-line interface utilities for the Orphaned Pages Manager
 */

/**
 * Parse command-line arguments
 * @param {string[]} args - Command-line arguments
 * @returns {Object} - Parsed command and options
 */
export function parseArguments(args) {
  if (args.length === 0) {
    displayHelp();
    process.exit(0);
  }

  const command = args[0];
  const options = {};

  // Parse options
  for (let i = 1; i < args.length; i++) {
    const arg = args[i];

    if (arg.startsWith('--')) {
      const option = arg.slice(2);
      
      if (option.includes('=')) {
        // Handle --option=value format
        const [key, value] = option.split('=');
        options[key] = value;
      } else {
        // Handle --option format (boolean flag)
        const nextArg = args[i + 1];
        
        if (nextArg && !nextArg.startsWith('--')) {
          // Next argument is a value
          options[option] = nextArg;
          i++; // Skip the next argument
        } else {
          // Flag without value
          options[option] = true;
        }
      }
    }
  }

  return { command, options };
}

/**
 * Display help information
 */
export function displayHelp() {
  console.log(`
Orphaned Pages Manager

A unified script for managing orphaned pages in the OmniCare EMR system.

Usage:
  node orphaned-pages-manager.js <command> [options]

Commands:
  analyze     Analyze orphaned pages and generate reports
  reintegrate Reintegrate orphaned pages into the application
  validate    Validate the integration status of pages
  help        Display this help information

Options:
  --pages=<names>    Comma-separated list of page names
  --category=<name>  Category name (e.g., clinicalWorkflow)
  --all              Apply to all pages
  --dry-run          Preview changes without applying them
  --verbose          Display detailed information
  --open-report      Open the generated report

Examples:
  # Analyze all orphaned pages
  node orphaned-pages-manager.js analyze

  # Reintegrate specific pages
  node orphaned-pages-manager.js reintegrate --pages=CriticalResults,FluidBalance

  # Reintegrate all pages in a category
  node orphaned-pages-manager.js reintegrate --category=clinicalWorkflow

  # Validate all pages with detailed output
  node orphaned-pages-manager.js validate --verbose
`);
}