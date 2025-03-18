import { readFileSync, readdirSync } from 'fs';
import { join, extname } from 'path';

interface TranslationDiagnostic {
  key: string;
  file: string;
}

export const findMissingTranslations = (
  localesPath: string,
  defaultLocale: string
): TranslationDiagnostic[] => {
  const defaultLocaleFile = join(localesPath, `${defaultLocale}.json`);
  let defaultTranslations: { [key: string]: string } = {};

  try {
    const fileContent = readFileSync(defaultLocaleFile, 'utf-8');
    defaultTranslations = JSON.parse(fileContent);
  } catch (error) {
    console.error(`Error reading default locale file ${defaultLocaleFile}:`, error);
    return [];
  }

  const otherLocales = readdirSync(localesPath).filter(
    file =>
      extname(file) === '.json' && file !== `${defaultLocale}.json`
  );

  const missingTranslations: TranslationDiagnostic[] = [];

  otherLocales.forEach(localeFile => {
    const locale = localeFile.replace('.json', '');
    const localeFilePath = join(localesPath, localeFile);
    let localeTranslations: { [key: string]: string } = {};

    try {
      const fileContent = readFileSync(localeFilePath, 'utf-8');
      localeTranslations = JSON.parse(fileContent);
    } catch (error) {
      console.error(`Error reading locale file ${localeFilePath}:`, error);
      return;
    }

    Object.keys(defaultTranslations).forEach(key => {
      if (!localeTranslations[key]) {
        missingTranslations.push({ key, file: locale });
      }
    });
  });

  return missingTranslations;
};

export const findUnusedTranslations = (
  localesPath: string,
  defaultLocale: string,
  sourceFilesPath: string
): TranslationDiagnostic[] => {
  const defaultLocaleFile = join(localesPath, `${defaultLocale}.json`);
  let defaultTranslations: { [key: string]: string } = {};

  try {
    const fileContent = readFileSync(defaultLocaleFile, 'utf-8');
    defaultTranslations = JSON.parse(fileContent);
  } catch (error) {
    console.error(`Error reading default locale file ${defaultLocaleFile}:`, error);
    return [];
  }

  const allSourceFiles: string[] = [];
  
  const traverseDirectory = (directory: string) => {
    const files = readdirSync(directory);

    files.forEach(file => {
      const absolutePath = join(directory, file);
      if (extname(file) === '.tsx' || extname(file) === '.ts') {
        allSourceFiles.push(absolutePath);
      } else if (readdirSync(directory).includes(file) && file !== 'node_modules') {
        traverseDirectory(absolutePath);
      }
    });
  };

  traverseDirectory(sourceFilesPath);

  const translationKeysInUse: Set<string> = new Set();

  allSourceFiles.forEach(file => {
    try {
      const fileContent = readFileSync(file, 'utf-8');
      Object.keys(defaultTranslations).forEach(key => {
        if (fileContent.includes(key)) {
          translationKeysInUse.add(key);
        }
      });
    } catch (error) {
      console.error(`Error reading source file ${file}:`, error);
    }
  });

  const unusedTranslations: TranslationDiagnostic[] = [];

  Object.keys(defaultTranslations).forEach(key => {
    if (!translationKeysInUse.has(key)) {
      unusedTranslations.push({ key, file: defaultLocale });
    }
  });

  return unusedTranslations;
};

export const findTranslationValueMismatches = (
  localesPath: string,
  defaultLocale: string
): TranslationDiagnostic[] => {
  const defaultLocaleFile = join(localesPath, `${defaultLocale}.json`);
  let defaultTranslations: { [key: string]: string } = {};

  try {
    const fileContent = readFileSync(defaultLocaleFile, 'utf-8');
    defaultTranslations = JSON.parse(fileContent);
  } catch (error) {
    console.error(`Error reading default locale file ${defaultLocaleFile}:`, error);
    return [];
  }

  const otherLocales = readdirSync(localesPath).filter(
    file =>
      extname(file) === '.json' && file !== `${defaultLocale}.json`
  );

  const valueMismatches: TranslationDiagnostic[] = [];

  otherLocales.forEach(localeFile => {
    const locale = localeFile.replace('.json', '');
    const localeFilePath = join(localesPath, localeFile);
    let localeTranslations: { [key: string]: string } = {};

    try {
      const fileContent = readFileSync(localeFilePath, 'utf-8');
      localeTranslations = JSON.parse(fileContent);
    } catch (error) {
      console.error(`Error reading locale file ${localeFilePath}:`, error);
      return;
    }

    Object.keys(defaultTranslations).forEach(key => {
      if (localeTranslations[key] && typeof defaultTranslations[key] !== typeof localeTranslations[key]) {
        valueMismatches.push({ key, file: locale });
      }
    });
  });

  return valueMismatches;
};
