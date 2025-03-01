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
        <div className="mb-6 flex justify-center">
          <div className="border border-border rounded-lg overflow-hidden w-[70%]">
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
      
      
      <h2 className="text-2xl font-semibold text-center mb-6">
        Choose your setup method
      </h2>
      
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6"> 
        <Button 
          variant="outline"
          className="flex-1 order-1 sm:order-1 p-6"
          onClick={() => router.push('/setup/manual')}
        >
          I want to set up manually
        </Button>
        
        <Button 
          className="flex-1 p-6 order-2 sm:order-2 relative overflow-hidden group transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(255,255,255,0.5)]"
          onClick={() => router.push('/setup/unipile')}
        >
          <span className="relative z-10">I want to set up magically 🪄</span>
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500 via-orange-500 via-yellow-400 via-green-500 via-blue-500 to-purple-600"></div>
          </div>
        </Button>
      </div>
    </div>
  );
}