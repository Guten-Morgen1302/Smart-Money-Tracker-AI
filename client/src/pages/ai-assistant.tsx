import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { apiRequest } from '@/lib/queryClient';
import Header from '@/components/header';
import { useToast } from '@/hooks/use-toast';

type Message = {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

export default function AIAssistant() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your Smart Money Tracker AI assistant. I can help you analyze cryptocurrency trends, wallet information, and market insights. How can I assist you today?',
      timestamp: new Date()
    }
  ]);
  
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) return;
    
    // Add user message to chat
    const userMessage: Message = {
      role: 'user',
      content: query,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      // Send query to AI agent API
      const response = await fetch('/api/ai/query', {
        method: 'POST',
        body: JSON.stringify({ query }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        throw new Error('Invalid JSON response from server');
      }
      
      // Add AI response to chat
      if (data && data.choices && data.choices[0]) {
        const aiMessage: Message = {
          role: 'assistant',
          content: data.choices[0].message.content,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        toast({
          title: "Error",
          description: "Received an invalid response from the AI agent",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to get response from AI agent",
        variant: "destructive"
      });
      
      // Add error message to chat
      const errorMessage: Message = {
        role: 'assistant',
        content: "I'm sorry, I encountered an error processing your request. Please try again.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setQuery('');
    }
  };
  
  // Format timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div className="pt-16 pb-4 px-4 h-screen flex flex-col">
      <Header title="AI" highlight="Assistant" />
      
      <div className="flex-1 overflow-hidden flex flex-col mb-4">
        <div className="mb-4">
          <Button 
            onClick={() => window.history.back()} 
            variant="outline"
            className="border-cyan-400/30 text-white hover:bg-white/5"
          >
            <i className="ri-arrow-left-line mr-2"></i>
            Back to Dashboard
          </Button>
        </div>
        
        <Card className="flex-1 bg-[#0A0A12] border-white/5 flex flex-col overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="w-8 h-8 rounded-full bg-cyan-400/20 flex items-center justify-center">
                <i className="ri-robot-line text-cyan-400"></i>
              </div>
              Crypto Intelligence Agent
            </CardTitle>
            <CardDescription>
              Ask questions about crypto markets, wallets, and transactions
            </CardDescription>
          </CardHeader>
          
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] lg:max-w-[70%] rounded-xl px-4 py-2 ${
                      message.role === 'user' 
                        ? 'bg-gradient-to-r from-purple-500/30 to-cyan-500/30 border border-cyan-500/20 text-white' 
                        : 'bg-[#111122] border border-gray-700/30 text-gray-100'
                    }`}
                  >
                    <div className="text-xs text-gray-400 pb-1">
                      {message.role === 'user' ? 'You' : 'AI Assistant'} • {formatTime(message.timestamp)}
                    </div>
                    <div className="whitespace-pre-wrap">
                      {message.content}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>
          
          <CardFooter className="border-t border-white/5 p-4">
            <form onSubmit={handleSubmit} className="w-full flex gap-2">
              <Input
                placeholder="Ask about market trends, wallet analysis, or transaction insights..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={isLoading}
                className="flex-1 bg-[#121225] border-gray-700/50 focus:border-cyan-500/50"
              />
              <Button 
                type="submit" 
                disabled={isLoading || !query.trim()}
                className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white/10 border-t-white rounded-full animate-spin mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  <>
                    <i className="ri-send-plane-line mr-1"></i>
                    Send
                  </>
                )}
              </Button>
            </form>
          </CardFooter>
        </Card>
      </div>
      
      <div className="text-center text-xs text-gray-500 mt-2">
        <p>AI powered by OpenServ SDK | Responses are generated in real-time based on available data</p>
      </div>
    </div>
  );
}
