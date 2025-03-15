
import { translations } from '@/i18n/translations';
import { allTranslations } from '@/i18n/categories';

interface DiagnosticResult {
  missingKeys: {
    en: string[];
    pt: string[];
  };
  inconsistentFormatting: {
    key: string;
    en: string;
    pt: string;
  }[];
  potentialMisalignments: {
    key: string;
    reason: string;
    en: string;
    pt: string;
  }[];
}

export const runTranslationDiagnostics = (): DiagnosticResult => {
  const result: DiagnosticResult = {
    missingKeys: {
      en: [],
      pt: []
    },
    inconsistentFormatting: [],
    potentialMisalignments: []
  };
  
  // Check for missing keys
  Object.keys(translations.en).forEach(key => {
    if (!translations.pt[key]) {
      result.missingKeys.pt.push(key);
    }
  });
  
  Object.keys(translations.pt).forEach(key => {
    if (!translations.en[key]) {
      result.missingKeys.en.push(key);
    }
  });
  
  // Check for potential inconsistencies in formatting
  Object.keys(translations.en).forEach(key => {
    const enTranslation = translations.en[key];
    const ptTranslation = translations.pt[key];
    
    if (!ptTranslation) return; // Skip if missing in PT
    
    // Check for placeholders like {0}, {name}, etc.
    const enPlaceholders = enTranslation.match(/{\w+}/g) || [];
    const ptPlaceholders = ptTranslation.match(/{\w+}/g) || [];
    
    if (enPlaceholders.length !== ptPlaceholders.length) {
      result.inconsistentFormatting.push({
        key,
        en: enTranslation,
        pt: ptTranslation
      });
      return;
    }
    
    // Check if same placeholders are used
    const enPlaceholderSet = new Set(enPlaceholders);
    const missingInPt = enPlaceholders.filter(p => !ptPlaceholders.includes(p));
    
    if (missingInPt.length > 0) {
      result.inconsistentFormatting.push({
        key,
        en: enTranslation,
        pt: ptTranslation
      });
    }
  });
  
  // Check for potential misalignments (translations that might not match semantically)
  Object.keys(translations.en).forEach(key => {
    const enTranslation = translations.en[key];
    const ptTranslation = translations.pt[key];
    
    if (!ptTranslation) return; // Skip if missing in PT
    
    // Length ratio check (PT is typically longer than EN by ~20-30%)
    const enLength = enTranslation.length;
    const ptLength = ptTranslation.length;
    
    // If Portuguese is significantly shorter, it might be suspicious
    if (ptLength < enLength * 0.7) {
      result.potentialMisalignments.push({
        key,
        reason: 'Portuguese translation is unusually short',
        en: enTranslation,
        pt: ptTranslation
      });
    }
    
    // If English has "error" or "warning" but Portuguese doesn't have "erro" or "aviso"
    if (
      (enTranslation.toLowerCase().includes('error') && 
       !ptTranslation.toLowerCase().includes('erro')) ||
      (enTranslation.toLowerCase().includes('warning') && 
       !ptTranslation.toLowerCase().includes('aviso'))
    ) {
      result.potentialMisalignments.push({
        key,
        reason: 'Semantic mismatch: error/warning terms not aligned',
        en: enTranslation,
        pt: ptTranslation
      });
    }
  });
  
  return result;
};

// Utility to get a report of the diagnostic results
export const getTranslationDiagnosticReport = (): string => {
  const results = runTranslationDiagnostics();
  
  let report = '# Translation Diagnostic Report\n\n';
  
  // Missing keys
  report += '## Missing Keys\n\n';
  
  if (results.missingKeys.en.length === 0 && results.missingKeys.pt.length === 0) {
    report += 'No missing keys found! 🎉\n\n';
  } else {
    if (results.missingKeys.en.length > 0) {
      report += '### Missing in English:\n';
      results.missingKeys.en.forEach(key => {
        report += `- \`${key}\`: "${translations.pt[key]}"\n`;
      });
      report += '\n';
    }
    
    if (results.missingKeys.pt.length > 0) {
      report += '### Missing in Portuguese:\n';
      results.missingKeys.pt.forEach(key => {
        report += `- \`${key}\`: "${translations.en[key]}"\n`;
      });
      report += '\n';
    }
  }
  
  // Inconsistent formatting
  report += '## Inconsistent Formatting\n\n';
  
  if (results.inconsistentFormatting.length === 0) {
    report += 'No formatting inconsistencies found! 🎉\n\n';
  } else {
    results.inconsistentFormatting.forEach(item => {
      report += `### \`${item.key}\`:\n`;
      report += `- EN: "${item.en}"\n`;
      report += `- PT: "${item.pt}"\n\n`;
    });
  }
  
  // Potential misalignments
  report += '## Potential Semantic Misalignments\n\n';
  
  if (results.potentialMisalignments.length === 0) {
    report += 'No potential misalignments found! 🎉\n\n';
  } else {
    results.potentialMisalignments.forEach(item => {
      report += `### \`${item.key}\`:\n`;
      report += `- Reason: ${item.reason}\n`;
      report += `- EN: "${item.en}"\n`;
      report += `- PT: "${item.pt}"\n\n`;
    });
  }
  
  // Summary
  report += '## Summary\n\n';
  const totalIssues = 
    results.missingKeys.en.length + 
    results.missingKeys.pt.length + 
    results.inconsistentFormatting.length + 
    results.potentialMisalignments.length;
  
  if (totalIssues === 0) {
    report += 'No issues found! The translation system appears to be in good health. 🎉\n';
  } else {
    report += `Found ${totalIssues} potential issues that should be addressed:\n`;
    report += `- ${results.missingKeys.en.length} keys missing in English\n`;
    report += `- ${results.missingKeys.pt.length} keys missing in Portuguese\n`;
    report += `- ${results.inconsistentFormatting.length} formatting inconsistencies\n`;
    report += `- ${results.potentialMisalignments.length} potential semantic misalignments\n\n`;
    
    report += 'Recommendation: Address these issues to improve the consistency of the translation system.\n';
  }
  
  return report;
};

// Function to log diagnostic results to console
export const logTranslationDiagnostics = (): void => {
  console.log(getTranslationDiagnosticReport());
};
