// app/contexts/setup-context.tsx
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SetupContextType {
  // Step 1: Details
  n8nApiKey: string;
  setN8nApiKey: (value: string) => void;
  unipileApiKey: string;
  setUnipileApiKey: (value: string) => void;
  unipileDsn: string;
  setUnipileDsn: (value: string) => void;
  
  // Step 2: n8n
  n8nSetupComplete: boolean;
  setN8nSetupComplete: (value: boolean) => void;
  
  // Step 3: Manual setup (if needed)
  manualSetupComplete: boolean;
  setManualSetupComplete: (value: boolean) => void;
  
  // Step 4: PocketBase
  pocketbaseSetupComplete: boolean;
  setPocketbaseSetupComplete: (value: boolean) => void;
  
  // Navigation
  currentStep: number;
  setCurrentStep: (step: number) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
}

const SetupContext = createContext<SetupContextType | undefined>(undefined);

export function SetupProvider({ children }: { children: ReactNode }) {
  // Step 1: Details
  const [n8nApiKey, setN8nApiKey] = useState('');
  const [unipileApiKey, setUnipileApiKey] = useState('');
  const [unipileDsn, setUnipileDsn] = useState('');
  
  // Step 2: n8n
  const [n8nSetupComplete, setN8nSetupComplete] = useState(false);
  
  // Step 3: Manual setup
  const [manualSetupComplete, setManualSetupComplete] = useState(false);
  
  // Step 4: PocketBase
  const [pocketbaseSetupComplete, setPocketbaseSetupComplete] = useState(false);
  
  // Navigation
  const [currentStep, setCurrentStep] = useState(1);
  
  const goToNextStep = () => {
    setCurrentStep(prev => prev + 1);
  };
  
  const goToPreviousStep = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };
  
  return (
    <SetupContext.Provider
      value={{
        n8nApiKey,
        setN8nApiKey,
        unipileApiKey,
        setUnipileApiKey,
        unipileDsn,
        setUnipileDsn,
        n8nSetupComplete,
        setN8nSetupComplete,
        manualSetupComplete,
        setManualSetupComplete,
        pocketbaseSetupComplete,
        setPocketbaseSetupComplete,
        currentStep,
        setCurrentStep,
        goToNextStep,
        goToPreviousStep,
      }}
    >
      {children}
    </SetupContext.Provider>
  );
}

export function useSetup() {
  const context = useContext(SetupContext);
  if (context === undefined) {
    throw new Error('useSetup must be used within a SetupProvider');
  }
  return context;
}