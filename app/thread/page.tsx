'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ArrowLeft, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { format, formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/auth-context';

interface Author {
  id?: string;
  name: string;
  linkedinUrl?: string;
  threadUrl?: string;
  avatarUrl?: string;
}

interface Message {
  id: string;
  content: string;
  isFromMe: string;
  lastUpdated: string;
  linkedinProfileURL: string;
  recipientLinkedInFollowerCount: string;
  recipientName: string;
}

interface Thread {
  id: string;
  messages: Message[];
}

async function generateDraft(
  data: {
    toFullName: string;
    messageToReplyTo: string;
    messageCategory: string;
  },
  token: string
): Promise<{ draftReply: string }> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/linkedout/generate-draft`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    const result = await response.json();
    return { draftReply: result.draftReply };
  } catch (error) {
    return {
      draftReply: "Sorry, I couldn't generate a draft reply at the moment. Please try again later."
    };
  }
}

function Avatar({ author }: { author: Author }) {
  if (author.avatarUrl) {
    return (
      <img 
        src={author.avatarUrl} 
        alt={author.name}
        className="w-8 h-8 rounded-full"
      />
    );
  }

  const initials = author.name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const backgroundColor = stringToColor(author.name);

  return (
    <div 
      className={cn(
        'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium text-primary-foreground'
      )}
      style={{ backgroundColor }}
    >
      {initials}
    </div>
  );
}

function MessageGroup({ message }: { message: Message }) {
  const initial = message.recipientName ? message.recipientName[0]?.toUpperCase() : '?';
  const date = message.lastUpdated ? new Date(message.lastUpdated) : new Date();

  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0">
        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-sm font-medium">
          {initial}
        </div>
      </div>
      <div className="flex-grow space-y-1">
        <div className="flex items-center gap-2">
          <span className="font-medium">{message.recipientName || 'Unknown'}</span>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(date, { addSuffix: true })}
          </span>
        </div>
        <p className="text-sm">{message.content || ''}</p>
      </div>
    </div>
  );
}

function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hash % 360;
  return `hsl(${hue}, 65%, 25%)`; // Dark mode friendly
}

export default function ThreadPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [reply, setReply] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [thread, setThread] = useState<Thread | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token, isLoading: authLoading } = useAuth();

  const threadId = searchParams?.get('id');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!threadId || !token) return;

    const fetchThread = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/threads?id=${threadId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) throw new Error('Failed to fetch thread');
        const data = await response.json();
        console.log('Thread data:', data);
        
        // Transform the API response into our Thread type
        const transformedThread: Thread = {
          id: threadId,
          messages: [{
            id: data[0].id,
            content: data[0].content,
            isFromMe: data[0].isFromMe,
            lastUpdated: data[0].lastUpdated,
            linkedinProfileURL: data[0].linkedinProfileURL,
            recipientLinkedInFollowerCount: data[0].recipientLinkedInFollowerCount,
            recipientName: data[0].recipientName
          }]
        };
        
        setThread(transformedThread);
      } catch (err) {
        console.error('Thread fetch error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load thread');
      } finally {
        setIsLoading(false);
      }
    };

    fetchThread();
  }, [threadId, token]);

  useEffect(() => {
    if (!authLoading && !token) {
      router.push('/login');
    }
  }, [token, authLoading, router]);

  const handleGenerateDraft = async () => {
    if (!token) return;

    setIsGenerating(true);
    try {
      const lastMessage = thread?.messages[thread?.messages.length - 1];
      
      const draftResponse = await generateDraft({
        toFullName: lastMessage?.recipientName || '',
        messageToReplyTo: lastMessage?.content || '',
        messageCategory: 'love-your-content'
      }, token);
      
      setReply(draftResponse.draftReply);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = async () => {
    if (!reply.trim() || isSending) return;

    setIsSending(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setReply('');
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleOpenLink = (url: string) => {
    if (typeof window !== 'undefined') {
      window.open(url, '_blank');
    }
  };

  if (!mounted) {
    return null;
  }

  if (!threadId) {
    router.push('/inbox');
    return null;
  }

  if (isLoading || authLoading) {
    return (
      <div className="container mx-auto py-6 max-w-4xl">
        <div className="flex items-center space-x-4">
          <div className="h-8 w-24 bg-muted/10 animate-pulse rounded" />
        </div>
        <div className="mt-4 space-y-4">
          <div className="h-32 bg-muted/10 animate-pulse rounded-lg" />
          <div className="h-32 bg-muted/10 animate-pulse rounded-lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-6 max-w-4xl">
        <div className="text-destructive p-4 rounded-lg border border-destructive/50">
          {error}
        </div>
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="container mx-auto py-6 max-w-4xl">
        <div className="text-muted-foreground p-4 text-center">
          Thread not found
        </div>
      </div>
    );
  }

  const firstMessage = thread.messages[0];

  if (!firstMessage) {
    return (
      <div className="container mx-auto py-6 max-w-4xl">
        <div className="text-muted-foreground p-4 text-center">
          No messages in thread
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          className="gap-2"
          onClick={() => router.push('/inbox')}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      <div className="border border-border rounded-lg bg-background">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold">{firstMessage.recipientName || 'Unknown'}</h2>
            <span className="px-2 py-1 text-sm bg-secondary rounded-md">
              {firstMessage.recipientLinkedInFollowerCount} followers
            </span>
          </div>
          <div className="flex items-center gap-2">
            {firstMessage.linkedinProfileURL && (
              <Button 
                variant="outline"
                onClick={() => handleOpenLink(firstMessage.linkedinProfileURL)}
              >
                LinkedIn Profile
              </Button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {thread.messages.map((message) => (
            <MessageGroup key={message.id} message={message} />
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-border bg-background p-4">
        <div className="flex gap-3">
          <div className="relative flex-grow">
            <Textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Write reply here..."
              className="min-h-[100px] resize-none border-0 focus-visible:ring-0 text-lg p-0 pr-28"
            />
            <Button
              variant="ghost"
              className="absolute right-0 top-0 gap-2 hover:bg-transparent text-muted-foreground hover:text-foreground"
              onClick={handleGenerateDraft}
              disabled={isGenerating}
            >
              <Wand2 className="h-5 w-5" />
              Generate
            </Button>
          </div>
          <div className="flex-shrink-0">
            <Button 
              size="icon"
              className="h-12 w-12 rounded-lg bg-muted hover:bg-muted/80"
              disabled={!reply.trim() || isSending}
              onClick={handleSend}
            >
              <svg 
                viewBox="0 0 24 24" 
                className="h-5 w-5" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d="M5 12H19M19 12L13 6M19 12L13 18" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
