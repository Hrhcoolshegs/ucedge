import { createContext, useContext, useState, ReactNode } from 'react';
import { Campaign } from '@/types/campaign';
import { sampleCampaigns } from '@/utils/sampleCampaigns';

interface CampaignsContextType {
  campaigns: Campaign[];
  addCampaign: (campaign: Campaign) => void;
  updateCampaign: (id: string, updates: Partial<Campaign>) => void;
  deleteCampaign: (id: string) => void;
}

const CampaignsContext = createContext<CampaignsContextType | undefined>(undefined);

export const CampaignsProvider = ({ children }: { children: ReactNode }) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>(sampleCampaigns);

  const addCampaign = (campaign: Campaign) => {
    setCampaigns(prev => [campaign, ...prev]);
  };

  const updateCampaign = (id: string, updates: Partial<Campaign>) => {
    setCampaigns(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteCampaign = (id: string) => {
    setCampaigns(prev => prev.filter(c => c.id !== id));
  };

  return (
    <CampaignsContext.Provider value={{ campaigns, addCampaign, updateCampaign, deleteCampaign }}>
      {children}
    </CampaignsContext.Provider>
  );
};

export const useCampaigns = () => {
  const context = useContext(CampaignsContext);
  if (!context) {
    throw new Error('useCampaigns must be used within CampaignsProvider');
  }
  return context;
};