'use client';

import { cn } from "@/lib/utils";
import { InboxIcon, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from '@/app/contexts/auth-context';
import { formatDistanceToNow } from "date-fns";

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
  
  console.log('Message data:', {
    id: message.id,
    author: message.author,
    hasAvatar: !!message.avatar,
    avatarUrl: message.avatar
  });

  return (
    <div className="flex gap-6">
      <div className="flex-shrink-0">
        {message.avatar ? (
          <img 
            src={message.avatar || ''}
            alt={message.author}
            className="w-14 h-14 rounded-full border-2 border-border object-cover"
            onError={(e) => {
              console.error('Image load error:', {
                src: e.currentTarget.src,
                error: e
              });
              e.currentTarget.onerror = null;
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement!.innerHTML = `
                <div class="w-14 h-14 rounded-full flex items-center justify-center text-xl font-medium border-2 bg-background text-foreground border-border">
                  ${initial}
                </div>
              `;
            }}
          />
        ) : (
          <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-medium border-2 bg-background text-foreground border-border">
            {initial}
          </div>
        )}
      </div>
      <div className="flex-grow min-w-0 flex items-start justify-between gap-4">
        <div className="min-w-0 flex-grow">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-lg truncate">{message.author}</h2>
            <span className="text-sm text-muted-foreground">
              {formatDistanceToNow(date, { addSuffix: true })}
            </span>
          </div>
          <p className="text-base text-muted-foreground line-clamp-1">
            {message.content}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function InboxPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { token, isLoading: authLoading, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const fetchMessages = async () => {
    if (!token) {
      console.log('No token available, skipping fetch');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/proxy?endpoint=linkout_messages', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.status === 401) {
        handleLogout();
        return;
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch messages: ${response.status}`);
      }

      const data = await response.json();
      
      console.log('Full message data:', data);

      const sortedMessages = data
        .filter((msg: Message) => msg.content !== null)
        .sort((a: Message, b: Message) => 
          new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
        );

      setMessages(sortedMessages);
    } catch (err) {
      console.error('Detailed fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch messages');
    } finally {
      setIsLoading(false);
    }
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
    return <div className="container mx-auto py-6 max-w-4xl">Loading...</div>;
  }
  if (error) {
    return (
      <div className="container mx-auto py-6 max-w-4xl">
        <div className="text-destructive p-4 border border-destructive/50 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Messages</h1>
        <Button 
          variant="ghost" 
          size="sm"
          className="gap-2"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
      {messages.length > 0 ? (
        <div className="border border-border rounded-lg divide-y divide-border">
          {messages.map((message, index) => (
            <div 
              key={message.id}
              onClick={() => handleMessageClick(message.id)}
              className={cn(
                "p-4 hover:bg-muted/10 transition-colors cursor-pointer",
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
  );
}
