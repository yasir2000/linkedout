'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSetup } from '@/app/contexts/setup-context';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { ExternalLink } from 'lucide-react';
import Image from 'next/image';

// Validation schema
const formSchema = z.object({
  unipileApiKey: z.string().min(1, "Unipile API Key is required"),
  unipileDsn: z.string().min(1, "Unipile DSN is required"),
  unipileAccountId: z.string().min(1, "Unipile Account ID is required"),
});

type Errors = {
  unipileApiKey?: string;
  unipileDsn?: string;
  unipileAccountId?: string;
};

export default function UnipileSetupPage() {
  const router = useRouter();
  const { 
    unipileDsn, setUnipileDsn,
    unipileApiKey, setUnipileApiKey,
    unipileAccountId, setUnipileAccountId,
    goToNextStep 
  } = useSetup();

  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const validateInputs = () => {
    const newErrors: Errors = {};
    
    if (!unipileDsn?.trim()) {
      newErrors.unipileDsn = 'Unipile DSN is required';
    }
    
    if (!unipileApiKey?.trim()) {
      newErrors.unipileApiKey = 'Unipile API key is required';
    }
    
    if (!unipileAccountId?.trim()) {
      newErrors.unipileAccountId = 'LinkedIn Account ID is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validateInputs()) {
      setIsSubmitting(true);
      
      try {
        // Store values in localStorage for potential use in other components
        localStorage.setItem('unipileAccountId', unipileAccountId);
        
        toast({
          title: "Unipile details saved",
          description: "Your Unipile configuration has been saved successfully."
        });
        
        goToNextStep();
        router.push('/setup/details');
      } catch (error) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to save Unipile details",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="border border-border rounded-lg p-8 bg-background">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-4">Set up Unipile</h1>
          <p className="text-muted-foreground">
            <a href="https://www.unipile.com/linkedin-api-a-comprehensive-guide-to-integration/?utm_source=linkedout&utm_medium=linkedout_app&utm_campaign=MAXFROMN8N" target="_blank" rel="noopener noreferrer">Unipile</a> provides access to the LinkedIn API, which is <i>officially</i> hard to come by.
          </p>
        </div>
        <Image 
          src="/images/logo-unipile.svg" 
          alt="Unipile Logo" 
          width={120} 
          height={26} 
          className="mt-1 opacity-90"
        />
      </div>
      
      <div className="bg-green-50/80 dark:bg-green-950/20 border border-green-200/70 dark:border-green-800/50 rounded-md p-4 mb-6">
        <p className="text-green-700 dark:text-green-300/90 text-sm">
          <span className="font-medium">Max's protip:</span> Spoke with their founder Julien, use <b>MAXFROMN8N</b> (contact support) for 50% off for 3 months.
        </p>
      </div>
      
      <div className="space-y-8 mb-12">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">1. Connect LinkedIn Account</h3>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.open('https://dashboard.unipile.com/accounts', '_blank')}
            >
              Open Accounts Page <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              LinkedIn Account ID
            </label>
            <Input
              value={unipileAccountId}
              onChange={(e) => setUnipileAccountId(e.target.value)}
              placeholder="e.g. gXVRsr0MRuqmJcLb8qcbYg"
              className={`w-full ${errors.unipileAccountId ? 'border-destructive' : ''}`}
            />
            {errors.unipileAccountId && (
              <p className="text-sm text-destructive mt-1">{errors.unipileAccountId}</p>
            )}
            <p className="text-xs text-muted-foreground mt-2">
              Copy the Account ID from the Unipile dashboard after connecting your LinkedIn account.
            </p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">2. Create API Key</h3>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.open('https://dashboard.unipile.com/access-tokens', '_blank')}
            >
              Open Access Tokens <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Unipile API Key
            </label>
            <Input
              value={unipileApiKey}
              onChange={(e) => setUnipileApiKey(e.target.value)}
              placeholder="e.g. hX9ZTMBq.P5vJ73kdYwA+LN64eMR+2VpoRXyyDGXPg6yjRtKCdu="
              className={`w-full ${errors.unipileApiKey ? 'border-destructive' : ''}`}
            />
            {errors.unipileApiKey && (
              <p className="text-sm text-destructive mt-1">{errors.unipileApiKey}</p>
            )}
            <p className="text-xs text-muted-foreground mt-2">
              Create and copy the API key from the Access Tokens page in Unipile. Choose all three scopes.
            </p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">3. Get Unipile DSN</h3>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.open('https://dashboard.unipile.com', '_blank')}
            >
              Open Unipile DSN <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Unipile DSN
            </label>
            <Input
              value={unipileDsn}
              onChange={(e) => setUnipileDsn(e.target.value)}
              placeholder="e.g. api1.unipile.com:14108"
              className={`w-full ${errors.unipileDsn ? 'border-destructive' : ''}`}
            />
            {errors.unipileDsn && (
              <p className="text-sm text-destructive mt-1">{errors.unipileDsn}</p>
            )}
            <p className="text-xs text-muted-foreground mt-2">
              Find your DSN in the top left of Unipile dashboard menu.
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={() => router.push('/setup')}>
          Back
        </Button>
        <Button 
          onClick={handleContinue}
          disabled={isSubmitting || !unipileApiKey || !unipileDsn || !unipileAccountId}
        >
          {isSubmitting ? 'Saving...' : 'Continue'}
        </Button>
      </div>
    </div>
  );
} 