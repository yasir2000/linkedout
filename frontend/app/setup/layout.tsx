// app/setup/layout.tsx
'use client';

import { SetupProvider } from '@/app/contexts/setup-context';
import { Progress } from '@/components/ui/progress';
import { useSetup } from '@/app/contexts/setup-context';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { Footer } from '@/components/footer';

// Progress indicator component
function SetupProgress() {
  const { currentStep } = useSetup();
  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;
  
  return (
    <div className="mb-8">
      <Progress value={progress} className="h-2" />
      <div className="flex justify-between mt-2 text-sm text-muted-foreground">
        <span>Step {currentStep} of {totalSteps}</span>
        <span>{Math.round(progress)}% Complete</span>
      </div>
    </div>
  );
}

// Path to step mapping
const pathToStep: Record<string, number> = {
  '/setup': 1,
  '/setup/details': 2,
  '/setup/n8n': 3,
  '/setup/pocketbase': 4,
  '/setup/manual': 3, // Alternative to n8n
};

function getProgress(pathname: string): number {
  // Map paths to specific progress percentages
  const pathProgressMap: Record<string, number> = {
    '/setup/details': 25,
    '/setup/n8n': 50, 
    '/setup/manual': 50, // Added manual path with 50% progress
    '/setup/pocketbase': 100,
    '/setup/review': 100
  };
  
  // Find the matching path
  for (const [path, progress] of Object.entries(pathProgressMap)) {
    if (pathname.startsWith(path)) {
      return progress;
    }
  }
  
  // Default progress for other paths
  return 0;
}

function SetupLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { setCurrentStep } = useSetup();
  
  // Hide progress bar on the root setup page
  const showProgressBar = pathname !== '/setup';
  
  useEffect(() => {
    if (pathname && pathname in pathToStep) {
      setCurrentStep(pathToStep[pathname]);
    }
  }, [pathname, setCurrentStep]);
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="container mx-auto py-6 max-w-4xl flex-grow">
        <h1 className="text-xl font-semibold mb-4">Set up LinkedOut</h1>
        {showProgressBar && <SetupProgress />}
        {children}
      </div>
      <Footer />
    </div>
  );
}

export default function SetupLayout({ children }: { children: React.ReactNode }) {
  return (
    <SetupProvider>
      <SetupLayoutContent>{children}</SetupLayoutContent>
    </SetupProvider>
  );
}