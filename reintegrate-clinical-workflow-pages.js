/**
 * Reintegrate Clinical Workflow Pages Script
 *
 * This script implements the changes outlined in the Clinical-Workflow-Pages-Implementation-Plan.md
 * to reintegrate three clinical workflow pages:
 * 1. TaskDetail - Part of the clinical task execution workflow
 * 2. Telemedicine - Part of the prescription management workflow
 * 3. VisitNotes - Part of the patient visit registration workflow
 *
 * The script includes robust error handling and optimized duplicate detection algorithms.
 *
 * Usage:
 * node reintegrate-clinical-workflow-pages.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths to the files we need to modify
const ROUTE_CONFIG_PATH = path.join(__dirname, 'src', 'routes', 'RouteConfig.ts');
const ROUTES_INDEX_PATH = path.join(__dirname, 'src', 'routes', 'index.tsx');
const PERMISSIONS_PATH = path.join(__dirname, 'src', 'constants', 'permissions.ts');
const TRANSLATIONS_PATH = path.join(__dirname, 'src', 'i18n', 'translations.ts');

// Routes to add
const ROUTES_TO_ADD = [
  {
    path: '/tasks/:id',
    component: 'TaskDetail',
    requiredPermission: 'tasks:view',
    requireSector: true,
    title: 'Task Detail',
    description: 'View and manage task details',
    icon: 'ListChecks',
  },
  {
    path: '/telemedicine',
    component: 'Telemedicine',
    requiredPermission: 'telemedicine',
    requireSector: true,
    title: 'Telemedicine',
    description: 'Conduct virtual consultations',
    icon: 'Video',
  },
  {
    path: '/visit-notes',
    component: 'VisitNotes',
    requiredPermission: 'view_records',
    requireSector: true,
    title: 'Visit Notes',
    description: 'Record clinical visit notes',
    icon: 'ClipboardCheck',
  }
];

// Permissions to add
const PERMISSIONS_TO_ADD = [
  { key: 'TELEMEDICINE', value: 'telemedicine' },
  { key: 'VIEW_RECORDS', value: 'view_records' }
];

// Translations to add
const TRANSLATIONS_TO_ADD = [
  { key: 'visitNotes', en: 'Visit Notes', pt: 'Notas de Consulta' },
  { key: 'taskDetail', en: 'Task Detail', pt: 'Detalhes da Tarefa' }
];

// Components to add to routes/index.tsx
const COMPONENTS_TO_ADD = [
  { name: 'TaskDetail', path: '../pages/TaskDetail' },
  { name: 'Telemedicine', path: '../pages/Telemedicine' },
  { name: 'VisitNotes', path: '../pages/VisitNotes' }
];

// Role sections in RouteConfig.ts
const ROLE_SECTIONS = [
  { role: 'doctor', startMarker: "'doctor': [" },
  { role: 'nurse', startMarker: "'nurse': [" },
  { role: 'admin', startMarker: "'admin': [" },
  { role: 'system_administrator', startMarker: "'system_administrator': [" }
];

// ===== Error Handling Utilities =====

/**
 * Read a file with retry mechanism
 * @param {string} filePath - Path to the file
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} retryDelay - Delay between retries in ms
 * @returns {string} - File content
 */
function readFileWithRetry(filePath, maxRetries = 3, retryDelay = 1000) {
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      return fs.readFileSync(filePath, 'utf8');
    } catch (error) {
      if (error.code === 'ENOENT') {
        // File not found - no need to retry
        throw new Error(`File not found: ${filePath}`);
      }
      
      if (error.code === 'EACCES') {
        // Permission error - no need to retry
        throw new Error(`Permission denied: ${filePath}`);
      }
      
      if (error.code === 'EBUSY' || error.code === 'EMFILE' || error.code === 'ENFILE') {
        // File is busy or too many open files - retry
        retries++;
        console.warn(`File access error (${error.code}), retrying (${retries}/${maxRetries})...`);
        
        // Wait before retrying
        if (retries < maxRetries) {
          // Simple delay implementation
          const startTime = Date.now();
          const delay = retryDelay * Math.pow(2, retries - 1); // Exponential backoff
          while (Date.now() - startTime < delay) {
            // Wait
          }
        }
        continue;
      }
      
      // Other errors - throw
      throw error;
    }
  }
  
  throw new Error(`Failed to read file after ${maxRetries} retries: ${filePath}`);
}

