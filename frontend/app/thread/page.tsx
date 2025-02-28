'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Wand2, LogOut, Expand, Shrink, Clipboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { format, formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { useAuth } from '@/app/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Footer } from '@/components/footer';

// Add the TextSnippet interface
interface TextSnippet {
  name: string;
  value: string;
}


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
  avatar?: string;
  chatId?: string;
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
    const response = await fetch('/api/proxy', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'x-endpoint': 'linkedout/generate-draft'
      },
      body: JSON.stringify(data)
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
  const isUrl = (text: string) => {
    const urlPattern = /https?:\/\/[^\s]+/g;
    return urlPattern.test(text);
  };

  const formatMessage = (content: string) => {
    if (!content) return '';
    
    // Split text into URLs and non-URLs
    const parts = content.split(/(https?:\/\/[^\s]+)/g);
    
    return parts.map((part, index) => {
      if (isUrl(part)) {
        return (
          <a 
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline break-all inline-block"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {part}
          </a>
        );
      }
      return <span key={index} className="break-words">{part}</span>;
    });
  };

  const isMe = message.isFromMe === "true";
  const initial = message.recipientName ? message.recipientName[0]?.toUpperCase() : '?';
  const date = message.lastUpdated ? new Date(message.lastUpdated) : new Date();

  return (
    <div className="flex gap-4 mb-8 group relative">
      <div className="flex-shrink-0">
        {isMe ? (
          <div className={cn(
            "w-14 h-14 rounded-full flex items-center justify-center text-xl font-medium border-2",
            "bg-primary text-primary-foreground border-primary"
          )}>
            Me
          </div>
        ) : (
          <img 
            src={message.avatar || ''}
            alt={message.recipientName}
            className="w-14 h-14 rounded-full border-2 border-border object-cover"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement!.innerHTML = `
                <div class="w-14 h-14 rounded-full flex items-center justify-center text-xl font-medium border-2 bg-background text-foreground border-border">
                  ${initial}
                </div>
              `;
            }}
          />
        )}
      </div>
      <div className="flex-grow space-y-1 min-w-0 pr-20">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-lg truncate">
            {isMe ? "You" : message.recipientName || 'Unknown'}
          </span>
          <span className="text-sm text-muted-foreground">
            {format(date, "MMM d, yyyy 'at' h:mm a")}
          </span>
        </div>
        <div className="text-base text-muted-foreground break-words whitespace-pre-line">
          {formatMessage(message.content || '')}
        </div>
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

// Add loading spinner component
function LoadingSpinner() {
  return (
    <div className="flex justify-center py-4">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-foreground"></div>
    </div>
  );
}

