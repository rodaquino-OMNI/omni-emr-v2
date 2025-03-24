# Orphaned Pages Testing Guide

This document provides instructions for testing the reintegrated orphaned pages:

1. MedicationAdministration (src/pages/MedicationAdministration.tsx)
2. MedicationView (src/pages/MedicationView.tsx)
3. RoleManagement (src/pages/Admin/RoleManagement.tsx)

## Prerequisites

- The OmniCare EMR application should be running (`npm run dev`)
- You should have access to accounts with different roles (doctor, nurse, admin, system_administrator)

## Testing Steps

### 1. Medication Administration Page

1. **Navigation Test**:
   - Log in as a nurse or doctor
   - Verify that "Medication Administration" appears in the sidebar
   - Click on "Medication Administration" in the sidebar
   - Verify that you are navigated to the `/medication-administration` route
   - Verify that the MedicationAdministrationPage component is rendered correctly

2. **Functionality Test**:
   - Verify that the medication administration interface loads correctly
   - Check that all components are properly displayed
   - Test any interactive elements (if applicable)

3. **Permission Test**:
   - Log in as a user without the 'administer_medications' permission
   - Verify that the "Medication Administration" option is not visible in the sidebar
   - Try to navigate directly to `/medication-administration`
   - Verify that you are redirected to an unauthorized page or shown an appropriate error message

### 2. Medication View Page

1. **Navigation Test**:
   - Log in as a nurse or doctor
   - Navigate to the Medications page
   - Click on a medication to view its details
   - Verify that you are navigated to the `/medications/:id` route
   - Verify that the MedicationView component is rendered correctly

2. **Functionality Test**:
   - Verify that the medication details are displayed correctly
   - Check that all components (header, details, actions) are properly displayed
   - Test the "Back to medications" link
   - Test the Print, Delete, and Edit buttons (if applicable)

3. **Permission Test**:
   - Log in as a user without the 'view_medications' permission
   - Try to navigate directly to `/medications/:id`
   - Verify that you are redirected to an unauthorized page or shown an appropriate error message

### 3. Role Management Page

1. **Navigation Test**:
   - Log in as an admin or system administrator
   - Navigate to the Administration section
   - Verify that "Role Management" appears in the Administration submenu
   - Click on "Role Management"
   - Verify that you are navigated to the `/admin/roles` route
   - Verify that the RoleManagement component is rendered correctly

2. **Functionality Test**:
   - Verify that the role management interface loads correctly
   - Check that the tabs (Roles and Function Assignment) are displayed
   - Test switching between tabs
   - Verify that the RolesList and RolePermissionMatrix components are rendered correctly
   - Test the "Manage Function Blocks" and "Configure Function Blocks" links

3. **Permission Test**:
   - Log in as a user without the 'manage_roles' permission
   - Try to navigate directly to `/admin/roles`
   - Verify that you are redirected to an unauthorized page or shown an appropriate error message

## Troubleshooting

If you encounter any issues during testing, check the following:

1. **Console Errors**: Open the browser's developer tools and check for any errors in the console.
2. **Network Requests**: Check the network tab for any failed API requests.
3. **Component Rendering**: Verify that all components are being rendered correctly.
4. **Route Configuration**: Check that the routes are properly configured in the RouteConfig.ts file.
5. **Sidebar Configuration**: Verify that the sidebar entries are correctly defined in the sidebarConfig.ts file.
6. **Permissions**: Ensure that the necessary permissions are defined in the permissions.ts file.
7. **Translations**: Check that the translation keys are properly defined in the translations.ts file.

## Reporting Issues

If you encounter any issues that cannot be resolved through troubleshooting, please document them with the following information:

1. The page or component where the issue occurs
2. Steps to reproduce the issue
3. Expected behavior
4. Actual behavior
5. Any error messages or console output
6. Screenshots (if applicable)

## Next Steps

After successful testing, consider the following next steps:

1. Update documentation to reflect the reintegrated pages
2. Implement any additional features or improvements identified during testing
3. Continue with the reintegration of other orphaned pages following the same methodology