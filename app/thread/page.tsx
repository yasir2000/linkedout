'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ArrowLeft, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { format, formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface Author {
  id: string;
  name: string;
  followers?: number;
  linkedinUrl: string;
  threadUrl: string;
  avatarUrl?: string;
}

interface Message {
  id: string;
  author: Author;
  content: string;
  timestamp: Date;
}

interface Thread {
  id: string;
  messages: Message[];
}

async function generateDraft(data: {
  toFullName: string;
  messageToReplyTo: string;
  messageCategory: string;
}): Promise<{ draftReply: string }> {
  try {
    const response = await fetch('https://n8n-zjrvqodz.cloud-station.app/webhook/linkedout/generate-draft', {
      method: 'POST',
      headers: {
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
  const isRecent = Date.now() - message.timestamp.getTime() < 24 * 60 * 60 * 1000;
  
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Avatar author={message.author} />
        <span className="font-semibold">{message.author.name}</span>
      </div>
      <p className="text-muted-foreground pl-10 whitespace-pre-wrap">
        {message.content}
      </p>
      <div className="pl-10 text-sm text-muted-foreground">
        {isRecent 
          ? `Sent ${formatDistanceToNow(message.timestamp)} ago`
          : `Sent ${format(message.timestamp, "HH:mm 'on' dd MMMM, yyyy")}`
        }
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

  useEffect(() => {
    setMounted(true);
  }, []);

  const threadId = searchParams?.get('id');

  // Mock thread data
  const thread: Thread = {
    id: '1234',
    messages: [
      {
        id: '1',
        author: {
          id: '1',
          name: 'Maxym Tkacz',
          followers: 3500,
          linkedinUrl: 'https://linkedin.com/in/maxymtkacz',
          threadUrl: '#'
        },
        content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        timestamp: new Date(2025, 1, 12, 11, 56)
      },
      {
        id: '2',
        author: {
          id: '2',
          name: 'Luis Guzman',
          linkedinUrl: 'https://linkedin.com/in/luisguzman',
          threadUrl: '#'
        },
        content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n\nUt enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        timestamp: new Date(2025, 1, 12, 11, 58)
      }
    ]
  };

  const handleGenerateDraft = async () => {
    setIsGenerating(true);
    try {
      const lastMessage = thread.messages[thread.messages.length - 1];
      
      const draftResponse = await generateDraft({
        toFullName: lastMessage.author.name,
        messageToReplyTo: lastMessage.content,
        messageCategory: 'love-your-content'
      });
      
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

  if (!threadId || !thread) {
    router.push('/inbox');
    return null;
  }

  const firstMessage = thread.messages[0];

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
            <h2 className="text-xl font-semibold">{firstMessage.author.name}</h2>
            {firstMessage.author.followers && (
              <span className="px-2 py-1 text-sm bg-secondary rounded-md">
                {(firstMessage.author.followers / 1000).toFixed(1)}k
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline"
              onClick={() => handleOpenLink(firstMessage.author.linkedinUrl)}
            >
              LinkedIn Profile
            </Button>
            <Button 
              variant="outline"
              onClick={() => handleOpenLink(firstMessage.author.threadUrl)}
            >
              Open Thread
            </Button>
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
