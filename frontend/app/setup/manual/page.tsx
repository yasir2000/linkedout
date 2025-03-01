'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Github, ExternalLink } from 'lucide-react';
import Image from 'next/image';

export default function ManualSetupPage() {
  const router = useRouter();
  
  const openGithub = () => {
    window.open('https://github.com/maxt-n8n/linkedout/', '_blank');
  };
  
  return (
    <div className="border border-border rounded-lg p-8 bg-background">
      <h1 className="text-2xl font-bold mb-4">Manual Setup Instructions</h1>
      
      <div className="bg-blue-50/80 dark:bg-blue-950/20 border border-blue-200/70 dark:border-blue-800/50 rounded-md p-4 mb-6">
        <p className="text-blue-700 dark:text-blue-300/90 text-sm">
          <span className="font-medium">Recommended:</span> Use the <a href="https://app.cloud-station.io/template-store/linkedout" target="_blank" rel="noopener noreferrer" className="font-bold underline">CloudStation LinkedOut Template</a> for one-click deployment of the frontend app and PocketBase with pre-configured environment variables.
        </p>
      </div>
      
      <div className="space-y-16">
        <section>
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-semibold">1. Set up n8n</h2>
            <Image 
              src="/images/logo-n8n.svg" 
              alt="n8n Logo" 
              width={100} 
              height={27} 
              className="mt-1 opacity-90"
            />
          </div>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>You'll need to set up the following in your n8n instance:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Create a <strong>Unipile [LinkedIn API]</strong> credential of type <code>httpHeaderAuth</code> with your Unipile API key</li>
              
              <li>Import the following workflows from the GitHub repository:</li>
              <ul className="list-disc pl-6 mt-1">
                <li><code>/inbox backend [linkedout]</code></li>
                <li><code>/thread backend [linkedout]</code></li>
                <li><code>New message ingress [linkedout]</code></li>
                <li><code>/setup backend [linkedout]</code> (optional)</li>
              </ul>
              <li>Update all placeholder values in the workflows:</li>
              <ul className="list-disc pl-6 mt-1">
                <li><code>****POCKETBASE_BASE_URL****</code>: Your PocketBase URL</li>
                <li><code>****UNIPILE_CREDENTIAL_ID****</code>: Your Unipile credential ID in n8n</li>
                <li><code>****UNIPILE_DSN_URL****</code>: Your Unipile DSN URL</li>
                <li><code>****UNIPILE_ACCOUNT_ID****</code>: Your Unipile account ID</li>
                <li><code>****POCKETBASE_SERVICE_USER_EMAIL****</code>: <code>linkedout-service-user@n8n.io</code></li>
                <li><code>****POCKETBASE_SERVICE_USER_PASSWORD****</code>: Your service user password</li>
              </ul>
              <li>Set newly created Unipile credential in workflows - /thread backend and New message ingress</li>
            </ul>
          </div>
        </section>
        
        <section>
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-semibold">2. Set up PocketBase</h2>
            <Image 
              src="/images/logo-pocketbase.svg" 
              alt="PocketBase Logo" 
              width={40} 
              height={40} 
              className="mt-1 opacity-90"
            />
          </div>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>In your PocketBase instance, you'll need to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Create a service user with email <code>linkedout-service-user@n8n.io</code> and a secure password</li>
              <li>Create the following collections:</li>
              <ul className="list-disc pl-6 mt-1">
                <li><code>People</code></li>
                <li><code>Inboxes</code></li>
                <li><code>TextSnippets</code></li>
              </ul>
              <li>Configure proper schema for each collection (refer to GitHub repository for schema details)</li>
            </ul>
          </div>
        </section>
        
        <section>
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-semibold">3. Configure Environment Variables</h2>
            <Image 
              src="/images/linkedout-logo.svg" 
              alt="LinkedOut Logo" 
              width={120} 
              height={36} 
              className="mt-1 opacity-90"
            />
          </div>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>Set the following environment variables in your frontend deployment:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><code>NEXT_PUBLIC_POCKETBASE_URL</code>: Your PocketBase URL</li>
              <li><code>NEXT_PUBLIC_N8N_WEBHOOK_URL</code>: Your n8n webhook URL</li>
            </ul>
            <p className="text-xs mt-2 text-amber-600 dark:text-amber-400">Note: Do not include trailing slashes in URLs. Changing these will require a rebuild + redeployment of this frontend app.</p>
          </div>
        </section>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 mt-14">
        <Button 
          variant="outline" 
          onClick={openGithub}
          className="flex items-center gap-2"
        >
          <Github className="h-5 w-5" />
          View on GitHub
        </Button>
        
      
      </div>
      
      <div className="mt-8 pt-4 border-t border-border">
        <Button 
          variant="outline" 
          onClick={() => router.push('/setup')}
          className="w-full"
        >
          Back to Setup Options
        </Button>
      </div>
    </div>
  );
}