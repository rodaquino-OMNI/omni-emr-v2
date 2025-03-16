
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Sector {
  id: string;
  name: string;
  description: string;
}

interface SectorContextType {
  sectors: Sector[];
  selectedSector: Sector | null;
  selectSector: (sector: Sector) => void;
  loading: boolean;
}

const SectorContext = createContext<SectorContextType | undefined>(undefined);

// Mock sectors data - in a real app, this would come from an API
const mockSectors: Sector[] = [
  {
    id: 'emergency',
    name: 'Emergency Department',
    description: 'Acute care and emergency services'
  },
  {
    id: 'inpatient',
    name: 'Inpatient Ward',
    description: 'General medical and surgical inpatient care'
  },
  {
    id: 'outpatient',
    name: 'Outpatient Clinic',
    description: 'Follow-up visits and non-emergency consultations'
  },
  {
    id: 'icu',
    name: 'Intensive Care Unit',
    description: 'Critical care for patients requiring close monitoring'
  },
  {
    id: 'pediatrics',
    name: 'Pediatrics',
    description: 'Medical care for infants, children and adolescents'
  }
];

export const SectorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [selectedSector, setSelectedSector] = useState<Sector | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading sectors from an API
    const loadSectors = async () => {
      setLoading(true);
      
      // In a real app, this would be an API call
      // For now, we'll use our mock data with a short delay
      setTimeout(() => {
        setSectors(mockSectors);
        
        // Check if a sector was previously selected
        const storedSectorId = localStorage.getItem('selectedSector');
        if (storedSectorId) {
          const sector = mockSectors.find(s => s.id === storedSectorId);
          if (sector) {
            setSelectedSector(sector);
          }
        }
        
        setLoading(false);
      }, 300);
    };
    
    loadSectors();
  }, []);

  const selectSector = (sector: Sector) => {
    setSelectedSector(sector);
    localStorage.setItem('selectedSector', sector.id);
  };

  return (
    <SectorContext.Provider value={{ sectors, selectedSector, selectSector, loading }}>
      {children}
    </SectorContext.Provider>
  );
};

export const useSectorContext = (): SectorContextType => {
  const context = useContext(SectorContext);
  if (context === undefined) {
    throw new Error('useSectorContext must be used within a SectorProvider');
  }
  return context;
};
