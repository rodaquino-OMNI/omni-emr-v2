
// Helper functions for checking medication families
export const isPenicillinFamily = (med: string): boolean => {
  const penicillinDrugs = ['amoxicillin', 'ampicillin', 'dicloxacillin', 'nafcillin', 'oxacillin', 'penicillin'];
  return penicillinDrugs.some(drug => med.includes(drug));
};

export const isSulfaFamily = (med: string): boolean => {
  const sulfaDrugs = ['sulfamethoxazole', 'sulfasalazine', 'sulfadiazine', 'sulfisoxazole'];
  return sulfaDrugs.some(drug => med.includes(drug));
};

export const isNSAID = (med: string): boolean => {
  const nsaids = ['ibuprofen', 'naproxen', 'aspirin', 'diclofenac', 'indomethacin', 'meloxicam', 'celecoxib'];
  return nsaids.some(drug => med.includes(drug));
};
