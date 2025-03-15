
import React from 'react';
import { 
  ShieldCheck, FileText, ExternalLink, 
  AlertCircle, HelpCircle, Lock
} from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';

const ComplianceNotice = () => {
  return (
    <Card className="border-t-4 border-t-green-500">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-green-700 dark:text-green-400">
          <ShieldCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
          HIPAA Compliance Information
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="text-sm text-muted-foreground space-y-3">
          <p>
            This audit logging system complies with HIPAA Security Rule requirements for maintaining activity logs
            and tracking access to protected health information (PHI).
          </p>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="retention">
              <AccordionTrigger className="text-sm font-medium py-2">
                <div className="flex items-center gap-1.5">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  Retention Policy
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-xs space-y-2">
                <p>
                  All security audit logs are retained for a minimum of 6 years in accordance with HIPAA retention requirements.
                  Logs are stored in an immutable format to prevent tampering or deletion.
                </p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <FileText className="h-3 w-3" />
                  <span>Policy document: <span className="underline cursor-pointer">HIPAA-LOG-RETENTION-2023.pdf</span></span>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="security">
              <AccordionTrigger className="text-sm font-medium py-2">
                <div className="flex items-center gap-1.5">
                  <Lock className="h-4 w-4 text-blue-500" />
                  Security Measures
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-xs space-y-2">
                <p>
                  All audit logs are encrypted both in transit and at rest. Access to audit logs is restricted
                  to authorized personnel only, and all access to the audit system itself is also logged.
                </p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <ExternalLink className="h-3 w-3" />
                  <span>Learn more about our <span className="underline cursor-pointer">encryption policies</span></span>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="compliance">
              <AccordionTrigger className="text-sm font-medium py-2">
                <div className="flex items-center gap-1.5">
                  <HelpCircle className="h-4 w-4 text-purple-500" />
                  Compliance FAQs
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-xs space-y-2">
                <div className="space-y-1.5">
                  <p className="font-medium">How often are logs reviewed?</p>
                  <p>Security logs are reviewed automatically in real-time by our AI system and manually by security staff on a weekly basis.</p>
                </div>
                <div className="space-y-1.5">
                  <p className="font-medium">What triggers an investigation?</p>
                  <p>Multiple failed login attempts, access to sensitive PHI outside of working hours, or unusual access patterns may trigger a security investigation.</p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <div className="w-full flex flex-col xs:flex-row items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">Last compliance audit: June 15, 2023</p>
          <Button variant="outline" size="sm" className="w-full xs:w-auto">
            <FileText className="h-3.5 w-3.5 mr-1.5" />
            Download Compliance Report
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ComplianceNotice;
