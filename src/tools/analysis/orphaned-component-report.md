# OmniCare EMR Orphaned Component Analysis Report

*Generated on 3/20/2025, 3:34:43 PM*

## Summary

- Total Pages: 44
- Total Components: 552
- Orphaned Pages: 44
- Orphaned Components: 429
- Prescription Management Orphans: 94
- Clinical Task Execution Orphans: 53
- Patient Visit Registration Orphans: 39

## Reintegration Recommendations

### High Priority

#### Components

| Component | Path | Clinical Workflows |
|-----------|------|--------------------|
| MedicationAutocompleteDemoPage | debug/MedicationAutocompleteDemoPage.tsx | prescriptionManagement |
| FHIRMedicationDetail | medications/FHIRMedicationDetail.tsx | prescriptionManagement |
| MedicationCard | medications/MedicationCard.tsx | prescriptionManagement |
| MedicineTranslationForm | medications/MedicineTranslationForm.tsx | prescriptionManagement |
| RxNormActionButtons | medications/admin/RxNormActionButtons.tsx | prescriptionManagement |
| RxNormStatsCards | medications/admin/RxNormStatsCards.tsx | prescriptionManagement |
| rxnormApi | medications/admin/api/rxnormApi.ts | prescriptionManagement |
| dateUtils | medications/admin/dateUtils.ts | prescriptionManagement |
| index | medications/admin/index.ts | prescriptionManagement |
| useRxNormStats | medications/admin/useRxNormStats.ts | prescriptionManagement |
| dbUtils | medications/admin/utils/dbUtils.ts | prescriptionManagement |
| IVCalculator | medications/administration/IVCalculator.tsx | prescriptionManagement |
| MedicationScanner | medications/administration/MedicationScanner.tsx | prescriptionManagement |
| PatientSafetyHeader | medications/administration/PatientSafetyHeader.tsx | prescriptionManagement |
| TimelineView | medications/administration/TimelineView.tsx | prescriptionManagement |
| MedicationAdministrationContent | medications/administration/components/MedicationAdministrationContent.tsx | prescriptionManagement |
| MedicationAdministrationDialogs | medications/administration/components/MedicationAdministrationDialogs.tsx | prescriptionManagement |
| MedicationAdministrationHeader | medications/administration/components/MedicationAdministrationHeader.tsx | prescriptionManagement |
| ViewOnlyPermissionWarning | medications/administration/components/ViewOnlyPermissionWarning.tsx | prescriptionManagement |
| useAdminActionHandlers | medications/administration/hooks/useAdminActionHandlers.tsx | prescriptionManagement |
| useAdminMedicationRecords | medications/administration/hooks/useAdminMedicationRecords.tsx | prescriptionManagement |
| useAdminPatientData | medications/administration/hooks/useAdminPatientData.tsx | prescriptionManagement |
| useMedicationAdministration | medications/administration/hooks/useMedicationAdministration.tsx | prescriptionManagement |
| useScannerState | medications/administration/hooks/useScannerState.tsx | prescriptionManagement |
| MedicationDetailSection | medications/administration/page/MedicationDetailSection.tsx | prescriptionManagement |
| PageHeader | medications/administration/page/PageHeader.tsx | prescriptionManagement |
| PatientListSection | medications/administration/page/PatientListSection.tsx | prescriptionManagement |
| MedicationActions | medications/administration/record/MedicationActions.tsx | prescriptionManagement |
| MedicationDetails | medications/administration/record/MedicationDetails.tsx | prescriptionManagement |
| MedicationTable | medications/administration/record/MedicationTable.tsx | prescriptionManagement |
| MissedMedicationDialog | medications/administration/record/MissedMedicationDialog.tsx | prescriptionManagement |
| types | medications/administration/record/types.ts | prescriptionManagement |
| AllergyWarning | medications/administration/scanner/AllergyWarning.tsx | prescriptionManagement |
| BarcodeScanner | medications/administration/scanner/BarcodeScanner.tsx | prescriptionManagement |
| EHRVerification | medications/administration/scanner/EHRVerification.ts | prescriptionManagement, clinicalTaskExecution |
| ManualEntryForm | medications/administration/scanner/ManualEntryForm.tsx | prescriptionManagement |
| MedicationHeader | medications/administration/scanner/MedicationHeader.tsx | prescriptionManagement |
| ScanItem | medications/administration/scanner/ScanItem.tsx | prescriptionManagement |
| useScannerState | medications/administration/scanner/hooks/useScannerState.tsx | prescriptionManagement |
| useVerificationService | medications/administration/scanner/hooks/useVerificationService.tsx | prescriptionManagement, clinicalTaskExecution |
| types | medications/administration/scanner/types.ts | prescriptionManagement |
| useMedicationScanner | medications/administration/scanner/useMedicationScanner.tsx | prescriptionManagement |
| AIInsightsSection | medications/detail/AIInsightsSection.tsx | prescriptionManagement |
| MedicationHeader | medications/detail/MedicationHeader.tsx | prescriptionManagement |
| MedicationInfo | medications/detail/MedicationInfo.tsx | prescriptionManagement |
| MedicationNotFound | medications/detail/MedicationNotFound.tsx | prescriptionManagement |
| SpecialInstructions | medications/detail/SpecialInstructions.tsx | prescriptionManagement |
| useMedicationData | medications/detail/useMedicationData.ts | prescriptionManagement |
| useMedicationData | medications/detail/useMedicationData.tsx | prescriptionManagement |
| DrugInteractionSearch | medications/drugInteractions/DrugInteractionSearch.tsx | prescriptionManagement |
| InteractionResults | medications/drugInteractions/InteractionResults.tsx | prescriptionManagement |
| InteractionSeverityBadge | medications/drugInteractions/InteractionSeverityBadge.tsx | prescriptionManagement |
| MedicationList | medications/drugInteractions/MedicationList.tsx | prescriptionManagement |
| MedicationDateField | medications/form/MedicationDateField.tsx | prescriptionManagement |
| MedicationDateFields | medications/form/MedicationDateFields.tsx | prescriptionManagement |
| MedicationDetailsFields | medications/form/MedicationDetailsFields.tsx | prescriptionManagement |
| MedicationFormButtons | medications/form/MedicationFormButtons.tsx | prescriptionManagement |
| MedicationStatusField | medications/form/MedicationStatusField.tsx | prescriptionManagement |
| MedicationTextField | medications/form/MedicationTextField.tsx | prescriptionManagement |
| MedicationTextareaField | medications/form/MedicationTextareaField.tsx | prescriptionManagement |
| PatientField | medications/form/PatientField.tsx | prescriptionManagement |
| useMedicationForm | medications/hooks/useMedicationForm.tsx | prescriptionManagement |
| useMedicationFormState | medications/hooks/useMedicationFormState.tsx | prescriptionManagement |
| useMedicationFormSubmit | medications/hooks/useMedicationFormSubmit.tsx | prescriptionManagement |
| useMedicationInteractions | medications/hooks/useMedicationInteractions.tsx | prescriptionManagement |
| index | medications/index.tsx | prescriptionManagement |
| AllergiesReviewDialog | medications/safety/AllergiesReviewDialog.tsx | prescriptionManagement |
| MedicationSafetyDialog | medications/safety/MedicationSafetyDialog.tsx | prescriptionManagement |
| AllergiesDialogFooter | medications/safety/components/AllergiesDialogFooter.tsx | prescriptionManagement |
| AllergyListContent | medications/safety/components/AllergyListContent.tsx | prescriptionManagement |
| AllergyListItem | medications/safety/components/AllergyListItem.tsx | prescriptionManagement |
| AllergySection | medications/safety/components/AllergySection.tsx | prescriptionManagement |
| DialogFooterActions | medications/safety/components/DialogFooterActions.tsx | prescriptionManagement |
| SafetyStatusIndicator | medications/safety/components/SafetyStatusIndicator.tsx | prescriptionManagement |
| WeightBasedSection | medications/safety/components/WeightBasedSection.tsx | prescriptionManagement |
| MedicationOrderForm | orders/forms/MedicationOrderForm.tsx | prescriptionManagement |
| PatientPrescriptions | patients/PatientPrescriptions.tsx | prescriptionManagement |
| useFetchPrescriptionData | patients/hooks/useFetchPrescriptionData.tsx | prescriptionManagement |
| usePatientPrescriptions | patients/hooks/usePatientPrescriptions.tsx | prescriptionManagement |
| useProcessPrescriptionData | patients/hooks/useProcessPrescriptionData.tsx | prescriptionManagement |
| MedicationsCard | patients/overview/MedicationsCard.tsx | prescriptionManagement |
| PatientMedicationsTab | patients/tabs/PatientMedicationsTab.tsx | prescriptionManagement |
| PatientPrescriptionsTab | patients/tabs/PatientPrescriptionsTab.tsx | prescriptionManagement |
| PrescriptionCard | prescriptions/PrescriptionCard.tsx | prescriptionManagement |
| PrescriptionItemCard | prescriptions/PrescriptionItemCard.tsx | prescriptionManagement |
| PrescriptionsList | prescriptions/PrescriptionsList.tsx | prescriptionManagement |
| index | prescriptions/index.ts | prescriptionManagement |
| index | prescriptions/index.tsx | prescriptionManagement |
| LoadingState | prescriptions/view/LoadingState.tsx | prescriptionManagement |
| ParticipantInfo | prescriptions/view/ParticipantInfo.tsx | prescriptionManagement |
| PrescriptionHeader | prescriptions/view/PrescriptionHeader.tsx | prescriptionManagement |
| PrescriptionItems | prescriptions/view/PrescriptionItems.tsx | prescriptionManagement |
| index | prescriptions/view/index.ts | prescriptionManagement |
| index | prescriptions/view/index.tsx | prescriptionManagement |

