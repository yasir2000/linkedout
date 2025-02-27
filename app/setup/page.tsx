// app/setup/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function SetupPage() {
  const router = useRouter();
  
  return (
    <div className="border border-border rounded-lg p-8 bg-background">
      <h1 className="text-2xl font-bold mb-4">Welcome to LinkedOut Setup</h1>
      
      <p className="text-muted-foreground mb-6">
        Choose your setup method:
      </p>
      
      <div className="space-y-4">
        <Button 
          className="w-full"
          onClick={() => router.push('/setup/details')}
        >
          I used the CloudStation deployment template
        </Button>
        
        <Button 
          variant="outline"
          className="w-full"
          onClick={() => router.push('/setup/manual')}
        >
          I want to set up manually
        </Button>
      </div>
    </div>
  );
}