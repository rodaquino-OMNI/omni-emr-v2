/**
 * Configuration handlers for the Orphaned Pages Manager
 * Handles updates to route configuration, sidebar, permissions, and translations
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { 
  readFileWithRetry, 
  writeFileWithErrorHandling, 
  backupFile 
} from './file-utils.js';
import { 
  validateRouteConfig, 
  buildRouteHashMap, 
  checkForExistingRoute, 
  createRouteBloomFilter 
} from './validation.js';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../../../..');

// Paths to the files we need to modify
const ROUTE_CONFIG_PATH = path.join(projectRoot, 'src', 'routes', 'RouteConfig.ts');
const ROUTES_INDEX_PATH = path.join(projectRoot, 'src', 'routes', 'index.tsx');
const SIDEBAR_CONFIG_PATH = path.join(projectRoot, 'src', 'config', 'sidebarConfig.ts');
const PERMISSIONS_PATH = path.join(projectRoot, 'src', 'constants', 'permissions.ts');
const TRANSLATIONS_PATH = path.join(projectRoot, 'src', 'i18n', 'translations.ts');

// Role sections in RouteConfig.ts
const ROLE_SECTIONS = [
  { role: 'doctor', startMarker: "'doctor': [" },
  { role: 'nurse', startMarker: "'nurse': [" },
  { role: 'admin', startMarker: "'admin': [" },
  { role: 'system_administrator', startMarker: "'system_administrator': [" }
];

/**
 * Update RouteConfig.ts with new routes
 * @param {Array} pages - Array of page objects to add
 * @param {Object} options - Options for the update
 * @returns {Promise<boolean>} - Whether the update was successful
 */
export async function updateRouteConfig(pages, options = {}) {
  console.log('Updating RouteConfig.ts...');
  
  // Backup the file
  await backupFile(ROUTE_CONFIG_PATH);
  
  // Read the file
  let content = await readFileWithRetry(ROUTE_CONFIG_PATH);
  
  // Validate the file format
  if (!validateRouteConfig(content)) {
    console.error('Invalid route configuration format. Aborting.');
    throw new Error('Invalid route configuration format');
  }
  
  // Create optimized indices for route checking
  const routeHashMap = buildRouteHashMap(content);
  const bloomFilter = createRouteBloomFilter(content);
  
  let updatedContent = content;
  let changesCount = 0;
  
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
    for (const page of pages) {
      // Skip pages without potentialRoutes
      if (!page.potentialRoutes || page.potentialRoutes.length === 0) {
        console.warn(`Page ${page.name} has no potential routes. Skipping.`);
        continue;
      }
      
      // Use the first potential route
      const routePath = page.potentialRoutes[0];
      
      // First quick check with bloom filter
      const routeHash = `${routePath}|${page.name}`.toLowerCase();
      if (bloomFilter.mightContain(routeHash)) {
        // Potential match, do a more accurate check
        if (checkForExistingRoute(routeHashMap, routePath, page.name)) {
          console.log(`Route for ${page.name} already exists in ${section.role} section`);
          continue;
        }
      }
      
      // Get required permission from page or use default
      const requiredPermission = page.permissions && page.permissions.length > 0 
        ? page.permissions[0] 
        : null;
      
      // Convert route object to string
      const routeString = `
    {
      path: '${routePath}',
      component: '${page.name}',
      ${requiredPermission ? `requiredPermission: '${requiredPermission}',` : ''}
      requireSector: true,
      ${page.reintegrationStrategy && page.reintegrationStrategy.routeDefinition && page.reintegrationStrategy.routeDefinition.title ? 
        `title: '${page.reintegrationStrategy.routeDefinition.title}',` : ''}
      ${page.description ? `description: '${page.description}',` : ''}
      ${page.reintegrationStrategy && page.reintegrationStrategy.routeDefinition && page.reintegrationStrategy.routeDefinition.icon ? 
        `icon: '${page.reintegrationStrategy.routeDefinition.icon}',` : ''}
    },`;
      
      // Insert the route at the insertion point
      updatedContent = updatedContent.slice(0, insertionPoint) + routeString + updatedContent.slice(insertionPoint);
      console.log(`Added ${page.name} route to ${section.role} section`);
      changesCount++;
    }
  }
  
  if (changesCount === 0) {
    console.log('No changes needed for RouteConfig.ts');
    return true;
  }
  
  // Write the updated content back to the file
  return writeFileWithErrorHandling(ROUTE_CONFIG_PATH, updatedContent);
}

