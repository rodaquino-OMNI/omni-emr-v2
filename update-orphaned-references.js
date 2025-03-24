/**
 * Update Orphaned References Script
 * 
 * This script identifies and updates references to orphaned pages that were removed
 * from the codebase. It analyzes the codebase, finds references to the removed pages,
 * and helps update them with appropriate replacements or removals.
 * 
 * Usage:
 * node update-orphaned-references.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname);

// List of removed orphaned pages
const REMOVED_PAGES = [
  'FunctionBlocks',
  'EmergencyCare',
  'Help',
  'HospitalWorkflows',
  'Index',
  'MedicalHistory',
  'Messages',
  'NewOrder',
  'Notifications',
  'PageNotFound',
  'Records',
  'Register',
  'RxNormManagement',
  'SectorSelection',
  'NotFound'
];

// Suggested replacements for orphaned pages
const REPLACEMENTS = {
  'FunctionBlocks': 'Admin', // Replace with Admin page
  'EmergencyCare': 'Dashboard', // Replace with Dashboard
  'Help': 'Dashboard', // Replace with Dashboard
  'HospitalWorkflows': 'Dashboard', // Replace with Dashboard
  'Index': 'Dashboard', // Replace with Dashboard
  'MedicalHistory': 'PatientDetail', // Replace with PatientDetail
  'Messages': 'Dashboard', // Replace with Dashboard
  'NewOrder': 'Orders', // Replace with Orders
  'Notifications': 'Dashboard', // Replace with Dashboard
  'PageNotFound': 'Dashboard', // Replace with Dashboard
  'Records': 'PatientDetail', // Replace with PatientDetail
  'Register': 'Login', // Replace with Login
  'RxNormManagement': 'Medications', // Replace with Medications
  'SectorSelection': 'Dashboard', // Replace with Dashboard
  'NotFound': 'Dashboard' // Replace with Dashboard
};

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

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

// Function to get all .tsx and .ts files in the src directory
function getAllFiles(dir, fileList = []) {
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
}

// Function to find references to orphaned pages in a file
function findReferences(filePath, content) {
  const references = [];
  
  REMOVED_PAGES.forEach(page => {
    // Check for import statements
    const importRegex = new RegExp(`import\\s+${page}\\s+from\\s+['"].*?${page}['"]`, 'g');
    let match;
    while ((match = importRegex.exec(content)) !== null) {
      references.push({
        page,
        type: 'import',
        line: content.substring(0, match.index).split('\n').length,
        match: match[0],
        replacement: null // Will be determined later
      });
    }
    
    // Check for component usage
    const componentRegex = new RegExp(`<${page}\\s*.*?\\/>|<${page}\\s*.*?>.*?<\\/${page}>`, 'g');
    while ((match = componentRegex.exec(content)) !== null) {
      references.push({
        page,
        type: 'component',
        line: content.substring(0, match.index).split('\n').length,
        match: match[0],
        replacement: null // Will be determined later
      });
    }
    
    // Check for references in routes
    const routeRegex = new RegExp(`path:\\s*['"].*?['"]\\s*,\\s*element:\\s*{<${page}\\s*.*?\\/>}`, 'g');
    while ((match = routeRegex.exec(content)) !== null) {
      references.push({
        page,
        type: 'route',
        line: content.substring(0, match.index).split('\n').length,
        match: match[0],
        replacement: null // Will be determined later
      });
    }
    
    // Check for other references
    const otherRegex = new RegExp(`\\b${page}\\b`, 'g');
    while ((match = otherRegex.exec(content)) !== null) {
      // Skip if this reference is already captured by other regex
      const alreadyCaptured = references.some(ref => 
        ref.line === content.substring(0, match.index).split('\n').length &&
        ref.match.includes(match[0])
      );
      
      if (!alreadyCaptured) {
        references.push({
          page,
          type: 'other',
          line: content.substring(0, match.index).split('\n').length,
          match: match[0],
          replacement: null // Will be determined later
        });
      }
    }
  });
  
  return references;
}

// Function to suggest replacements for references
function suggestReplacements(references) {
  return references.map(ref => {
    const replacement = REPLACEMENTS[ref.page];
    
    if (ref.type === 'import') {
      // For import statements, suggest importing the replacement page
      return {
        ...ref,
        suggestion: `import ${replacement} from '../pages/${replacement}'`,
        action: 'replace'
      };
    } else if (ref.type === 'component') {
      // For component usage, suggest using the replacement component
      return {
        ...ref,
        suggestion: ref.match.replace(new RegExp(`<${ref.page}(\\s*.*?)(\\/?>)`, 'g'), `<${replacement}$1$2`),
        action: 'replace'
      };
    } else if (ref.type === 'route') {
      // For routes, suggest using the replacement route
      return {
        ...ref,
        suggestion: ref.match.replace(new RegExp(`element:\\s*{<${ref.page}\\s*.*?\\/>}`, 'g'), `element:{<${replacement} />}`),
        action: 'replace'
      };
    } else {
      // For other references, suggest replacing with the replacement page name
      return {
        ...ref,
        suggestion: ref.match.replace(new RegExp(`\\b${ref.page}\\b`, 'g'), replacement),
        action: 'replace'
      };
    }
  });
}

// Function to update references in a file
function updateReferences(filePath, content, references) {
  let updatedContent = content;
  
  // Sort references by line number in descending order to avoid offset issues
  references.sort((a, b) => b.line - a.line);
  
  references.forEach(ref => {
    if (ref.action === 'replace') {
      updatedContent = updatedContent.replace(ref.match, ref.suggestion);
    } else if (ref.action === 'remove') {
      updatedContent = updatedContent.replace(ref.match, '');
    }
  });
  
  return updatedContent;
}

// Function to process a file
async function processFile(filePath) {
  console.log(`Processing ${filePath}...`);
  
  // Read the file
  const content = readFile(filePath);
  if (!content) return false;
  
  // Find references
  const references = findReferences(filePath, content);
  if (references.length === 0) {
    console.log(`No references found in ${filePath}`);
    return true;
  }
  
  // Suggest replacements
  const suggestedReferences = suggestReplacements(references);
  
  // Display references and suggestions
  console.log(`Found ${references.length} references in ${filePath}:`);
  suggestedReferences.forEach((ref, index) => {
    console.log(`${index + 1}. Line ${ref.line}: ${ref.match}`);
    console.log(`   Suggestion: ${ref.suggestion}`);
    console.log(`   Action: ${ref.action}`);
    console.log();
  });
  
  // Ask for confirmation
  const answer = await new Promise(resolve => {
    rl.question('Apply these changes? (y/n/s) ', resolve);
  });
  
  if (answer.toLowerCase() === 'y') {
    // Backup the file
    backupFile(filePath);
    
    // Update references
    const updatedContent = updateReferences(filePath, content, suggestedReferences);
    
    // Write the updated content
    return writeFile(filePath, updatedContent);
  } else if (answer.toLowerCase() === 's') {
    console.log('Skipping this file');
    return true;
  } else {
    console.log('Changes not applied');
    return false;
  }
}

// Main function
async function main() {
  console.log('Starting orphaned references update...');
  
  // Get all .tsx and .ts files in the src directory
  const allFiles = getAllFiles(path.join(PROJECT_ROOT, 'src'))
    .map(file => file.replace(PROJECT_ROOT + '/', ''));
  
  console.log(`Found ${allFiles.length} files to process`);
  
  // Process each file
  for (const file of allFiles) {
    await processFile(file);
  }
  
  console.log('Orphaned references update completed!');
  rl.close();
}

// Run the script
main().catch(error => {
  console.error('Error running update script:', error);
  rl.close();
  process.exit(1);
});