export default function ThreadPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [reply, setReply] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [thread, setThread] = useState<Thread | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token, isLoading: authLoading, logout } = useAuth();
  const { toast } = useToast();
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);


  // Add new state for text snippets
  const [snippets, setSnippets] = useState<TextSnippet[]>([]);
  const [isLoadingSnippets, setIsLoadingSnippets] = useState(false);
  const [snippetsError, setSnippetsError] = useState<string | null>(null);
  const [isSnippetsOpen, setIsSnippetsOpen] = useState(false);


  const threadId = searchParams?.get('id');


  // Add function to fetch text snippets
  const fetchTextSnippets = async () => {
    if (!token) return;
    
    setIsLoadingSnippets(true);
    setSnippetsError(null);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL}/webhook/linkedout/snippets`, {
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
        throw new Error('Failed to fetch text snippets');
      }
      
      const data = await response.json();
      setSnippets(data.textSnippets || []);
    } catch (error) {
      console.error('Error fetching text snippets:', error);
      setSnippetsError('Failed to load text snippets');
    } finally {
      setIsLoadingSnippets(false);
    }
  };
  
  // Function to insert snippet at cursor position or append to existing text
  const insertSnippet = (snippetValue: string) => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const selectionStart = textarea.selectionStart;
      const selectionEnd = textarea.selectionEnd;
      
      const newText = 
        reply.substring(0, selectionStart) + 
        snippetValue + 
        reply.substring(selectionEnd);
      
      setReply(newText);
      
      // Focus back on textarea after inserting snippet
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(
          selectionStart + snippetValue.length,
          selectionStart + snippetValue.length
        );
      }, 0);
    } else {
      // If textarea is not focused, append to the end
      setReply((prev) => {
        // Add a newline if there's already text and it doesn't end with one
        const separator = prev && !prev.endsWith('\n') ? '\n' : '';
        return prev + separator + snippetValue;
      });
    }
    
    // Close the popover after inserting
    setIsSnippetsOpen(false);
  };

  // Fetch snippets when component mounts
  useEffect(() => {
    if (token) {
      fetchTextSnippets();
    }
  }, [token]);


  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const fetchThread = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL}/webhook/threads?id=${threadId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401) {
        handleLogout();
        return Promise.resolve();
      }

      if (!response.ok) throw new Error('Failed to fetch thread');
      const data = await response.json();
      
      const transformedThread: Thread = {
        id: threadId!,
        messages: data
          .map((msg: any) => ({
            id: msg.id || threadId,
            content: msg.content,
            isFromMe: msg.isFromMe,
            lastUpdated: msg.lastUpdated,
            linkedinProfileURL: msg.linkedinProfileURL,
            recipientLinkedInFollowerCount: msg.recipientLinkedInFollowerCount,
            recipientName: msg.recipientName,
            avatar: msg.avatar,
            chatId: msg.chatId
          }))
          .sort((a: Message, b: Message) => new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime())
      };
      
      setThread(transformedThread);
      return Promise.resolve();
    } catch (err) {
      console.error('Thread fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load thread');
      return Promise.reject(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!threadId || !token) return;
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
      
      textareaRef.current?.scrollIntoView({ behavior: 'smooth' });
      textareaRef.current?.focus();
      
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSend = async () => {
    if (!reply.trim() || isSending) return;
    setIsSending(true);

    // Create optimistic message
    const optimisticMessage: Message = {
      id: Date.now().toString(),
      content: reply,
      isFromMe: "true",
      lastUpdated: new Date().toISOString(),
      linkedinProfileURL: thread?.messages[0]?.linkedinProfileURL || "",
      recipientLinkedInFollowerCount: thread?.messages[0]?.recipientLinkedInFollowerCount || "",
      recipientName: thread?.messages[0]?.recipientName || "",
      chatId: thread?.messages[0]?.chatId,
      avatar: thread?.messages[0]?.avatar
    };

    // Optimistically update UI
    setThread(prev => prev ? {
      ...prev,
      messages: [...prev.messages, optimisticMessage].sort(
        (a, b) => new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime()
      )
    } : null);

    try {
      // Send through proxy
      const response = await fetch('/api/proxy', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'x-endpoint': 'linkout_messages'
        },
        body: JSON.stringify({
          content: reply,
          threadId: threadId,
          chatId: thread?.messages[0]?.chatId,
        }),
      });

      if (response.status === 401) {
        handleLogout();
        return;
      }

      // N8N webhook call
      const n8nResponse = await fetch('/api/proxy', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'x-endpoint': 'linkedout/message',
        },
        body: JSON.stringify({
          message: reply,
          threadId: threadId,
          messageId: thread?.messages[0]?.id,
          chatId: thread?.messages[0]?.chatId,
          recipientName: thread?.messages[0]?.recipientName,
          linkedinProfileURL: thread?.messages[0]?.linkedinProfileURL,
        }),
      });

      if (!n8nResponse.ok) {
        throw new Error(`Failed to trigger workflow: ${n8nResponse.status}`);
      }

      setReply('');
      
      toast({
        title: "Message sent",
        description: "Your message has been sent successfully.",
      });

    } catch (error) {
      // Remove optimistic message on error
      setThread(prev => prev ? {
        ...prev,
        messages: prev.messages.filter(msg => msg.id !== optimisticMessage.id)
      } : null);

      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleOpenLink = (url: string) => {
    if (typeof window !== 'undefined') {
      window.open(url, '_blank');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [thread?.messages]);

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
      <div className="container mx-auto py-6 max-w-4xl flex flex-col min-h-screen">
        <div className="flex-grow">
          <div className="text-destructive p-4 rounded-lg border border-destructive/50">
            {error}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="container mx-auto py-6 max-w-4xl flex flex-col min-h-screen">
        <div className="flex-grow">
          <div className="text-muted-foreground p-4 text-center">
            Thread not found
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const firstMessage = thread.messages[0];

  if (!firstMessage) {
    return (
      <div className="container mx-auto py-6 max-w-4xl flex flex-col min-h-screen">
        <div className="flex-grow">
          <div className="text-muted-foreground p-4 text-center">
            No messages in thread
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="container mx-auto py-4 max-w-4xl flex flex-col h-[calc(100vh-48px)] flex-grow">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            className="gap-2"
            onClick={() => router.push('/inbox')}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
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
        
        <div className="border border-border rounded-lg bg-background flex flex-col flex-1 min-h-0">
        <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-4">
              <img 
                src={firstMessage.avatar || ''}
                alt={firstMessage.recipientName}
                className="w-16 h-16 rounded-full border-4 border-border object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.innerHTML = `
                    <div class="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-2xl font-medium">
                      ${firstMessage.recipientName?.[0]?.toUpperCase()}
                    </div>
                  `;
                }}
              />
              <div>
                <h2 className="text-xl font-semibold">{firstMessage.recipientName || 'Unknown'}</h2>
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                  <span>{firstMessage.recipientLinkedInFollowerCount} followers</span>
                  {firstMessage.linkedinProfileURL && (
                    <Button 
                      variant="link"
                      className="p-0 h-auto font-normal"
                      onClick={() => handleOpenLink(firstMessage.linkedinProfileURL)}
                    >
                      View LinkedIn profile
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto min-h-0">
            <div className="p-6 space-y-6">
              {thread.messages.map((message) => (
                <MessageGroup 
                  key={message.id} 
                  message={message} 
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-border bg-background p-4">
          <div className="flex flex-col gap-4">
            <div className="relative flex-grow">
              <Textarea
                ref={textareaRef}
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Write your reply..."
                className={cn(
                  "w-full resize-none p-4 pr-28 text-base transition-all duration-200",
                  isExpanded ? "min-h-[500px]" : "min-h-[100px]"
                )}
                disabled={isSending}
              />
              <div className="absolute top-3 right-3 flex gap-2 z-10">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-muted-foreground hover:text-foreground hover:bg-muted/50 bg-background"
                >
                  {isExpanded ? (
                    <Shrink className="h-5 w-5" />
                  ) : (
                    <Expand className="h-5 w-5" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleGenerateDraft}
                  disabled={isGenerating}
                  className="text-muted-foreground hover:text-foreground hover:bg-muted/50 bg-background"
                >
                  <Wand2 className="h-5 w-5 text-foreground" />
                </Button>
              </div>
            </div>

            <div className="flex justify-between items-center">
              {/* Text Snippets Button and Popover - moved outside textarea */}
              <Popover open={isSnippetsOpen} onOpenChange={setIsSnippetsOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="lg"
                    className="gap-2 text-muted-foreground hover:text-foreground"
                    onClick={() => {
                      if (!snippets.length && !isLoadingSnippets) {
                        fetchTextSnippets();
                      }
                    }}
                  >
                    <Clipboard className="h-4 w-4" />
                    Text Snippets
                  </Button>
                </PopoverTrigger>
                <PopoverContent 
                  className="w-80 p-0" 
                  align="start"
                  side="top"
                  alignOffset={-50}
                  sideOffset={10}
                >
                  <div className="py-2">
                    <h3 className="font-medium px-4 py-2 border-b">Text Snippets</h3>
                    
                    {isLoadingSnippets ? (
                      <div className="p-4 text-center">
                        <LoadingSpinner />
                      </div>
                    ) : snippetsError ? (
                      <div className="p-4 text-center text-destructive">
                        {snippetsError}
                      </div>
                    ) : snippets.length === 0 ? (
                      <div className="p-4 text-center text-muted-foreground">
                        No text snippets, set them in Pocketbase
                      </div>
                    ) : (
                      <ScrollArea className="max-h-[calc(6*42px)]">
                        <div className="py-1">
                          {snippets.map((snippet, index) => (
                            <button
                              key={index}
                              className="w-full text-left px-4 py-2 text-sm hover:bg-muted/50 focus:bg-muted/50 focus:outline-none truncate"
                              onClick={() => insertSnippet(snippet.value)}
                            >
                              {snippet.name}
                            </button>
                          ))}
                        </div>
                      </ScrollArea>
                    )}
                  </div>
                </PopoverContent>
              </Popover>

              <Button 
                size="lg"
                className="px-4 gap-2"
                disabled={!reply.trim() || isSending}
                onClick={handleSend}
              >
                Send
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
      <Footer />
    </div>
  );
}
