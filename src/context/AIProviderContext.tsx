import React, { createContext, useContext, useState, useEffect } from 'react';

export interface OmniRouteStatus {
  connected: boolean;
  url: string;
  models: string[];
  lastChecked: number;
}

export type AIProvider = 'gemini' | 'omniroute';

interface AIProviderContextType {
  provider: AIProvider;
  setProvider: (provider: AIProvider) => void;
  omniRouteUrl: string;
  setOmniRouteUrl: (url: string) => void;
  omniRouteModel: string;
  setOmniRouteModel: (model: string) => void;
  omniRouteStatus: OmniRouteStatus;
  checkOmniRouteStatus: (customUrl?: string) => Promise<boolean>;
  isCheckingStatus: boolean;
}

const AIProviderContext = createContext<AIProviderContextType | undefined>(undefined);

export const AIProviderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [provider, setProviderState] = useState<AIProvider>(() => {
    return (localStorage.getItem('lumora_ai_provider') as AIProvider) || 'gemini';
  });

  const [omniRouteUrl, setOmniRouteUrlState] = useState<string>(() => {
    return localStorage.getItem('lumora_omniroute_url') || 'http://localhost:20128';
  });

  const [omniRouteModel, setOmniRouteModelState] = useState<string>(() => {
    return localStorage.getItem('lumora_omniroute_model') || 'gpt-4o-mini';
  });

  const [omniRouteStatus, setOmniRouteStatus] = useState<OmniRouteStatus>({
    connected: false,
    url: omniRouteUrl,
    models: [],
    lastChecked: 0,
  });

  const [isCheckingStatus, setIsCheckingStatus] = useState<boolean>(false);

  const setProvider = (newProvider: AIProvider) => {
    setProviderState(newProvider);
    localStorage.setItem('lumora_ai_provider', newProvider);
  };

  const setOmniRouteUrl = (newUrl: string) => {
    setOmniRouteUrlState(newUrl);
    localStorage.setItem('lumora_omniroute_url', newUrl);
  };

  const setOmniRouteModel = (newModel: string) => {
    setOmniRouteModelState(newModel);
    localStorage.setItem('lumora_omniroute_model', newModel);
  };

  const checkOmniRouteStatus = async (customUrl?: string): Promise<boolean> => {
    setIsCheckingStatus(true);
    const targetUrl = customUrl || omniRouteUrl;
    try {
      const res = await fetch('/api/omniroute/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customUrl: targetUrl }),
      });
      const data = await res.json();
      
      const status: OmniRouteStatus = {
        connected: !!data.connected,
        url: targetUrl,
        models: Array.isArray(data.models) ? data.models : [],
        lastChecked: Date.now(),
      };
      setOmniRouteStatus(status);
      return status.connected;
    } catch {
      setOmniRouteStatus({
        connected: false,
        url: targetUrl,
        models: [],
        lastChecked: Date.now(),
      });
      return false;
    } finally {
      setIsCheckingStatus(false);
    }
  };

  // Initial check on mount
  useEffect(() => {
    checkOmniRouteStatus();
  }, []);

  return (
    <AIProviderContext.Provider
      value={{
        provider,
        setProvider,
        omniRouteUrl,
        setOmniRouteUrl,
        omniRouteModel,
        setOmniRouteModel,
        omniRouteStatus,
        checkOmniRouteStatus,
        isCheckingStatus,
      }}
    >
      {children}
    </AIProviderContext.Provider>
  );
};

export const useAIProvider = () => {
  const context = useContext(AIProviderContext);
  if (!context) {
    throw new Error('useAIProvider must be used within an AIProviderProvider');
  }
  return context;
};
