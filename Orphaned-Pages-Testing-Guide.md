# Orphaned Pages Testing Guide

This guide provides instructions for testing the reintegrated orphaned pages in the OmniCare EMR system.

## Login Credentials

Use the following credentials to log in to the system:

| Role | Email | Password |
|------|-------|----------|
| Doctor | doctor@omnicare.com | password123 |
| Nurse | nurse@omnicare.com | password123 |
| Admin | admin@omnicare.com | password123 |

## Testing the Reintegrated Pages

### 1. Critical Results Page

1. **Access via Sidebar**:
   - Log in with any of the credentials above
   - Verify that "Critical Results" appears in the sidebar
   - Click on "Critical Results" in the sidebar
   - Verify that the Critical Results page loads correctly

2. **Access via Direct URL**:
   - Navigate to `/critical-results`
   - Verify that the Critical Results page loads correctly

3. **Functionality Testing**:
   - Verify that critical results are displayed
   - Test filtering by acknowledgment status (all/acknowledged/unacknowledged)
   - Test acknowledging a critical result
   - Verify that permission checks work as expected

### 2. Fluid Balance Page

1. **Access via Sidebar**:
   - Log in with any of the credentials above
   - Verify that "Fluid Balance" appears in the sidebar
   - Click on "Fluid Balance" in the sidebar
   - Verify that the Fluid Balance page loads correctly

2. **Access via Direct URL**:
   - Navigate to `/fluid-balance`
   - Verify that the Fluid Balance page loads correctly

3. **Functionality Testing**:
   - Test recording fluid intake with different types, amounts, and timestamps
   - Test recording fluid output with different types, amounts, and timestamps
   - Verify that the history of fluid intake and output is displayed correctly
   - Test the multilingual support by switching between English and Portuguese

### 3. Patient Profile Page

1. **Access via Patient Detail Page**:
   - Log in with any of the credentials above
   - Navigate to the Patients page
   - Click on a patient to view their details
   - Click on "Edit profile" button
   - Verify that the Patient Profile page loads correctly

2. **Access via Direct URL**:
   - Navigate to `/patients/:id/profile` (replace `:id` with an actual patient ID)
   - Verify that the Patient Profile page loads correctly

3. **Functionality Testing**:
   - Test editing patient information (name, date of birth, gender, etc.)
   - Test saving changes
   - Verify that the changes are reflected in the patient detail page
   - Test the multilingual support by switching between English and Portuguese

## Verification Checklist

Use this checklist to ensure all aspects of the reintegrated pages are working correctly:

- [ ] Critical Results page is accessible via sidebar
- [ ] Critical Results page is accessible via direct URL
- [ ] Critical Results functionality works correctly
- [ ] Fluid Balance page is accessible via sidebar
- [ ] Fluid Balance page is accessible via direct URL
- [ ] Fluid Balance functionality works correctly
- [ ] Patient Profile page is accessible via Patient Detail page
- [ ] Patient Profile page is accessible via direct URL
- [ ] Patient Profile functionality works correctly
- [ ] All pages respect permission checks
- [ ] All pages support multilingual interface

## Reporting Issues

If you encounter any issues during testing, please document them with the following information:

1. Page/feature being tested
2. Steps to reproduce the issue
3. Expected behavior
4. Actual behavior
5. Screenshots (if applicable)
6. Browser and device information

## Next Steps

After successfully testing the reintegrated pages, proceed with the analysis and reintegration of the remaining orphaned pages following the same approach.