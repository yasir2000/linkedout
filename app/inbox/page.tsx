'use client';

import { cn } from "@/lib/utils";
import { InboxIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface Message {
  id: string;
  author: string;
  content: string;
  category: string;
  lastUpdated: string;
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

export default function InboxPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch('https://n8n-zjrvqodz.cloud-station.app/webhook/linkout_messages');
        if (!response.ok) throw new Error('Failed to fetch messages');
        const data = await response.json();
        setMessages(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load messages');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, []);

  if (isLoading) return null;
  if (error) return <div className="text-destructive p-4">{error}</div>;

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-4">Unanswered messages</h1>
      {messages.length > 0 ? (
        <div className="border border-border rounded-lg divide-y divide-border">
          {messages.map((message, index) => (
            <div 
              key={message.id}
              className={cn(
                "p-3 hover:bg-muted/10 transition-colors cursor-pointer",
                "flex items-start gap-4"
              )}
            >
              <div className="flex-shrink-0 w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-sm font-medium">
                {index + 1}
              </div>
              <div className="flex-grow min-w-0 flex items-start justify-between gap-4">
                <div className="min-w-0 flex-grow">
                  <h2 className="font-semibold truncate">{message.author}</h2>
                  <p className="text-muted-foreground text-sm line-clamp-1">
                    {message.content}
                  </p>
                </div>
                {message.category && (
                  <div className="flex-shrink-0 rounded-md bg-muted/10 px-2 py-1 text-xs">
                    {message.category}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}
