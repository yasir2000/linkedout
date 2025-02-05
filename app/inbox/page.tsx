'use client';

import { cn } from "@/lib/utils";
import { InboxIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from '@/contexts/auth-context';
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

  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0">
        {message.avatar ? (
          <img 
            src={message.avatar}
            alt={message.author}
            className="w-10 h-10 rounded-full border-2 border-border object-cover"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement!.innerHTML = `
                <div class="w-10 h-10 rounded-full flex items-center justify-center text-base font-medium border-2 bg-background text-foreground border-border">
                  ${initial}
                </div>
              `;
            }}
          />
        ) : (
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-base font-medium border-2 bg-background text-foreground border-border">
            {initial}
          </div>
        )}
      </div>
      <div className="flex-grow min-w-0 flex items-start justify-between gap-4">
        <div className="min-w-0 flex-grow">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold truncate">{message.author}</h2>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(date, { addSuffix: true })}
            </span>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-1">
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
  const { token, isLoading: authLoading } = useAuth();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        console.log('Fetching messages with token:', token);
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/linkout_messages`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        console.log('Response status:', response.status);
        
        if (!response.ok) throw new Error('Failed to fetch messages');
        const data = await response.json();
        console.log('Raw API Response:', data);

        // The data is already an array of messages
        setMessages(data.filter((msg: Message) => ({
          ...msg,
          avatar: msg.avatar // Make sure to include the avatar in the filtered data
        })));
      } catch (err) {
        console.error('Detailed fetch error:', {
          error: err,
          message: err instanceof Error ? err.message : 'Unknown error',
          stack: err instanceof Error ? err.stack : undefined
        });
        setError(err instanceof Error ? err.message : 'Failed to load messages');
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchMessages();
    } else {
      console.log('No token available, skipping fetch');
    }
  }, [token]);

  useEffect(() => {
    if (!authLoading && !token) {
      router.push('/login');
    }
  }, [token, authLoading, router]);

  const handleMessageClick = (messageId: string) => {
    router.push(`/thread?id=${messageId}`);
  };

  if (isLoading || authLoading || !token) {
    return null;
  }
  if (error) return <div className="text-destructive p-4">{error}</div>;

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-4">Messages</h1>
      {messages.length > 0 ? (
        <div className="border border-border rounded-lg divide-y divide-border">
          {messages.map((message, index) => (
            <div 
              key={message.id}
              onClick={() => handleMessageClick(message.id)}
              className={cn(
                "p-3 hover:bg-muted/10 transition-colors cursor-pointer",
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