#### Pages

| Page | Path | Clinical Workflows |
|------|------|--------------------|
| MedicationAdministration | MedicationAdministration.tsx | prescriptionManagement |
| MedicationView | MedicationView.tsx | prescriptionManagement |
| Medications | Medications.tsx | prescriptionManagement |
| PrescribeMedication | PrescribeMedication.tsx | prescriptionManagement |
| PrescriptionView | PrescriptionView.tsx | prescriptionManagement |
| Prescriptions | Prescriptions.tsx | prescriptionManagement |
| Telemedicine | Telemedicine.tsx | prescriptionManagement |

### Medium Priority

#### Components

| Component | Path | Clinical Workflows |
|-----------|------|--------------------|
| CosignatureRequestModal | clinical-documentation/components/CosignatureRequestModal.tsx | clinicalTaskExecution |
| SignatureModal | clinical-documentation/components/SignatureModal.tsx | clinicalTaskExecution |
| useCosignature | clinical-documentation/hooks/note-editor/useCosignature.tsx | clinicalTaskExecution |
| EHRVerification | medications/administration/scanner/EHRVerification.ts | prescriptionManagement, clinicalTaskExecution |
| useVerificationService | medications/administration/scanner/hooks/useVerificationService.tsx | prescriptionManagement, clinicalTaskExecution |
| AIVerificationModal | orders/AIVerificationModal.tsx | clinicalTaskExecution |
| useAlertVerification | orders/hooks/useAlertVerification.ts | clinicalTaskExecution |
| aiVerificationService | orders/hooks/utils/aiVerificationService.ts | clinicalTaskExecution |
| VitalSignsCard | patients/overview/VitalSignsCard.tsx | clinicalTaskExecution |
| PatientCareTasksTab | patients/tabs/PatientCareTasksTab.tsx | clinicalTaskExecution |
| PatientFluidBalanceTab | patients/tabs/PatientFluidBalanceTab.tsx | clinicalTaskExecution |
| PatientVitalSignsTab | patients/tabs/PatientVitalSignsTab.tsx | clinicalTaskExecution |
| PatientVitalsTabs | patients/vitals/PatientVitalsTabs.tsx | clinicalTaskExecution |
| VitalsHeader | patients/vitals/VitalsHeader.tsx | clinicalTaskExecution |
| patientHelper | patients/vitals/helpers/patientHelper.ts | clinicalTaskExecution |
| CurrentVitalsTab | patients/vitals/tabs/CurrentVitalsTab.tsx | clinicalTaskExecution |
| InsightsTab | patients/vitals/tabs/InsightsTab.tsx | clinicalTaskExecution |
| TrendsTab | patients/vitals/tabs/TrendsTab.tsx | clinicalTaskExecution |
| TaskCard | tasks/TaskCard.tsx | clinicalTaskExecution |
| TaskFilters | tasks/TaskFilters.tsx | clinicalTaskExecution |
| TaskList | tasks/TaskList.tsx | clinicalTaskExecution |
| TaskStats | tasks/TaskStats.tsx | clinicalTaskExecution |
| TaskActions | tasks/card/TaskActions.tsx | clinicalTaskExecution |
| TaskCompletionInfo | tasks/card/TaskCompletionInfo.tsx | clinicalTaskExecution |
| TaskDetails | tasks/card/TaskDetails.tsx | clinicalTaskExecution |
| TaskHeader | tasks/card/TaskHeader.tsx | clinicalTaskExecution |
| TaskIcon | tasks/card/TaskIcon.tsx | clinicalTaskExecution |
| EmptyTaskState | tasks/components/EmptyTaskState.tsx | clinicalTaskExecution |
| TaskDateGroup | tasks/components/TaskDateGroup.tsx | clinicalTaskExecution |
| TaskActionsSection | tasks/detail/TaskActionsSection.tsx | clinicalTaskExecution |
| TaskDelayWarning | tasks/detail/TaskDelayWarning.tsx | clinicalTaskExecution |
| TaskDetailsSection | tasks/detail/TaskDetailsSection.tsx | clinicalTaskExecution |
| TaskFooter | tasks/detail/TaskFooter.tsx | clinicalTaskExecution |
| TaskStatusBadges | tasks/detail/TaskStatusBadges.tsx | clinicalTaskExecution |
| ActiveFilters | tasks/filters/ActiveFilters.tsx | clinicalTaskExecution |
| DelayedFilter | tasks/filters/DelayedFilter.tsx | clinicalTaskExecution |
| FilterPopover | tasks/filters/FilterPopover.tsx | clinicalTaskExecution |
| PriorityFilter | tasks/filters/PriorityFilter.tsx | clinicalTaskExecution |
| SearchInput | tasks/filters/SearchInput.tsx | clinicalTaskExecution |
| SectorFilter | tasks/filters/SectorFilter.tsx | clinicalTaskExecution |
| StatusFilter | tasks/filters/StatusFilter.tsx | clinicalTaskExecution |
| TaskTypeFilter | tasks/filters/TaskTypeFilter.tsx | clinicalTaskExecution |
| taskGrouping | tasks/utils/taskGrouping.ts | clinicalTaskExecution |
| QuickEntryForm | vital-signs/QuickEntryForm.tsx | clinicalTaskExecution |
| VitalSignsChart | vital-signs/VitalSignsChart.tsx | clinicalTaskExecution |
| VitalSignsDisplay | vital-signs/VitalSignsDisplay.tsx | clinicalTaskExecution |
| types | vital-signs/types.ts | clinicalTaskExecution |
| VitalsChartLinesWrapper | vitals/VitalsChartLinesWrapper.tsx | clinicalTaskExecution |
| VitalsChartLines | vitals/components/VitalsChartLines.tsx | clinicalTaskExecution |
| VitalsChartTooltip | vitals/components/VitalsChartTooltip.tsx | clinicalTaskExecution |
| VitalsReferenceLines | vitals/components/VitalsReferenceLines.tsx | clinicalTaskExecution |
| vitalsChartConfig | vitals/utils/vitalsChartConfig.ts | clinicalTaskExecution |
| vitalsDataGenerator | vitals/utils/vitalsDataGenerator.ts | clinicalTaskExecution |
| ScheduleDateField | orders/forms/procedure/ScheduleDateField.tsx | patientVisitRegistration |
| AppointmentsCard | patients/overview/AppointmentsCard.tsx | patientVisitRegistration |
| PatientAppointmentsTab | patients/tabs/PatientAppointmentsTab.tsx | patientVisitRegistration |
| AppointmentActions | schedule/AppointmentCard/AppointmentActions.tsx | patientVisitRegistration |
| AppointmentInfo | schedule/AppointmentCard/AppointmentInfo.tsx | patientVisitRegistration |
| AppointmentStatus | schedule/AppointmentCard/AppointmentStatus.tsx | patientVisitRegistration |
| AppointmentStatusBadge | schedule/AppointmentCard/AppointmentStatusBadge.tsx | patientVisitRegistration |
| AppointmentTime | schedule/AppointmentCard/AppointmentTime.tsx | patientVisitRegistration |
| AppointmentTypeIcon | schedule/AppointmentCard/AppointmentTypeIcon.tsx | patientVisitRegistration |
| AppointmentOptions | schedule/AppointmentCard/components/AppointmentOptions.tsx | patientVisitRegistration |
| CancelButton | schedule/AppointmentCard/components/CancelButton.tsx | patientVisitRegistration |
| ReminderButton | schedule/AppointmentCard/components/ReminderButton.tsx | patientVisitRegistration |
| useAppointmentActions | schedule/AppointmentCard/hooks/useAppointmentActions.tsx | patientVisitRegistration |
| index | schedule/AppointmentCard/index.tsx | patientVisitRegistration |
| types | schedule/AppointmentCard/types.ts | patientVisitRegistration |
| AppointmentListEmpty | schedule/AppointmentsList/AppointmentListEmpty.tsx | patientVisitRegistration |
| AppointmentListError | schedule/AppointmentsList/AppointmentListError.tsx | patientVisitRegistration |
| AppointmentListLoading | schedule/AppointmentsList/AppointmentListLoading.tsx | patientVisitRegistration |
| AppointmentsList | schedule/AppointmentsList/AppointmentsList.tsx | patientVisitRegistration |
| useFetchAppointments | schedule/AppointmentsList/hooks/useFetchAppointments.ts | patientVisitRegistration |
| index | schedule/AppointmentsList/index.tsx | patientVisitRegistration |
| appointmentUtils | schedule/AppointmentsList/utils/appointmentUtils.ts | patientVisitRegistration |
| AppointmentsList | schedule/AppointmentsList.tsx | patientVisitRegistration |
| ScheduleConsultationForm | schedule/ScheduleConsultationForm.tsx | patientVisitRegistration |
| ConsultationDetailsSection | schedule/consultation-form/ConsultationDetailsSection.tsx | patientVisitRegistration |
| FormActions | schedule/consultation-form/FormActions.tsx | patientVisitRegistration |
| PatientSection | schedule/consultation-form/PatientSection.tsx | patientVisitRegistration |
| SchedulingSection | schedule/consultation-form/SchedulingSection.tsx | patientVisitRegistration |
| ConsultationTypeSelector | schedule/consultation-form/components/ConsultationTypeSelector.tsx | patientVisitRegistration |
| DateSelector | schedule/consultation-form/components/DateSelector.tsx | patientVisitRegistration |
| DurationSelector | schedule/consultation-form/components/DurationSelector.tsx | patientVisitRegistration |
| LocationField | schedule/consultation-form/components/LocationField.tsx | patientVisitRegistration |
| ReminderToggle | schedule/consultation-form/components/ReminderToggle.tsx | patientVisitRegistration |
| TimeSelector | schedule/consultation-form/components/TimeSelector.tsx | patientVisitRegistration |
| types | schedule/consultation-form/types.ts | patientVisitRegistration |
| useConsultationForm | schedule/consultation-form/useConsultationForm.ts | patientVisitRegistration |
| NewVisitNoteForm | visit-notes/NewVisitNoteForm.tsx | patientVisitRegistration |
| VisitNoteDetail | visit-notes/VisitNoteDetail.tsx | patientVisitRegistration |
| index | visit-notes/index.ts | patientVisitRegistration |

