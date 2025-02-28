'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Github } from 'lucide-react';

export default function ManualSetupPage() {
  const router = useRouter();
  
  const openGithub = () => {
    window.open('https://github.com/maxt-n8n/linkedout/', '_blank');
  };
  
  return (
    <div className="border border-border rounded-lg p-8 bg-background">
      <h1 className="text-2xl font-bold mb-4">Manual Setup Instructions</h1>
      
      <p className="text-muted-foreground mb-6">
        Follow these steps to set up LinkedOut manually:
      </p>
      
      <div className="space-y-8 mb-8">
        <div>
          <h2 className="text-xl font-semibold mb-2">1. Set up PocketBase</h2>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>Deploy a PocketBase instance (you can use <a href="https://app.cloud-station.io/template-store/pocketbase" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">CloudStation</a> or your preferred hosting)</li>
            <li>Create a superuser account during the initial setup</li>
            <li>Create the following collections in PocketBase:
              <ul className="list-disc pl-6 mt-1">
                <li><b>People</b> - to store LinkedIn contacts</li>
                <li><b>Inboxes</b> - to store message threads</li>
                <li><b>TextSnippets</b> - to store reusable message templates</li>
              </ul>
            </li>
            <li>Create a service user account with appropriate permissions</li>
          </ul>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-2">2. Set up n8n</h2>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>Deploy an n8n instance (you can use <a href="https://app.n8n.cloud/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">n8n.cloud</a> or self-host)</li>
            <li>Create a Unipile credential for LinkedIn API access</li>
            <li>Import the following workflows:
              <ul className="list-disc pl-6 mt-1">
                <li><b>New message ingress [linkedout]</b> - handles incoming LinkedIn messages</li>
                <li><b>/inbox backend [linkedout]</b> - manages the inbox functionality</li>
                <li><b>/thread backend [linkedout]</b> - handles message threads</li>
              </ul>
            </li>
            <li>Configure the workflows with your PocketBase URL and credentials</li>
          </ul>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-2">3. Configure Environment Variables</h2>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>Create a <code>.env.local</code> file in your project root with:
              <pre className="bg-muted p-2 rounded-md mt-1 overflow-x-auto">
                <code>
NEXT_PUBLIC_POCKETBASE_URL=your_pocketbase_url
NEXT_PUBLIC_N8N_WEBHOOK_URL=your_n8n_url
                </code>
              </pre>
            </li>
          </ul>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-2">4. Deploy the Frontend</h2>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>Clone the LinkedOut repository</li>
            <li>Install dependencies with <code>npm install</code></li>
            <li>Build the application with <code>npm run build</code></li>
            <li>Deploy to your preferred hosting service (Vercel, Netlify, etc.)</li>
          </ul>
        </div>
      </div>
      
      <p className="text-muted-foreground mb-6">
        For detailed instructions, workflow templates, and schema definitions, check out the GitHub repository:
      </p>
      
      <div className="flex justify-center">
        <Button 
          className="w-full max-w-md py-6 text-lg gap-2"
          onClick={openGithub}
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