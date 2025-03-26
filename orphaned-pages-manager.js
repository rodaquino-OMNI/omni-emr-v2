#!/usr/bin/env node
/**
 * Orphaned Pages Manager
 * 
 * A unified script for managing orphaned pages in the OmniCare EMR system.
 * This script combines functionality from multiple existing scripts:
 * - reintegrate-orphaned-pages.js
 * - reintegrate-new-orphaned-pages.js
 * - reintegrate-clinical-workflow-pages.js
 * 
 * Features:
 * - Modular architecture for better maintainability
 * - Command-line interface with multiple operations
 * - Enhanced error handling and validation
 * - Batch processing for multiple pages
 * - Dry-run mode to preview changes
 * 
 * Usage:
 * node orphaned-pages-manager.js <command> [options]
 * 
 * Commands:
 *   analyze     Analyze orphaned pages and generate reports
 *   reintegrate Reintegrate orphaned pages into the application
 *   validate    Validate the integration status of pages
 *   help        Display help information
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===== Module Imports =====
import { parseArguments, displayHelp } from './src/tools/orphaned-pages/cli.js';
import { 
  readFileWithRetry, 
  writeFileWithErrorHandling, 
  backupFile, 
  checkFilePermissions 
} from './src/tools/orphaned-pages/file-utils.js';
import { 
  validateRouteConfig, 
  buildRouteHashMap, 
  checkForExistingRoute 
} from './src/tools/orphaned-pages/validation.js';
import { 
  updateRouteConfig, 
  updateSidebarConfig, 
  updatePermissions, 
  updateTranslations, 
  updateRoutesIndex 
} from './src/tools/orphaned-pages/config-handlers.js';
import { 
  analyzeOrphanedPages, 
  generateReports 
} from './src/tools/orphaned-pages/analysis.js';

// ===== Main Function =====
async function main() {
  try {
    // Parse command-line arguments
    const { command, options } = parseArguments(process.argv.slice(2));
    
    // Execute the appropriate command
    switch (command) {
      case 'analyze':
        await analyzeCommand(options);
        break;
      case 'reintegrate':
        await reintegrateCommand(options);
        break;
      case 'validate':
        await validateCommand(options);
        break;
      case 'help':
        displayHelp();
        break;
      default:
        console.error(`Unknown command: ${command}`);
        displayHelp();
        process.exit(1);
    }
  } catch (error) {
    console.error('An error occurred:', error.message);
    console.error('Please check the logs for details and try again.');
    process.exit(1);
  }
}

// ===== Command Implementations =====

/**
 * Analyze orphaned pages and generate reports
 * @param {Object} options - Command options
 */
async function analyzeCommand(options) {
  console.log('Analyzing orphaned pages...');
  
  // Analyze orphaned pages
  const analysisResults = await analyzeOrphanedPages(options);
  
  // Generate reports
  await generateReports(analysisResults, options);
  
  console.log('Analysis complete!');
  console.log('Reports generated:');
  console.log('  - orphaned-pages-registry.json');
  console.log('  - Orphaned-Pages-Analysis-Report.md');
  
  if (options.openReport) {
    // Open the report using the default application
    const platform = process.platform;
    const reportPath = path.join(__dirname, 'Orphaned-Pages-Analysis-Report.md');
    
    if (platform === 'darwin') {
      // macOS
      const { exec } = await import('child_process');
      exec(`open "${reportPath}"`);
    } else if (platform === 'linux') {
      // Linux
      const { exec } = await import('child_process');
      exec(`xdg-open "${reportPath}"`);
    } else if (platform === 'win32') {
      // Windows
      const { exec } = await import('child_process');
      exec(`start "" "${reportPath}"`);
    } else {
      console.log(`Could not determine how to open the report on your system.`);
      console.log(`Please open it manually: ${reportPath}`);
    }
  }
}

/**
 * Reintegrate orphaned pages into the application
 * @param {Object} options - Command options
 */