#### Pages

| Page | Path | Clinical Workflows |
|------|------|--------------------|
| Appointments | Appointments.tsx | patientVisitRegistration |
| FluidBalance | FluidBalance.tsx | clinicalTaskExecution |
| Schedule | Schedule.tsx | patientVisitRegistration |
| TaskDetail | TaskDetail.tsx | clinicalTaskExecution |
| Tasks | Tasks.tsx | clinicalTaskExecution |
| VisitNotes | VisitNotes.tsx | patientVisitRegistration |
| VitalSigns | VitalSigns.tsx | clinicalTaskExecution |

### Low Priority

#### Components

| Component | Path | Clinical Workflows |
|-----------|------|--------------------|
| ErrorBoundary | ErrorBoundary.tsx |  |
| ErrorBoundaryWrapper | ErrorBoundaryWrapper.tsx |  |
| LanguageSwitcher | LanguageSwitcher.tsx |  |
| ApprovalPendingMessage | auth/ApprovalPendingMessage.tsx |  |
| EmailLoginForm | auth/EmailLoginForm.tsx |  |
| PhoneLoginForm | auth/PhoneLoginForm.tsx |  |
| ProtectedRoute | auth/ProtectedRoute.tsx |  |
| RouteErrorBoundary | auth/RouteErrorBoundary.tsx |  |
| SocialLoginButtons | auth/SocialLoginButtons.tsx |  |
| ApprovalPendingAlert | auth/login/ApprovalPendingAlert.tsx |  |
| ConnectionAlert | auth/login/ConnectionAlert.tsx |  |
| LoginCard | auth/login/LoginCard.tsx |  |
| LoginErrorAlert | auth/login/LoginErrorAlert.tsx |  |
| LoginHeader | auth/login/LoginHeader.tsx |  |
| LoginTabs | auth/login/LoginTabs.tsx |  |
| HipaaBanner | auth/protected-route/HipaaBanner.tsx |  |
| LoadingState | auth/protected-route/LoadingState.tsx |  |
| OfflineModeBanner | auth/protected-route/OfflineModeBanner.tsx |  |
| index | auth/protected-route/index.ts |  |
| index | auth/protected-route/index.tsx |  |
| useOfflineMode | auth/protected-route/useOfflineMode.ts |  |
| useRoutePermissions | auth/protected-route/useRoutePermissions.ts |  |
| withRoleBasedAccess | auth/withRoleBasedAccess.tsx |  |
| NoteEditor | clinical-documentation/NoteEditor.tsx |  |
| NoteTemplateSelector | clinical-documentation/NoteTemplateSelector.tsx |  |
| NotesList | clinical-documentation/NotesList.tsx |  |
| CosignatureRequestModal | clinical-documentation/components/CosignatureRequestModal.tsx | clinicalTaskExecution |
| NoteEditorHeader | clinical-documentation/components/NoteEditorHeader.tsx |  |
| OfflineSyncIndicator | clinical-documentation/components/OfflineSyncIndicator.tsx |  |
| SignatureModal | clinical-documentation/components/SignatureModal.tsx | clinicalTaskExecution |
| NoteContent | clinical-documentation/editor/NoteContent.tsx |  |
| NoteEditorContainer | clinical-documentation/editor/NoteEditorContainer.tsx |  |
| NoteEditorTabs | clinical-documentation/editor/NoteEditorTabs.tsx |  |
| useAIAssistance | clinical-documentation/hooks/note-editor/useAIAssistance.tsx |  |
| useConnectivity | clinical-documentation/hooks/note-editor/useConnectivity.tsx |  |
| useCosignature | clinical-documentation/hooks/note-editor/useCosignature.tsx | clinicalTaskExecution |
| useNoteContent | clinical-documentation/hooks/note-editor/useNoteContent.tsx |  |
| useNoteSaving | clinical-documentation/hooks/note-editor/useNoteSaving.tsx |  |
| useNoteValidation | clinical-documentation/hooks/note-editor/useNoteValidation.tsx |  |
| useNoteEditor | clinical-documentation/hooks/useNoteEditor.tsx |  |
| useSyncManager | clinical-documentation/hooks/useSyncManager.tsx |  |
| useTemplates | clinical-documentation/hooks/useTemplates.tsx |  |
| index | clinical-documentation/index.ts |  |
| NoteTypeFilters | clinical-documentation/template/NoteTypeFilters.tsx |  |
| TemplateCard | clinical-documentation/template/TemplateCard.tsx |  |
| TemplateGrid | clinical-documentation/template/TemplateGrid.tsx |  |
| TemplateIcons | clinical-documentation/template/TemplateIcons.tsx |  |
| CriticalResultAlert | critical-results/CriticalResultAlert.tsx |  |
| CriticalResultDetail | critical-results/CriticalResultDetail.tsx |  |
| Dashboard | dashboard/Dashboard.tsx |  |
| DashboardAlerts | dashboard/DashboardAlerts.tsx |  |
| DefaultDashboard | dashboard/DefaultDashboard.tsx |  |
| QuickActions | dashboard/QuickActions.tsx |  |
| RoleDashboard | dashboard/RoleDashboard.tsx |  |
| QuickActionButton | dashboard/components/QuickActionButton.tsx |  |
| quickActionsData | dashboard/data/quickActionsData.ts |  |
| useQuickActions | dashboard/hooks/useQuickActions.tsx |  |
| quickActionTypes | dashboard/types/quickActionTypes.ts |  |
| MedicationAutocompleteDemoPage | debug/MedicationAutocompleteDemoPage.tsx | prescriptionManagement |
| TranslationDiagnostics | debug/TranslationDiagnostics.tsx |  |
| useTriageState | emergency/hooks/useTriageState.tsx |  |
| CurrentTriageLevel | emergency/triage/CurrentTriageLevel.tsx |  |
| EmergencyTreatment | emergency/triage/EmergencyTreatment.tsx |  |
| PatientInfo | emergency/triage/PatientInfo.tsx |  |
| PermissionMessage | emergency/triage/PermissionMessage.tsx |  |
| TriageLevel | emergency/triage/TriageLevel.tsx |  |
| types | emergency/types.ts |  |
| ErrorBoundaryWrapper | error-boundary/ErrorBoundaryWrapper.tsx |  |
| LanguageSwitcherButton | language/LanguageSwitcherButton.tsx |  |
| HeaderLogo | layout/HeaderLogo.tsx |  |
| HeaderNotifications | layout/HeaderNotifications.tsx |  |
| HeaderSearch | layout/HeaderSearch.tsx |  |
| HeaderSettingsButton | layout/HeaderSettingsButton.tsx |  |
| HeaderUserMenu | layout/HeaderUserMenu.tsx |  |
| Layout | layout/Layout.tsx |  |
| SectorSelector | layout/SectorSelector.tsx |  |
| SidebarContent | layout/SidebarContent.tsx |  |
| SidebarItem | layout/SidebarItem.tsx |  |
| SidebarLogo | layout/SidebarLogo.tsx |  |
| SidebarSectorSelector | layout/SidebarSectorSelector.tsx |  |
| SidebarToggle | layout/SidebarToggle.tsx |  |
| SidebarUserProfile | layout/SidebarUserProfile.tsx |  |
| MainNavigation | layout/sidebar/MainNavigation.tsx |  |
| QuickActions | layout/sidebar/QuickActions.tsx |  |
| FHIRMedicationDetail | medications/FHIRMedicationDetail.tsx | prescriptionManagement |
| MedicationCard | medications/MedicationCard.tsx | prescriptionManagement |
| MedicineTranslationForm | medications/MedicineTranslationForm.tsx | prescriptionManagement |
| RxNormActionButtons | medications/admin/RxNormActionButtons.tsx | prescriptionManagement |
| RxNormStatsCards | medications/admin/RxNormStatsCards.tsx | prescriptionManagement |
| rxnormApi | medications/admin/api/rxnormApi.ts | prescriptionManagement |
| dateUtils | medications/admin/dateUtils.ts | prescriptionManagement |
| index | medications/admin/index.ts | prescriptionManagement |
| useRxNormStats | medications/admin/useRxNormStats.ts | prescriptionManagement |
| dbUtils | medications/admin/utils/dbUtils.ts | prescriptionManagement |
| IVCalculator | medications/administration/IVCalculator.tsx | prescriptionManagement |
| MedicationScanner | medications/administration/MedicationScanner.tsx | prescriptionManagement |
| PatientSafetyHeader | medications/administration/PatientSafetyHeader.tsx | prescriptionManagement |
| TimelineView | medications/administration/TimelineView.tsx | prescriptionManagement |
| MedicationAdministrationContent | medications/administration/components/MedicationAdministrationContent.tsx | prescriptionManagement |
| MedicationAdministrationDialogs | medications/administration/components/MedicationAdministrationDialogs.tsx | prescriptionManagement |
| MedicationAdministrationHeader | medications/administration/components/MedicationAdministrationHeader.tsx | prescriptionManagement |
| ViewOnlyPermissionWarning | medications/administration/components/ViewOnlyPermissionWarning.tsx | prescriptionManagement |
| useAdminActionHandlers | medications/administration/hooks/useAdminActionHandlers.tsx | prescriptionManagement |
| useAdminMedicationRecords | medications/administration/hooks/useAdminMedicationRecords.tsx | prescriptionManagement |
| useAdminPatientData | medications/administration/hooks/useAdminPatientData.tsx | prescriptionManagement |
| useMedicationAdministration | medications/administration/hooks/useMedicationAdministration.tsx | prescriptionManagement |
| useScannerState | medications/administration/hooks/useScannerState.tsx | prescriptionManagement |
| MedicationDetailSection | medications/administration/page/MedicationDetailSection.tsx | prescriptionManagement |
| PageHeader | medications/administration/page/PageHeader.tsx | prescriptionManagement |
| PatientListSection | medications/administration/page/PatientListSection.tsx | prescriptionManagement |
| MedicationActions | medications/administration/record/MedicationActions.tsx | prescriptionManagement |
| MedicationDetails | medications/administration/record/MedicationDetails.tsx | prescriptionManagement |
| MedicationTable | medications/administration/record/MedicationTable.tsx | prescriptionManagement |
| MissedMedicationDialog | medications/administration/record/MissedMedicationDialog.tsx | prescriptionManagement |
| types | medications/administration/record/types.ts | prescriptionManagement |
| AllergyWarning | medications/administration/scanner/AllergyWarning.tsx | prescriptionManagement |
| BarcodeScanner | medications/administration/scanner/BarcodeScanner.tsx | prescriptionManagement |
| EHRVerification | medications/administration/scanner/EHRVerification.ts | prescriptionManagement, clinicalTaskExecution |
| ManualEntryForm | medications/administration/scanner/ManualEntryForm.tsx | prescriptionManagement |
| MedicationHeader | medications/administration/scanner/MedicationHeader.tsx | prescriptionManagement |
| ScanItem | medications/administration/scanner/ScanItem.tsx | prescriptionManagement |
| useScannerState | medications/administration/scanner/hooks/useScannerState.tsx | prescriptionManagement |
| useVerificationService | medications/administration/scanner/hooks/useVerificationService.tsx | prescriptionManagement, clinicalTaskExecution |
| types | medications/administration/scanner/types.ts | prescriptionManagement |
| useMedicationScanner | medications/administration/scanner/useMedicationScanner.tsx | prescriptionManagement |
| AIInsightsSection | medications/detail/AIInsightsSection.tsx | prescriptionManagement |
| MedicationHeader | medications/detail/MedicationHeader.tsx | prescriptionManagement |
| MedicationInfo | medications/detail/MedicationInfo.tsx | prescriptionManagement |
| MedicationNotFound | medications/detail/MedicationNotFound.tsx | prescriptionManagement |
| SpecialInstructions | medications/detail/SpecialInstructions.tsx | prescriptionManagement |
| useMedicationData | medications/detail/useMedicationData.ts | prescriptionManagement |
| useMedicationData | medications/detail/useMedicationData.tsx | prescriptionManagement |
| DrugInteractionSearch | medications/drugInteractions/DrugInteractionSearch.tsx | prescriptionManagement |
| InteractionResults | medications/drugInteractions/InteractionResults.tsx | prescriptionManagement |
| InteractionSeverityBadge | medications/drugInteractions/InteractionSeverityBadge.tsx | prescriptionManagement |
| MedicationList | medications/drugInteractions/MedicationList.tsx | prescriptionManagement |
| MedicationDateField | medications/form/MedicationDateField.tsx | prescriptionManagement |
| MedicationDateFields | medications/form/MedicationDateFields.tsx | prescriptionManagement |
| MedicationDetailsFields | medications/form/MedicationDetailsFields.tsx | prescriptionManagement |
| MedicationFormButtons | medications/form/MedicationFormButtons.tsx | prescriptionManagement |
| MedicationStatusField | medications/form/MedicationStatusField.tsx | prescriptionManagement |
| MedicationTextField | medications/form/MedicationTextField.tsx | prescriptionManagement |
| MedicationTextareaField | medications/form/MedicationTextareaField.tsx | prescriptionManagement |
| PatientField | medications/form/PatientField.tsx | prescriptionManagement |
| useMedicationForm | medications/hooks/useMedicationForm.tsx | prescriptionManagement |
| useMedicationFormState | medications/hooks/useMedicationFormState.tsx | prescriptionManagement |
| useMedicationFormSubmit | medications/hooks/useMedicationFormSubmit.tsx | prescriptionManagement |
| useMedicationInteractions | medications/hooks/useMedicationInteractions.tsx | prescriptionManagement |
| index | medications/index.tsx | prescriptionManagement |
| AllergiesReviewDialog | medications/safety/AllergiesReviewDialog.tsx | prescriptionManagement |
| MedicationSafetyDialog | medications/safety/MedicationSafetyDialog.tsx | prescriptionManagement |
| AllergiesDialogFooter | medications/safety/components/AllergiesDialogFooter.tsx | prescriptionManagement |
| AllergyListContent | medications/safety/components/AllergyListContent.tsx | prescriptionManagement |
| AllergyListItem | medications/safety/components/AllergyListItem.tsx | prescriptionManagement |
| AllergySection | medications/safety/components/AllergySection.tsx | prescriptionManagement |
| DialogFooterActions | medications/safety/components/DialogFooterActions.tsx | prescriptionManagement |
| SafetyStatusIndicator | medications/safety/components/SafetyStatusIndicator.tsx | prescriptionManagement |
| WeightBasedSection | medications/safety/components/WeightBasedSection.tsx | prescriptionManagement |
| NotificationItem | notifications/NotificationItem.tsx |  |
| mockNotifications | notifications/mockNotifications.ts |  |
| AIVerificationModal | orders/AIVerificationModal.tsx | clinicalTaskExecution |
| OrderCreator | orders/OrderCreator.tsx |  |
| OrderActionButtons | orders/components/OrderActionButtons.tsx |  |
| OrderFormContent | orders/components/OrderFormContent.tsx |  |
| OrderHeader | orders/components/OrderHeader.tsx |  |
| OrderTypeOptions | orders/components/OrderTypeOptions.tsx |  |
| OrderTypeSelector | orders/components/OrderTypeSelector.tsx |  |
| ModularOrderForm | orders/examples/ModularOrderForm.tsx |  |
| DateRangeField | orders/fields/DateRangeField.tsx |  |
| DiagnosisField | orders/fields/DiagnosisField.tsx |  |
| NotesField | orders/fields/NotesField.tsx |  |
| PatientSelectorField | orders/fields/PatientSelectorField.tsx |  |
| PrioritySelectField | orders/fields/PrioritySelectField.tsx |  |
| ProviderField | orders/fields/ProviderField.tsx |  |
| index | orders/fields/index.ts |  |
| ConsultationOrderForm | orders/forms/ConsultationOrderForm.tsx |  |
| MedicationOrderForm | orders/forms/MedicationOrderForm.tsx | prescriptionManagement |
| RadiologyOrderForm | orders/forms/RadiologyOrderForm.tsx |  |
| ClinicalReasonField | orders/forms/laboratory/ClinicalReasonField.tsx |  |
| CollectionInstructionsField | orders/forms/laboratory/CollectionInstructionsField.tsx |  |
| FrequencySelector | orders/forms/laboratory/FrequencySelector.tsx |  |
| LabTestSelector | orders/forms/laboratory/LabTestSelector.tsx |  |
| LaboratoryOrderForm | orders/forms/laboratory/LaboratoryOrderForm.tsx |  |
| PrioritySelector | orders/forms/laboratory/PrioritySelector.tsx |  |
| SpecimenTypeField | orders/forms/laboratory/SpecimenTypeField.tsx |  |
| TestSelectionList | orders/forms/laboratory/TestSelectionList.tsx |  |
| EquipmentField | orders/forms/procedure/EquipmentField.tsx |  |
| InstructionsField | orders/forms/procedure/InstructionsField.tsx |  |
| LocationField | orders/forms/procedure/LocationField.tsx |  |
| ProcedureNameField | orders/forms/procedure/ProcedureNameField.tsx |  |
| ProcedureOrderForm | orders/forms/procedure/ProcedureOrderForm.tsx |  |
| ProcedurePrioritySelector | orders/forms/procedure/ProcedurePrioritySelector.tsx |  |
| ScheduleDateField | orders/forms/procedure/ScheduleDateField.tsx | patientVisitRegistration |
| orderAlerts | orders/hooks/types/orderAlerts.ts |  |
| useAlertDecisions | orders/hooks/useAlertDecisions.ts |  |
| useAlertVerification | orders/hooks/useAlertVerification.ts | clinicalTaskExecution |
| useOrderAlertsCheck | orders/hooks/useOrderAlertsCheck.tsx |  |
| useOrderCreator | orders/hooks/useOrderCreator.tsx |  |
| aiVerificationService | orders/hooks/utils/aiVerificationService.ts | clinicalTaskExecution |
| alertLogging | orders/hooks/utils/alertLogging.ts |  |
| alertNotifications | orders/hooks/utils/alertNotifications.ts |  |
| alertProcessing | orders/hooks/utils/alertProcessing.ts |  |
| mockAlertGenerator | orders/hooks/utils/mockAlertGenerator.ts |  |
| MedicalHistoryForm | patients/MedicalHistoryForm.tsx |  |
| PastMedicalHistoryList | patients/PastMedicalHistoryList.tsx |  |
| PatientAIInsights | patients/PatientAIInsights.tsx |  |
| PatientAccessControls | patients/PatientAccessControls.tsx |  |
| PatientDetail | patients/PatientDetail.tsx |  |
| PatientHeader | patients/PatientHeader.tsx |  |
| PatientList | patients/PatientList.tsx |  |
| PatientOverview | patients/PatientOverview.tsx |  |
| PatientPrescriptions | patients/PatientPrescriptions.tsx | prescriptionManagement |
| PatientRecords | patients/PatientRecords.tsx |  |
| SectorPatientListSkeleton | patients/SectorPatientListSkeleton.tsx |  |
| FHIRAllergiesList | patients/allergies/FHIRAllergiesList.tsx |  |
| FHIRConditionsList | patients/conditions/FHIRConditionsList.tsx |  |
| PatientDetailContent | patients/detail/PatientDetailContent.tsx |  |
| useFetchPrescriptionData | patients/hooks/useFetchPrescriptionData.tsx | prescriptionManagement |
| usePatientPrescriptions | patients/hooks/usePatientPrescriptions.tsx | prescriptionManagement |
| useProcessPrescriptionData | patients/hooks/useProcessPrescriptionData.tsx | prescriptionManagement |
| AllergiesSection | patients/medical-history/AllergiesSection.tsx |  |
| ChiefComplaintSection | patients/medical-history/ChiefComplaintSection.tsx |  |
| FamilyHistorySection | patients/medical-history/FamilyHistorySection.tsx |  |
| MedicalHistoryData | patients/medical-history/MedicalHistoryData.ts |  |
| NewEntryForm | patients/medical-history/NewEntryForm.tsx |  |
| PastMedicalSection | patients/medical-history/PastMedicalSection.tsx |  |
| ReviewOfSystemsSection | patients/medical-history/ReviewOfSystemsSection.tsx |  |
| SocialHistorySection | patients/medical-history/SocialHistorySection.tsx |  |
| EmptyHistoryState | patients/medical-history/components/EmptyHistoryState.tsx |  |
| FindingOptionButtons | patients/medical-history/components/FindingOptionButtons.tsx |  |
| HistoryEntryCard | patients/medical-history/components/HistoryEntryCard.tsx |  |
| LoadingHistoryState | patients/medical-history/components/LoadingHistoryState.tsx |  |
| MedicalEntryFormContent | patients/medical-history/components/MedicalEntryFormContent.tsx |  |
| MedicalHistoryActions | patients/medical-history/components/MedicalHistoryActions.tsx |  |
| MedicalHistoryHeader | patients/medical-history/components/MedicalHistoryHeader.tsx |  |
| SecurityBanner | patients/medical-history/components/SecurityBanner.tsx |  |
| SystemCodeHeader | patients/medical-history/components/SystemCodeHeader.tsx |  |
| useAuditLogger | patients/medical-history/hooks/useAuditLogger.tsx |  |
| useMedicalEntryFormState | patients/medical-history/hooks/useMedicalEntryFormState.tsx |  |
| useMedicalEntrySubmit | patients/medical-history/hooks/useMedicalEntrySubmit.tsx |  |
| useMedicalHistory | patients/medical-history/hooks/useMedicalHistory.ts |  |
| useMedicalHistoryData | patients/medical-history/hooks/useMedicalHistoryData.ts |  |
| useNewEntryForm | patients/medical-history/hooks/useNewEntryForm.tsx |  |
| useReviewOfSystems | patients/medical-history/hooks/useReviewOfSystems.tsx |  |
| auditUtils | patients/medical-history/utils/auditUtils.ts |  |
| AppointmentsCard | patients/overview/AppointmentsCard.tsx | patientVisitRegistration |
| CareTimelineCard | patients/overview/CareTimelineCard.tsx |  |
| HealthStatusSummary | patients/overview/HealthStatusSummary.tsx |  |
| MedicationsCard | patients/overview/MedicationsCard.tsx | prescriptionManagement |
| PatientQuickActions | patients/overview/PatientQuickActions.tsx |  |
| VitalSignsCard | patients/overview/VitalSignsCard.tsx | clinicalTaskExecution |
| PatientAllergiesTab | patients/tabs/PatientAllergiesTab.tsx |  |
| PatientAppointmentsTab | patients/tabs/PatientAppointmentsTab.tsx | patientVisitRegistration |
| PatientCareTasksTab | patients/tabs/PatientCareTasksTab.tsx | clinicalTaskExecution |
| PatientDiagnosesTab | patients/tabs/PatientDiagnosesTab.tsx |  |
| PatientFluidBalanceTab | patients/tabs/PatientFluidBalanceTab.tsx | clinicalTaskExecution |
| PatientImagingTab | patients/tabs/PatientImagingTab.tsx |  |
| PatientLabResultsTab | patients/tabs/PatientLabResultsTab.tsx |  |
| PatientMedicationsTab | patients/tabs/PatientMedicationsTab.tsx | prescriptionManagement |
| PatientNotesTab | patients/tabs/PatientNotesTab.tsx |  |
| PatientOrdersTab | patients/tabs/PatientOrdersTab.tsx |  |
| PatientOverviewTab | patients/tabs/PatientOverviewTab.tsx |  |
| PatientPrescriptionsTab | patients/tabs/PatientPrescriptionsTab.tsx | prescriptionManagement |
| PatientRecordsTab | patients/tabs/PatientRecordsTab.tsx |  |
| PatientVitalSignsTab | patients/tabs/PatientVitalSignsTab.tsx | clinicalTaskExecution |
| index | patients/tabs/index.ts |  |
| patientDetailAdapter | patients/utils/patientDetailAdapter.ts |  |
| DefaultPatientView | patients/views/DefaultPatientView.tsx |  |
| DoctorPatientView | patients/views/DoctorPatientView.tsx |  |
| MedicalStaffPatientView | patients/views/MedicalStaffPatientView.tsx |  |
| NursePatientView | patients/views/NursePatientView.tsx |  |
| TechnicianPatientView | patients/views/TechnicianPatientView.tsx |  |
| index | patients/views/index.ts |  |
| PatientVitalsTabs | patients/vitals/PatientVitalsTabs.tsx | clinicalTaskExecution |
| VitalsHeader | patients/vitals/VitalsHeader.tsx | clinicalTaskExecution |
| patientHelper | patients/vitals/helpers/patientHelper.ts | clinicalTaskExecution |
| CurrentVitalsTab | patients/vitals/tabs/CurrentVitalsTab.tsx | clinicalTaskExecution |
| InsightsTab | patients/vitals/tabs/InsightsTab.tsx | clinicalTaskExecution |
| TrendsTab | patients/vitals/tabs/TrendsTab.tsx | clinicalTaskExecution |
| PrescriptionCard | prescriptions/PrescriptionCard.tsx | prescriptionManagement |
| PrescriptionItemCard | prescriptions/PrescriptionItemCard.tsx | prescriptionManagement |
| PrescriptionsList | prescriptions/PrescriptionsList.tsx | prescriptionManagement |
| index | prescriptions/index.ts | prescriptionManagement |
| index | prescriptions/index.tsx | prescriptionManagement |
| LoadingState | prescriptions/view/LoadingState.tsx | prescriptionManagement |
| ParticipantInfo | prescriptions/view/ParticipantInfo.tsx | prescriptionManagement |
| PrescriptionHeader | prescriptions/view/PrescriptionHeader.tsx | prescriptionManagement |
| PrescriptionItems | prescriptions/view/PrescriptionItems.tsx | prescriptionManagement |
| index | prescriptions/view/index.ts | prescriptionManagement |
| index | prescriptions/view/index.tsx | prescriptionManagement |
| LanguageProvider | providers/LanguageProvider.tsx |  |
| RecordCard | records/RecordCard.tsx |  |
| AppointmentActions | schedule/AppointmentCard/AppointmentActions.tsx | patientVisitRegistration |
| AppointmentInfo | schedule/AppointmentCard/AppointmentInfo.tsx | patientVisitRegistration |
| AppointmentStatus | schedule/AppointmentCard/AppointmentStatus.tsx | patientVisitRegistration |
| AppointmentStatusBadge | schedule/AppointmentCard/AppointmentStatusBadge.tsx | patientVisitRegistration |
| AppointmentTime | schedule/AppointmentCard/AppointmentTime.tsx | patientVisitRegistration |
| AppointmentTypeIcon | schedule/AppointmentCard/AppointmentTypeIcon.tsx | patientVisitRegistration |
| AppointmentOptions | schedule/AppointmentCard/components/AppointmentOptions.tsx | patientVisitRegistration |
| CancelButton | schedule/AppointmentCard/components/CancelButton.tsx | patientVisitRegistration |
| ReminderButton | schedule/AppointmentCard/components/ReminderButton.tsx | patientVisitRegistration |
| useAppointmentActions | schedule/AppointmentCard/hooks/useAppointmentActions.tsx | patientVisitRegistration |
| index | schedule/AppointmentCard/index.tsx | patientVisitRegistration |
| types | schedule/AppointmentCard/types.ts | patientVisitRegistration |
| AppointmentListEmpty | schedule/AppointmentsList/AppointmentListEmpty.tsx | patientVisitRegistration |
| AppointmentListError | schedule/AppointmentsList/AppointmentListError.tsx | patientVisitRegistration |
| AppointmentListLoading | schedule/AppointmentsList/AppointmentListLoading.tsx | patientVisitRegistration |
| AppointmentsList | schedule/AppointmentsList/AppointmentsList.tsx | patientVisitRegistration |
| useFetchAppointments | schedule/AppointmentsList/hooks/useFetchAppointments.ts | patientVisitRegistration |
| index | schedule/AppointmentsList/index.tsx | patientVisitRegistration |
| appointmentUtils | schedule/AppointmentsList/utils/appointmentUtils.ts | patientVisitRegistration |
| AppointmentsList | schedule/AppointmentsList.tsx | patientVisitRegistration |
| ScheduleConsultationForm | schedule/ScheduleConsultationForm.tsx | patientVisitRegistration |
| ConsultationDetailsSection | schedule/consultation-form/ConsultationDetailsSection.tsx | patientVisitRegistration |
| FormActions | schedule/consultation-form/FormActions.tsx | patientVisitRegistration |
| PatientSection | schedule/consultation-form/PatientSection.tsx | patientVisitRegistration |
| SchedulingSection | schedule/consultation-form/SchedulingSection.tsx | patientVisitRegistration |
| ConsultationTypeSelector | schedule/consultation-form/components/ConsultationTypeSelector.tsx | patientVisitRegistration |
| DateSelector | schedule/consultation-form/components/DateSelector.tsx | patientVisitRegistration |
| DurationSelector | schedule/consultation-form/components/DurationSelector.tsx | patientVisitRegistration |
| LocationField | schedule/consultation-form/components/LocationField.tsx | patientVisitRegistration |
| ReminderToggle | schedule/consultation-form/components/ReminderToggle.tsx | patientVisitRegistration |
| TimeSelector | schedule/consultation-form/components/TimeSelector.tsx | patientVisitRegistration |
| types | schedule/consultation-form/types.ts | patientVisitRegistration |
| useConsultationForm | schedule/consultation-form/useConsultationForm.ts | patientVisitRegistration |
| DatabaseActivityIndicator | settings/ProfileSettings/DatabaseActivityIndicator.tsx |  |
| ProfileForm | settings/ProfileSettings/ProfileForm.tsx |  |
| ProfileLoadingState | settings/ProfileSettings/ProfileLoadingState.tsx |  |
| ProfileSectionHeader | settings/ProfileSettings/ProfileSectionHeader.tsx |  |
| ProfileSettings | settings/ProfileSettings/ProfileSettings.tsx |  |
| useProfileFetch | settings/ProfileSettings/hooks/useProfileFetch.ts |  |
| useProfileSync | settings/ProfileSettings/hooks/useProfileSync.ts |  |
| useProfileUpdate | settings/ProfileSettings/hooks/useProfileUpdate.ts |  |
| index | settings/ProfileSettings/index.tsx |  |
| types | settings/ProfileSettings/types.ts |  |
| useProfileData | settings/ProfileSettings/useProfileData.ts |  |
| ProfileSettings | settings/ProfileSettings.tsx |  |
| SecurityAuditLog | settings/SecurityAuditLog.tsx |  |
| AccessDenied | settings/audit/AccessDenied.tsx |  |
| AuditLogDetail | settings/audit/AuditLogDetail.tsx |  |
| AuditLogHeader | settings/audit/AuditLogHeader.tsx |  |
| AuditLogMainContent | settings/audit/AuditLogMainContent.tsx |  |
| AuditLogTable | settings/audit/AuditLogTable.tsx |  |
| ComplianceNotice | settings/audit/ComplianceNotice.tsx |  |
| EmptyLogsState | settings/audit/components/EmptyLogsState.tsx |  |
| HeaderActions | settings/audit/components/HeaderActions.tsx |  |
| HeaderTitle | settings/audit/components/HeaderTitle.tsx |  |
| LoadingState | settings/audit/components/LoadingState.tsx |  |
| LogTableRow | settings/audit/components/LogTableRow.tsx |  |
| LogsCounter | settings/audit/components/LogsCounter.tsx |  |
| SearchAndFilterBar | settings/audit/components/SearchAndFilterBar.tsx |  |
| StatCard | settings/audit/components/StatCard.tsx |  |
| StatsCardGrid | settings/audit/components/StatsCardGrid.tsx |  |
| TablePagination | settings/audit/components/TablePagination.tsx |  |
| useAuditLogExport | settings/audit/hooks/useAuditLogExport.tsx |  |
| useAuditLogFilters | settings/audit/hooks/useAuditLogFilters.tsx |  |
| useAuditLogSearch | settings/audit/hooks/useAuditLogSearch.tsx |  |
| useAuditLogsData | settings/audit/hooks/useAuditLogsData.tsx |  |
| useLogDetailView | settings/audit/hooks/useLogDetailView.tsx |  |
| useAuditLogs | settings/audit/useAuditLogs.tsx |  |
| ComplianceInformation | settings/security/ComplianceInformation.tsx |  |
| HipaaComplianceBanner | settings/security/HipaaComplianceBanner.tsx |  |
| MFASetup | settings/security/MFASetup.tsx |  |
| PasswordUpdateForm | settings/security/PasswordUpdateForm.tsx |  |
| SecurityAuditLog | settings/security/SecurityAuditLog.tsx |  |
| SecurityControlItem | settings/security/SecurityControlItem.tsx |  |
| SecurityControls | settings/security/SecurityControls.tsx |  |
| SessionTimeoutControl | settings/security/SessionTimeoutControl.tsx |  |
| TaskCard | tasks/TaskCard.tsx | clinicalTaskExecution |
| TaskFilters | tasks/TaskFilters.tsx | clinicalTaskExecution |
| TaskList | tasks/TaskList.tsx | clinicalTaskExecution |
| TaskStats | tasks/TaskStats.tsx | clinicalTaskExecution |
| TaskActions | tasks/card/TaskActions.tsx | clinicalTaskExecution |
| TaskCompletionInfo | tasks/card/TaskCompletionInfo.tsx | clinicalTaskExecution |
| TaskDetails | tasks/card/TaskDetails.tsx | clinicalTaskExecution |
| TaskHeader | tasks/card/TaskHeader.tsx | clinicalTaskExecution |
| TaskIcon | tasks/card/TaskIcon.tsx | clinicalTaskExecution |
| EmptyTaskState | tasks/components/EmptyTaskState.tsx | clinicalTaskExecution |
| TaskDateGroup | tasks/components/TaskDateGroup.tsx | clinicalTaskExecution |
| TaskActionsSection | tasks/detail/TaskActionsSection.tsx | clinicalTaskExecution |
| TaskDelayWarning | tasks/detail/TaskDelayWarning.tsx | clinicalTaskExecution |
| TaskDetailsSection | tasks/detail/TaskDetailsSection.tsx | clinicalTaskExecution |
| TaskFooter | tasks/detail/TaskFooter.tsx | clinicalTaskExecution |
| TaskStatusBadges | tasks/detail/TaskStatusBadges.tsx | clinicalTaskExecution |
| ActiveFilters | tasks/filters/ActiveFilters.tsx | clinicalTaskExecution |
| DelayedFilter | tasks/filters/DelayedFilter.tsx | clinicalTaskExecution |
| FilterPopover | tasks/filters/FilterPopover.tsx | clinicalTaskExecution |
| PriorityFilter | tasks/filters/PriorityFilter.tsx | clinicalTaskExecution |
| SearchInput | tasks/filters/SearchInput.tsx | clinicalTaskExecution |
| SectorFilter | tasks/filters/SectorFilter.tsx | clinicalTaskExecution |
| StatusFilter | tasks/filters/StatusFilter.tsx | clinicalTaskExecution |
| TaskTypeFilter | tasks/filters/TaskTypeFilter.tsx | clinicalTaskExecution |
| taskGrouping | tasks/utils/taskGrouping.ts | clinicalTaskExecution |
| Loading | ui/Loading.tsx |  |
| SupabaseConnectionStatus | ui/SupabaseConnectionStatus.tsx |  |
| alert | ui/alert.tsx |  |
| aspect-ratio | ui/aspect-ratio.tsx |  |
| breadcrumb | ui/breadcrumb.tsx |  |
| carousel | ui/carousel.tsx |  |
| chart | ui/chart.tsx |  |
| collapsible | ui/collapsible.tsx |  |
| command | ui/command.tsx |  |
| context-menu | ui/context-menu.tsx |  |
| drawer | ui/drawer.tsx |  |
| empty-placeholder | ui/empty-placeholder.tsx |  |
| hover-card | ui/hover-card.tsx |  |
| icons | ui/icons.tsx |  |
| input | ui/input.tsx |  |
| menubar | ui/menubar.tsx |  |
| navigation-menu | ui/navigation-menu.tsx |  |
| resizable | ui/resizable.tsx |  |
| sidebar | ui/sidebar.tsx |  |
| sonner | ui/sonner.tsx |  |
| toast | ui/toast.tsx |  |
| toaster | ui/toaster.tsx |  |
| toggle | ui/toggle.tsx |  |
| NewVisitNoteForm | visit-notes/NewVisitNoteForm.tsx | patientVisitRegistration |
| VisitNoteDetail | visit-notes/VisitNoteDetail.tsx | patientVisitRegistration |
| index | visit-notes/index.ts | patientVisitRegistration |
| QuickEntryForm | vital-signs/QuickEntryForm.tsx | clinicalTaskExecution |
| VitalSignsChart | vital-signs/VitalSignsChart.tsx | clinicalTaskExecution |
| VitalSignsDisplay | vital-signs/VitalSignsDisplay.tsx | clinicalTaskExecution |
| types | vital-signs/types.ts | clinicalTaskExecution |
| VitalsChartLinesWrapper | vitals/VitalsChartLinesWrapper.tsx | clinicalTaskExecution |
| VitalsChartLines | vitals/components/VitalsChartLines.tsx | clinicalTaskExecution |
| VitalsChartTooltip | vitals/components/VitalsChartTooltip.tsx | clinicalTaskExecution |
| VitalsReferenceLines | vitals/components/VitalsReferenceLines.tsx | clinicalTaskExecution |
| vitalsChartConfig | vitals/utils/vitalsChartConfig.ts | clinicalTaskExecution |
| vitalsDataGenerator | vitals/utils/vitalsDataGenerator.ts | clinicalTaskExecution |

