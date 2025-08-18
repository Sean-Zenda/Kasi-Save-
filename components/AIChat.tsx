import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, MessageCircle, Send, Bot, User } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { ScrollArea } from './ui/scroll-area';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface User {
  name?: string;
  totalSaved: number;
  goal: {
    name: string;
    amount: number;
    saved: number;
  };
  streak: number;
}

interface AIChatProps {
  user: User;
  onBack: () => void;
}

export const AIChat = ({ user, onBack }: AIChatProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: `Hi ${user.name || 'there'}! 👋 I'm your AI savings coach. I can help you with savings tips, answer questions about your goals, or just chat about your financial journey. What would you like to know?`,
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Simple rule-based responses for demo
    if (lowerMessage.includes('goal') || lowerMessage.includes('target')) {
      const progress = user.goal.amount > 0 ? (user.goal.saved / user.goal.amount) * 100 : 0;
      return `Great question about your ${user.goal.name}! You're currently ${progress.toFixed(1)}% towards your R${user.goal.amount.toLocaleString()} goal. You've saved R${user.goal.saved.toLocaleString()} so far. ${progress < 50 ? 'Consider setting up weekly deposits to build momentum!' : 'You\'re doing amazing! Keep up the consistency.'}`;
    }
    
    if (lowerMessage.includes('save') || lowerMessage.includes('saving')) {
      return `Here are some saving tips for you:\n\n• Try the 50/30/20 rule: 50% needs, 30% wants, 20% savings\n• Round up purchases and save the change\n• Set up automatic weekly deposits\n• Track your expenses to find areas to cut back\n\nWith your current R${user.totalSaved.toLocaleString()} saved, you're on a great path!`;
    }
    
    if (lowerMessage.includes('budget') || lowerMessage.includes('money')) {
      return `Budgeting is key to successful saving! Start by tracking your income and expenses for a week. Then categorize them into needs vs wants. This will help you see where you can save more for your ${user.goal.name}.`;
    }
    
    if (lowerMessage.includes('emergency') || lowerMessage.includes('fund')) {
      return `An emergency fund is crucial! Aim for 3-6 months of expenses. Start small - even R50 per week adds up. Since you have R${user.totalSaved.toLocaleString()} saved, you're already building a good foundation!`;
    }
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return `Hello! 😊 I'm here to help you on your savings journey. You can ask me about budgeting, saving strategies, or anything related to your financial goals. What's on your mind today?`;
    }
    
    if (lowerMessage.includes('streak') || lowerMessage.includes('consistency')) {
      return `Your ${user.streak}-day saving streak is fantastic! 🔥 Consistency is the key to reaching your goals. Even small daily amounts make a big difference over time.`;
    }
    
    if (lowerMessage.includes('help') || lowerMessage.includes('?')) {
      return `I'm here to help! I can assist you with:\n\n• Saving strategies and tips\n• Budget planning advice\n• Goal setting guidance\n• Progress tracking insights\n• General financial questions\n\nWhat specific area would you like help with?`;
    }
    
    // Default responses
    const defaultResponses = [
      `That's a great question! Based on your current savings of R${user.totalSaved.toLocaleString()}, I'd suggest focusing on consistent small deposits to build momentum.`,
      `Interesting point! Remember, every small step counts towards your ${user.goal.name}. What specific aspect would you like to explore further?`,
      `I'd love to help you with that! Your savings journey is unique, and with R${user.totalSaved.toLocaleString()} already saved, you're off to a good start.`,
      `That's something many savers think about! Consider breaking it down into smaller, manageable steps. What feels most achievable for you right now?`
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI thinking time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      content: generateAIResponse(inputMessage),
      sender: 'ai',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiResponse]);
    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickQuestions = [
    "How can I save more money?",
    "Tips for my emergency fund?",
    "How to stay motivated?",
    "Budget planning help?"
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-card p-6 border-b border-border">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-medium">AI Savings Coach</h1>
              <p className="text-sm text-muted-foreground">
                {isTyping ? 'AI is typing...' : 'Online'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4 max-w-3xl mx-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.sender === 'ai' && (
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
              )}
              
              <Card className={`p-3 max-w-[80%] ${
                message.sender === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-card'
              }`}>
                <p className="text-sm whitespace-pre-line">{message.content}</p>
                <p className={`text-xs mt-1 opacity-70 ${
                  message.sender === 'user' ? 'text-primary-foreground' : 'text-muted-foreground'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </Card>

              {message.sender === 'user' && (
                <div className="w-8 h-8 bg-secondary/50 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-foreground" />
                </div>
              )}
            </div>
          ))}
          
          {isTyping && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-primary" />
              </div>
              <Card className="p-3 bg-card">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </Card>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Quick Questions */}
      {messages.length === 1 && (
        <div className="p-4 border-t border-border">
          <p className="text-sm text-muted-foreground mb-3 text-center">Quick questions to get started:</p>
          <div className="flex flex-wrap gap-2 justify-center max-w-3xl mx-auto">
            {quickQuestions.map((question) => (
              <Button
                key={question}
                variant="outline"
                size="sm"
                onClick={() => setInputMessage(question)}
                className="text-xs"
              >
                {question}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2 max-w-3xl mx-auto">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me about saving, budgeting, or your goals..."
            className="flex-1"
            disabled={isTyping}
          />
          <Button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isTyping}
            size="icon"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};