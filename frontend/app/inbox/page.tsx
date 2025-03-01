'use client';

import { cn } from "@/lib/utils";
import { InboxIcon, LogOut, Database, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from '@/app/contexts/auth-context';
import { formatDistanceToNow } from "date-fns";
import Image from 'next/image';
import { Footer } from "@/components/footer";

interface Message {
  id: string;
  author: string;
  content: string | null;
  lastUpdated: string;
  category: string | null;
  avatar?: string;
}

function EmptyState() {
  return (
    <div className="border border-border rounded-lg py-12 px-6">
      <div className="flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 rounded-full bg-muted/10 flex items-center justify-center mb-4">
          <InboxIcon className="w-6 h-6 text-muted-foreground" />
        </div>
        <h2 className="font-semibold text-lg mb-2">No messages yet</h2>
        <p className="text-muted-foreground text-sm mb-4 max-w-sm">
          When you receive new messages, they'll appear here. Check back later or refresh the page.
        </p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Refresh
        </Button>
      </div>
    </div>
  );
}

function MessageGroup({ message }: { message: Message }) {
  const initial = message.author ? message.author[0]?.toUpperCase() : '?';
  const date = message.lastUpdated ? new Date(message.lastUpdated) : new Date();

  return (
    <div className="flex gap-3 sm:gap-6">
      <div className="flex-shrink-0">
        {message.avatar ? (
          <img 
            src={message.avatar || ''}
            alt={message.author}
            className="w-10 h-10 sm:w-14 sm:h-14 rounded-full border-2 border-border object-cover"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.style.display = 'none';
              const fallbackDiv = document.createElement('div');
              fallbackDiv.className = 'w-10 h-10 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-base sm:text-xl font-medium border-2 bg-background text-foreground border-border';
              fallbackDiv.textContent = initial;
              e.currentTarget.parentElement?.replaceChildren(fallbackDiv);
            }}
          />
        ) : (
          <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-base sm:text-xl font-medium border-2 bg-background text-foreground border-border">
            {initial}
          </div>
        )}
      </div>
      <div className="flex-grow min-w-0 flex items-start justify-between gap-2 sm:gap-4">
        <div className="min-w-0 flex-grow">
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
            <h2 className="font-semibold text-base sm:text-lg truncate">{message.author}</h2>
            <span className="text-xs sm:text-sm text-muted-foreground">
              {formatDistanceToNow(date, { addSuffix: true })}
            </span>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground line-clamp-1">
            {message.content}
          </p>
        </div>
      </div>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex justify-center py-4">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-foreground"></div>
    </div>
  );
}

export default function InboxPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { token, isLoading: authLoading, logout } = useAuth();

  const fetchMessages = async () => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/proxy?endpoint=linkout_messages', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.status === 401) {
        handleLogout();
        return;
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch messages: ${response.status}`);
      }

      const data = await response.json();
      
      // Handle empty or null response
      if (!data) {
        setMessages([]);
        setIsLoading(false);
        return;
      }
      
      const sortedMessages = (Array.isArray(data) ? data : [])
        .filter((msg: Message) => msg?.content !== null)
        .sort((a: Message, b: Message) => 
          new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
        );

      setMessages(sortedMessages);
      setError(null);
      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch messages');
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    await fetchMessages();
    return Promise.resolve();
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  useEffect(() => {
    fetchMessages();
  }, [token]);

  useEffect(() => {
    if (!authLoading && !token) {
      router.push('/login');
    }
  }, [token, authLoading, router]);

  const handleMessageClick = (messageId: string) => {
    router.push(`/thread?id=${messageId}`);
  };

  if (isLoading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-0 mt-[-10vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-foreground"></div>
          <p className="text-muted-foreground">Loading messages...</p>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="container mx-auto py-6 max-w-4xl">
        <div className="text-destructive p-4 border border-destructive/50 rounded-lg">
          {error}
        </div>
        <Footer className="mt-4" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="container mx-auto py-2 sm:py-6 max-w-4xl flex-grow px-2 sm:px-4">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <div className="flex items-center gap-2">
            <Image 
              src="/images/linkedout-logo.svg" 
              alt="LinkedOut Logo" 
              width={136} 
              height={40} 
              className="sm:w-[136px] sm:h-[40px]"
              priority
            />
            
            
          </div>
          <div className="flex gap-1 sm:gap-2">
            <Button 
              variant="outline" 
              size="sm"
              className="gap-1 sm:gap-2 px-2 sm:px-3"
              onClick={() => window.open(`${process.env.NEXT_PUBLIC_POCKETBASE_URL}/_/`, '_blank')}
            >
              <Database className="h-4 w-4" />
              <span className="hidden sm:inline">Open PocketBase</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
              className="gap-1 sm:gap-2 px-2 sm:px-3"
            >
              <RefreshCw className="h-4 w-4" />
              <span className="hidden sm:inline">{isLoading ? 'Refreshing...' : 'Refresh'}</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="gap-1 sm:gap-2 px-2 sm:px-3"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
        {messages.length > 0 ? (
          <div className="border border-border rounded-lg divide-y divide-border">
            {messages.map((message, index) => (
              <div 
                key={message.id}
                onClick={() => handleMessageClick(message.id)}
                className={cn(
                  "p-3 sm:p-4 hover:bg-muted/10 transition-colors cursor-pointer",
                  "flex items-start gap-4"
                )}
              >
                <MessageGroup message={message} />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
      <Footer />
    </div>
  );
}