#### Pages

| Page | Path | Clinical Workflows |
|------|------|--------------------|
| FunctionBlocks | Admin/FunctionBlocks.tsx |  |
| RoleManagement | Admin/RoleManagement.tsx |  |
| Admin | Admin.tsx |  |
| AuthCallback | AuthCallback.tsx |  |
| ClinicalDocumentation | ClinicalDocumentation.tsx |  |
| CriticalResults | CriticalResults.tsx |  |
| Dashboard | Dashboard.tsx |  |
| EmergencyCare | EmergencyCare.tsx |  |
| Help | Help.tsx |  |
| Home | Home.tsx |  |
| HospitalWorkflows | HospitalWorkflows.tsx |  |
| Index | Index.tsx |  |
| Login | Login.tsx |  |
| MedicalHistory | MedicalHistory.tsx |  |
| Messages | Messages.tsx |  |
| NotFound | NotFound.tsx |  |
| Notifications | Notifications.tsx |  |
| Orders | Orders.tsx |  |
| PageNotFound | PageNotFound.tsx |  |
| PatientDetail | PatientDetail.tsx |  |
| PatientProfile | PatientProfile.tsx |  |
| Patients | Patients.tsx |  |
| RecordView | RecordView.tsx |  |
| Records | Records.tsx |  |
| Register | Register.tsx |  |
| ResetPassword | ResetPassword.tsx |  |
| RxNormManagement | RxNormManagement.tsx |  |
| SectorSelection | SectorSelection.tsx |  |
| Settings | Settings.tsx |  |
| Unauthorized | Unauthorized.tsx |  |

