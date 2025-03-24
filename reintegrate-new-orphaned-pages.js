/**
 * Reintegrate New Orphaned Pages Script
 *
 * This script helps implement the reintegration of three additional orphaned pages:
 * 1. MedicationAdministration (src/pages/MedicationAdministration.tsx)
 * 2. MedicationView (src/pages/MedicationView.tsx)
 * 3. RoleManagement (src/pages/Admin/RoleManagement.tsx)
 *
 * Usage:
 * node reintegrate-new-orphaned-pages.js
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
  
  // Doctor role routes - add after an existing route
  const doctorRoutesInsertPoint = content.indexOf("path: '/medications'");
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
      path: '/medication-administration',
      component: 'MedicationAdministration',
      requiredPermission: 'administer_medications',
      requireSector: true,
      title: 'Medication Administration',
      description: 'Administer medications to patients',
      icon: 'Pill',
    },
    {
      path: '/medications/:id',
      component: 'MedicationView',
      requiredPermission: 'view_medications',
      requireSector: true,
      title: 'Medication Details',
      description: 'View medication details',
      icon: 'Pill',
    },`;
  
  content = content.slice(0, doctorRoutesEndPoint + 2) + doctorRoutes + content.slice(doctorRoutesEndPoint + 2);
  
  // Nurse role routes - add after an existing route
  const nurseRoutesInsertPoint = content.indexOf("path: '/medications'", doctorRoutesEndPoint);
  if (nurseRoutesInsertPoint === -1) {
    console.error('Could not find insertion point for nurse routes');
    process.exit(1);
  }
  
  // Find the end of the nurse routes section
  const nurseRoutesEndPoint = content.indexOf('},', nurseRoutesInsertPoint);
  if (nurseRoutesEndPoint === -1) {
    console.error('Could not find end point for nurse routes');
    process.exit(1);
  }
  
  // Insert the new routes
  const nurseRoutes = `
    {
      path: '/medication-administration',
      component: 'MedicationAdministration',
      requiredPermission: 'administer_medications',
      requireSector: true,
      title: 'Medication Administration',
      description: 'Administer medications to patients',
      icon: 'Pill',
    },
    {
      path: '/medications/:id',
      component: 'MedicationView',
      requiredPermission: 'view_medications',
      requireSector: true,
      title: 'Medication Details',
      description: 'View medication details',
      icon: 'Pill',
    },`;
  
  content = content.slice(0, nurseRoutesEndPoint + 1) + ',' + nurseRoutes + content.slice(nurseRoutesEndPoint + 1);
  
  // Admin role routes - add after an existing route
  const adminRoutesInsertPoint = content.indexOf("path: '/admin'", nurseRoutesEndPoint);
  if (adminRoutesInsertPoint === -1) {
    console.error('Could not find insertion point for admin routes');
    process.exit(1);
  }
  
  // Find the end of the admin routes section
  const adminRoutesEndPoint = content.indexOf('},', adminRoutesInsertPoint);
  if (adminRoutesEndPoint === -1) {
    console.error('Could not find end point for admin routes');
    process.exit(1);
  }
  
  // Insert the new routes
  const adminRoutes = `
    {
      path: '/admin/roles',
      component: 'Admin/RoleManagement',
      requiredPermission: 'manage_roles',
      title: 'Role Management',
      description: 'Manage user roles and permissions',
      icon: 'Shield',
    },
    {
      path: '/medication-administration',
      component: 'MedicationAdministration',
      title: 'Medication Administration',
      description: 'Administer medications to patients',
      icon: 'Pill',
    },
    {
      path: '/medications/:id',
      component: 'MedicationView',
      title: 'Medication Details',
      description: 'View medication details',
      icon: 'Pill',
    },`;
  
  content = content.slice(0, adminRoutesEndPoint + 1) + ',' + adminRoutes + content.slice(adminRoutesEndPoint + 1);
  
  // System administrator role routes - add after an existing route
  const sysAdminRoutesInsertPoint = content.indexOf("path: '/admin'", adminRoutesEndPoint);
  if (sysAdminRoutesInsertPoint === -1) {
    console.error('Could not find insertion point for system administrator routes');
    process.exit(1);
  }
  
  // Find the end of the system administrator routes section
  const sysAdminRoutesEndPoint = content.indexOf('},', sysAdminRoutesInsertPoint);
  if (sysAdminRoutesEndPoint === -1) {
    console.error('Could not find end point for system administrator routes');
    process.exit(1);
  }
  
  // Insert the new routes
  const sysAdminRoutes = `
    {
      path: '/admin/roles',
      component: 'Admin/RoleManagement',
      requiredPermission: 'manage_roles',
      title: 'Role Management',
      description: 'Manage user roles and permissions',
      icon: 'Shield',
    },
    {
      path: '/medication-administration',
      component: 'MedicationAdministration',
      title: 'Medication Administration',
      description: 'Administer medications to patients',
      icon: 'Pill',
    },
    {
      path: '/medications/:id',
      component: 'MedicationView',
      title: 'Medication Details',
      description: 'View medication details',
      icon: 'Pill',
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
  
  // Update imports to include Shield if not already included
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
  
  // Check if Shield is already imported
  if (content.slice(importsLine, importsEndLine).indexOf('Shield') === -1) {
    // Add Shield to imports
    const imports = content.slice(importsLine, importsEndLine);
    const newImports = imports.replace('Package', 'Package, Shield');
    content = content.slice(0, importsLine) + newImports + content.slice(importsEndLine);
  }
  
  // Update the existing Medication Administration entry to point to the correct path
  const medicationAdminEntry = content.indexOf("name: 'Medication Administration'");
  if (medicationAdminEntry === -1) {
    console.error('Could not find Medication Administration entry');
    // If not found, we'll add it after the Dashboard entry
    const dashboardEntry = content.indexOf("name: 'Dashboard'");
    if (dashboardEntry === -1) {
      console.error('Could not find Dashboard entry');
      process.exit(1);
    }
    
    const dashboardEntryEnd = content.indexOf('},', dashboardEntry);
    if (dashboardEntryEnd === -1) {
      console.error('Could not find Dashboard entry end');
      process.exit(1);
    }
    
    // Add Medication Administration entry
    const newMedicationAdminEntry = `
  {
    name: 'Medication Administration',
    path: '/medication-administration',
    icon: Pill,
    translationKey: 'medicationAdministration',
    permissionRequired: 'administer_medications',
    functionBlockRequired: 'medication_management',
    priority: 4,
    roles: ['doctor', 'nurse', 'admin', 'system_administrator']
  },`;
    
    content = content.slice(0, dashboardEntryEnd + 2) + newMedicationAdminEntry + content.slice(dashboardEntryEnd + 2);
  } else {
    // If found, update the path
    const pathStart = content.indexOf('path:', medicationAdminEntry);
    if (pathStart === -1) {
      console.error('Could not find path in Medication Administration entry');
      process.exit(1);
    }
    
    const pathEnd = content.indexOf(',', pathStart);
    if (pathEnd === -1) {
      console.error('Could not find end of path in Medication Administration entry');
      process.exit(1);
    }
    
    // Update the path
    const oldPath = content.slice(pathStart, pathEnd);
    const newPath = "path: '/medication-administration'";
    content = content.slice(0, pathStart) + newPath + content.slice(pathEnd);
  }
  
  // Add Role Management entry in the Administration section's children
  const adminEntry = content.indexOf("name: 'Administration'");
  if (adminEntry === -1) {
    console.error('Could not find Administration entry');
    process.exit(1);
  }
  
  // Find the children array of the Administration entry
  const childrenStart = content.indexOf('children: [', adminEntry);
  if (childrenStart === -1) {
    console.error('Could not find children array in Administration entry');
    process.exit(1);
  }
  
  // Find the first child in the children array
  const firstChildStart = content.indexOf('{', childrenStart);
  if (firstChildStart === -1) {
    console.error('Could not find first child in Administration entry');
    process.exit(1);
  }
  
  // Check if Role Management entry already exists
  if (content.indexOf("name: 'Role Management'") === -1) {
    // Add Role Management entry as a child of Administration
    const roleManagementEntry = `
        {
          name: 'Role Management',
          path: '/admin/roles',
          icon: Shield,
          translationKey: 'roleManagement',
          permissionRequired: 'manage_roles',
          functionBlockRequired: 'system_administration',
          priority: 2,
        },`;
    
    content = content.slice(0, firstChildStart) + roleManagementEntry + content.slice(firstChildStart);
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
  
  // Check if administer_medications permission already exists
  if (content.indexOf('ADMINISTER_MEDICATIONS') === -1) {
    // Add administer_medications permission
    const newPermission = `
  ADMINISTER_MEDICATIONS: 'administer_medications',`;
    
    content = content.slice(0, insertionPoint) + newPermission + content.slice(insertionPoint);
  }
  
  // Check if manage_roles permission already exists
  if (content.indexOf('MANAGE_ROLES') === -1) {
    // Add manage_roles permission
    const newPermission = `
  MANAGE_ROLES: 'manage_roles',`;
    
    content = content.slice(0, insertionPoint) + newPermission + content.slice(insertionPoint);
  }
  
  // Check if view_medications permission already exists
  if (content.indexOf('VIEW_MEDICATIONS') === -1) {
    // Add view_medications permission
    const newPermission = `
  VIEW_MEDICATIONS: 'view_medications',`;
    
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
  
  // Check if medicationAdministration translation already exists in English section
  if (content.slice(enSectionStart, enSectionEnd).indexOf('medicationAdministration:') === -1) {
    // Add medicationAdministration translation to English section
    const enTranslation = `
    medicationAdministration: "Medication Administration",`;
    
    content = content.slice(0, enSectionEnd) + enTranslation + content.slice(enSectionEnd);
  }
  
  // Check if roleManagement translation already exists in English section
  if (content.slice(enSectionStart, enSectionEnd).indexOf('roleManagement:') === -1) {
    // Add roleManagement translation to English section
    const enTranslation = `
    roleManagement: "Role Management",`;
    
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
  
  // Check if medicationAdministration translation already exists in Portuguese section
  if (content.slice(ptSectionStart, ptSectionEnd).indexOf('medicationAdministration:') === -1) {
    // Add medicationAdministration translation to Portuguese section
    const ptTranslation = `
    medicationAdministration: "Administração de Medicamentos",`;
    
    content = content.slice(0, ptSectionEnd) + ptTranslation + content.slice(ptSectionEnd);
  }
  
  // Check if roleManagement translation already exists in Portuguese section
  if (content.slice(ptSectionStart, ptSectionEnd).indexOf('roleManagement:') === -1) {
    // Add roleManagement translation to Portuguese section
    const ptTranslation = `
    roleManagement: "Gerenciamento de Funções",`;
    
    content = content.slice(0, ptSectionEnd) + ptTranslation + content.slice(ptSectionEnd);
  }
  
  // Write the updated content back to the file
  writeFile(TRANSLATIONS_PATH, content);
}

// 5. Update routes/index.tsx to include the new components
function updateRoutesIndex() {
  console.log('Updating routes/index.tsx...');
  
  // Path to the routes/index.tsx file
  const ROUTES_INDEX_PATH = path.join(__dirname, 'src', 'routes', 'index.tsx');
  
  // Backup the file
  backupFile(ROUTES_INDEX_PATH);
  
  // Read the file
  let content = readFile(ROUTES_INDEX_PATH);
  
  // Find the lazy-loaded components section
  const lazyComponentsStart = content.indexOf('// Define lazy-loaded components');
  if (lazyComponentsStart === -1) {
    console.error('Could not find lazy-loaded components section');
    process.exit(1);
  }
  
  // Find a good insertion point after the existing components
  const insertionPoint = content.indexOf('// Add missing lazy-loaded components', lazyComponentsStart);
  if (insertionPoint === -1) {
    console.error('Could not find insertion point for lazy-loaded components');
    process.exit(1);
  }
  
  // Check if MedicationAdministration is already imported
  if (content.indexOf("import('../pages/MedicationAdministration')") === -1) {
    // Add MedicationAdministration import
    const newImport = `const MedicationAdministration = lazy(() => import('../pages/MedicationAdministration').then(module => ({ default: module.default })));\n`;
    
    content = content.slice(0, insertionPoint) + newImport + content.slice(insertionPoint);
  }
  
  // Check if MedicationView is already imported
  if (content.indexOf("import('../pages/MedicationView')") === -1) {
    // Add MedicationView import
    const newImport = `const MedicationView = lazy(() => import('../pages/MedicationView').then(module => ({ default: module.default })));\n`;
    
    content = content.slice(0, insertionPoint) + newImport + content.slice(insertionPoint);
  }
  
  // Check if RoleManagement is already imported
  if (content.indexOf("import('../pages/Admin/RoleManagement')") === -1) {
    // Add RoleManagement import
    const newImport = `const RoleManagement = lazy(() => import('../pages/Admin/RoleManagement').then(module => ({ default: module.default })));\n`;
    
    content = content.slice(0, insertionPoint) + newImport + content.slice(insertionPoint);
  }
  
  // Find the static routes section
  const staticRoutesStart = content.indexOf('children: [');
  if (staticRoutesStart === -1) {
    console.error('Could not find static routes section');
    process.exit(1);
  }
  
  // Find the end of the static routes section
  const staticRoutesEnd = content.indexOf('],', staticRoutesStart);
  if (staticRoutesEnd === -1) {
    console.error('Could not find end of static routes section');
    process.exit(1);
  }
  
  // Check if MedicationAdministration route already exists
  if (content.slice(staticRoutesStart, staticRoutesEnd).indexOf("path: 'medication-administration'") === -1) {
    // Add MedicationAdministration route
    const newRoute = `
      {
        path: 'medication-administration',
        element: <Suspense fallback={<Loading />}><MedicationAdministration /></Suspense>,
      },`;
    
    content = content.slice(0, staticRoutesEnd) + newRoute + content.slice(staticRoutesEnd);
  }
  
  // Check if MedicationView route already exists
  if (content.slice(staticRoutesStart, staticRoutesEnd).indexOf("path: 'medications/:id'") === -1) {
    // Add MedicationView route
    const newRoute = `
      {
        path: 'medications/:id',
        element: <Suspense fallback={<Loading />}><MedicationView /></Suspense>,
      },`;
    
    content = content.slice(0, staticRoutesEnd) + newRoute + content.slice(staticRoutesEnd);
  }
  
  // Check if RoleManagement route already exists
  if (content.slice(staticRoutesStart, staticRoutesEnd).indexOf("path: 'admin/roles'") === -1) {
    // Add RoleManagement route
    const newRoute = `
      {
        path: 'admin/roles',
        element: <Suspense fallback={<Loading />}><RoleManagement /></Suspense>,
      },`;
    
    content = content.slice(0, staticRoutesEnd) + newRoute + content.slice(staticRoutesEnd);
  }
  
  // Write the updated content back to the file
  writeFile(ROUTES_INDEX_PATH, content);
}

// Main function
function main() {
  console.log('Starting reintegration of new orphaned pages...');
  
  // Update the files
  updateRouteConfig();
  updateSidebarConfig();
  updatePermissions();
  updateTranslations();
  updateRoutesIndex();
  
  console.log('Reintegration complete!');
  console.log('Please test the changes to ensure everything works as expected.');
}

// Run the script
main();