
import React from 'react';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Mail, Phone, MessageSquare, FileQuestion, Search } from 'lucide-react';

const HelpPage = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  
  // FAQ items
  const faqItems = [
    {
      question: "How do I add a new patient?",
      answer: "To add a new patient, navigate to the Patients page and click on the 'New Patient' button in the top right corner. Fill out the required information in the form and click 'Save' to create the patient record."
    },
    {
      question: "How do I schedule an appointment?",
      answer: "To schedule an appointment, go to the Schedule page and click the 'New Appointment' button. Select a date from the calendar, choose a time slot, and fill in the appointment details including the patient, provider, and purpose."
    },
    {
      question: "How do I update patient information?",
      answer: "To update patient information, navigate to the patient's profile by clicking on their name in the Patients list. Then click the 'Edit' button in the top right corner of their profile page. Make the necessary changes and click 'Save' to update the record."
    },
    {
      question: "How do I add a medical record?",
      answer: "To add a medical record, go to the Records page and click the 'New Record' button. Select the record type, patient, and fill in the details of the medical record. Click 'Save' to create the record."
    },
    {
      question: "How do I prescribe medication?",
      answer: "To prescribe medication, navigate to the Medications page and click 'New Medication'. Select the patient, enter the medication details including name, dosage, frequency, and duration, then click 'Save' to create the prescription."
    },
    {
      question: "How do I print patient reports?",
      answer: "To print a patient report, navigate to the patient's profile, medical record, or medication detail page. Click the 'Print' button in the top right corner to generate a printable version of the information."
    }
  ];
  
  // Filter FAQ items based on search term
  const filteredFaqItems = searchTerm 
    ? faqItems.filter(item => 
        item.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.answer.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : faqItems;
  
  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto animate-fade-in">
          <div className="max-w-6xl mx-auto w-full">
            <div className="mb-8">
              <h1 className="text-2xl font-semibold mb-2">Help Center</h1>
              <p className="text-muted-foreground">
                Find answers to common questions or contact support for assistance.
              </p>
            </div>
            
            <div className="mb-8">
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-muted-foreground" />
                </div>
                <input
                  type="text"
                  placeholder="Search for help..."
                  className="w-full h-12 pl-10 pr-4 rounded-md border border-border bg-background"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="glass-card p-6 flex flex-col items-center text-center">
                <Mail className="h-12 w-12 text-primary mb-4" />
                <h2 className="text-lg font-medium mb-2">Email Support</h2>
                <p className="text-muted-foreground mb-4">
                  Send us an email and we'll get back to you within 24 hours.
                </p>
                <a href="mailto:support@medcare.com" className="text-primary font-medium hover:underline">
                  support@medcare.com
                </a>
              </div>
              
              <div className="glass-card p-6 flex flex-col items-center text-center">
                <Phone className="h-12 w-12 text-primary mb-4" />
                <h2 className="text-lg font-medium mb-2">Phone Support</h2>
                <p className="text-muted-foreground mb-4">
                  Call us directly for immediate assistance with urgent matters.
                </p>
                <a href="tel:1-800-123-4567" className="text-primary font-medium hover:underline">
                  1-800-123-4567
                </a>
              </div>
              
              <div className="glass-card p-6 flex flex-col items-center text-center">
                <MessageSquare className="h-12 w-12 text-primary mb-4" />
                <h2 className="text-lg font-medium mb-2">Live Chat</h2>
                <p className="text-muted-foreground mb-4">
                  Chat with our support team for real-time assistance.
                </p>
                <button className="text-white bg-primary px-4 py-2 rounded-md font-medium">
                  Start Chat
                </button>
              </div>
            </div>
            
            <div className="glass-card p-6 mb-8">
              <div className="flex items-center gap-2 mb-4">
                <FileQuestion className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-medium">Frequently Asked Questions</h2>
              </div>
              
              {filteredFaqItems.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                  {filteredFaqItems.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left font-medium">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-muted-foreground">{item.answer}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No results found for "{searchTerm}"</p>
                </div>
              )}
            </div>
            
            <div className="text-center pb-8">
              <h3 className="text-lg font-medium mb-2">Need more help?</h3>
              <p className="text-muted-foreground">
                Our comprehensive <a href="#" className="text-primary hover:underline">user guide</a> contains detailed information about all features.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HelpPage;