## Clinical Workflow Orphans

### Prescription Management

| Component | Path |
|-----------|------|
| MedicationAutocompleteDemoPage | debug/MedicationAutocompleteDemoPage.tsx |
| FHIRMedicationDetail | medications/FHIRMedicationDetail.tsx |
| MedicationCard | medications/MedicationCard.tsx |
| MedicineTranslationForm | medications/MedicineTranslationForm.tsx |
| RxNormActionButtons | medications/admin/RxNormActionButtons.tsx |
| RxNormStatsCards | medications/admin/RxNormStatsCards.tsx |
| rxnormApi | medications/admin/api/rxnormApi.ts |
| dateUtils | medications/admin/dateUtils.ts |
| index | medications/admin/index.ts |
| useRxNormStats | medications/admin/useRxNormStats.ts |
| dbUtils | medications/admin/utils/dbUtils.ts |
| IVCalculator | medications/administration/IVCalculator.tsx |
| MedicationScanner | medications/administration/MedicationScanner.tsx |
| PatientSafetyHeader | medications/administration/PatientSafetyHeader.tsx |
| TimelineView | medications/administration/TimelineView.tsx |
| MedicationAdministrationContent | medications/administration/components/MedicationAdministrationContent.tsx |
| MedicationAdministrationDialogs | medications/administration/components/MedicationAdministrationDialogs.tsx |
| MedicationAdministrationHeader | medications/administration/components/MedicationAdministrationHeader.tsx |
| ViewOnlyPermissionWarning | medications/administration/components/ViewOnlyPermissionWarning.tsx |
| useAdminActionHandlers | medications/administration/hooks/useAdminActionHandlers.tsx |
| useAdminMedicationRecords | medications/administration/hooks/useAdminMedicationRecords.tsx |
| useAdminPatientData | medications/administration/hooks/useAdminPatientData.tsx |
| useMedicationAdministration | medications/administration/hooks/useMedicationAdministration.tsx |
| useScannerState | medications/administration/hooks/useScannerState.tsx |
| MedicationDetailSection | medications/administration/page/MedicationDetailSection.tsx |
| PageHeader | medications/administration/page/PageHeader.tsx |
| PatientListSection | medications/administration/page/PatientListSection.tsx |
| MedicationActions | medications/administration/record/MedicationActions.tsx |
| MedicationDetails | medications/administration/record/MedicationDetails.tsx |
| MedicationTable | medications/administration/record/MedicationTable.tsx |
| MissedMedicationDialog | medications/administration/record/MissedMedicationDialog.tsx |
| types | medications/administration/record/types.ts |
| AllergyWarning | medications/administration/scanner/AllergyWarning.tsx |
| BarcodeScanner | medications/administration/scanner/BarcodeScanner.tsx |
| EHRVerification | medications/administration/scanner/EHRVerification.ts |
| ManualEntryForm | medications/administration/scanner/ManualEntryForm.tsx |
| MedicationHeader | medications/administration/scanner/MedicationHeader.tsx |
| ScanItem | medications/administration/scanner/ScanItem.tsx |
| useScannerState | medications/administration/scanner/hooks/useScannerState.tsx |
| useVerificationService | medications/administration/scanner/hooks/useVerificationService.tsx |
| types | medications/administration/scanner/types.ts |
| useMedicationScanner | medications/administration/scanner/useMedicationScanner.tsx |
| AIInsightsSection | medications/detail/AIInsightsSection.tsx |
| MedicationHeader | medications/detail/MedicationHeader.tsx |
| MedicationInfo | medications/detail/MedicationInfo.tsx |
| MedicationNotFound | medications/detail/MedicationNotFound.tsx |
| SpecialInstructions | medications/detail/SpecialInstructions.tsx |
| useMedicationData | medications/detail/useMedicationData.ts |
| useMedicationData | medications/detail/useMedicationData.tsx |
| DrugInteractionSearch | medications/drugInteractions/DrugInteractionSearch.tsx |
| InteractionResults | medications/drugInteractions/InteractionResults.tsx |
| InteractionSeverityBadge | medications/drugInteractions/InteractionSeverityBadge.tsx |
| MedicationList | medications/drugInteractions/MedicationList.tsx |
| MedicationDateField | medications/form/MedicationDateField.tsx |
| MedicationDateFields | medications/form/MedicationDateFields.tsx |
| MedicationDetailsFields | medications/form/MedicationDetailsFields.tsx |
| MedicationFormButtons | medications/form/MedicationFormButtons.tsx |
| MedicationStatusField | medications/form/MedicationStatusField.tsx |
| MedicationTextField | medications/form/MedicationTextField.tsx |
| MedicationTextareaField | medications/form/MedicationTextareaField.tsx |
| PatientField | medications/form/PatientField.tsx |
| useMedicationForm | medications/hooks/useMedicationForm.tsx |
| useMedicationFormState | medications/hooks/useMedicationFormState.tsx |
| useMedicationFormSubmit | medications/hooks/useMedicationFormSubmit.tsx |
| useMedicationInteractions | medications/hooks/useMedicationInteractions.tsx |
| index | medications/index.tsx |
| AllergiesReviewDialog | medications/safety/AllergiesReviewDialog.tsx |
| MedicationSafetyDialog | medications/safety/MedicationSafetyDialog.tsx |
| AllergiesDialogFooter | medications/safety/components/AllergiesDialogFooter.tsx |
| AllergyListContent | medications/safety/components/AllergyListContent.tsx |
| AllergyListItem | medications/safety/components/AllergyListItem.tsx |
| AllergySection | medications/safety/components/AllergySection.tsx |
| DialogFooterActions | medications/safety/components/DialogFooterActions.tsx |
| SafetyStatusIndicator | medications/safety/components/SafetyStatusIndicator.tsx |
| WeightBasedSection | medications/safety/components/WeightBasedSection.tsx |
| MedicationOrderForm | orders/forms/MedicationOrderForm.tsx |
| PatientPrescriptions | patients/PatientPrescriptions.tsx |
| useFetchPrescriptionData | patients/hooks/useFetchPrescriptionData.tsx |
| usePatientPrescriptions | patients/hooks/usePatientPrescriptions.tsx |
| useProcessPrescriptionData | patients/hooks/useProcessPrescriptionData.tsx |
| MedicationsCard | patients/overview/MedicationsCard.tsx |
| PatientMedicationsTab | patients/tabs/PatientMedicationsTab.tsx |
| PatientPrescriptionsTab | patients/tabs/PatientPrescriptionsTab.tsx |
| PrescriptionCard | prescriptions/PrescriptionCard.tsx |
| PrescriptionItemCard | prescriptions/PrescriptionItemCard.tsx |
| PrescriptionsList | prescriptions/PrescriptionsList.tsx |
| index | prescriptions/index.ts |
| index | prescriptions/index.tsx |
| LoadingState | prescriptions/view/LoadingState.tsx |
| ParticipantInfo | prescriptions/view/ParticipantInfo.tsx |
| PrescriptionHeader | prescriptions/view/PrescriptionHeader.tsx |
| PrescriptionItems | prescriptions/view/PrescriptionItems.tsx |
| index | prescriptions/view/index.ts |
| index | prescriptions/view/index.tsx |

