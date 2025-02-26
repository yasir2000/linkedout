// app/setup/n8n/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useSetup } from '@/app/contexts/setup-context';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { addUnipileCredential } from './add-unipile-credential';
import { importWorkflows } from './import-workflows';
import { SetupStatus } from './types';

export default function N8nSetupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { 
    n8nApiKey, 
    unipileApiKey, 
    unipileDsn,
    goToNextStep
  } = useSetup();
  
  const [status, setStatus] = useState<SetupStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  
  // Setup steps
  const [unipileCredentialStatus, setUnipileCredentialStatus] = useState<SetupStatus>('idle');
  const [workflowsStatus, setWorkflowsStatus] = useState<SetupStatus>('idle');
  
  useEffect(() => {
    // Start setup automatically when the page loads
    if (status === 'idle' && n8nApiKey && unipileApiKey && unipileDsn) {
      handleSetup();
    }
  }, []);
  
  const handleSetup = async () => {
    if (!n8nApiKey || !unipileApiKey || !unipileDsn) {
      router.push('/setup/details');
      return;
    }
    
    setStatus('loading');
    setError(null);
    
    try {
      // Step 1: Add unipile credential to n8n
      setUnipileCredentialStatus('loading');
      const unipileCredentialResult = await addUnipileCredential(
        n8nApiKey, 
        unipileApiKey, 
        setError
      );
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
        setError
      );
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
      
      <p className="text-muted-foreground mb-6">
        We're configuring your n8n instance with the necessary workflows and credentials.
      </p>
      
      <div className="space-y-4 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Add Unipile credential to n8n</h3>
            <p className="text-sm text-muted-foreground">Configuring API credentials for Unipile</p>
          </div>
          {renderStatusIcon(unipileCredentialStatus)}
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Import modified workflows to n8n</h3>
            <p className="text-sm text-muted-foreground">Setting up necessary workflows for LinkedOut</p>
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
          
          {status === 'success' ? (
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
          
          {status === 'idle' && (
            <Button onClick={handleSetup}>
              Start Setup
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}