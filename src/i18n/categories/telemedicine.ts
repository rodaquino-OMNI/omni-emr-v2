
interface TelemedicineTranslations {
  telemedicine: string;
  videoConsultation: string;
  upcomingCalls: string;
  pastCalls: string;
  scheduledConsultations: string;
  joinCall: string;
  endCall: string;
  callInformation: string;
  callDuration: string;
  reason: string;
  scheduleConsultation: string;
  patientName: string;
  callControls: string;
  enableVideo: string;
  disableVideo: string;
  enableAudio: string;
  disableAudio: string;
  noUpcomingCalls: string;
  noPastCalls: string;
}

export type TelemedicineTranslationKey = keyof TelemedicineTranslations;

export const telemedicineTranslations = {
  en: {
    telemedicine: "Telemedicine",
    videoConsultation: "Video Consultation",
    upcomingCalls: "Upcoming Calls",
    pastCalls: "Past Calls",
    scheduledConsultations: "Scheduled Consultations",
    joinCall: "Join Call",
    endCall: "End Call",
    callInformation: "Call Information",
    callDuration: "Call Duration",
    reason: "Reason",
    scheduleConsultation: "Schedule Consultation",
    patientName: "Patient Name",
    callControls: "Call Controls",
    enableVideo: "Enable Video",
    disableVideo: "Disable Video",
    enableAudio: "Enable Audio",
    disableAudio: "Disable Audio",
    noUpcomingCalls: "No upcoming calls scheduled",
    noPastCalls: "No past calls found"
  },
  pt: {
    telemedicine: "Telemedicina",
    videoConsultation: "Consulta por Vídeo",
    upcomingCalls: "Chamadas Agendadas",
    pastCalls: "Chamadas Anteriores",
    scheduledConsultations: "Consultas Agendadas",
    joinCall: "Entrar na Chamada",
    endCall: "Encerrar Chamada",
    callInformation: "Informações da Chamada",
    callDuration: "Duração da Chamada",
    reason: "Motivo",
    scheduleConsultation: "Agendar Consulta",
    patientName: "Nome do Paciente",
    callControls: "Controles da Chamada",
    enableVideo: "Ativar Vídeo",
    disableVideo: "Desativar Vídeo",
    enableAudio: "Ativar Áudio",
    disableAudio: "Desativar Áudio",
    noUpcomingCalls: "Não há chamadas agendadas",
    noPastCalls: "Não há chamadas anteriores"
  }
};