/**
 * Update sidebarConfig.ts with new sidebar entries
 * @param {Array} pages - Array of page objects to add
 * @param {Object} options - Options for the update
 * @returns {Promise<boolean>} - Whether the update was successful
 */
export async function updateSidebarConfig(pages, options = {}) {
  console.log('Updating sidebarConfig.ts...');
  
  // Backup the file
  await backupFile(SIDEBAR_CONFIG_PATH);
  
  // Read the file
  let content = await readFileWithRetry(SIDEBAR_CONFIG_PATH);
  
  let updatedContent = content;
  let changesCount = 0;
  
  // Process each page
  for (const page of pages) {
    // Skip pages without sidebar placement
    if (!page.reintegrationStrategy || !page.reintegrationStrategy.sidebarPlacement) {
      console.log(`Page ${page.name} has no sidebar placement. Skipping.`);
      continue;
    }
    
    const sidebarPlacement = page.reintegrationStrategy.sidebarPlacement;
    
    // Check if the page is already in the sidebar
    const pageNameRegex = new RegExp(`name:\\s*['"]${page.name}['"]`, 'i');
    if (pageNameRegex.test(content)) {
      console.log(`Page ${page.name} already exists in sidebar. Skipping.`);
      continue;
    }
    
    // Update imports to include the icon if needed
    if (sidebarPlacement.icon) {
      const importsLine = updatedContent.indexOf('import {');
      if (importsLine === -1) {
        console.warn('Could not find imports line');
      } else {
        const importsEndLine = updatedContent.indexOf('}', importsLine);
        if (importsEndLine === -1) {
          console.warn('Could not find imports end line');
        } else {
          // Check if the icon is already imported
          const iconName = sidebarPlacement.icon;
          if (updatedContent.slice(importsLine, importsEndLine).indexOf(iconName) === -1) {
            // Add icon to imports
            const imports = updatedContent.slice(importsLine, importsEndLine);
            const lastImport = imports.split(',').pop().trim();
            const newImports = imports.replace(lastImport, `${lastImport}, ${iconName}`);
            updatedContent = updatedContent.slice(0, importsLine) + newImports + updatedContent.slice(importsEndLine);
          }
        }
      }
    }
    
    // Find a good insertion point - after an existing entry in the same section
    const sectionName = sidebarPlacement.section || 'Clinical';
    const sectionRegex = new RegExp(`section:\\s*['"]${sectionName}['"]`, 'i');
    const sectionMatch = sectionRegex.exec(updatedContent);
    
    if (!sectionMatch) {
      console.warn(`Could not find section ${sectionName} in sidebar config`);
      continue;
    }
    
    // Find the end of an entry in this section
    const sectionStart = sectionMatch.index;
    const entryEndMatch = /},\s*{/g;
    entryEndMatch.lastIndex = sectionStart;
    const entryEndResult = entryEndMatch.exec(updatedContent);
    
    if (!entryEndResult) {
      console.warn(`Could not find a good insertion point in section ${sectionName}`);
      continue;
    }
    
    const insertionPoint = entryEndResult.index + 1; // After the closing brace
    
    // Create the sidebar entry
    const sidebarEntry = `
  {
    name: '${page.name}',
    path: '${page.potentialRoutes[0]}',
    icon: ${sidebarPlacement.icon},
    translationKey: '${camelCase(page.name)}',
    ${page.permissions && page.permissions.length > 0 ? `permissionRequired: '${page.permissions[0]}',` : ''}
    ${page.reintegrationStrategy.functionBlock ? `functionBlockRequired: '${page.reintegrationStrategy.functionBlock}',` : ''}
    priority: ${sidebarPlacement.priority || 5},
    roles: ['doctor', 'nurse', 'admin', 'system_administrator']
  },`;
    
    // Insert the entry
    updatedContent = updatedContent.slice(0, insertionPoint) + sidebarEntry + updatedContent.slice(insertionPoint);
    console.log(`Added ${page.name} to sidebar in section ${sectionName}`);
    changesCount++;
  }
  
  if (changesCount === 0) {
    console.log('No changes needed for sidebarConfig.ts');
    return true;
  }
  
  // Write the updated content back to the file
  return writeFileWithErrorHandling(SIDEBAR_CONFIG_PATH, updatedContent);
}