async function reintegrateCommand(options) {
  console.log('Reintegrating orphaned pages...');
  
  // Validate options
  if (!options.pages && !options.category && !options.all) {
    console.error('Error: You must specify pages to reintegrate using --pages, --category, or --all');
    process.exit(1);
  }
  
  // Load the registry
  const registryPath = path.join(__dirname, 'orphaned-pages-registry.json');
  let registry;
  
  try {
    const registryContent = await readFileWithRetry(registryPath);
    registry = JSON.parse(registryContent);
  } catch (error) {
    console.error(`Error loading registry: ${error.message}`);
    console.error('Please run the analyze command first to generate the registry.');
    process.exit(1);
  }
  
  // Determine which pages to reintegrate
  let pagesToReintegrate = [];
  
  if (options.pages) {
    // Reintegrate specific pages
    const pageNames = options.pages.split(',').map(p => p.trim());
    
    for (const pageName of pageNames) {
      const page = findPageInRegistry(registry, pageName);
      
      if (page) {
        pagesToReintegrate.push(page);
      } else {
        console.warn(`Warning: Page "${pageName}" not found in registry. Skipping.`);
      }
    }
  } else if (options.category) {
    // Reintegrate pages in a specific category
    const category = options.category;
    
    if (registry.categories[category]) {
      pagesToReintegrate = registry.categories[category].pages;
    } else {
      console.error(`Error: Category "${category}" not found in registry.`);
      console.error('Available categories:');
      
      for (const cat in registry.categories) {
        console.error(`  - ${cat}`);
      }
      
      process.exit(1);
    }
  } else if (options.all) {
    // Reintegrate all pages
    for (const category in registry.categories) {
      pagesToReintegrate = pagesToReintegrate.concat(registry.categories[category].pages);
    }
  }
  
  console.log(`Found ${pagesToReintegrate.length} pages to reintegrate.`);
  
  if (pagesToReintegrate.length === 0) {
    console.log('No pages to reintegrate. Exiting.');
    return;
  }
  
  // Check if this is a dry run
  if (options.dryRun) {
    console.log('Dry run mode. No changes will be made.');
    console.log('Pages that would be reintegrated:');
    
    for (const page of pagesToReintegrate) {
      console.log(`  - ${page.name} (${page.path})`);
    }
    
    return;
  }
  
  // Perform the reintegration
  try {
    // Update configuration files
    await updateRouteConfig(pagesToReintegrate, options);
    await updateSidebarConfig(pagesToReintegrate, options);
    await updatePermissions(pagesToReintegrate, options);
    await updateTranslations(pagesToReintegrate, options);
    await updateRoutesIndex(pagesToReintegrate, options);
    
    // Update the registry with the new status
    for (const page of pagesToReintegrate) {
      page.status = 'reintegrated';
      page.reintegrationDate = new Date().toISOString();
    }
    
    // Save the updated registry
    await writeFileWithErrorHandling(
      registryPath,
      JSON.stringify(registry, null, 2)
    );
    
    console.log('Reintegration complete!');
    console.log('Please test the changes to ensure everything works as expected.');
  } catch (error) {
    console.error(`Error during reintegration: ${error.message}`);
    process.exit(1);
  }
}

/**
 * Validate the integration status of pages
 * @param {Object} options - Command options
 */
