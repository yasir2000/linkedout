'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/app/contexts/auth-context';
import Image from 'next/image';
import { Footer } from '@/components/footer';

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <main className="container mx-auto py-6 flex-grow">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="flex justify-center mb-6">
            <Image 
              src="/images/linkedout-logo.svg" 
              alt="LinkedOut Logo" 
              width={250} 
              height={75} 
              priority
            />
          </div>
          <p className="text-muted-foreground mb-8">
            {user ? (
              <>
                Check your <a href="/inbox" className="underline hover:text-foreground">inbox</a> to view your messages
              </>
            ) : (
              'Sign in to view your messages or to setup LinkedOut'
            )}
          </p>
          {!user && (
            <Button 
              size="lg"
              onClick={() => router.push('/login')}
            >
              Sign in
            </Button>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
