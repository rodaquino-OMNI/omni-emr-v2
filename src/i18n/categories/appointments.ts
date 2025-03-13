
export type AppointmentsTranslationKey =
  | 'loadingAppointments'
  | 'errorLoadingAppointments'
  | 'noAppointmentsScheduled'
  | 'noAppointmentsForPatient'
  | 'selectDateToViewAppointments'
  | 'inPerson'
  | 'telemedicine'
  | 'phone'
  | 'reminderSent'
  | 'reminderSentDescription'
  | 'errorSendingReminder'
  | 'errorSendingReminderDescription'
  | 'appointmentCompleted'
  | 'appointmentCompletedDescription'
  | 'errorCompletingAppointment'
  | 'errorCompletingAppointmentDescription'
  | 'appointmentCancelled'
  | 'appointmentCancelledDescription'
  | 'errorCancellingAppointment'
  | 'errorCancellingAppointmentDescription'
  | 'sendReminder'
  | 'cancelAppointment'
  | 'cancelAppointmentDescription'
  | 'goBack'
  | 'confirmCancel'
  | 'options'
  | 'reminderAlreadySent'
  | 'markAsCompleted'
  | 'minutes'
  | 'provider'
  | 'notes'
  | 'consultationDetails'
  | 'consultationTitle'
  | 'schedulingInformation'
  | 'appointmentDate'
  | 'selectDate'
  | 'appointmentTime'
  | 'selectTime'
  | 'duration'
  | 'selectDuration'
  | 'consultationType'
  | 'location'
  | 'reminderDescription'
  | 'scheduleConsultation'
  | 'appointmentScheduled'
  | 'appointmentScheduledSuccess'
  | 'newAppointment'
  | 'appointments'
  | 'reminders'
  | 'noRemindersScheduled';

export const appointmentsTranslations = {
  pt: {
    loadingAppointments: 'Carregando consultas',
    errorLoadingAppointments: 'Erro ao carregar consultas',
    noAppointmentsScheduled: 'Nenhuma consulta agendada para esta data',
    noAppointmentsForPatient: 'Este paciente não tem consultas agendadas',
    selectDateToViewAppointments: 'Selecione uma data para ver as consultas',
    inPerson: 'Presencial',
    telemedicine: 'Telemedicina',
    phone: 'Telefone',
    reminderSent: 'Lembrete enviado',
    reminderSentDescription: 'Um lembrete foi enviado ao paciente',
    errorSendingReminder: 'Erro ao enviar lembrete',
    errorSendingReminderDescription: 'Não foi possível enviar o lembrete ao paciente',
    appointmentCompleted: 'Consulta concluída',
    appointmentCompletedDescription: 'A consulta foi marcada como concluída',
    errorCompletingAppointment: 'Erro ao concluir consulta',
    errorCompletingAppointmentDescription: 'Não foi possível marcar a consulta como concluída',
    appointmentCancelled: 'Consulta cancelada',
    appointmentCancelledDescription: 'A consulta foi cancelada',
    errorCancellingAppointment: 'Erro ao cancelar consulta',
    errorCancellingAppointmentDescription: 'Não foi possível cancelar a consulta',
    sendReminder: 'Enviar lembrete',
    cancelAppointment: 'Cancelar consulta',
    cancelAppointmentDescription: 'Tem certeza que deseja cancelar esta consulta?',
    goBack: 'Voltar',
    confirmCancel: 'Confirmar cancelamento',
    options: 'Opções',
    reminderAlreadySent: 'Lembrete já enviado',
    markAsCompleted: 'Marcar como concluída',
    minutes: 'minutos',
    provider: 'Profissional',
    notes: 'Observações',
    consultationDetails: 'Detalhes da consulta',
    consultationTitle: 'Título da consulta',
    schedulingInformation: 'Informações de agendamento',
    appointmentDate: 'Data da consulta',
    selectDate: 'Selecione uma data',
    appointmentTime: 'Horário da consulta',
    selectTime: 'Selecione um horário',
    duration: 'Duração',
    selectDuration: 'Selecione a duração',
    consultationType: 'Tipo de consulta',
    location: 'Local',
    reminderDescription: 'Enviar lembrete ao paciente antes da consulta',
    scheduleConsultation: 'Agendar consulta',
    appointmentScheduled: 'Consulta agendada',
    appointmentScheduledSuccess: 'A consulta foi agendada com sucesso',
    newAppointment: 'Nova consulta',
    appointments: 'Consultas',
    reminders: 'Lembretes',
    noRemindersScheduled: 'Nenhum lembrete agendado'
  },
  en: {
    loadingAppointments: 'Loading appointments',
    errorLoadingAppointments: 'Error loading appointments',
    noAppointmentsScheduled: 'No appointments scheduled for this date',
    noAppointmentsForPatient: 'This patient has no scheduled appointments',
    selectDateToViewAppointments: 'Select a date to view appointments',
    inPerson: 'In Person',
    telemedicine: 'Telemedicine',
    phone: 'Phone',
    reminderSent: 'Reminder sent',
    reminderSentDescription: 'A reminder has been sent to the patient',
    errorSendingReminder: 'Error sending reminder',
    errorSendingReminderDescription: 'Could not send reminder to patient',
    appointmentCompleted: 'Appointment completed',
    appointmentCompletedDescription: 'The appointment has been marked as completed',
    errorCompletingAppointment: 'Error completing appointment',
    errorCompletingAppointmentDescription: 'Could not mark appointment as completed',
    appointmentCancelled: 'Appointment cancelled',
    appointmentCancelledDescription: 'The appointment has been cancelled',
    errorCancellingAppointment: 'Error cancelling appointment',
    errorCancellingAppointmentDescription: 'Could not cancel the appointment',
    sendReminder: 'Send reminder',
    cancelAppointment: 'Cancel appointment',
    cancelAppointmentDescription: 'Are you sure you want to cancel this appointment?',
    goBack: 'Go back',
    confirmCancel: 'Confirm cancellation',
    options: 'Options',
    reminderAlreadySent: 'Reminder already sent',
    markAsCompleted: 'Mark as completed',
    minutes: 'minutes',
    provider: 'Provider',
    notes: 'Notes',
    consultationDetails: 'Consultation details',
    consultationTitle: 'Consultation title',
    schedulingInformation: 'Scheduling information',
    appointmentDate: 'Appointment date',
    selectDate: 'Select a date',
    appointmentTime: 'Appointment time',
    selectTime: 'Select a time',
    duration: 'Duration',
    selectDuration: 'Select duration',
    consultationType: 'Consultation type',
    location: 'Location',
    reminderDescription: 'Send a reminder to patient before appointment',
    scheduleConsultation: 'Schedule consultation',
    appointmentScheduled: 'Appointment scheduled',
    appointmentScheduledSuccess: 'The appointment has been scheduled successfully',
    newAppointment: 'New appointment',
    appointments: 'Appointments',
    reminders: 'Reminders',
    noRemindersScheduled: 'No reminders scheduled'
  }
};