async function validateCommand(options) {
  console.log('Validating orphaned pages...');
  
  // Load the registry
  const registryPath = path.join(__dirname, 'orphaned-pages-registry.json');
  let registry;
  
  try {
    const registryContent = await readFileWithRetry(registryPath);
    registry = JSON.parse(registryContent);
  } catch (error) {
    console.error(`Error loading registry: ${error.message}`);
    console.error('Please run the analyze command first to generate the registry.');
    process.exit(1);
  }
  
  // Determine which pages to validate
  let pagesToValidate = [];
  
  if (options.pages) {
    // Validate specific pages
    const pageNames = options.pages.split(',').map(p => p.trim());
    
    for (const pageName of pageNames) {
      const page = findPageInRegistry(registry, pageName);
      
      if (page) {
        pagesToValidate.push(page);
      } else {
        console.warn(`Warning: Page "${pageName}" not found in registry. Skipping.`);
      }
    }
  } else if (options.category) {
    // Validate pages in a specific category
    const category = options.category;
    
    if (registry.categories[category]) {
      pagesToValidate = registry.categories[category].pages;
    } else {
      console.error(`Error: Category "${category}" not found in registry.`);
      console.error('Available categories:');
      
      for (const cat in registry.categories) {
        console.error(`  - ${cat}`);
      }
      
      process.exit(1);
    }
  } else {
    // Validate all pages
    for (const category in registry.categories) {
      pagesToValidate = pagesToValidate.concat(registry.categories[category].pages);
    }
  }
  
  console.log(`Found ${pagesToValidate.length} pages to validate.`);
  
  if (pagesToValidate.length === 0) {
    console.log('No pages to validate. Exiting.');
    return;
  }
  
  // Perform the validation
  try {
    const validationResults = {
      total: pagesToValidate.length,
      reintegrated: 0,
      orphaned: 0,
      partiallyReintegrated: 0,
      details: []
    };
    
    // Check route configuration
    const routeConfigPath = path.join(__dirname, 'src', 'routes', 'RouteConfig.ts');
    const routeConfigContent = await readFileWithRetry(routeConfigPath);
    const routeHashMap = buildRouteHashMap(routeConfigContent);
    
    // Check routes/index.tsx
    const routesIndexPath = path.join(__dirname, 'src', 'routes', 'index.tsx');
    const routesIndexContent = await readFileWithRetry(routesIndexPath);
    
    // Check sidebar configuration
    const sidebarConfigPath = path.join(__dirname, 'src', 'config', 'sidebarConfig.ts');
    const sidebarConfigContent = await readFileWithRetry(sidebarConfigPath);
    
    // Validate each page
    for (const page of pagesToValidate) {
      const result = {
        name: page.name,
        path: page.path,
        status: 'orphaned',
        issues: []
      };
      
      // Check if the page exists
      if (!fs.existsSync(path.join(__dirname, page.path))) {
        result.issues.push(`Page file does not exist: ${page.path}`);
      }
      
      // Check if the page is in RouteConfig.ts
      let inRouteConfig = false;
      
      if (page.potentialRoutes && page.potentialRoutes.length > 0) {
        for (const route of page.potentialRoutes) {
          if (checkForExistingRoute(routeHashMap, route, page.name)) {
            inRouteConfig = true;
            break;
          }
        }
      }
      
      if (!inRouteConfig) {
        result.issues.push('Not found in RouteConfig.ts');
      }
      
      // Check if the page is imported in routes/index.tsx
      const importRegex = new RegExp(`import\\(['\"]\\.\\./${page.path.replace(/\.tsx$/, '')}['\"]\\)`, 'i');
      const isImported = importRegex.test(routesIndexContent);
      
      if (!isImported) {
        result.issues.push('Not imported in routes/index.tsx');
      }
      
      // Check if the page is in sidebarConfig.ts (if it should be)
      if (page.reintegrationStrategy && page.reintegrationStrategy.sidebarPlacement) {
        const nameRegex = new RegExp(`name:\\s*['"]${page.name}['"]`, 'i');
        const inSidebar = nameRegex.test(sidebarConfigContent);
        
        if (!inSidebar) {
          result.issues.push('Not found in sidebarConfig.ts');
        }
      }
      
      // Determine the overall status
      if (result.issues.length === 0) {
        result.status = 'reintegrated';
        validationResults.reintegrated++;
      } else if (result.issues.length < 3) {
        result.status = 'partially-reintegrated';
        validationResults.partiallyReintegrated++;
      } else {
        validationResults.orphaned++;
      }
      
      validationResults.details.push(result);
    }
    
    // Display the results
    console.log('\nValidation Results:');
    console.log(`Total pages: ${validationResults.total}`);
    console.log(`Fully reintegrated: ${validationResults.reintegrated}`);
    console.log(`Partially reintegrated: ${validationResults.partiallyReintegrated}`);
    console.log(`Still orphaned: ${validationResults.orphaned}`);
    
    if (options.verbose) {
      console.log('\nDetailed Results:');
      
      for (const result of validationResults.details) {
        console.log(`\n${result.name} (${result.path}):`);
        console.log(`  Status: ${result.status}`);
        
        if (result.issues.length > 0) {
          console.log('  Issues:');
          
          for (const issue of result.issues) {
            console.log(`    - ${issue}`);
          }
        }
      }
    }
    
    // Save the validation results
    const validationReportPath = path.join(__dirname, 'orphaned-pages-validation-report.json');
    
    await writeFileWithErrorHandling(
      validationReportPath,
      JSON.stringify(validationResults, null, 2)
    );
    
    console.log(`\nValidation report saved to: ${validationReportPath}`);
  } catch (error) {
    console.error(`Error during validation: ${error.message}`);
    process.exit(1);
  }
}

/**
 * Find a page in the registry by name
 * @param {Object} registry - The orphaned pages registry
 * @param {string} pageName - The name of the page to find
 * @returns {Object|null} - The page object or null if not found
 */
function findPageInRegistry(registry, pageName) {
  for (const category in registry.categories) {
    const pages = registry.categories[category].pages;
    
    for (const page of pages) {
      if (page.name === pageName) {
        return page;
      }
    }
  }
  
  return null;
}

// Run the script
main();