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
  pocketbaseSuperuserEmail: z.string().email("Invalid email address").min(1, "PocketBase Superuser Email is required"),
  pocketbaseSuperuserPassword: z.string().min(1, "PocketBase Superuser Password is required"),
  unipileAccountId: z.string().min(1, "Unipile Account ID is required"),
});

export default function DetailsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { 
    n8nApiKey, setN8nApiKey,
    unipileApiKey, setUnipileApiKey,
    unipileDsn, setUnipileDsn,
    pocketbaseSuperuserEmail, setPocketbaseSuperuserEmail,
    pocketbaseSuperuserPassword, setPocketbaseSuperuserPassword,
    unipileAccountId, setUnipileAccountId,
    goToNextStep
  } = useSetup();
  
  const [errors, setErrors] = useState<{
    n8nApiKey?: string;
    unipileApiKey?: string;
    unipileDsn?: string;
    pocketbaseSuperuserEmail?: string;
    pocketbaseSuperuserPassword?: string;
    unipileAccountId?: string;
  }>({});
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const validateForm = () => {
    try {
      formSchema.parse({
        n8nApiKey,
        unipileApiKey,
        unipileDsn,
        pocketbaseSuperuserEmail,
        pocketbaseSuperuserPassword,
        unipileAccountId,
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
        This app connects to your n8n and PocketBase, setting up workflows, credentials, and tables via
        API. There is no "phone home", none of your infos are sent to us 🤓
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-6">
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
        <div className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Unipile Account ID (LinkedIn)
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
            </div>
          </div>
        </div>
        <div className="mt-2">
            <p className="text-xs text-muted-foreground">
            ℹ️ From Unipile dashboard, first <a href="https://dashboard.unipile.com/accounts" target='_blank'>create a LinkedIn Account</a> (e.g. connect to it). Then create an <a href="https://dashboard.unipile.com/access-tokens" target='_blank'>Access Token (API Key)</a>.
            </p>
          </div>
        <div className="border-t pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                PocketBase Superuser Email
              </label>
              <Input
                type="email"
                value={pocketbaseSuperuserEmail}
                onChange={(e) => setPocketbaseSuperuserEmail(e.target.value)}
                placeholder="e.g. admin@example.com"
                className={`w-full ${errors.pocketbaseSuperuserEmail ? 'border-destructive' : ''}`}
              />
              {errors.pocketbaseSuperuserEmail && (
                <p className="text-sm text-destructive mt-1">{errors.pocketbaseSuperuserEmail}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                PocketBase Superuser Password
              </label>
              <Input
                type="password"
                value={pocketbaseSuperuserPassword}
                onChange={(e) => setPocketbaseSuperuserPassword(e.target.value)}
                placeholder="Your PocketBase admin password"
                className={`w-full ${errors.pocketbaseSuperuserPassword ? 'border-destructive' : ''}`}
              />
              {errors.pocketbaseSuperuserPassword && (
                <p className="text-sm text-destructive mt-1">{errors.pocketbaseSuperuserPassword}</p>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between mt-16">
        <Button variant="outline" onClick={() => router.push('/setup')}>
          Back
        </Button>
        <Button 
          onClick={handleContinue}
          disabled={isSubmitting || !n8nApiKey || !unipileApiKey || !unipileDsn || 
                   !pocketbaseSuperuserEmail || !pocketbaseSuperuserPassword || !unipileAccountId}
        >
          {isSubmitting ? 'Saving...' : 'Continue'}
        </Button>
      </div>
    </div>
  );
} 