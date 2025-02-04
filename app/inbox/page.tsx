'use client';

import { cn } from "@/lib/utils";
import { InboxIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Message {
  id: number;
  author: string;
  content: string;
  category: string;
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
  const messages: Message[] = [
    {
      id: 547,
      author: "Oumnya Benhassou",
      content: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim...",
      category: "category 1"
    },
    {
      id: 235,
      author: "Maxym Tkacz",
      content: "Hey Max, I love your content! Mainly because I am you!",
      category: "simple thanks"
    },
    {
      id: 986,
      author: "Luis Guzman",
      content: "Max, WTF are you doing in Dubai? Stop spending my money!",
      category: "other"
    },
    {
      id: 432,
      author: "Sarah Chen",
      content: "Could you review my latest pull request? I've implemented the new feature we discussed in the last meeting.",
      category: "work"
    },
    {
      id: 876,
      author: "James Wilson",
      content: "Thanks for the amazing presentation yesterday! The client was really impressed with the design direction.",
      category: "feedback"
    },
    {
      id: 345,
      author: "Elena Rodriguez",
      content: "Quick question about the API documentation - are we supporting websockets in the new version?",
      category: "technical"
    },
    {
      id: 654,
      author: "Ahmed Hassan",
      content: "The deployment failed on staging. I've attached the error logs. Can you take a look when you have a moment?",
      category: "urgent"
    },
    {
      id: 234,
      author: "Marie Dubois",
      content: "Just wanted to say that the new dashboard design is absolutely fantastic! Great work!",
      category: "simple thanks"
    },
    {
      id: 789,
      author: "Thomas Schmidt",
      content: "We need to schedule a meeting to discuss the Q4 roadmap. When are you available next week?",
      category: "planning"
    },
    {
      id: 543,
      author: "Lisa Wong",
      content: "The client reported a bug in the payment processing module. Priority is high on this one.",
      category: "urgent"
    },
    {
      id: 321,
      author: "Alex Morgan",
      content: "Can we sync up about the new marketing campaign? I have some ideas I'd like to run by you.",
      category: "marketing"
    },
    {
      id: 765,
      author: "David Kim",
      content: "The latest analytics report shows a 25% increase in user engagement. Great news!",
      category: "analytics"
    },
    {
      id: 890,
      author: "Emma Thompson",
      content: "Need your approval on the new brand guidelines before we send them to the client.",
      category: "design"
    }
  ];

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
                <div className="flex-shrink-0 rounded-md bg-muted/10 px-2 py-1 text-xs">
                  {message.category}
                </div>
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
