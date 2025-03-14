
import { describe, it, expect } from 'vitest';
import { validateTranslations, validateComponentTranslations } from '../translationValidator';
import { translations } from '@/i18n/translations';

describe('Translation Validator', () => {
  it('should validate all translations exist in both languages', () => {
    const missingKeys = validateTranslations();
    
    // Check if any keys are missing
    expect(missingKeys.en).toEqual([]);
    expect(missingKeys.pt).toEqual([]);
  });
  
  it('should validate specific component translations', () => {
    // Test with a subset of keys
    const testKeys = ['noHistoricalUpdates', 'loadingHistory'] as const;
    const missingKeys = validateComponentTranslations(testKeys);
    
    // Check if any keys are missing
    expect(missingKeys.en).toEqual([]);
    expect(missingKeys.pt).toEqual([]);
  });
  
  it('should have the same number of keys in both languages', () => {
    const enKeysCount = Object.keys(translations.en).length;
    const ptKeysCount = Object.keys(translations.pt).length;
    
    expect(enKeysCount).toBe(ptKeysCount);
  });
});