### Clinical Task Execution

| Component | Path |
|-----------|------|
| CosignatureRequestModal | clinical-documentation/components/CosignatureRequestModal.tsx |
| SignatureModal | clinical-documentation/components/SignatureModal.tsx |
| useCosignature | clinical-documentation/hooks/note-editor/useCosignature.tsx |
| EHRVerification | medications/administration/scanner/EHRVerification.ts |
| useVerificationService | medications/administration/scanner/hooks/useVerificationService.tsx |
| AIVerificationModal | orders/AIVerificationModal.tsx |
| useAlertVerification | orders/hooks/useAlertVerification.ts |
| aiVerificationService | orders/hooks/utils/aiVerificationService.ts |
| VitalSignsCard | patients/overview/VitalSignsCard.tsx |
| PatientCareTasksTab | patients/tabs/PatientCareTasksTab.tsx |
| PatientFluidBalanceTab | patients/tabs/PatientFluidBalanceTab.tsx |
| PatientVitalSignsTab | patients/tabs/PatientVitalSignsTab.tsx |
| PatientVitalsTabs | patients/vitals/PatientVitalsTabs.tsx |
| VitalsHeader | patients/vitals/VitalsHeader.tsx |
| patientHelper | patients/vitals/helpers/patientHelper.ts |
| CurrentVitalsTab | patients/vitals/tabs/CurrentVitalsTab.tsx |
| InsightsTab | patients/vitals/tabs/InsightsTab.tsx |
| TrendsTab | patients/vitals/tabs/TrendsTab.tsx |
| TaskCard | tasks/TaskCard.tsx |
| TaskFilters | tasks/TaskFilters.tsx |
| TaskList | tasks/TaskList.tsx |
| TaskStats | tasks/TaskStats.tsx |
| TaskActions | tasks/card/TaskActions.tsx |
| TaskCompletionInfo | tasks/card/TaskCompletionInfo.tsx |
| TaskDetails | tasks/card/TaskDetails.tsx |
| TaskHeader | tasks/card/TaskHeader.tsx |
| TaskIcon | tasks/card/TaskIcon.tsx |
| EmptyTaskState | tasks/components/EmptyTaskState.tsx |
| TaskDateGroup | tasks/components/TaskDateGroup.tsx |
| TaskActionsSection | tasks/detail/TaskActionsSection.tsx |
| TaskDelayWarning | tasks/detail/TaskDelayWarning.tsx |
| TaskDetailsSection | tasks/detail/TaskDetailsSection.tsx |
| TaskFooter | tasks/detail/TaskFooter.tsx |
| TaskStatusBadges | tasks/detail/TaskStatusBadges.tsx |
| ActiveFilters | tasks/filters/ActiveFilters.tsx |
| DelayedFilter | tasks/filters/DelayedFilter.tsx |
| FilterPopover | tasks/filters/FilterPopover.tsx |
| PriorityFilter | tasks/filters/PriorityFilter.tsx |
| SearchInput | tasks/filters/SearchInput.tsx |
| SectorFilter | tasks/filters/SectorFilter.tsx |
| StatusFilter | tasks/filters/StatusFilter.tsx |
| TaskTypeFilter | tasks/filters/TaskTypeFilter.tsx |
| taskGrouping | tasks/utils/taskGrouping.ts |
| QuickEntryForm | vital-signs/QuickEntryForm.tsx |
| VitalSignsChart | vital-signs/VitalSignsChart.tsx |
| VitalSignsDisplay | vital-signs/VitalSignsDisplay.tsx |
| types | vital-signs/types.ts |
| VitalsChartLinesWrapper | vitals/VitalsChartLinesWrapper.tsx |
| VitalsChartLines | vitals/components/VitalsChartLines.tsx |
| VitalsChartTooltip | vitals/components/VitalsChartTooltip.tsx |
| VitalsReferenceLines | vitals/components/VitalsReferenceLines.tsx |
| vitalsChartConfig | vitals/utils/vitalsChartConfig.ts |
| vitalsDataGenerator | vitals/utils/vitalsDataGenerator.ts |

