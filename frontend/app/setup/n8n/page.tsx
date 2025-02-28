// app/setup/n8n/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useSetup } from '@/app/contexts/setup-context';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { addUnipileCredential } from './add-unipile-credential'; // Changed from create-unipile-credential
import { importWorkflows } from './import-workflows';
import { SetupStatus } from './types';


export default function N8nSetupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { 
    n8nApiKey, 
    unipileApiKey,
    unipileAccountId,
    unipileDsn,
    goToNextStep,
    currentStep,
    setN8nSetupComplete,
    n8nSetupComplete
  } = useSetup();
  
  const [status, setStatus] = useState<SetupStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  
  // Setup steps
  const [unipileCredentialStatus, setUnipileCredentialStatus] = useState<SetupStatus>('idle');
  const [workflowsStatus, setWorkflowsStatus] = useState<SetupStatus>('idle');
  
  // Add a ref to track if setup has been initiated
  const setupInitiatedRef = useRef(false);
  const setupCompletedRef = useRef(false);
  
  useEffect(() => {
    // If we're on a step after n8n setup OR n8n setup is marked complete in context
    if (currentStep > 1 && n8nSetupComplete) {
      setupCompletedRef.current = true;
      setStatus('success');
      setUnipileCredentialStatus('success');
      setWorkflowsStatus('success');
      return;
    }
    
    // Add !setupCompletedRef.current check
    if (
      status === 'idle' && 
      !setupInitiatedRef.current && 
      !setupCompletedRef.current && 
      n8nApiKey && 
      unipileApiKey && 
      unipileDsn
    ) {
      setupInitiatedRef.current = true;
      handleSetup();
    }
  }, [currentStep, n8nSetupComplete]);
  
  const handleSetup = async () => {
    // Don't restart if already completed
    if (setupCompletedRef.current) {
      console.log('Setup already completed, not restarting');
      return;
    }
    
    // Prevent multiple simultaneous setup attempts
    if (setupInitiatedRef.current && status === 'loading') {
      console.log('Setup already in progress, ignoring duplicate request');
      return;
    }
    
    setupInitiatedRef.current = true;
    
    if (!n8nApiKey || !unipileApiKey || !unipileDsn) {
      router.push('/setup/details');
      return;
    }
    
    
    setError(null);
    
    try {
      // Step 1: Add unipile credential to n8n
      setUnipileCredentialStatus('loading');
      const unipileCredentialResult = await addUnipileCredential(
        n8nApiKey, 
        unipileApiKey,
        unipileAccountId,
        setError
      );
      // Add delay before updating status
      await new Promise(resolve => setTimeout(resolve, 500));
      setUnipileCredentialStatus(unipileCredentialResult ? 'success' : 'error');
      
      if (!unipileCredentialResult) {
        throw new Error('Failed to add Unipile credential to n8n');
      }
      
      // Get the credential ID from localStorage
      const unipileCredentialId = localStorage.getItem('unipileCredentialId');
      
      // Step 2: Import modified workflows to n8n
      setWorkflowsStatus('loading');
      const workflowsResult = await importWorkflows(
        n8nApiKey,
        unipileCredentialId,
        setError,
        unipileDsn,
        unipileAccountId
      );
      await new Promise(resolve => setTimeout(resolve, 1000));
      setWorkflowsStatus(workflowsResult ? 'success' : 'error');
      
      if (!workflowsResult) {
        throw new Error('Failed to import workflows to n8n');
      }
      
      // All steps completed successfully
      setStatus('success');
      
      toast({
        title: "n8n setup complete",
        description: "Great success [Borat voice]",
      });
      
      // Only update the step counter, but don't navigate automatically
      goToNextStep();
      
      setupCompletedRef.current = true;
      setN8nSetupComplete(true);
      
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      
      toast({
        title: "Setup failed",
        description: err instanceof Error ? err.message : "Failed to set up n8n",
        variant: "destructive",
      });
    }
  };
  
  const handleRetry = () => {
    setupInitiatedRef.current = false;
    setupCompletedRef.current = false;
    setUnipileCredentialStatus('idle');
    setWorkflowsStatus('idle');
    handleSetup();
  };
  
  const handleContinue = () => {
    router.push('/setup/pocketbase');
  };
  
  const renderStatusIcon = (status: SetupStatus) => {
    switch (status) {
      case 'loading':
        return <Loader2 className="h-5 w-5 animate-spin text-primary" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-destructive" />;
      default:
        return <div className="h-5 w-5" />;
    }
  };
  
  // Determine if navigation should be disabled
  const isNavigationDisabled = status === 'loading';
  
  return (
    <div className="border border-border rounded-lg p-8 bg-background">
      <h1 className="text-2xl font-bold mb-4">Setting up n8n</h1>
      
      <p className="text-muted-foreground mb-12">
        We're configuring your n8n instance with the necessary workflows and credentials.
      </p>
      
      <div className="space-y-8 mb-12">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Add Unipile credential to n8n</h3>
            <p className="text-sm text-muted-foreground">The credential will be called <b>Unipile [LinkedIn API]</b></p>
          </div>
          {renderStatusIcon(unipileCredentialStatus)}
        </div>
        
        <div className="flex items-start justify-between gap-4">
          <div className="max-w-[50%] sm:max-w-[75%] md:max-w-[60%]">
            <h3 className="font-medium">Import modified workflows to n8n</h3>
            <p className="text-sm text-muted-foreground">This step swaps out dynamic settings (like PocketBase base URL) then imports workflows to your n8n instance:</p>
            <div className="mt-3 space-y-1">
              <p className="text-sm text-muted-foreground">1. <b>/inbox backend [linkedout]</b> workflow</p>
              <p className="text-sm text-muted-foreground">2. <b>/thread backend [linkedout]</b> workflow</p>
              <p className="text-sm text-muted-foreground">4. <b>/setup backend [linkedout]</b> workflow</p>
            </div>
          </div>
          {renderStatusIcon(workflowsStatus)}
        </div>
      </div>
      
      {error && (
        <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded-md mb-6">
          <p className="text-sm">{error}</p>
        </div>
      )}
      
      <div className="flex justify-between mt-16">
        <Button 
          variant="outline" 
          onClick={() => router.push('/setup/details')}
          disabled={isNavigationDisabled}
        >
          Back
        </Button>
        
        <div className="space-x-2">
          {status === 'error' && (
            <Button onClick={handleRetry}>
              Retry
            </Button>
          )}
          
          {(status === 'success' || setupCompletedRef.current) ? (
            <Button onClick={handleContinue}>
              Continue
            </Button>
          ) : (
            <Button 
              onClick={handleContinue} 
              disabled={true}
            >
              Continue
            </Button>
          )}
          
          {status === 'idle' && !setupInitiatedRef.current && !setupCompletedRef.current && (
            <Button onClick={handleSetup}>
              Start Setup
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}