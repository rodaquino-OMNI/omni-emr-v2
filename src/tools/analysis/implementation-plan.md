# OmniCare EMR Component Reintegration Implementation Plan

## Analysis Summary

Our analysis of the OmniCare EMR system has identified a significant number of orphaned components and pages that were disconnected during refactoring but contain valuable business logic and UX benefits:

- **Total Pages**: 44
- **Total Components**: 552
- **Orphaned Pages**: 44 (100% of pages)
- **Orphaned Components**: 429 (78% of components)
- **Prescription Management Orphans**: 94
- **Clinical Task Execution Orphans**: 53
- **Patient Visit Registration Orphans**: 39

This high percentage of orphaned components indicates a major refactoring effort that disconnected many components from the main application flow. Our implementation plan will focus on reintegrating these components in a phased approach, prioritizing critical clinical workflows.

## Implementation Phases

### Phase 1: Prescription Management Reintegration (High Priority)

**Objective**: Reintegrate prescription management components to restore medication management functionality.

**Key Components to Reintegrate**:
1. Medication administration components (`medications/administration/*`)
2. Drug interaction checking components (`medications/drugInteractions/*`)
3. Medication safety components (`medications/safety/*`)
4. Prescription management pages (`Medications.tsx`, `PrescribeMedication.tsx`, etc.)

**Implementation Steps**:
1. Analyze the current routing configuration to identify integration points
2. Update the route configuration to include prescription management pages
3. Integrate medication components into patient detail views
4. Restore medication administration workflow
5. Implement drug interaction checking
6. Test the reintegrated components

**Timeline**: 2 weeks

### Phase 2: Clinical Task Execution Reintegration (Medium Priority)

**Objective**: Reintegrate clinical task execution components to restore vital signs monitoring and task management.

**Key Components to Reintegrate**:
1. Task management components (`tasks/*`)
2. Vital signs components (`vital-signs/*`, `vitals/*`)
3. Clinical task execution pages (`Tasks.tsx`, `VitalSigns.tsx`, etc.)

**Implementation Steps**:
1. Update the route configuration to include clinical task pages
2. Integrate task management components into patient detail views
3. Restore vital signs monitoring workflow
4. Implement task assignment and tracking
5. Test the reintegrated components

**Timeline**: 2 weeks

### Phase 3: Patient Visit Registration Reintegration (Medium Priority)

**Objective**: Reintegrate patient visit registration components to restore appointment scheduling and visit documentation.

**Key Components to Reintegrate**:
1. Appointment management components (`schedule/*`)
2. Visit note components (`visit-notes/*`)
3. Patient visit registration pages (`Appointments.tsx`, `Schedule.tsx`, etc.)

**Implementation Steps**:
1. Update the route configuration to include patient visit pages
2. Integrate appointment components into patient detail views
3. Restore appointment scheduling workflow
4. Implement visit note documentation
5. Test the reintegrated components

**Timeline**: 2 weeks

### Phase 4: Integration Testing and Optimization (Low Priority)

**Objective**: Ensure all reintegrated components work together seamlessly and optimize performance.

**Implementation Steps**:
1. Perform end-to-end testing of clinical workflows
2. Identify and resolve any integration issues
3. Optimize component performance
4. Update documentation
5. Implement governance framework

**Timeline**: 1 week

## Technical Implementation Details

### Route Configuration Updates

The route configuration needs to be updated to include the orphaned pages. Here's an example of how to update the route configuration:

```tsx
// src/routes/protectedRoutes.tsx
import { Medications } from '@/pages/Medications';
import { PrescribeMedication } from '@/pages/PrescribeMedication';
import { PrescriptionView } from '@/pages/PrescriptionView';
import { Prescriptions } from '@/pages/Prescriptions';
import { Tasks } from '@/pages/Tasks';
import { VitalSigns } from '@/pages/VitalSigns';
import { Appointments } from '@/pages/Appointments';
import { Schedule } from '@/pages/Schedule';

export const protectedRoutes = [
  // Existing routes
  
  // Prescription Management Routes
  {
    path: '/medications',
    element: <Medications />,
    exact: true,
    authRequired: true,
    permissions: ['view_medications']
  },
  {
    path: '/prescribe-medication',
    element: <PrescribeMedication />,
    exact: true,
    authRequired: true,
    permissions: ['prescribe_medications']
  },
  {
    path: '/prescriptions',
    element: <Prescriptions />,
    exact: true,
    authRequired: true,
    permissions: ['view_prescriptions']
  },
  {
    path: '/prescriptions/:id',
    element: <PrescriptionView />,
    exact: true,
    authRequired: true,
    permissions: ['view_prescriptions']
  },
  
  // Clinical Task Execution Routes
  {
    path: '/tasks',
    element: <Tasks />,
    exact: true,
    authRequired: true,
    permissions: ['view_tasks']
  },
  {
    path: '/vital-signs',
    element: <VitalSigns />,
    exact: true,
    authRequired: true,
    permissions: ['view_vitals']
  },
  
  // Patient Visit Registration Routes
  {
    path: '/appointments',
    element: <Appointments />,
    exact: true,
    authRequired: true,
    permissions: ['view_appointments']
  },
  {
    path: '/schedule',
    element: <Schedule />,
    exact: true,
    authRequired: true,
    permissions: ['manage_schedule']
  }
];
```

### Sidebar Configuration Updates

The sidebar configuration needs to be updated to include links to the reintegrated pages:

```tsx
// src/config/sidebarConfig.ts
export const sidebarConfig = {
  // Existing configuration
  
  items: [
    // Existing items
    
    // Prescription Management
    {
      title: 'Medications',
      path: '/medications',
      icon: 'pill',
      permissions: ['view_medications'],
      roles: ['doctor', 'nurse', 'pharmacist']
    },
    {
      title: 'Prescriptions',
      path: '/prescriptions',
      icon: 'clipboard',
      permissions: ['view_prescriptions'],
      roles: ['doctor', 'pharmacist']
    },
    
    // Clinical Task Execution
    {
      title: 'Tasks',
      path: '/tasks',
      icon: 'check-square',
      permissions: ['view_tasks'],
      roles: ['doctor', 'nurse', 'medical_staff']
    },
    {
      title: 'Vital Signs',
      path: '/vital-signs',
      icon: 'activity',
      permissions: ['view_vitals'],
      roles: ['doctor', 'nurse', 'medical_staff']
    },
    
    // Patient Visit Registration
    {
      title: 'Appointments',
      path: '/appointments',
      icon: 'calendar',
      permissions: ['view_appointments'],
      roles: ['doctor', 'nurse', 'receptionist']
    },
    {
      title: 'Schedule',
      path: '/schedule',
      icon: 'clock',
      permissions: ['manage_schedule'],
      roles: ['doctor', 'nurse', 'receptionist']
    }
  ]
};
```

### Patient Detail Integration

The patient detail page needs to be updated to include tabs for the reintegrated components:

```tsx
// src/pages/PatientDetail.tsx
import { PatientMedicationsTab } from '@/components/patients/tabs/PatientMedicationsTab';
import { PatientPrescriptionsTab } from '@/components/patients/tabs/PatientPrescriptionsTab';
import { PatientVitalSignsTab } from '@/components/patients/tabs/PatientVitalSignsTab';
import { PatientCareTasksTab } from '@/components/patients/tabs/PatientCareTasksTab';
import { PatientAppointmentsTab } from '@/components/patients/tabs/PatientAppointmentsTab';

// In the tabs configuration
const tabs = [
  // Existing tabs
  
  // Prescription Management
  {
    id: 'medications',
    label: t('medications'),
    icon: <Pill className="h-4 w-4" />,
    content: <PatientMedicationsTab patientId={patientId} />,
    permissions: ['view_medications']
  },
  {
    id: 'prescriptions',
    label: t('prescriptions'),
    icon: <Clipboard className="h-4 w-4" />,
    content: <PatientPrescriptionsTab patientId={patientId} />,
    permissions: ['view_prescriptions']
  },
  
  // Clinical Task Execution
  {
    id: 'vitals',
    label: t('vitalSigns'),
    icon: <Activity className="h-4 w-4" />,
    content: <PatientVitalSignsTab patientId={patientId} />,
    permissions: ['view_vitals']
  },
  {
    id: 'tasks',
    label: t('tasks'),
    icon: <CheckSquare className="h-4 w-4" />,
    content: <PatientCareTasksTab patientId={patientId} />,
    permissions: ['view_tasks']
  },
  
  // Patient Visit Registration
  {
    id: 'appointments',
    label: t('appointments'),
    icon: <Calendar className="h-4 w-4" />,
    content: <PatientAppointmentsTab patientId={patientId} />,
    permissions: ['view_appointments']
  }
];
```