/**
 * Check file permissions
 * @param {string} filePath - Path to the file
 * @param {Object} requiredPermissions - Required permissions
 * @returns {Object} - Result object
 */
function checkFilePermissions(filePath, requiredPermissions = { read: true, write: true }) {
  try {
    // If file doesn't exist, check if we can create it
    if (!fs.existsSync(filePath)) {
      if (requiredPermissions.write) {
        const dirPath = path.dirname(filePath);
        try {
          fs.accessSync(dirPath, fs.constants.W_OK);
          return { success: true }; // Can write to directory
        } catch (dirError) {
          return { success: false, error: `Cannot create file in directory ${dirPath}` };
        }
      }
      return { success: false, error: `File does not exist: ${filePath}` };
    }
    
    const stats = fs.statSync(filePath);
    
    // Check if file exists
    if (!stats.isFile()) {
      return { success: false, error: `${filePath} is not a file` };
    }
    
    // Check read permission
    if (requiredPermissions.read) {
      try {
        fs.accessSync(filePath, fs.constants.R_OK);
      } catch (error) {
        return { success: false, error: `No read permission for ${filePath}` };
      }
    }
    
    // Check write permission
    if (requiredPermissions.write) {
      try {
        fs.accessSync(filePath, fs.constants.W_OK);
      } catch (error) {
        return { success: false, error: `No write permission for ${filePath}` };
      }
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: `Error checking permissions: ${error.message}` };
  }
}

/**
 * Execute a function with timeout
 * @param {Function} fn - Function to execute
 * @param {number} timeout - Timeout in ms
 * @returns {Promise} - Promise that resolves with the function result
 */
async function executeWithTimeout(fn, timeout = 30000) {
  return new Promise((resolve, reject) => {
    // Set timeout
    const timeoutId = setTimeout(() => {
      reject(new Error(`Operation timed out after ${timeout}ms`));
    }, timeout);
    
    try {
      // Execute function
      const result = fn();
      clearTimeout(timeoutId);
      resolve(result);
    } catch (error) {
      clearTimeout(timeoutId);
      reject(error);
    }
  });
}

/**
 * Backup a file before modifying it
 * @param {string} filePath - Path to the file
 */
function backupFile(filePath) {
  const backupPath = `${filePath}.bak`;
  try {
    fs.copyFileSync(filePath, backupPath);
    console.log(`Backed up ${filePath} to ${backupPath}`);
  } catch (error) {
    console.error(`Error backing up file ${filePath}:`, error);
    process.exit(1);
  }
}

/**
 * Write to a file with error handling
 * @param {string} filePath - Path to the file
 * @param {string} content - Content to write
 */
function writeFileWithErrorHandling(filePath, content) {
  try {
    executeWithTimeout(() => {
      fs.writeFileSync(filePath, content, 'utf8');
    });
    console.log(`Successfully updated ${filePath}`);
  } catch (error) {
    console.error(`Error writing file: ${error.message}`);
    console.log('Attempting to restore from backup...');
    try {
      fs.copyFileSync(`${filePath}.bak`, filePath);
      console.log('Restored from backup successfully');
    } catch (restoreError) {
      console.error(`Error restoring from backup: ${restoreError.message}`);
    }
    process.exit(1);
  }
}

/**
 * Validate route configuration format
 * @param {string} content - Route configuration content
 * @returns {boolean} - Whether the format is valid
 */
