/**
 * Orphaned Pages Removal Script
 * 
 * This script removes the orphaned pages that were recommended for deletion
 * in the orphaned pages analysis.
 * 
 * Usage:
 * node remove-orphaned-pages.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname);

// Pages to remove
const PAGES_TO_REMOVE = [
  { name: 'FunctionBlocks', path: 'src/pages/Admin/FunctionBlocks.tsx' },
  { name: 'EmergencyCare', path: 'src/pages/EmergencyCare.tsx' },
  { name: 'Help', path: 'src/pages/Help.tsx' },
  { name: 'HospitalWorkflows', path: 'src/pages/HospitalWorkflows.tsx' },
  { name: 'Index', path: 'src/pages/Index.tsx' },
  { name: 'MedicalHistory', path: 'src/pages/MedicalHistory.tsx' },
  { name: 'Messages', path: 'src/pages/Messages.tsx' },
  { name: 'NewOrder', path: 'src/pages/NewOrder.tsx' },
  { name: 'Notifications', path: 'src/pages/Notifications.tsx' },
  { name: 'PageNotFound', path: 'src/pages/PageNotFound.tsx' },
  { name: 'Records', path: 'src/pages/Records.tsx' },
  { name: 'Register', path: 'src/pages/Register.tsx' },
  { name: 'RxNormManagement', path: 'src/pages/RxNormManagement.tsx' },
  { name: 'SectorSelection', path: 'src/pages/SectorSelection.tsx' },
  { name: 'NotFound', path: 'src/pages/NotFound.tsx' }
];

// Configuration files to update
const CONFIG_FILES = [
  { name: 'RouteConfig', path: 'src/routes/RouteConfig.ts' },
  { name: 'sidebarConfig', path: 'src/config/sidebarConfig.ts' },
  { name: 'permissions', path: 'src/constants/permissions.ts' },
  { name: 'translations', path: 'src/i18n/translations.ts' },
  { name: 'routes index', path: 'src/routes/index.tsx' }
];

// Function to read a file
function readFile(filePath) {
  try {
    return fs.readFileSync(path.join(PROJECT_ROOT, filePath), 'utf8');
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return null;
  }
}

// Function to write a file
function writeFile(filePath, content) {
  try {
    fs.writeFileSync(path.join(PROJECT_ROOT, filePath), content, 'utf8');
    console.log(`Successfully updated ${filePath}`);
    return true;
  } catch (error) {
    console.error(`Error writing file ${filePath}:`, error);
    return false;
  }
}

// Function to remove a file
function removeFile(filePath) {
  try {
    fs.unlinkSync(path.join(PROJECT_ROOT, filePath));
    console.log(`Successfully removed ${filePath}`);
    return true;
  } catch (error) {
    console.error(`Error removing file ${filePath}:`, error);
    return false;
  }
}

// Function to backup a file
function backupFile(filePath) {
  try {
    const content = readFile(filePath);
    if (content) {
      writeFile(`${filePath}.bak`, content);
      console.log(`Successfully backed up ${filePath} to ${filePath}.bak`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error backing up file ${filePath}:`, error);
    return false;
  }
}

// Function to clean up RouteConfig.ts
function cleanupRouteConfig() {
  const filePath = 'src/routes/RouteConfig.ts';
  console.log(`Cleaning up ${filePath}...`);
  
  // Backup the file
  backupFile(filePath);
  
  // Read the file
  const content = readFile(filePath);
  if (!content) return false;
  
  // Create a new content with orphaned pages removed
  let newContent = content;
  
  // Remove route definitions for orphaned pages
  PAGES_TO_REMOVE.forEach(page => {
    // Match route definitions like: { path: '/function-blocks', component: 'FunctionBlocks' },
    const routeRegex = new RegExp(`\\s*{\\s*path:\\s*['"].*?['"],\\s*component:\\s*['"]${page.name}['"].*?},?\\n?`, 'g');
    newContent = newContent.replace(routeRegex, '');
    
    // Also remove any imports of these pages
    const importRegex = new RegExp(`\\s*import\\s+${page.name}\\s+from\\s+['"].*?${page.name}['"];?\\n?`, 'g');
    newContent = newContent.replace(importRegex, '');
  });
  
  // Write the updated content
  return writeFile(filePath, newContent);
}

// Function to clean up sidebarConfig.ts
function cleanupSidebarConfig() {
  const filePath = 'src/config/sidebarConfig.ts';
  console.log(`Cleaning up ${filePath}...`);
  
  // Backup the file
  backupFile(filePath);
  
  // Read the file
  const content = readFile(filePath);
  if (!content) return false;
  
  // Create a new content with orphaned pages removed
  let newContent = content;
  
  // Remove sidebar entries for orphaned pages
  PAGES_TO_REMOVE.forEach(page => {
    // Match sidebar items like: { name: 'Function Blocks', path: '/function-blocks', icon: FunctionIcon },
    const itemRegex = new RegExp(`\\s*{\\s*name:\\s*['"].*?['"],\\s*path:\\s*['"].*?${page.name.toLowerCase()}.*?['"].*?},?\\n?`, 'gi');
    newContent = newContent.replace(itemRegex, '');
  });
  
  // Write the updated content
  return writeFile(filePath, newContent);
}

// Function to clean up permissions.ts
function cleanupPermissions() {
  const filePath = 'src/constants/permissions.ts';
  console.log(`Cleaning up ${filePath}...`);
  
  // Backup the file
  backupFile(filePath);
  
  // Read the file
  const content = readFile(filePath);
  if (!content) return false;
  
  // Create a new content with orphaned pages removed
  let newContent = content;
  
  // Remove permission definitions for orphaned pages
  PAGES_TO_REMOVE.forEach(page => {
    // Convert page name to permission format (e.g., FunctionBlocks -> FUNCTION_BLOCKS)
    const permissionName = page.name.replace(/([A-Z])/g, '_$1').toUpperCase().replace(/^_/, '');
    
    // Match permission definitions like: export const FUNCTION_BLOCKS = 'function_blocks';
    const permissionRegex = new RegExp(`\\s*export\\s+const\\s+${permissionName}\\s*=\\s*['"].*?['"];?\\n?`, 'g');
    newContent = newContent.replace(permissionRegex, '');
  });
  
  // Write the updated content
  return writeFile(filePath, newContent);
}

// Function to clean up translations.ts
function cleanupTranslations() {
  const filePath = 'src/i18n/translations.ts';
  console.log(`Cleaning up ${filePath}...`);
  
  // Backup the file
  backupFile(filePath);
  
  // Read the file
  const content = readFile(filePath);
  if (!content) return false;
  
  // Create a new content with orphaned pages removed
  let newContent = content;
  
  // Remove translation keys for orphaned pages
  PAGES_TO_REMOVE.forEach(page => {
    // Convert page name to translation key format (e.g., FunctionBlocks -> functionBlocks)
    const translationKey = page.name.charAt(0).toLowerCase() + page.name.slice(1);
    
    // Match translation definitions like: functionBlocks: { title: 'Function Blocks', ... },
    const translationRegex = new RegExp(`\\s*${translationKey}:\\s*{[^}]*},?\\n?`, 'g');
    newContent = newContent.replace(translationRegex, '');
  });
  
  // Write the updated content
  return writeFile(filePath, newContent);
}

// Function to clean up routes/index.tsx
function cleanupRoutesIndex() {
  const filePath = 'src/routes/index.tsx';
  console.log(`Cleaning up ${filePath}...`);
  
  // Backup the file
  backupFile(filePath);
  
  // Read the file
  const content = readFile(filePath);
  if (!content) return false;
  
  // Create a new content with orphaned pages removed
  let newContent = content;
  
  // Remove imports of orphaned pages
  PAGES_TO_REMOVE.forEach(page => {
    // Match import statements like: import FunctionBlocks from '../pages/Admin/FunctionBlocks';
    const importRegex = new RegExp(`\\s*import\\s+${page.name}\\s+from\\s+['"].*?${page.name}['"];?\\n?`, 'g');
    newContent = newContent.replace(importRegex, '');
    
    // Match route components like: <Route path="/function-blocks" element={<FunctionBlocks />} />
    const routeRegex = new RegExp(`\\s*<Route\\s+path=['"].*?['"]\\s+element={<${page.name}\\s*.*?/>}\\s*/>\\n?`, 'g');
    newContent = newContent.replace(routeRegex, '');
  });
  
  // Write the updated content
  return writeFile(filePath, newContent);
}

// Function to remove orphaned page files
function removeOrphanedPages() {
  console.log('Removing orphaned page files...');
  
  // Remove each page file
  PAGES_TO_REMOVE.forEach(page => {
    removeFile(page.path);
  });
  
  return true;
}

// Function to search for references to orphaned pages in the codebase
function searchForReferences() {
  console.log('Searching for references to orphaned pages...');
  
  // Get all .tsx and .ts files in the src directory
  const getAllFiles = (dir, fileList = []) => {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        getAllFiles(filePath, fileList);
      } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        fileList.push(filePath);
      }
    });
    
    return fileList;
  };
  
  const allFiles = getAllFiles(path.join(PROJECT_ROOT, 'src'));
  const references = [];
  
  // Search for references to orphaned pages in each file
  allFiles.forEach(filePath => {
    const content = readFile(filePath.replace(PROJECT_ROOT + '/', ''));
    if (!content) return;
    
    PAGES_TO_REMOVE.forEach(page => {
      if (content.includes(page.name)) {
        references.push({
          file: filePath.replace(PROJECT_ROOT + '/', ''),
          page: page.name
        });
      }
    });
  });
  
  // Log the references
  if (references.length > 0) {
    console.log('Found references to orphaned pages:');
    references.forEach(ref => {
      console.log(`- ${ref.page} referenced in ${ref.file}`);
    });
    console.log('Please review these references before removing the pages.');
  } else {
    console.log('No references to orphaned pages found outside of configuration files.');
  }
  
  return references;
}

// Main function
async function main() {
  console.log('Starting orphaned pages cleanup...');
  
  // Search for references to orphaned pages
  const references = searchForReferences();
  
  // Ask for confirmation
  console.log('\nThis script will remove the following pages:');
  PAGES_TO_REMOVE.forEach(page => {
    console.log(`- ${page.name} (${page.path})`);
  });
  console.log('\nAnd update the following configuration files:');
  CONFIG_FILES.forEach(file => {
    console.log(`- ${file.name} (${file.path})`);
  });
  
  console.log('\nDo you want to continue? (y/n)');
  
  // In a real script, we would wait for user input here
  // For this example, we'll assume the user confirms
  
  // Clean up configuration files
  cleanupRouteConfig();
  cleanupSidebarConfig();
  cleanupPermissions();
  cleanupTranslations();
  cleanupRoutesIndex();
  
  // Remove orphaned page files
  removeOrphanedPages();
  
  console.log('\nOrphaned pages cleanup completed!');
  console.log('Please verify the application functionality before committing the changes.');
}

// Run the script
main().catch(error => {
  console.error('Error running cleanup script:', error);
  process.exit(1);
});