### Dashboard Integration

The dashboard needs to be updated to include cards for the reintegrated components:

```tsx
// src/registry/entrypoints/DoctorDashboard.tsx
import { MedicationsCard } from '@/components/patients/overview/MedicationsCard';
import { VitalSignsCard } from '@/components/patients/overview/VitalSignsCard';
import { AppointmentsCard } from '@/components/patients/overview/AppointmentsCard';

// In the dashboard layout
return (
  <div className="space-y-4">
    <h1 className="text-2xl font-bold">Doctor Dashboard</h1>
    
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Existing cards */}
      
      {/* Prescription Management */}
      <MedicationsCard patientId={selectedPatient?.id} />
      
      {/* Clinical Task Execution */}
      <VitalSignsCard patientId={selectedPatient?.id} />
      
      {/* Patient Visit Registration */}
      <AppointmentsCard patientId={selectedPatient?.id} />
    </div>
  </div>
);
```

## Governance Framework Implementation

To prevent future disconnections, we will implement a governance framework with the following components:

### 1. Code Ownership Documentation

Create a CODEOWNERS file to define ownership of components:

```
# CODEOWNERS file
# Format: path/to/file/or/directory @owner

# Prescription Management
/src/components/medications/ @medication-team
/src/pages/Medications.tsx @medication-team
/src/pages/PrescribeMedication.tsx @medication-team
/src/pages/Prescriptions.tsx @medication-team
/src/pages/PrescriptionView.tsx @medication-team

# Clinical Task Execution
/src/components/tasks/ @task-team
/src/components/vital-signs/ @vitals-team
/src/components/vitals/ @vitals-team
/src/pages/Tasks.tsx @task-team
/src/pages/VitalSigns.tsx @vitals-team

# Patient Visit Registration
/src/components/schedule/ @schedule-team
/src/components/visit-notes/ @visit-team
/src/pages/Appointments.tsx @schedule-team
/src/pages/Schedule.tsx @schedule-team
```

### 2. Testing Protocols

Implement automated tests for critical workflows:

```tsx
// src/tests/workflows/prescription-workflow.test.tsx
describe('Prescription Workflow', () => {
  test('Doctor can prescribe medication', async () => {
    // Test implementation
  });
  
  test('Pharmacist can review prescription', async () => {
    // Test implementation
  });
  
  test('Nurse can administer medication', async () => {
    // Test implementation
  });
});
```

### 3. Architectural Decision Records

Create ADRs for major architectural decisions:

```markdown
# ADR 1: Component Reintegration Strategy

## Status
Accepted

## Context
Many components were disconnected during refactoring but contain valuable business logic and UX benefits.

## Decision
We will reintegrate these components in a phased approach, prioritizing critical clinical workflows.

## Consequences
- Improved clinical workflow efficiency
- Restored valuable functionality
- Increased code complexity in the short term
- Need for comprehensive testing
```

## Success Metrics

We will measure the success of the reintegration effort using the following metrics:

1. **Clinical Efficiency**
   - Reduction in workflow steps
   - Improved information accessibility
   - Enhanced decision support

2. **Code Quality**
   - Reduced component duplication
   - Improved code reuse
   - Enhanced maintainability

3. **User Experience**
   - Improved workflow continuity
   - Reduced context switching
   - Enhanced information presentation

4. **Compliance**
   - Maintained or improved HIPAA compliance
   - Enhanced audit capabilities
   - Improved data protection

## Conclusion

This implementation plan provides a detailed roadmap for reintegrating orphaned components in the OmniCare EMR system. By following this plan, we will restore valuable functionality, improve clinical workflows, and establish governance to prevent future disconnections.