# OmniCare EMR Page Analysis Report

*Generated on 3/24/2025, 11:53:19 AM*

## Summary

- Total Pages: 45
- Total Routes: 94
- Potentially Orphaned Pages: 25
- Prescription Management Pages: 7
- Clinical Task Execution Pages: 4
- Patient Visit Registration Pages: 3
- Other Pages: 31

## Potentially Orphaned Pages

| Page | Path | Clinical Workflows |
|------|------|--------------------|
| FunctionBlocks | Admin/FunctionBlocks.tsx | None |
| RoleManagement | Admin/RoleManagement.tsx | None |
| CriticalResults | CriticalResults.tsx | None |
| EmergencyCare | EmergencyCare.tsx | None |
| FluidBalance | FluidBalance.tsx | clinicalTaskExecution |
| Help | Help.tsx | None |
| HospitalWorkflows | HospitalWorkflows.tsx | None |
| Index | Index.tsx | None |
| MedicalHistory | MedicalHistory.tsx | None |
| MedicationAdministration | MedicationAdministration.tsx | prescriptionManagement |
| MedicationView | MedicationView.tsx | prescriptionManagement |
| Messages | Messages.tsx | None |
| NewOrder | NewOrder.tsx | None |
| Notifications | Notifications.tsx | None |
| PageNotFound | PageNotFound.tsx | None |
| PatientProfile | PatientProfile.tsx | None |
| RecordView | RecordView.tsx | None |
| Records | Records.tsx | None |
| Register | Register.tsx | None |
| ResetPassword | ResetPassword.tsx | None |
| RxNormManagement | RxNormManagement.tsx | None |
| SectorSelection | SectorSelection.tsx | None |
| TaskDetail | TaskDetail.tsx | clinicalTaskExecution |
| Telemedicine | Telemedicine.tsx | prescriptionManagement |
| VisitNotes | VisitNotes.tsx | patientVisitRegistration |

## Clinical Workflow Pages

### Prescription Management

| Page | Path | Orphaned |
|------|------|----------|
| MedicationAdministration | MedicationAdministration.tsx | Yes |
| MedicationView | MedicationView.tsx | Yes |
| Medications | Medications.tsx | No |
| PrescribeMedication | PrescribeMedication.tsx | No |
| PrescriptionView | PrescriptionView.tsx | No |
| Prescriptions | Prescriptions.tsx | No |
| Telemedicine | Telemedicine.tsx | Yes |

### Clinical Task Execution

| Page | Path | Orphaned |
|------|------|----------|
| FluidBalance | FluidBalance.tsx | Yes |
| TaskDetail | TaskDetail.tsx | Yes |
| Tasks | Tasks.tsx | No |
| VitalSigns | VitalSigns.tsx | No |

### Patient Visit Registration

| Page | Path | Orphaned |
|------|------|----------|
| Appointments | Appointments.tsx | No |
| Schedule | Schedule.tsx | No |
| VisitNotes | VisitNotes.tsx | Yes |

