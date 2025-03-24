/**
 * Reintegrate Orphaned Pages Script
 *
 * This script helps implement the changes outlined in the Orphaned-Pages-Implementation-Plan.md
 * to reintegrate the three pilot pages (CriticalResults, FluidBalance, and PatientProfile)
 * into the OmniCare EMR system.
 *
 * Usage:
 * node reintegrate-orphaned-pages.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths to the files we need to modify
const ROUTE_CONFIG_PATH = path.join(__dirname, 'src', 'routes', 'RouteConfig.ts');
const SIDEBAR_CONFIG_PATH = path.join(__dirname, 'src', 'config', 'sidebarConfig.ts');
const PERMISSIONS_PATH = path.join(__dirname, 'src', 'constants', 'permissions.ts');
const TRANSLATIONS_PATH = path.join(__dirname, 'src', 'i18n', 'translations.ts');

// Function to read a file
function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    process.exit(1);
  }
}

// Function to write a file
function writeFile(filePath, content) {
  try {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Successfully updated ${filePath}`);
  } catch (error) {
    console.error(`Error writing file ${filePath}:`, error);
    process.exit(1);
  }
}

// Function to backup a file before modifying it
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

// 1. Update RouteConfig.ts
function updateRouteConfig() {
  console.log('Updating RouteConfig.ts...');
  
  // Backup the file
  backupFile(ROUTE_CONFIG_PATH);
  
  // Read the file
  let content = readFile(ROUTE_CONFIG_PATH);
  
  // Doctor role routes - add after line 160
  const doctorRoutesInsertPoint = content.indexOf("path: '/emergency/:patientId'");
  if (doctorRoutesInsertPoint === -1) {
    console.error('Could not find insertion point for doctor routes');
    process.exit(1);
  }
  
  // Find the end of the doctor routes section
  const doctorRoutesEndPoint = content.indexOf('},', doctorRoutesInsertPoint);
  if (doctorRoutesEndPoint === -1) {
    console.error('Could not find end point for doctor routes');
    process.exit(1);
  }
  
  // Insert the new routes
  const doctorRoutes = `
    {
      path: '/critical-results',
      component: 'CriticalResults',
      requiredPermission: 'view_critical_results',
      requireSector: true,
      title: 'Critical Results',
      description: 'View and manage critical test results',
      icon: 'AlertTriangle',
    },
    {
      path: '/fluid-balance',
      component: 'FluidBalance',
      requiredPermission: 'manage_fluid_balance',
      requireSector: true,
      title: 'Fluid Balance',
      description: 'Track patient fluid intake and output',
      icon: 'Droplet',
    },
    {
      path: '/patients/:id/profile',
      component: 'PatientProfile',
      requiredPermission: 'patients:view',
      requireSector: true,
    },`;
  
  content = content.slice(0, doctorRoutesEndPoint + 2) + doctorRoutes + content.slice(doctorRoutesEndPoint + 2);
  
  // Nurse role routes - add after line 238
  const nurseRoutesInsertPoint = content.indexOf("path: '/medications'", doctorRoutesEndPoint);
  if (nurseRoutesInsertPoint === -1) {
    console.error('Could not find insertion point for nurse routes');
    process.exit(1);
  }
  
  // Find the end of the nurse routes section
  const nurseRoutesEndPoint = content.indexOf('}', nurseRoutesInsertPoint);
  if (nurseRoutesEndPoint === -1) {
    console.error('Could not find end point for nurse routes');
    process.exit(1);
  }
  
  // Insert the new routes
  const nurseRoutes = `
    {
      path: '/critical-results',
      component: 'CriticalResults',
      requiredPermission: 'view_critical_results',
      requireSector: true,
      title: 'Critical Results',
      description: 'View and manage critical test results',
      icon: 'AlertTriangle',
    },
    {
      path: '/fluid-balance',
      component: 'FluidBalance',
      requiredPermission: 'manage_fluid_balance',
      requireSector: true,
      title: 'Fluid Balance',
      description: 'Track patient fluid intake and output',
      icon: 'Droplet',
    },
    {
      path: '/patients/:id/profile',
      component: 'PatientProfile',
      requiredPermission: 'patients:view',
      requireSector: true,
    },`;
  
  content = content.slice(0, nurseRoutesEndPoint + 1) + ',' + nurseRoutes + content.slice(nurseRoutesEndPoint + 1);
  
  // Admin role routes - add after line 366
  const adminRoutesInsertPoint = content.indexOf("path: '/admin'", nurseRoutesEndPoint);
  if (adminRoutesInsertPoint === -1) {
    console.error('Could not find insertion point for admin routes');
    process.exit(1);
  }
  
  // Find the end of the admin routes section
  const adminRoutesEndPoint = content.indexOf('}', adminRoutesInsertPoint);
  if (adminRoutesEndPoint === -1) {
    console.error('Could not find end point for admin routes');
    process.exit(1);
  }
  
  // Insert the new routes
  const adminRoutes = `
    {
      path: '/critical-results',
      component: 'CriticalResults',
      title: 'Critical Results',
      description: 'View and manage critical test results',
      icon: 'AlertTriangle',
    },
    {
      path: '/fluid-balance',
      component: 'FluidBalance',
      title: 'Fluid Balance',
      description: 'Track patient fluid intake and output',
      icon: 'Droplet',
    },
    {
      path: '/patients/:id/profile',
      component: 'PatientProfile',
    },`;
  
  content = content.slice(0, adminRoutesEndPoint + 1) + ',' + adminRoutes + content.slice(adminRoutesEndPoint + 1);
  
  // System administrator role routes - add after line 447
  const sysAdminRoutesInsertPoint = content.indexOf("path: '/admin'", adminRoutesEndPoint);
  if (sysAdminRoutesInsertPoint === -1) {
    console.error('Could not find insertion point for system administrator routes');
    process.exit(1);
  }
  
  // Find the end of the system administrator routes section
  const sysAdminRoutesEndPoint = content.indexOf('}', sysAdminRoutesInsertPoint);
  if (sysAdminRoutesEndPoint === -1) {
    console.error('Could not find end point for system administrator routes');
    process.exit(1);
  }
  
  // Insert the new routes
  const sysAdminRoutes = `
    {
      path: '/critical-results',
      component: 'CriticalResults',
      title: 'Critical Results',
      description: 'View and manage critical test results',
      icon: 'AlertTriangle',
    },
    {
      path: '/fluid-balance',
      component: 'FluidBalance',
      title: 'Fluid Balance',
      description: 'Track patient fluid intake and output',
      icon: 'Droplet',
    },
    {
      path: '/patients/:id/profile',
      component: 'PatientProfile',
    },`;
  
  content = content.slice(0, sysAdminRoutesEndPoint + 1) + ',' + sysAdminRoutes + content.slice(sysAdminRoutesEndPoint + 1);
  
  // Write the updated content back to the file
  writeFile(ROUTE_CONFIG_PATH, content);
}

// 2. Update sidebarConfig.ts
function updateSidebarConfig() {
  console.log('Updating sidebarConfig.ts...');
  
  // Backup the file
  backupFile(SIDEBAR_CONFIG_PATH);
  
  // Read the file
  let content = readFile(SIDEBAR_CONFIG_PATH);
  
  // Update imports to include AlertTriangle
  const importsLine = content.indexOf('import {');
  if (importsLine === -1) {
    console.error('Could not find imports line');
    process.exit(1);
  }
  
  const importsEndLine = content.indexOf('}', importsLine);
  if (importsEndLine === -1) {
    console.error('Could not find imports end line');
    process.exit(1);
  }
  
  // Check if AlertTriangle is already imported
  if (content.slice(importsLine, importsEndLine).indexOf('AlertTriangle') === -1) {
    // Add AlertTriangle to imports
    const imports = content.slice(importsLine, importsEndLine);
    const newImports = imports.replace('Package', 'Package, AlertTriangle');
    content = content.slice(0, importsLine) + newImports + content.slice(importsEndLine);
  }
  
  // Add Critical Results entry after Emergency Care
  const emergencyCareEntry = content.indexOf("name: 'Emergency Care'");
  if (emergencyCareEntry === -1) {
    console.error('Could not find Emergency Care entry');
    process.exit(1);
  }
  
  const emergencyCareEntryEnd = content.indexOf('},', emergencyCareEntry);
  if (emergencyCareEntryEnd === -1) {
    console.error('Could not find Emergency Care entry end');
    process.exit(1);
  }
  
  // Check if Critical Results entry already exists
  if (content.indexOf("name: 'Critical Results'") === -1) {
    // Add Critical Results entry
    const criticalResultsEntry = `
  {
    name: 'Critical Results',
    path: '/critical-results',
    icon: AlertTriangle,
    translationKey: 'criticalResults',
    permissionRequired: 'view_critical_results',
    functionBlockRequired: 'clinical_alerts',
    priority: 3,
    roles: ['doctor', 'nurse', 'admin', 'system_administrator']
  },`;
    
    content = content.slice(0, emergencyCareEntryEnd + 2) + criticalResultsEntry + content.slice(emergencyCareEntryEnd + 2);
  }
  
  // Write the updated content back to the file
  writeFile(SIDEBAR_CONFIG_PATH, content);
}

// 3. Update permissions.ts
function updatePermissions() {
  console.log('Updating permissions.ts...');
  
  // Backup the file
  backupFile(PERMISSIONS_PATH);
  
  // Read the file
  let content = readFile(PERMISSIONS_PATH);
  
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
  
  // Check if view_critical_results permission already exists
  if (content.indexOf('VIEW_CRITICAL_RESULTS') === -1) {
    // Add view_critical_results permission
    const newPermission = `
  VIEW_CRITICAL_RESULTS: 'view_critical_results',`;
    
    content = content.slice(0, insertionPoint) + newPermission + content.slice(insertionPoint);
  }
  
  // Write the updated content back to the file
  writeFile(PERMISSIONS_PATH, content);
}

// 4. Update translations.ts
function updateTranslations() {
  console.log('Updating translations.ts...');
  
  // Backup the file
  backupFile(TRANSLATIONS_PATH);
  
  // Read the file
  let content = readFile(TRANSLATIONS_PATH);
  
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
  
  // Check if criticalResults translation already exists in English section
  if (content.slice(enSectionStart, enSectionEnd).indexOf('criticalResults:') === -1) {
    // Add criticalResults translation to English section
    const enTranslation = `
    criticalResults: "Critical Results",`;
    
    content = content.slice(0, enSectionEnd) + enTranslation + content.slice(enSectionEnd);
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
  
  // Check if criticalResults translation already exists in Portuguese section
  if (content.slice(ptSectionStart, ptSectionEnd).indexOf('criticalResults:') === -1) {
    // Add criticalResults translation to Portuguese section
    const ptTranslation = `
    criticalResults: "Resultados Críticos",`;
    
    content = content.slice(0, ptSectionEnd) + ptTranslation + content.slice(ptSectionEnd);
  }
  
  // Write the updated content back to the file
  writeFile(TRANSLATIONS_PATH, content);
}

// Main function
function main() {
  console.log('Starting reintegration of orphaned pages...');
  
  // Update the files
  updateRouteConfig();
  updateSidebarConfig();
  updatePermissions();
  updateTranslations();
  
  console.log('Reintegration complete!');
  console.log('Please test the changes to ensure everything works as expected.');
}

// Run the script
main();