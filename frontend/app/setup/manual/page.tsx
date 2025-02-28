'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Github, ExternalLink } from 'lucide-react';
import { CodeBlock } from "@/components/ui/code-block";

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
      
      <div className="space-y-6 mb-8">
        <div>
          <h2 className="text-xl font-semibold mb-2">1. Set up PocketBase</h2>
          <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
            <li>Option 1: Deploy via <a href="https://app.cloud-station.io/template-store/pocketbase" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">CloudStation</a></li>
            <li>Option 2: Install locally:
              <CodeBlock 
                code="curl -fsSL https://github.com/pocketbase/pocketbase/releases/download/v0.25.8/pocketbase_0.25.8_linux_amd64.zip -o pocketbase.zip
unzip pocketbase.zip

# Start PocketBase
./pocketbase serve" 
                language="bash" 
                showLineNumbers={false} 
              />
            </li>
            <li>Create collections: <b>People</b>, <b>Inboxes</b>, and <b>TextSnippets</b></li>
            <li>Set up a service user account with appropriate permissions</li>
          </ul>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-2">2. Set up n8n</h2>
          <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
            <li>Deploy n8n via <a href="https://app.n8n.cloud/register?utm_campaign=linkedout" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">n8n.cloud</a> (use code <b>MAX50</b> for 50% off for 12 months) or self-host</li>
            <li>Create a Unipile credential for LinkedIn API access</li>
            <li>Import the core workflows: <b>message ingress</b>, <b>/inbox backend</b>, and <b>/thread backend</b></li>
          </ul>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-2">3. Configure Environment Variables</h2>
          <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
            <li>Set up <code>.env.local</code> with:
              <pre className="bg-muted p-2 rounded-md mt-1 overflow-x-auto">
                <code>
NEXT_PUBLIC_POCKETBASE_URL=your_pocketbase_url
NEXT_PUBLIC_N8N_WEBHOOK_URL=your_n8n_url
                </code>
              </pre>
            </li>
            <li>Note: Do not include trailing slashes in URLs</li>
          </ul>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-2">4. Deploy the Frontend</h2>
          <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
            <li>Clone the repository, install dependencies with <code>npm install</code></li>
            <li>Build with <code>npm run build</code> and deploy to your preferred hosting</li>
          </ul>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <Button 
          className="py-5 text-lg gap-2 flex-1"
          onClick={openGithub}
        >
          <Github className="h-5 w-5" />
          View on GitHub
        </Button>
        
        <Button 
          variant="outline" 
          className="py-5 text-lg gap-2 flex-1"
          onClick={() => window.open('https://app.cloud-station.io/template-store/linkedout', '_blank')}
        >
          <ExternalLink className="h-5 w-5" />
          Deploy with CloudStation
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