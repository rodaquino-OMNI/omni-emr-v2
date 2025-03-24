# Orphaned Pages Cleanup Plan

This document outlines the plan for safely removing the 15 orphaned pages that were recommended for deletion in the orphaned pages analysis.

## Pages to Remove

Based on the analysis, the following pages are recommended for removal:

| # | Page | File Path | Justification |
|---|------|-----------|---------------|
| 1 | FunctionBlocks | src/pages/Admin/FunctionBlocks.tsx | Low code quality and low functional uniqueness |
| 2 | EmergencyCare | src/pages/EmergencyCare.tsx | Low code quality and medium functional uniqueness |
| 3 | Help | src/pages/Help.tsx | Low code quality and low functional uniqueness |
| 4 | HospitalWorkflows | src/pages/HospitalWorkflows.tsx | Low code quality and low functional uniqueness |
| 5 | Index | src/pages/Index.tsx | Low code quality and low functional uniqueness |
| 6 | MedicalHistory | src/pages/MedicalHistory.tsx | Low code quality and low functional uniqueness |
| 7 | Messages | src/pages/Messages.tsx | Low code quality and medium functional uniqueness |
| 8 | NewOrder | src/pages/NewOrder.tsx | Low code quality and medium functional uniqueness |
| 9 | Notifications | src/pages/Notifications.tsx | Low code quality and medium functional uniqueness |
| 10 | PageNotFound | src/pages/PageNotFound.tsx | Low code quality and medium functional uniqueness |
| 11 | Records | src/pages/Records.tsx | Medium code quality but low functional uniqueness |
| 12 | Register | src/pages/Register.tsx | Low code quality and medium functional uniqueness |
| 13 | RxNormManagement | src/pages/RxNormManagement.tsx | Low code quality and medium functional uniqueness |
| 14 | SectorSelection | src/pages/SectorSelection.tsx | Low code quality and medium functional uniqueness |
| 15 | NotFound | src/pages/NotFound.tsx | Low code quality and medium functional uniqueness |

## Cleanup Process

The cleanup will be executed in the following phases:

### Phase 1: Pre-Removal Verification

1. **Create a backup branch**
   ```bash
   git checkout -b orphaned-pages-cleanup-backup
   git push origin orphaned-pages-cleanup-backup
   git checkout main
   ```

2. **Create a new feature branch for the cleanup**
   ```bash
   git checkout -b feature/remove-orphaned-pages
   ```

3. **Verify that the pages to be removed are not referenced in critical user flows**
   - Run the application and ensure that the main user flows do not depend on these pages
   - Check analytics data (if available) to confirm low or no usage

### Phase 2: Configuration Cleanup

1. **Remove references from RouteConfig.ts**
   - Identify and remove route definitions for the orphaned pages
   - Update any dependent route configurations

2. **Remove references from sidebarConfig.ts**
   - Remove sidebar entries for the orphaned pages
   - Adjust sidebar structure if needed

3. **Remove references from permissions.ts**
   - Remove permission definitions related to the orphaned pages
   - Update any permission checks that reference these pages

4. **Remove references from translations.ts**
   - Remove translation keys related to the orphaned pages
   - Clean up any unused translation sections

### Phase 3: Code Cleanup

1. **Create a removal script**
   Create a script (`remove-orphaned-pages.js`) that will:
   - Remove the page files
   - Remove any direct imports of these pages in other files
   - Log all changes for verification

2. **Preserve essential functionality**
   - For pages with medium functional uniqueness, extract and preserve any unique functionality
   - Migrate essential features to appropriate existing pages

3. **Update component imports**
   - Check for and update any imports of components from the removed pages
   - Refactor code that depends on the removed pages

### Phase 4: Execution and Verification

1. **Execute the removal script**
   ```bash
   node remove-orphaned-pages.js
   ```

2. **Verify application functionality**
   - Run the application and test all main user flows
   - Ensure no broken links or references to removed pages
   - Verify that all preserved functionality works correctly

3. **Run tests**
   - Execute unit tests to ensure no regressions
   - Run integration tests to verify system integrity

### Phase 5: Finalization

1. **Commit changes**
   ```bash
   git add .
   git commit -m "Remove orphaned pages as per analysis recommendations"
   ```

2. **Create pull request**
   - Create a detailed PR describing the changes
   - Include before/after bundle size comparison
   - Reference the orphaned pages analysis report

3. **Code review**
   - Have team members review the changes
   - Address any feedback or concerns

4. **Merge and deploy**
   - Merge the PR after approval
   - Deploy to staging environment for final verification
   - Deploy to production

## Removal Script Implementation

Below is the implementation of the `remove-orphaned-pages.js` script:

```javascript
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

// Main function
async function main() {
  console.log('Starting orphaned pages cleanup...');
  
  // Clean up configuration files
  cleanupRouteConfig();
  cleanupSidebarConfig();
  cleanupPermissions();
  cleanupTranslations();
  cleanupRoutesIndex();
  
  // Remove orphaned page files
  removeOrphanedPages();
  
  console.log('Orphaned pages cleanup completed!');
  console.log('Please verify the application functionality before committing the changes.');
}

// Run the script
main().catch(error => {
  console.error('Error running cleanup script:', error);
  process.exit(1);
});
```

## Risk Mitigation

1. **Backup Strategy**
   - Create a backup branch before starting the cleanup
   - Backup each configuration file before modifying it
   - Document all changes for potential rollback

2. **Incremental Approach**
   - Clean up configuration files first
   - Verify application functionality after configuration changes
   - Remove page files only after confirming no critical dependencies

3. **Fallback Plan**
   - If issues are encountered, revert to the backup branch
   - If specific pages cause problems, exclude them from the cleanup
   - Prepare a rollback script to restore removed pages if needed

## Post-Cleanup Tasks

1. **Documentation Update**
   - Update project documentation to reflect the removed pages
   - Document any functionality that was migrated to other pages

2. **Performance Measurement**
   - Measure bundle size before and after cleanup
   - Compare application load times
   - Document performance improvements

3. **Knowledge Sharing**
   - Share the cleanup results with the team
   - Discuss lessons learned and best practices
   - Update coding guidelines to prevent future orphaned pages

## Timeline

| Phase | Estimated Duration | Dependencies |
|-------|-------------------|--------------|
| Pre-Removal Verification | 1 day | None |
| Configuration Cleanup | 1 day | Pre-Removal Verification |
| Code Cleanup | 2 days | Configuration Cleanup |
| Execution and Verification | 1 day | Code Cleanup |
| Finalization | 1 day | Execution and Verification |
| **Total** | **6 days** | |

## Conclusion

This cleanup plan provides a systematic approach to safely remove the 15 orphaned pages recommended for deletion. By following this plan, we can improve the codebase quality, reduce maintenance burden, and enhance application performance while minimizing the risk of breaking existing functionality.