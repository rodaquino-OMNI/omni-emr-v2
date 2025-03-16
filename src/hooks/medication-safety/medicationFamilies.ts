
// This file contains helper functions to determine if a medication belongs to a specific family

/**
 * Check if a medication name indicates it's in the penicillin family
 */
export function isPenicillinFamily(medicationName: string): boolean {
  const penicillinDrugs = [
    'penicillin',
    'amoxicillin', 
    'ampicillin', 
    'dicloxacillin', 
    'nafcillin', 
    'oxacillin', 
    'piperacillin',
    'ticarcillin',
    'augmentin',
    'clavulanate',
    'tazobactam',
    'unasyn'
  ];
  
  return penicillinDrugs.some(drug => medicationName.includes(drug));
}

/**
 * Check if a medication name indicates it's in the sulfa family
 */
export function isSulfaFamily(medicationName: string): boolean {
  const sulfaDrugs = [
    'sulfa',
    'sulfamethoxazole', 
    'sulfadiazine', 
    'sulfasalazine', 
    'sulfisoxazole',
    'bactrim',
    'septra',
    'cotrimoxazole',
    'trimethoprim-sulfa',
    'tmp-smx'
  ];
  
  return sulfaDrugs.some(drug => medicationName.includes(drug));
}

/**
 * Check if a medication name indicates it's a nonsteroidal anti-inflammatory drug (NSAID)
 */
export function isNSAID(medicationName: string): boolean {
  const nsaids = [
    'nsaid',
    'ibuprofen',
    'naproxen',
    'aspirin',
    'celecoxib',
    'indomethacin',
    'ketorolac',
    'meloxicam',
    'diclofenac',
    'piroxicam',
    'etodolac',
    'ketoprofen',
    'mefenamic',
    'flurbiprofen',
    'advil',
    'motrin',
    'aleve',
    'celebrex',
    'toradol'
  ];
  
  return nsaids.some(drug => medicationName.includes(drug));
}

/**
 * Check if a medication name indicates it's an opioid
 */
export function isOpioid(medicationName: string): boolean {
  const opioids = [
    'opioid',
    'morphine',
    'oxycodone',
    'hydrocodone',
    'fentanyl',
    'codeine',
    'methadone',
    'hydromorphone',
    'oxymorphone',
    'tramadol',
    'buprenorphine',
    'tapentadol',
    'vicodin',
    'percocet',
    'dilaudid',
    'norco',
    'lortab',
    'roxicodone',
    'duragesic'
  ];
  
  return opioids.some(drug => medicationName.includes(drug));
}

/**
 * Check if a medication name indicates it's an antibiotic
 */
export function isAntibiotic(medicationName: string): boolean {
  const antibiotics = [
    'antibiotic',
    'penicillin',
    'amoxicillin',
    'ampicillin',
    'cephalosporin',
    'cefazolin',
    'ceftriaxone',
    'cefuroxime',
    'ciprofloxacin',
    'levofloxacin',
    'moxifloxacin',
    'tetracycline',
    'doxycycline',
    'minocycline',
    'erythromycin',
    'azithromycin',
    'clarithromycin',
    'clindamycin',
    'vancomycin',
    'metronidazole',
    'trimethoprim',
    'sulfamethoxazole',
    'keflex',
    'rocephin',
    'augmentin',
    'bactrim',
    'zithromax'
  ];
  
  return antibiotics.some(drug => medicationName.includes(drug));
}
