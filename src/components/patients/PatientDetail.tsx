
import React from 'react';
import { cn } from '@/lib/utils';
import StatusBadge from '../ui/StatusBadge';
import VitalsChart from '../ui/VitalsChart';
import { Calendar, Clipboard, Heart, Pill, UserRound, Users } from 'lucide-react';
import { Patient } from './PatientCard';

type PatientDetailProps = {
  patientId: string;
  className?: string;
};

// Sample vitals data
const heartRateData = [
  { time: '8:00', value: 72 },
  { time: '12:00', value: 76 },
  { time: '16:00', value: 80 },
  { time: '20:00', value: 75 },
  { time: '00:00', value: 70 },
  { time: '04:00', value: 68 },
];

const temperatureData = [
  { time: '8:00', value: 98.6 },
  { time: '12:00', value: 99.1 },
  { time: '16:00', value: 99.4 },
  { time: '20:00', value: 99.0 },
  { time: '00:00', value: 98.8 },
  { time: '04:00', value: 98.6 },
];

const bloodPressureData = [
  { time: '8:00', value: 120 },
  { time: '12:00', value: 124 },
  { time: '16:00', value: 128 },
  { time: '20:00', value: 126 },
  { time: '00:00', value: 122 },
  { time: '04:00', value: 118 },
];

const oxygenData = [
  { time: '8:00', value: 96 },
  { time: '12:00', value: 97 },
  { time: '16:00', value: 95 },
  { time: '20:00', value: 96 },
  { time: '00:00', value: 96 },
  { time: '04:00', value: 97 },
];

// Sample medication data
const medications = [
  { name: "Lisinopril", dosage: "10mg", frequency: "Once daily", time: "Morning" },
  { name: "Metformin", dosage: "500mg", frequency: "Twice daily", time: "Morning & Evening" },
  { name: "Atorvastatin", dosage: "20mg", frequency: "Once daily", time: "Evening" },
];

// Sample patient
const patient: Patient = {
  id: "1",
  name: "John Doe",
  age: 65,
  gender: "Male",
  roomNumber: "203",
  status: "hospital",
  diagnosis: "Post-op recovery"
};

// Sample care team
const careTeam = [
  { role: "Primary Physician", name: "Dr. Sarah Johnson" },
  { role: "Nurse", name: "Michael Williams" },
  { role: "Physical Therapist", name: "Jessica Brown" },
];

// Sample notes
const notes = [
  { date: "2023-06-15", author: "Dr. Sarah Johnson", content: "Patient recovering well from surgery. Vital signs stable. Continue with current treatment plan." },
  { date: "2023-06-14", author: "Michael Williams", content: "Patient complained of mild pain at incision site. Administered prescribed pain medication. Pain subsided after 30 minutes." },
];

const PatientDetail = ({ patientId, className }: PatientDetailProps) => {
  // In a real app, you would fetch the patient data using the patientId
  
  return (
    <div className={cn("space-y-6", className)}>
      <div className="glass-card p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="h-28 w-28 rounded-full bg-medical-blue-light flex items-center justify-center text-medical-blue text-4xl font-semibold overflow-hidden">
            {patient.name.charAt(0)}
          </div>
          
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-semibold">{patient.name}</h2>
                <div className="flex items-center gap-2 text-muted-foreground mt-1">
                  <span>{patient.age} years</span>
                  <span>•</span>
                  <span>{patient.gender}</span>
                  {patient.roomNumber && (
                    <>
                      <span>•</span>
                      <span className="font-medium">Room {patient.roomNumber}</span>
                    </>
                  )}
                </div>
              </div>
              <StatusBadge status={patient.status} className="mt-1" />
            </div>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-medical-blue-light flex items-center justify-center text-medical-blue">
                  <UserRound className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Patient ID</p>
                  <p className="text-sm font-medium">P-{patient.id.padStart(6, '0')}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-medical-blue-light flex items-center justify-center text-medical-blue">
                  <Clipboard className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Diagnosis</p>
                  <p className="text-sm font-medium">{patient.diagnosis}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-medical-blue-light flex items-center justify-center text-medical-blue">
                  <Calendar className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Admitted</p>
                  <p className="text-sm font-medium">June 12, 2023</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Heart className="h-5 w-5 text-medical-red" />
              Vital Signs
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <VitalsChart data={heartRateData} type="heartRate" />
              <VitalsChart data={bloodPressureData} type="bloodPressure" />
              <VitalsChart data={temperatureData} type="temperature" />
              <VitalsChart data={oxygenData} type="oxygenSaturation" />
            </div>
          </div>
          
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Clipboard className="h-5 w-5 text-primary" />
              Clinical Notes
            </h3>
            
            <div className="space-y-4">
              {notes.map((note, index) => (
                <div key={index} className="border-b border-border pb-4 last:pb-0 last:border-0">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{note.author}</span>
                    <span className="text-muted-foreground">{note.date}</span>
                  </div>
                  <p className="mt-1 text-sm">{note.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Pill className="h-5 w-5 text-primary" />
              Medications
            </h3>
            
            <div className="space-y-3">
              {medications.map((med, index) => (
                <div key={index} className="border-b border-border pb-3 last:pb-0 last:border-0">
                  <p className="font-medium">{med.name}</p>
                  <div className="flex justify-between text-sm text-muted-foreground mt-1">
                    <span>{med.dosage}</span>
                    <span>{med.frequency}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{med.time}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Care Team
            </h3>
            
            <div className="space-y-3">
              {careTeam.map((member, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-medical-blue-light flex items-center justify-center text-medical-blue font-medium">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetail;
