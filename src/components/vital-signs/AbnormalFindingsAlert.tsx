
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { AbnormalVital } from '@/hooks/useVitalSignsAbnormalities';

interface AbnormalFindingsAlertProps {
  findings: AbnormalVital[];
}

const AbnormalFindingsAlert: React.FC<AbnormalFindingsAlertProps> = ({ findings }) => {
  if (!findings || findings.length === 0) {
    return null;
  }
  
  const criticalFindings = findings.filter(f => f.severity === 'high');
  const warningFindings = findings.filter(f => f.severity === 'medium');
  const mildFindings = findings.filter(f => f.severity === 'low');
  
  return (
    <div className="space-y-3 mb-4">
      {criticalFindings.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Critical Abnormal Findings</AlertTitle>
          <AlertDescription>
            <ul className="mt-2 list-disc list-inside">
              {criticalFindings.map((finding, index) => (
                <li key={index} className="text-sm">
                  <strong>{finding.name}:</strong> {finding.value} (Normal range: {finding.normalRange})
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
      
      {warningFindings.length > 0 && (
        <Alert variant="warning">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Abnormal Findings</AlertTitle>
          <AlertDescription>
            <ul className="mt-2 list-disc list-inside">
              {warningFindings.map((finding, index) => (
                <li key={index} className="text-sm">
                  <strong>{finding.name}:</strong> {finding.value} (Normal range: {finding.normalRange})
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
      
      {mildFindings.length > 0 && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Mild Abnormalities</AlertTitle>
          <AlertDescription>
            <ul className="mt-2 list-disc list-inside">
              {mildFindings.map((finding, index) => (
                <li key={index} className="text-sm">
                  <strong>{finding.name}:</strong> {finding.value} (Normal range: {finding.normalRange})
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default AbnormalFindingsAlert;