### Patient Visit Registration

| Component | Path |
|-----------|------|
| ScheduleDateField | orders/forms/procedure/ScheduleDateField.tsx |
| AppointmentsCard | patients/overview/AppointmentsCard.tsx |
| PatientAppointmentsTab | patients/tabs/PatientAppointmentsTab.tsx |
| AppointmentActions | schedule/AppointmentCard/AppointmentActions.tsx |
| AppointmentInfo | schedule/AppointmentCard/AppointmentInfo.tsx |
| AppointmentStatus | schedule/AppointmentCard/AppointmentStatus.tsx |
| AppointmentStatusBadge | schedule/AppointmentCard/AppointmentStatusBadge.tsx |
| AppointmentTime | schedule/AppointmentCard/AppointmentTime.tsx |
| AppointmentTypeIcon | schedule/AppointmentCard/AppointmentTypeIcon.tsx |
| AppointmentOptions | schedule/AppointmentCard/components/AppointmentOptions.tsx |
| CancelButton | schedule/AppointmentCard/components/CancelButton.tsx |
| ReminderButton | schedule/AppointmentCard/components/ReminderButton.tsx |
| useAppointmentActions | schedule/AppointmentCard/hooks/useAppointmentActions.tsx |
| index | schedule/AppointmentCard/index.tsx |
| types | schedule/AppointmentCard/types.ts |
| AppointmentListEmpty | schedule/AppointmentsList/AppointmentListEmpty.tsx |
| AppointmentListError | schedule/AppointmentsList/AppointmentListError.tsx |
| AppointmentListLoading | schedule/AppointmentsList/AppointmentListLoading.tsx |
| AppointmentsList | schedule/AppointmentsList/AppointmentsList.tsx |
| useFetchAppointments | schedule/AppointmentsList/hooks/useFetchAppointments.ts |
| index | schedule/AppointmentsList/index.tsx |
| appointmentUtils | schedule/AppointmentsList/utils/appointmentUtils.ts |
| AppointmentsList | schedule/AppointmentsList.tsx |
| ScheduleConsultationForm | schedule/ScheduleConsultationForm.tsx |
| ConsultationDetailsSection | schedule/consultation-form/ConsultationDetailsSection.tsx |
| FormActions | schedule/consultation-form/FormActions.tsx |
| PatientSection | schedule/consultation-form/PatientSection.tsx |
| SchedulingSection | schedule/consultation-form/SchedulingSection.tsx |
| ConsultationTypeSelector | schedule/consultation-form/components/ConsultationTypeSelector.tsx |
| DateSelector | schedule/consultation-form/components/DateSelector.tsx |
| DurationSelector | schedule/consultation-form/components/DurationSelector.tsx |
| LocationField | schedule/consultation-form/components/LocationField.tsx |
| ReminderToggle | schedule/consultation-form/components/ReminderToggle.tsx |
| TimeSelector | schedule/consultation-form/components/TimeSelector.tsx |
| types | schedule/consultation-form/types.ts |
| useConsultationForm | schedule/consultation-form/useConsultationForm.ts |
| NewVisitNoteForm | visit-notes/NewVisitNoteForm.tsx |
| VisitNoteDetail | visit-notes/VisitNoteDetail.tsx |
| index | visit-notes/index.ts |

## Next Steps

1. Review the high priority components and pages for reintegration
2. Analyze each component's functionality and determine how it can be reintegrated
3. Create a detailed plan for reintegrating each component
4. Implement the reintegration plan
5. Test the reintegrated components
6. Update documentation

