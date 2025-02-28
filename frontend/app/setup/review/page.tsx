'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

export default function ReviewPage() {
  const router = useRouter();
  const [n8nUrl, setN8nUrl] = useState<string>('');
  const [pocketbaseUrl, setPocketbaseUrl] = useState<string>('');

  useEffect(() => {
    // Get the URLs from environment variables
    setN8nUrl(process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL?.replace('/webhook', '') || 'devrel.app.n8n.cloud');
    setPocketbaseUrl(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'pb.yourdomain.com');
  }, []);

  const handleOpenLinkedOut = () => {
    router.push('/inbox');
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-8">LinkedOut is ready to use 🚀</h1> 
        
        <div className="flex items-start gap-2 mb-6">
          <CheckCircle2 className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
          <div>
            <h2 className="text-xl font-semibold">LinkedOut backend was successfully deployed:</h2>
            <ul className="list-disc pl-6 mt-4 space-y-2 text-muted-foreground">
              <li>
                <span className="font-medium">Unipile LinkedIn Account</span> credential was created on <b>{n8nUrl.replace(/^https?:\/\//, '')}</b> n8n instance
              </li>
              <li>
                <span className="font-medium">Backend workflows</span> were added to <b>{n8nUrl.replace(/^https?:\/\//, '')}</b> n8n instance:
                <ul className="list-disc pl-6 mt-1">
                  <li><b>New message ingress [linkedout]</b></li>
                  <li><b>/inbox backend [linkedout]</b></li>
                  <li><b>/thread backend [linkedout]</b></li>
                  <li><b>/setup/pocketbase [linkedout]</b> 👈 Can delete this if you like </li>
                </ul>
              </li>
              <li>
                <span className="font-medium">Your PocketBase URL (<b>{pocketbaseUrl.replace(/^https?:\/\//, '')}</b>) was inserted in all relevant nodes across n8n workflows </span>

              </li>
              <li>
                <span className="font-medium">PocketBase configuration</span>:
                <ul className="list-disc pl-6 mt-1">
                  <li>Service user <b>linkedout-service-user@n8n.io</b> was created (for New message ingress workflow to use)</li>
                  <li>People, Inboxes, and TextSnippets tables were created in PocketBase</li>
                </ul>
              </li>
            </ul>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Keep in mind 👇</h3>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>
              Use your <b>PocketBase Superuser username and password to sign in to LinkedOut</b>
            </li>
            <li>
              Create, update, and delete <b>Text Snippets</b> within PocketBase TextSnippets table directly (not yet added in-app). However, you can use text snippets you added in PocketBase whilst using LinkedOut.
            </li>
            <li>
              Not everything is perfect. It's an MVP. Embrace your inner flowgrammer and make it better. Make it <i>yours</i>.
            </li>
          </ul>
        </div>
      </div>

      <div className="flex justify-center">
        <Button 
          className="w-full max-w-md py-6 text-lg"
          onClick={handleOpenLinkedOut}
        >
          Open LinkedOut
        </Button>
      </div>
    </div>
  );
}