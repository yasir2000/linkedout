// app/setup/pocketbase/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useSetup } from '@/app/contexts/setup-context';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { createPocketbaseTables } from './create-pocketbase-tables';
import { createServiceAccount } from './create-service-account';
import { createMessageIngressWorkflow } from './create-message-ingress-workflow';
import { SetupStatus } from './types';

export default function PocketbaseSetupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const {
    n8nApiKey,
    pocketbaseSuperuserEmail,
    pocketbaseSuperuserPassword,
    unipileDsn,
    setPocketbaseSetupComplete,
    pocketbaseServiceUsername,
    setPocketbaseServiceUsername,
    pocketbaseServicePassword,
    setPocketbaseServicePassword,
  } = useSetup();
  
  const [status, setStatus] = useState<SetupStatus>('idle');
  const [tablesStatus, setTablesStatus] = useState<SetupStatus>('idle');
  const [serviceAccountStatus, setServiceAccountStatus] = useState<SetupStatus>('idle');
  const [messageIngressStatus, setMessageIngressStatus] = useState<SetupStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const setupCompletedRef = useRef(false);
  const setupInitiatedRef = useRef(false);
  
  useEffect(() => {
    // Add !setupCompletedRef.current check
    if (
      status === 'idle' && 
      !setupInitiatedRef.current && 
      !setupCompletedRef.current && 
      n8nApiKey && 
      pocketbaseSuperuserEmail && 
      pocketbaseSuperuserPassword
    ) {
      setupInitiatedRef.current = true;
      handleSetup();
    }
  }, [n8nApiKey, pocketbaseSuperuserEmail, pocketbaseSuperuserPassword, status]);
  
  const handleSetup = async () => {
    if (status === 'loading') return;
    
    setStatus('loading');
    setError(null);
    
    try {
      // Step 1: Create tables in PocketBase
      setTablesStatus('loading');
      const tablesResult = await createPocketbaseTables(
        n8nApiKey,
        pocketbaseSuperuserEmail,
        pocketbaseSuperuserPassword,
        setError
      );
      // Add delay before updating status
      await new Promise(resolve => setTimeout(resolve, 500));
      setTablesStatus(tablesResult ? 'success' : 'error');
      
      if (!tablesResult) {
        throw new Error('Failed to create tables in PocketBase');
      }
      
      // Step 2: Create service account in PocketBase
      setServiceAccountStatus('loading');
      let serviceUsername = '';
      let servicePassword = '';
      
      // Get the unipile credential ID from localStorage
      const unipileCredentialId = localStorage.getItem('unipileCredentialId');
      
      const serviceAccountResult = await createServiceAccount(
        n8nApiKey,
        pocketbaseSuperuserEmail,
        pocketbaseSuperuserPassword,
        unipileCredentialId,
        unipileDsn,
        setError,
        (credentials) => {
          serviceUsername = credentials.PocketBaseServiceUsername;
          servicePassword = credentials.PocketBaseServicePassword;
          
          // Store in context
          setPocketbaseServiceUsername(credentials.PocketBaseServiceUsername);
          setPocketbaseServicePassword(credentials.PocketBaseServicePassword);
        }
      );
      await new Promise(resolve => setTimeout(resolve, 500));
      setServiceAccountStatus(serviceAccountResult ? 'success' : 'error');
      
      if (!serviceAccountResult) {
        throw new Error('Failed to create service account in PocketBase');
      }
      
      // Step 3: Create message ingress workflow in n8n
      setMessageIngressStatus('loading');
      const messageIngressResult = await createMessageIngressWorkflow(
        n8nApiKey,
        unipileCredentialId,
        serviceUsername,
        servicePassword,
        setError
      );
      await new Promise(resolve => setTimeout(resolve, 500));
      setMessageIngressStatus(messageIngressResult ? 'success' : 'error');
      
      if (!messageIngressResult) {
        throw new Error('Failed to create message ingress workflow in n8n');
      }
      
      // All steps completed successfully
      setStatus('success');
      setupCompletedRef.current = true;
      setPocketbaseSetupComplete(true);
      
      // Show success toast
      toast({
        title: "Setup complete",
        description: "PocketBase has been successfully configured.",
      });
      
      // Navigate to the next step
      router.push('/setup/review');
    } catch (error) {
      console.error('Setup error:', error);
      setStatus('error');
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred during setup');
      }
    }
  };
  
  const handleRetry = () => {
    // Reset the setup initiated flag to allow retry
    setupInitiatedRef.current = false;
    setupCompletedRef.current = false;
    setTablesStatus('idle');
    setServiceAccountStatus('idle');
    setMessageIngressStatus('idle');
    handleSetup();
  };
  
  const handleContinue = () => {
    router.push('/setup/review');
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
      <h1 className="text-2xl font-bold mb-4">Setting up PocketBase</h1>
      
      <p className="text-muted-foreground mb-12">
        We're configuring your PocketBase instance with the necessary tables and service account.
      </p>
      
      <div className="space-y-8 mb-12">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Create tables in PocketBase</h3>
            <p className="text-sm text-muted-foreground">This creates the necessary tables for LinkedOut in your PocketBase instance</p>
          </div>
          {renderStatusIcon(tablesStatus)}
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Create service account in PocketBase</h3>
            <p className="text-sm text-muted-foreground">This creates a service account for the n8n workflows to use</p>
          </div>
          {renderStatusIcon(serviceAccountStatus)}
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Create message ingress workflow in n8n</h3>
            <p className="text-sm text-muted-foreground">This creates the workflow that handles incoming LinkedIn messages</p>
          </div>
          {renderStatusIcon(messageIngressStatus)}
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
          onClick={() => router.push('/setup/n8n')}
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