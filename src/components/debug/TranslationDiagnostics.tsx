
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { runTranslationDiagnostics, getTranslationDiagnosticReport } from '@/utils/i18n/translationDiagnostics';
import { useTranslation } from '@/hooks/useTranslation';

const TranslationDiagnostics: React.FC = () => {
  const { language, setLanguage } = useTranslation();
  const [diagnosticResults, setDiagnosticResults] = useState<any>(null);
  const [reportText, setReportText] = useState<string>('');
  
  const runDiagnostics = () => {
    const results = runTranslationDiagnostics();
    setDiagnosticResults(results);
    setReportText(getTranslationDiagnosticReport());
  };
  
  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'pt' : 'en');
  };
  
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Translation System Diagnostics</CardTitle>
        <CardDescription>
          Analyze the translation system for inconsistencies and issues
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <span className="font-medium">Current language:</span> {language === 'en' ? 'English' : 'Portuguese'}
          </div>
          <Button onClick={toggleLanguage}>
            Switch to {language === 'en' ? 'Portuguese' : 'English'}
          </Button>
        </div>
        
        <Button onClick={runDiagnostics} className="mb-6">
          Run Diagnostics
        </Button>
        
        {diagnosticResults && (
          <Tabs defaultValue="missing" className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="missing">Missing Keys</TabsTrigger>
              <TabsTrigger value="formatting">Formatting Issues</TabsTrigger>
              <TabsTrigger value="misalignments">Potential Misalignments</TabsTrigger>
            </TabsList>
            
            <TabsContent value="missing">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Missing in English ({diagnosticResults.missingKeys.en.length})</h3>
                  {diagnosticResults.missingKeys.en.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No missing keys!</p>
                  ) : (
                    <ul className="space-y-1 text-sm">
                      {diagnosticResults.missingKeys.en.map((key: string) => (
                        <li key={key} className="border-b pb-1">
                          <code className="bg-muted px-1 rounded">{key}</code>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Missing in Portuguese ({diagnosticResults.missingKeys.pt.length})</h3>
                  {diagnosticResults.missingKeys.pt.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No missing keys!</p>
                  ) : (
                    <ul className="space-y-1 text-sm">
                      {diagnosticResults.missingKeys.pt.map((key: string) => (
                        <li key={key} className="border-b pb-1">
                          <code className="bg-muted px-1 rounded">{key}</code>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="formatting">
              <h3 className="text-lg font-medium mb-2">Formatting Issues ({diagnosticResults.inconsistentFormatting.length})</h3>
              {diagnosticResults.inconsistentFormatting.length === 0 ? (
                <p className="text-sm text-muted-foreground">No formatting issues!</p>
              ) : (
                <div className="space-y-4">
                  {diagnosticResults.inconsistentFormatting.map((item: any, index: number) => (
                    <div key={index} className="border p-3 rounded">
                      <div className="font-medium mb-1">{item.key}</div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">English</div>
                          <div className="bg-muted p-2 rounded">{item.en}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">Portuguese</div>
                          <div className="bg-muted p-2 rounded">{item.pt}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="misalignments">
              <h3 className="text-lg font-medium mb-2">Potential Misalignments ({diagnosticResults.potentialMisalignments.length})</h3>
              {diagnosticResults.potentialMisalignments.length === 0 ? (
                <p className="text-sm text-muted-foreground">No potential misalignments!</p>
              ) : (
                <div className="space-y-4">
                  {diagnosticResults.potentialMisalignments.map((item: any, index: number) => (
                    <div key={index} className="border p-3 rounded">
                      <div className="font-medium mb-1">{item.key}</div>
                      <div className="text-sm mb-2 text-amber-600">{item.reason}</div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">English</div>
                          <div className="bg-muted p-2 rounded">{item.en}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">Portuguese</div>
                          <div className="bg-muted p-2 rounded">{item.pt}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
        
        {reportText && (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Diagnostic Report</h3>
            <pre className="bg-muted p-4 rounded overflow-auto max-h-[400px] text-xs whitespace-pre-wrap">
              {reportText}
            </pre>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => {
          setDiagnosticResults(null);
          setReportText('');
        }}>
          Clear Results
        </Button>
        {reportText && (
          <Button onClick={() => {
            navigator.clipboard.writeText(reportText);
          }}>
            Copy Report
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default TranslationDiagnostics;
