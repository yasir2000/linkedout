// app/setup/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useState } from 'react';

export default function SetupPage() {
  const router = useRouter();
  const [imageError, setImageError] = useState(false);
  
  return (
    <div className="border border-border rounded-lg p-8 bg-background">
      {!imageError && (
        <div className="mb-6">
          <div className="border border-border rounded-lg overflow-hidden">
            <Image 
              src="/images/setup-hero.png"
              alt="LinkedOut Setup Banner" 
              width={1200} 
              height={400} 
              className="w-full object-cover"
              priority
              onError={() => setImageError(true)}
            />
          </div>
        </div>
      )}
      
      <h1 className="text-2xl font-bold mb-4">Welcome to LinkedOut Setup</h1>
      
      <p className="text-muted-foreground mb-6">
        Choose your setup method
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
        <Button 
          variant="outline"
          className="flex-1 order-1 sm:order-1"
          onClick={() => router.push('/setup/manual')}
        >
          I want to set up manually
        </Button>
        
        <Button 
          className="flex-1 order-2 sm:order-2"
          onClick={() => router.push('/setup/unipile')}
        >
          I want to set up magically 🪄
        </Button>
      </div>
    </div>
  );
}