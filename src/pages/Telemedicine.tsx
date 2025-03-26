
import React, { useState } from 'react';
;
;
import { useTranslation } from '../hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Video, 
  Calendar, 
  Clock, 
  Users, 
  Phone, 
  VideoOff, 
  MicOff, 
  Mic, 
  PhoneOff,
  Plus
} from 'lucide-react';

// Mock upcoming calls
const upcomingCalls = [
  {
    id: '1',
    patientName: 'John Smith',
    patientId: '12345',
    date: '2023-12-20',
    time: '14:30',
    duration: 30,
    reason: 'Follow-up Consultation'
  },
  {
    id: '2',
    patientName: 'Maria Garcia',
    patientId: '67890',
    date: '2023-12-21',
    time: '10:00',
    duration: 45,
    reason: 'Initial Assessment'
  },
  {
    id: '3',
    patientName: 'Robert Johnson',
    patientId: '24680',
    date: '2023-12-22',
    time: '11:15',
    duration: 30,
    reason: 'Medication Review'
  }
];

// Mock past calls
const pastCalls = [
  {
    id: '101',
    patientName: 'Emily Wilson',
    patientId: '13579',
    date: '2023-12-15',
    time: '09:30',
    duration: 25,
    notes: 'Patient reported improvement in symptoms. Continue current treatment.'
  },
  {
    id: '102',
    patientName: 'Michael Brown',
    patientId: '97531',
    date: '2023-12-14',
    time: '13:45',
    duration: 40,
    notes: 'Discussed new treatment options. Scheduled follow-up in 2 weeks.'
  }
];

const TelemedicinePage = () => {
  const { t } = useTranslation();
  const [inCall, setInCall] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  
  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const handleJoinCall = () => {
    setInCall(true);
  };
  
  const handleEndCall = () => {
    setInCall(false);
  };

  return (
    <div className="max-w-6xl mx-auto w-full">
          <div className="max-w-6xl mx-auto w-full">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-semibold">{t('telemedicine')}</h1>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Schedule Consultation
              </Button>
            </div>
            
            {inCall ? (
              <div className="glass-card p-6 mb-6">
                <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden relative mb-4">
                  <div className="absolute inset-0 flex items-center justify-center text-white">
                    {!videoEnabled && <VideoOff className="h-16 w-16 opacity-50" />}
                  </div>
                  
                  <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-900 rounded-md overflow-hidden border-2 border-primary shadow-lg">
                    {/* Doctor's video feed */}
                  </div>
                </div>
                
                <div className="flex items-center justify-center gap-4 my-4">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="rounded-full h-12 w-12 p-0"
                    onClick={() => setVideoEnabled(!videoEnabled)}
                  >
                    {videoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="rounded-full h-12 w-12 p-0"
                    onClick={() => setAudioEnabled(!audioEnabled)}
                  >
                    {audioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                  </Button>
                  
                  <Button 
                    variant="destructive" 
                    size="lg" 
                    className="rounded-full h-12 w-12 p-0"
                    onClick={handleEndCall}
                  >
                    <PhoneOff className="h-5 w-5" />
                  </Button>
                </div>
                
                <div className="bg-accent/10 p-4 rounded-md">
                  <h3 className="font-medium mb-2">Call Information</h3>
                  <p><strong>Patient:</strong> John Smith (ID: 12345)</p>
                  <p><strong>Reason:</strong> Follow-up Consultation</p>
                  <p><strong>Duration:</strong> 00:12:35</p>
                </div>
              </div>
            ) : (
              <Tabs defaultValue="upcoming" className="w-full">
                <TabsList className="grid grid-cols-2 mb-6 w-full sm:w-80">
                  <TabsTrigger value="upcoming">Upcoming Calls</TabsTrigger>
                  <TabsTrigger value="past">Past Calls</TabsTrigger>
                </TabsList>
                
                <TabsContent value="upcoming">
                  <div className="glass-card p-6">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-3 px-4 font-medium">Patient</th>
                            <th className="text-left py-3 px-4 font-medium">Date & Time</th>
                            <th className="text-left py-3 px-4 font-medium">Reason</th>
                            <th className="text-right py-3 px-4 font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {upcomingCalls.map((call) => (
                            <tr key={call.id} className="border-b border-border hover:bg-accent/5">
                              <td className="py-3 px-4">
                                <div>
                                  <div className="font-medium">{call.patientName}</div>
                                  <div className="text-sm text-muted-foreground">ID: {call.patientId}</div>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center">
                                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                                  <span>{formatDate(call.date)}</span>
                                </div>
                                <div className="flex items-center mt-1">
                                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                                  <span>{call.time} ({call.duration} min)</span>
                                </div>
                              </td>
                              <td className="py-3 px-4">{call.reason}</td>
                              <td className="py-3 px-4 text-right">
                                <Button onClick={handleJoinCall}>
                                  <Video className="mr-2 h-4 w-4" />
                                  {t('joinCall')}
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="past">
                  <div className="glass-card p-6">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-3 px-4 font-medium">Patient</th>
                            <th className="text-left py-3 px-4 font-medium">Date & Time</th>
                            <th className="text-left py-3 px-4 font-medium">Notes</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pastCalls.map((call) => (
                            <tr key={call.id} className="border-b border-border hover:bg-accent/5">
                              <td className="py-3 px-4">
                                <div>
                                  <div className="font-medium">{call.patientName}</div>
                                  <div className="text-sm text-muted-foreground">ID: {call.patientId}</div>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center">
                                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                                  <span>{formatDate(call.date)}</span>
                                </div>
                                <div className="flex items-center mt-1">
                                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                                  <span>{call.time} ({call.duration} min)</span>
                                </div>
                              </td>
                              <td className="py-3 px-4">{call.notes}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>
  );
};

export default TelemedicinePage;