function validateRouteConfig(content) {
  // Check for basic syntax errors
  try {
    // Check for unbalanced braces
    let braceCount = 0;
    for (const char of content) {
      if (char === '{') braceCount++;
      if (char === '}') braceCount--;
      if (braceCount < 0) throw new Error('Unbalanced braces: too many closing braces');
    }
    if (braceCount !== 0) throw new Error('Unbalanced braces: missing closing braces');
    
    // Check for missing commas between objects
    const objectRegex = /}\s*{/g;
    if (objectRegex.test(content)) {
      throw new Error('Missing commas between objects');
    }
    
    // Check for invalid route definitions
    const routeRegex = /{\s*path:[^}]*}/g;
    const routes = content.match(routeRegex) || [];
    
    for (const route of routes) {
      if (!route.includes('component:')) {
        throw new Error('Route missing component property');
      }
    }
    
    return true;
  } catch (error) {
    console.error(`Invalid route configuration: ${error.message}`);
    return false;
  }
}

// ===== Duplicate Detection Utilities =====

/**
 * Generate a hash for a route
 * @param {string} path - Route path
 * @param {string} component - Route component
 * @returns {string} - Hash
 */
function generateRouteHash(path, component) {
  // Create a unique hash for the route based on path and component
  return `${path}|${component}`.toLowerCase();
}

/**
 * Build a hash map of existing routes
 * @param {string} content - Route configuration content
 * @returns {Object} - Hash map
 */
function buildRouteHashMap(content) {
  // Extract all existing routes and build a hash map for O(1) lookups
  const routeRegex = /{\s*path:\s*['"]([^'"]+)['"]\s*,\s*component:\s*['"]([^'"]+)['"]/g;
  const routes = {};
  let match;
  
  while ((match = routeRegex.exec(content)) !== null) {
    const path = match[1];
    const component = match[2];
    const hash = generateRouteHash(path, component);
    routes[hash] = true;
  }
  
  return routes;
}

/**
 * Check if a route already exists
 * @param {Object} routeHashMap - Hash map of existing routes
 * @param {string} path - Route path
 * @param {string} component - Route component
 * @returns {boolean} - Whether the route exists
 */
function checkForExistingRoute(routeHashMap, path, component) {
  const hash = generateRouteHash(path, component);
  return !!routeHashMap[hash];
}

/**
 * Create indices for route paths and components
 * @param {string} content - Route configuration content
 * @returns {Object} - Indices
 */
function createRouteIndices(content) {
  const pathIndex = {};
  const componentIndex = {};
  
  // Extract all paths
  const pathRegex = /path:\s*['"]([^'"]+)['"]/g;
  let pathMatch;
  while ((pathMatch = pathRegex.exec(content)) !== null) {
    const path = pathMatch[1];
    pathIndex[path] = (pathIndex[path] || 0) + 1;
  }
  
  // Extract all components
  const componentRegex = /component:\s*['"]([^'"]+)['"]/g;
  let componentMatch;
  while ((componentMatch = componentRegex.exec(content)) !== null) {
    const component = componentMatch[1];
    componentIndex[component] = (componentIndex[component] || 0) + 1;
  }
  
  return { pathIndex, componentIndex };
}

/**
 * Simple bloom filter implementation
 */
class SimpleBloomFilter {
  constructor(size = 1000, hashFunctions = 3) {
    this.size = size;
    this.hashFunctions = hashFunctions;
    this.bitArray = new Array(size).fill(0);
  }
  
  // Simple hash function
  hash(str, seed) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash + str.charCodeAt(i)) * seed;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash % this.size);
  }
  
  add(item) {
    for (let i = 0; i < this.hashFunctions; i++) {
      const index = this.hash(item, i + 1);
      this.bitArray[index] = 1;
    }
  }
  
  mightContain(item) {
    for (let i = 0; i < this.hashFunctions; i++) {
      const index = this.hash(item, i + 1);
      if (this.bitArray[index] === 0) {
        return false;
      }
    }
    return true; // Might contain (could be false positive)
  }
}

/**
 * Create a bloom filter for routes
 * @param {string} content - Route configuration content
 * @returns {SimpleBloomFilter} - Bloom filter
 */
