'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { ArrowLeft, Send, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { format, formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface Author {
  id: string;
  name: string;
  avatarUrl?: string;
  followers?: number;
  linkedinUrl?: string;
  threadUrl?: string;
}

interface Message {
  id: string;
  content: string;
  timestamp: Date;
  author: Author;
}

interface Thread {
  id: string;
  messages: Message[];
}

// Helper to generate consistent colors from string
function stringToColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hash % 360;
  return `hsl(${hue}, 65%, 25%)`; // Dark mode friendly
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
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

  return (
    <div 
      className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium text-primary-foreground"
      style={{ backgroundColor: stringToColor(author.name) }}
    >
      {getInitials(author.name)}
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

export default function ThreadPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const threadId = searchParams.get('id');
  const [reply, setReply] = useState('');

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
          linkedinUrl: '#',
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
          linkedinUrl: '#',
          threadUrl: '#'
        },
        content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n\nUt enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        timestamp: new Date(2025, 1, 12, 11, 58)
      }
    ]
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      // Handle send
    }
  };

  if (!threadId || !thread) {
    router.push('/inbox');
    return null;
  }

  const firstMessage = thread.messages[0];

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      {/* Header */}
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
        {/* Thread Header */}
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
            <Button variant="outline">LinkedIn Profile</Button>
            <Button variant="outline">Open Thread</Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {thread.messages.map((message) => (
            <MessageGroup key={message.id} message={message} />
          ))}
        </div>

        {/* Reply Box */}
        <div className="border-t border-border p-4">
          <div className="flex gap-2">
            <Textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Write reply here..."
              className="min-h-[80px] resize-none"
            />
            <Button 
              className="self-end"
              disabled={!reply.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
