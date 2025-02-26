'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSetup } from '@/app/contexts/setup-context';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';

// Validation schema
const formSchema = z.object({
  n8nApiKey: z.string().min(1, "n8n API Key is required"),
  unipileApiKey: z.string().min(1, "Unipile API Key is required"),
  unipileDsn: z.string().min(1, "Unipile DSN is required"),
});

export default function DetailsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { 
    n8nApiKey, setN8nApiKey,
    unipileApiKey, setUnipileApiKey,
    unipileDsn, setUnipileDsn,
    goToNextStep
  } = useSetup();
  
  const [errors, setErrors] = useState<{
    n8nApiKey?: string;
    unipileApiKey?: string;
    unipileDsn?: string;
  }>({});
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const validateForm = () => {
    try {
      formSchema.parse({
        n8nApiKey,
        unipileApiKey,
        unipileDsn
      });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            formattedErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(formattedErrors);
      }
      return false;
    }
  };
  
  const handleContinue = () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // No API call needed - just store in context
      toast({
        title: "Details saved",
        description: "Your API keys have been saved successfully."
      });
      
      goToNextStep();
      router.push('/setup/n8n');
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save details",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="border border-border rounded-lg p-8 bg-background">
      <h1 className="text-2xl font-bold mb-4">Add stack details</h1>
      
      <p className="text-muted-foreground mb-6">
        This app connects to n8n and PocketBase, setting up workflows, credentials, and tables via
        API. Your API keys stay secure—never sent to external servers.
      </p>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            n8n API key
          </label>
          <Input
            value={n8nApiKey}
            onChange={(e) => setN8nApiKey(e.target.value)}
            placeholder="e.g. eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            className={`w-full ${errors.n8nApiKey ? 'border-destructive' : ''}`}
          />
          {errors.n8nApiKey && (
            <p className="text-sm text-destructive mt-1">{errors.n8nApiKey}</p>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Unipile API key
            </label>
            <Input
              value={unipileApiKey}
              onChange={(e) => setUnipileApiKey(e.target.value)}
              placeholder="e.g. eyJhbGciOiJIUzI1NiIsInR5cCI"
              className={`w-full ${errors.unipileApiKey ? 'border-destructive' : ''}`}
            />
            {errors.unipileApiKey && (
              <p className="text-sm text-destructive mt-1">{errors.unipileApiKey}</p>
            )}
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
          </div>
        </div>
      </div>
      
      <div className="flex justify-between mt-16">
        <Button variant="outline" onClick={() => router.push('/setup')}>
          Back
        </Button>
        <Button 
          onClick={handleContinue}
          disabled={isSubmitting || !n8nApiKey || !unipileApiKey || !unipileDsn}
        >
          {isSubmitting ? 'Saving...' : 'Continue'}
        </Button>
      </div>
    </div>
  );
} 