/**
 * Update permissions.ts with new permissions
 * @param {Array} pages - Array of page objects to add
 * @param {Object} options - Options for the update
 * @returns {Promise<boolean>} - Whether the update was successful
 */
export async function updatePermissions(pages, options = {}) {
  console.log('Updating permissions.ts...');
  
  // Backup the file
  await backupFile(PERMISSIONS_PATH);
  
  // Read the file
  let content = await readFileWithRetry(PERMISSIONS_PATH);
  
  // Find the permissions object
  const permissionsObjectStart = content.indexOf('export const PERMISSIONS');
  if (permissionsObjectStart === -1) {
    console.error('Could not find permissions object');
    throw new Error('Could not find permissions object');
  }
  
  // Find a good insertion point
  const insertionPoint = content.indexOf('};', permissionsObjectStart);
  if (insertionPoint === -1) {
    console.error('Could not find insertion point for permissions');
    throw new Error('Could not find insertion point for permissions');
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
  let changesCount = 0;
  
  // Process each page
  for (const page of pages) {
    // Skip pages without permissions
    if (!page.permissions || page.permissions.length === 0) {
      continue;
    }
    
    // Add each permission if it doesn't already exist
    for (const permission of page.permissions) {
      // Skip if permission already exists
      if (existingPermissions.has(permission)) {
        continue;
      }
      
      // Convert to uppercase for constant name
      const permissionKey = snakeToConstantCase(permission);
      
      // Skip if key already exists
      if (existingPermissions.has(permissionKey)) {
        continue;
      }
      
      // Add the permission
      const permissionString = `
  ${permissionKey}: '${permission}',`;
      
      updatedContent = updatedContent.slice(0, insertionPoint) + permissionString + updatedContent.slice(insertionPoint);
      console.log(`Added ${permissionKey} permission`);
      
      // Update our set with the new permission
      existingPermissions.add(permissionKey);
      existingPermissions.add(permission);
      changesCount++;
    }
  }
  
  if (changesCount === 0) {
    console.log('No changes needed for permissions.ts');
    return true;
  }
  
  // Write the updated content back to the file
  return writeFileWithErrorHandling(PERMISSIONS_PATH, updatedContent);
}

/**
 * Update translations.ts with new translations
 * @param {Array} pages - Array of page objects to add
 * @param {Object} options - Options for the update
 * @returns {Promise<boolean>} - Whether the update was successful
 */
export async function updateTranslations(pages, options = {}) {
  console.log('Updating translations.ts...');
  
  // Backup the file
  await backupFile(TRANSLATIONS_PATH);
  
  // Read the file
  let content = await readFileWithRetry(TRANSLATIONS_PATH);
  
  // Find the English translations section
  const enSectionStart = content.indexOf('en: {');
  if (enSectionStart === -1) {
    console.error('Could not find English translations section');
    throw new Error('Could not find English translations section');
  }
  
  // Find the end of the English translations section
  const enSectionEnd = content.indexOf('  },', enSectionStart);
  if (enSectionEnd === -1) {
    console.error('Could not find end of English translations section');
    throw new Error('Could not find end of English translations section');
  }
  
  // Find the Portuguese translations section
  const ptSectionStart = content.indexOf('pt: {');
  if (ptSectionStart === -1) {
    console.error('Could not find Portuguese translations section');
    throw new Error('Could not find Portuguese translations section');
  }
  
  // Find the end of the Portuguese translations section
  const ptSectionEnd = content.indexOf('  }', ptSectionStart);
  if (ptSectionEnd === -1) {
    console.error('Could not find end of Portuguese translations section');
    throw new Error('Could not find end of Portuguese translations section');
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
  let changesCount = 0;
  
  // Process each page
  for (const page of pages) {
    // Create translation key (camelCase)
    const translationKey = camelCase(page.name);
    
    // Skip if both translations already exist
    if (existingEnTranslations.has(translationKey) && existingPtTranslations.has(translationKey)) {
      continue;
    }
    
    // Add English translation if needed
    if (!existingEnTranslations.has(translationKey)) {
      const enTranslation = `
    ${translationKey}: "${page.name}",`;
      
      updatedContent = updatedContent.slice(0, enSectionEnd) + enTranslation + updatedContent.slice(enSectionEnd);
      console.log(`Added ${translationKey} English translation`);
      existingEnTranslations.add(translationKey);
      changesCount++;
      
      // Update the Portuguese section end position after modifying the content
      const ptSectionStartNew = updatedContent.indexOf('pt: {');
      const ptSectionEndNew = updatedContent.indexOf('  }', ptSectionStartNew);
      
      // Add Portuguese translation if needed
      if (!existingPtTranslations.has(translationKey)) {
        // Create Portuguese translation (simple approach - could be improved with actual translations)
        const ptTranslation = `
    ${translationKey}: "${page.name}",`;
        
        updatedContent = updatedContent.slice(0, ptSectionEndNew) + ptTranslation + updatedContent.slice(ptSectionEndNew);
        console.log(`Added ${translationKey} Portuguese translation`);
        existingPtTranslations.add(translationKey);
        changesCount++;
      }
    }
  }
  
  if (changesCount === 0) {
    console.log('No changes needed for translations.ts');
    return true;
  }
  
  // Write the updated content back to the file
  return writeFileWithErrorHandling(TRANSLATIONS_PATH, updatedContent);
}

/**
 * Update routes/index.tsx with new component imports
 * @param {Array} pages - Array of page objects to add
 * @param {Object} options - Options for the update
 * @returns {Promise<boolean>} - Whether the update was successful
 */
export async function updateRoutesIndex(pages, options = {}) {
  console.log('Updating routes/index.tsx...');
  
  // Backup the file
  await backupFile(ROUTES_INDEX_PATH);
  
  // Read the file
  let content = await readFileWithRetry(ROUTES_INDEX_PATH);
  
  // Find the lazy-loaded components section
  const lazyLoadSection = content.indexOf('const');
  if (lazyLoadSection === -1) {
    console.error('Could not find lazy-loaded components section');
    throw new Error('Could not find lazy-loaded components section');
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
  let changesCount = 0;
  
  // Process each page
  for (const page of pages) {
    // Skip if component already exists
    if (existingComponents.has(page.name)) {
      continue;
    }
    
    // Add the component import
    const importPath = page.path.replace(/^src\//, '../').replace(/\.tsx$/, '');
    const importString = `const ${page.name} = lazy(() => import('${importPath}'));\n`;
    
    updatedContent = updatedContent.slice(0, currentLazyLoadSection) + importString + updatedContent.slice(currentLazyLoadSection);
    console.log(`Added ${page.name} import`);
    
    // Update our set with the new component
    existingComponents.add(page.name);
    
    // Update the lazyLoadSection position after modifying the content
    currentLazyLoadSection += importString.length;
    changesCount++;
  }
  
  if (changesCount === 0) {
    console.log('No changes needed for routes/index.tsx');
    return true;
  }
  
  // Write the updated content back to the file
  return writeFileWithErrorHandling(ROUTES_INDEX_PATH, updatedContent);
}

// ===== Helper Functions =====

/**
 * Convert a string to camelCase
 * @param {string} str - String to convert
 * @returns {string} - camelCase string
 */
function camelCase(str) {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, '');
}

/**
 * Convert a snake_case string to CONSTANT_CASE
 * @param {string} str - String to convert
 * @returns {string} - CONSTANT_CASE string
 */
function snakeToConstantCase(str) {
  return str.toUpperCase();
}