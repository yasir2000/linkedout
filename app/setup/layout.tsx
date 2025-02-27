// app/setup/layout.tsx
'use client';

import { SetupProvider } from '@/app/contexts/setup-context';
import { Progress } from '@/components/ui/progress';
import { useSetup } from '@/app/contexts/setup-context';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

// Progress indicator component
function SetupProgress() {
  const { currentStep } = useSetup();
  const totalSteps = 5;
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
  '/setup/review': 5,
  '/setup/manual': 3, // Alternative to n8n
};

function getProgress(pathname: string): number {
  const setupSteps = [
    '/setup/details',
    '/setup/n8n',
    '/setup/pocketbase',
    '/setup/review'
  ];
  
  const currentStepIndex = setupSteps.findIndex(step => pathname.startsWith(step));
  
  if (currentStepIndex === -1) {
    return 0;
  }
  
  // Calculate progress based on current step (25% per step)
  return Math.min(100, ((currentStepIndex + 1) / setupSteps.length) * 100);
}

function SetupLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { setCurrentStep } = useSetup();
  
  useEffect(() => {
    if (pathname && pathname in pathToStep) {
      setCurrentStep(pathToStep[pathname]);
    }
  }, [pathname, setCurrentStep]);
  
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6 max-w-4xl">
        <h1 className="text-xl font-semibold mb-4">Set up LinkedOut</h1>
        <SetupProgress />
        {children}
      </div>
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