function createRouteBloomFilter(content) {
  const bloomFilter = new SimpleBloomFilter();
  
  // Extract all routes
  const routeRegex = /{\s*path:\s*['"]([^'"]+)['"]\s*,\s*component:\s*['"]([^'"]+)['"]/g;
  let match;
  
  while ((match = routeRegex.exec(content)) !== null) {
    const path = match[1];
    const component = match[2];
    const hash = `${path}|${component}`.toLowerCase();
    bloomFilter.add(hash);
  }
  
  return bloomFilter;
}

// ===== Implementation Functions =====

/**
 * Update RouteConfig.ts
 */
function updateRouteConfig() {
  console.log('Updating RouteConfig.ts...');
  
  // Check file permissions
  const permissionCheck = checkFilePermissions(ROUTE_CONFIG_PATH);
  if (!permissionCheck.success) {
    console.error(`Permission error: ${permissionCheck.error}`);
    process.exit(1);
  }
  
  // Backup the file
  backupFile(ROUTE_CONFIG_PATH);
  
  // Read the file with retry mechanism
  let content;
  try {
    content = readFileWithRetry(ROUTE_CONFIG_PATH);
  } catch (error) {
    console.error(`Error reading file: ${error.message}`);
    process.exit(1);
  }
  
  // Validate the file format
  if (!validateRouteConfig(content)) {
    console.error('Invalid route configuration format. Aborting.');
    process.exit(1);
  }
  
  // Create optimized indices for route checking
  const routeHashMap = buildRouteHashMap(content);
  const { pathIndex, componentIndex } = createRouteIndices(content);
  const bloomFilter = createRouteBloomFilter(content);
  
  let updatedContent = content;
  
  // For each role section, add the routes if they don't already exist
  for (const section of ROLE_SECTIONS) {
    const sectionStart = updatedContent.indexOf(section.startMarker);
    if (sectionStart === -1) {
      console.warn(`Could not find ${section.role} section`);
      continue;
    }
    
    // Find a good insertion point (after the opening bracket)
    const insertionPoint = updatedContent.indexOf('[', sectionStart) + 1;
    
    // Add each route if it doesn't already exist
    for (const route of ROUTES_TO_ADD) {
      // First quick check with bloom filter
      const routeHash = `${route.path}|${route.component}`.toLowerCase();
      if (bloomFilter.mightContain(routeHash)) {
        // Potential match, do a more accurate check
        if (checkForExistingRoute(routeHashMap, route.path, route.component)) {
          console.log(`Route for ${route.component} already exists in ${section.role} section`);
          continue;
        }
      }
      
      // Convert route object to string
      const routeString = `
    {
      path: '${route.path}',
      component: '${route.component}',
      ${route.requiredPermission ? `requiredPermission: '${route.requiredPermission}',` : ''}
      ${route.requireSector ? `requireSector: ${route.requireSector},` : ''}
      ${route.title ? `title: '${route.title}',` : ''}
      ${route.description ? `description: '${route.description}',` : ''}
      ${route.icon ? `icon: '${route.icon}',` : ''}
    },`;
      
      // Insert the route at the insertion point
      updatedContent = updatedContent.slice(0, insertionPoint) + routeString + updatedContent.slice(insertionPoint);
      console.log(`Added ${route.component} route to ${section.role} section`);
      
      // Update our indices with the new route
      routeHashMap[routeHash] = true;
      pathIndex[route.path] = (pathIndex[route.path] || 0) + 1;
      componentIndex[route.component] = (componentIndex[route.component] || 0) + 1;
      bloomFilter.add(routeHash);
    }
  }
  
  // Write the updated content back to the file
  writeFileWithErrorHandling(ROUTE_CONFIG_PATH, updatedContent);
}

/**
 * Update permissions.ts
 */
function updatePermissions() {
  console.log('Updating permissions.ts...');
  
  // Check file permissions
  const permissionCheck = checkFilePermissions(PERMISSIONS_PATH);
  if (!permissionCheck.success) {
    console.error(`Permission error: ${permissionCheck.error}`);
    process.exit(1);
  }
  
  // Backup the file
  backupFile(PERMISSIONS_PATH);
  
  // Read the file with retry mechanism
  let content;
  try {
    content = readFileWithRetry(PERMISSIONS_PATH);
  } catch (error) {
    console.error(`Error reading file: ${error.message}`);
    process.exit(1);
  }
  
  // Find the permissions object
  const permissionsObjectStart = content.indexOf('export const PERMISSIONS');
  if (permissionsObjectStart === -1) {
    console.error('Could not find permissions object');
    process.exit(1);
  }
  
  // Find a good insertion point
  const insertionPoint = content.indexOf('};', permissionsObjectStart);
  if (insertionPoint === -1) {
    console.error('Could not find insertion point for permissions');
    process.exit(1);
  }
  
  // Create a hash set of existing permissions for O(1) lookups
  const existingPermissions = new Set();
  const permissionRegex = /(\w+):\s*['"]([^'"]+)['"]/g;
  let match;
  while ((match = permissionRegex.exec(content)) !== null) {
    existingPermissions.add(match[1]); // Add key
    existingPermissions.add(match[2]); // Add value
  }
  
  let updatedContent = content;
  
  // Add each permission if it doesn't already exist
  for (const permission of PERMISSIONS_TO_ADD) {
    if (!existingPermissions.has(permission.key) && !existingPermissions.has(permission.value)) {
      // Add the permission
      const permissionString = `
  ${permission.key}: '${permission.value}',`;
      
      updatedContent = updatedContent.slice(0, insertionPoint) + permissionString + updatedContent.slice(insertionPoint);
      console.log(`Added ${permission.key} permission`);
      
      // Update our set with the new permission
      existingPermissions.add(permission.key);
      existingPermissions.add(permission.value);
    } else {
      console.log(`Permission ${permission.key} or ${permission.value} already exists`);
    }
  }
  
  // Write the updated content back to the file
  writeFileWithErrorHandling(PERMISSIONS_PATH, updatedContent);
}

/**
 * Update translations.ts
 */
function updateTranslations() {
  console.log('Updating translations.ts...');
  
  // Check file permissions
  const permissionCheck = checkFilePermissions(TRANSLATIONS_PATH);
  if (!permissionCheck.success) {
    console.error(`Permission error: ${permissionCheck.error}`);
    process.exit(1);
  }
  
  // Backup the file
  backupFile(TRANSLATIONS_PATH);
  
  // Read the file with retry mechanism
  let content;
  try {
    content = readFileWithRetry(TRANSLATIONS_PATH);
  } catch (error) {
    console.error(`Error reading file: ${error.message}`);
    process.exit(1);
  }
  
  // Find the English translations section
  const enSectionStart = content.indexOf('en: {');
  if (enSectionStart === -1) {
    console.error('Could not find English translations section');
    process.exit(1);
  }
  
  // Find the end of the English translations section
  const enSectionEnd = content.indexOf('  },', enSectionStart);
  if (enSectionEnd === -1) {
    console.error('Could not find end of English translations section');
    process.exit(1);
  }
  
  // Find the Portuguese translations section
  const ptSectionStart = content.indexOf('pt: {');
  if (ptSectionStart === -1) {
    console.error('Could not find Portuguese translations section');
    process.exit(1);
  }
  
  // Find the end of the Portuguese translations section
  const ptSectionEnd = content.indexOf('  }', ptSectionStart);
  if (ptSectionEnd === -1) {
    console.error('Could not find end of Portuguese translations section');
    process.exit(1);
  }
  
  // Create hash sets of existing translations for O(1) lookups
  const existingEnTranslations = new Set();
  const existingPtTranslations = new Set();
  
  const translationRegex = /(\w+):\s*["']([^"']+)["']/g;
  
  // Extract English translations
  const enSection = content.slice(enSectionStart, enSectionEnd);
  let match;
  while ((match = translationRegex.exec(enSection)) !== null) {
    existingEnTranslations.add(match[1]);
  }
  
  // Extract Portuguese translations
  const ptSection = content.slice(ptSectionStart, ptSectionEnd);
  while ((match = translationRegex.exec(ptSection)) !== null) {
    existingPtTranslations.add(match[1]);
  }
  
  let updatedContent = content;
  
  // Add each translation if it doesn't already exist
  for (const translation of TRANSLATIONS_TO_ADD) {
    // Check if English translation already exists
    if (!existingEnTranslations.has(translation.key)) {
      // Add English translation
      const enTranslation = `
    ${translation.key}: "${translation.en}",`;
      
      updatedContent = updatedContent.slice(0, enSectionEnd) + enTranslation + updatedContent.slice(enSectionEnd);
      console.log(`Added ${translation.key} English translation`);
      
      // Update our set with the new translation
      existingEnTranslations.add(translation.key);
      
      // Update the Portuguese section end position after modifying the content
      const ptSectionStartNew = updatedContent.indexOf('pt: {');
      const ptSectionEndNew = updatedContent.indexOf('  }', ptSectionStartNew);
    }
    
    // Check if Portuguese translation already exists
    if (!existingPtTranslations.has(translation.key)) {
      // Find the updated Portuguese section end
      const ptSectionStartNew = updatedContent.indexOf('pt: {');
      const ptSectionEndNew = updatedContent.indexOf('  }', ptSectionStartNew);
      
      // Add Portuguese translation
      const ptTranslation = `
    ${translation.key}: "${translation.pt}",`;
      
      updatedContent = updatedContent.slice(0, ptSectionEndNew) + ptTranslation + updatedContent.slice(ptSectionEndNew);
      console.log(`Added ${translation.key} Portuguese translation`);
      
      // Update our set with the new translation
      existingPtTranslations.add(translation.key);
    }
  }
  
  // Write the updated content back to the file
  writeFileWithErrorHandling(TRANSLATIONS_PATH, updatedContent);
}

/**
 * Update routes/index.tsx
 */
function updateRoutesIndex() {
  console.log('Updating routes/index.tsx...');
  
  // Check file permissions
  const permissionCheck = checkFilePermissions(ROUTES_INDEX_PATH);
  if (!permissionCheck.success) {
    console.error(`Permission error: ${permissionCheck.error}`);
    process.exit(1);
  }
  
  // Backup the file
  backupFile(ROUTES_INDEX_PATH);
  
  // Read the file with retry mechanism
  let content;
  try {
    content = readFileWithRetry(ROUTES_INDEX_PATH);
  } catch (error) {
    console.error(`Error reading file: ${error.message}`);
    process.exit(1);
  }
  
  // Find the lazy-loaded components section
  const lazyLoadSection = content.indexOf('const');
  if (lazyLoadSection === -1) {
    console.error('Could not find lazy-loaded components section');
    process.exit(1);
  }
  
  // Create a set of existing component imports for O(1) lookups
  const existingComponents = new Set();
  const componentRegex = /const\s+(\w+)\s*=\s*lazy/g;
  let match;
  while ((match = componentRegex.exec(content)) !== null) {
    existingComponents.add(match[1]);
  }
  
  let updatedContent = content;
  let currentLazyLoadSection = lazyLoadSection;
  
  // Add each component if it doesn't already exist
  for (const component of COMPONENTS_TO_ADD) {
    if (!existingComponents.has(component.name)) {
      // Add the component import
      const importString = `const ${component.name} = lazy(() => import('${component.path}'));\n`;
      
      updatedContent = updatedContent.slice(0, currentLazyLoadSection) + importString + updatedContent.slice(currentLazyLoadSection);
      console.log(`Added ${component.name} import`);
      
      // Update our set with the new component
      existingComponents.add(component.name);
      
      // Update the lazyLoadSection position after modifying the content
      currentLazyLoadSection += importString.length;
    } else {
      console.log(`Import for ${component.name} already exists`);
    }
  }
  
  // Write the updated content back to the file
  writeFileWithErrorHandling(ROUTES_INDEX_PATH, updatedContent);
}

/**
 * Main function
 */
function main() {
  console.log('Starting reintegration of clinical workflow pages...');
  
  try {
    // Update the files
    updateRouteConfig();
    updatePermissions();
    updateTranslations();
    updateRoutesIndex();
    
    console.log('Reintegration complete!');
    console.log('Please test the changes to ensure everything works as expected.');
  } catch (error) {
    console.error('An error occurred during reintegration:', error);
    console.error('Please check the logs for details and try again.');
    process.exit(1);
  }
}

// Run the script
main();
