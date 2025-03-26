# Orphaned Pages Implementation Plan

This document outlines the specific code changes needed to reintegrate the three pilot pages (CriticalResults, FluidBalance, and PatientProfile) into the OmniCare EMR system.

## Current Status

From our analysis, we've found that:

1. **FluidBalance** is already in the sidebar configuration (line 46-54) but missing from the route configuration.
2. **CriticalResults** is missing from both the sidebar and route configurations.
3. **PatientProfile** is partially accessible via a link from the PatientDetail page but missing from the route configuration.

## Implementation Steps

### 1. Update RouteConfig.ts

Add the missing route definitions to the appropriate role sections in `src/routes/RouteConfig.ts`:

```typescript
// Add to doctor role routes (around line 160)
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
},

// Add to nurse role routes (around line 238)
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
},

// Add to admin role routes (around line 366)
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
},

// Add to system_administrator role routes (around line 447)
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
},
```

### 2. Update sidebarConfig.ts

Add the missing sidebar entry for CriticalResults in `src/config/sidebarConfig.ts`:

```typescript
// Add after the Emergency Care entry (around line 33)
{
  name: 'Critical Results',
  path: '/critical-results',
  icon: AlertTriangle, // Make sure to add AlertTriangle to the imports at the top
  translationKey: 'criticalResults',
  permissionRequired: 'view_critical_results',
  functionBlockRequired: 'clinical_alerts',
  priority: 3,
  roles: ['doctor', 'nurse', 'admin', 'system_administrator']
},
```

Update the imports at the top of the file to include AlertTriangle:

```typescript
import { LucideIcon, Home, Users, FileText, Pill, Calendar, MessageSquare, Video, HelpCircle, ClipboardList, Bell, ListChecks, Activity, Droplet, Settings, BarChart, Stethoscope, BookUser, FileHeart, FlaskConical, ClipboardCheck, Siren, Shield, Package, AlertTriangle } from 'lucide-react';
```

### 3. Add Translation Keys

Add the missing translation keys in the appropriate translation files:

```typescript
// In src/i18n/translations.ts or appropriate file
{
  criticalResults: {
    en: 'Critical Results',
    pt: 'Resultados Críticos'
  },
  // FluidBalance already exists in the sidebar config
}
```

### 4. Add Permission Definitions

Add the missing permission definitions in `src/constants/permissions.ts`:

```typescript
// Add to the permissions object
{
  view_critical_results: {
    label: 'View Critical Results',
    description: 'View and manage critical test results',
    roles: ['doctor', 'nurse', 'admin', 'system_administrator']
  },
  // manage_fluid_balance already exists in the sidebar config
}
```

### 5. Add Function Block Definitions

Add the missing function block definitions in the appropriate file (likely in the admin section):

```typescript
// Add to the function blocks configuration
{
  id: 'clinical_alerts',
  name: 'Clinical Alerts',
  description: 'Features related to clinical alerts and critical results',
  enabled: true,
  permissions: ['view_critical_results']
},
// fluid_balance already exists in the sidebar config
```

## Testing Plan

After implementing these changes, test the following:

1. **Route Access**:
   - Navigate directly to `/critical-results`, `/fluid-balance`, and `/patients/:id/profile` URLs
   - Verify that the pages load correctly
   - Verify that permission checks work as expected

2. **Sidebar Navigation**:
   - Verify that Critical Results and Fluid Balance appear in the sidebar
   - Verify that clicking on them navigates to the correct pages
   - Verify that they only appear for users with the appropriate roles and permissions

3. **Functionality**:
   - Verify that all features of each page work correctly
   - Test CriticalResults acknowledgment functionality
   - Test FluidBalance intake and output recording
   - Test PatientProfile editing and saving

## Rollback Plan

If issues are encountered, the following rollback steps can be taken:

1. Remove the added route definitions from RouteConfig.ts
2. Remove the added sidebar entry from sidebarConfig.ts
3. Remove the added translation keys, permissions, and function block definitions

## Next Steps

After successfully reintegrating these three pilot pages, proceed with the analysis and reintegration of the remaining orphaned pages following the same approach.