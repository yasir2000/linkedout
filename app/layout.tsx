import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Inbox - Messages',
  description: 'View your unanswered messages',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={cn(
        inter.className,
        "min-h-screen bg-background text-foreground antialiased"
      )}>
        {children}
      </body>
    </html>
  );
}
