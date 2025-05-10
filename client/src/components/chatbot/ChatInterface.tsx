import { useState, useRef, useEffect } from "react";
import { useChat } from "@/lib/hooks/useChat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, X } from "lucide-react";

interface ChatInterfaceProps {
  onClose?: () => void;
}

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: Date;
}

const ChatInterface = ({ onClose }: ChatInterfaceProps) => {
  const { sendMessage, messages, isLoading } = useChat();
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      sendMessage(inputValue);
      setInputValue("");
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center">
          <Avatar className="h-8 w-8 mr-2">
            <AvatarImage src="https://images.unsplash.com/photo-1507146153580-69a1fe6d8aa1?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" alt="AI" />
            <AvatarFallback>AI</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">MedScience AI Assistant</h3>
            <p className="text-xs text-gray-500">Ask me about medical conditions</p>
          </div>
        </div>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        )}
      </div>

      {/* Chat messages */}
      <ScrollArea className="flex-1 p-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <h3 className="text-lg font-medium mb-2">Welcome to MedScience AI</h3>
            <p className="text-gray-500 text-sm mb-4">
              I can answer questions about medical conditions, symptoms, treatments, and more.
            </p>
            <div className="grid grid-cols-1 gap-2 w-full max-w-sm">
              <Button 
                variant="outline" 
                className="justify-start"
                onClick={() => sendMessage("What are common symptoms of diabetes?")}
              >
                What are common symptoms of diabetes?
              </Button>
              <Button 
                variant="outline" 
                className="justify-start"
                onClick={() => sendMessage("How can I prevent heart disease?")}
              >
                How can I prevent heart disease?
              </Button>
              <Button 
                variant="outline" 
                className="justify-start"
                onClick={() => sendMessage("What causes migraines?")}
              >
                What causes migraines?
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div 
                key={index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div 
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === "user" 
                      ? "bg-primary text-white rounded-br-none" 
                      : "bg-gray-100 text-gray-800 rounded-bl-none"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <div 
                    className={`text-xs mt-1 ${
                      message.role === "user" ? "text-primary-100" : "text-gray-500"
                    }`}
                  >
                    {message.timestamp && new Date(message.timestamp).toLocaleTimeString([], { 
                      hour: "2-digit", 
                      minute: "2-digit" 
                    })}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </ScrollArea>

      {/* Input form */}
      <form onSubmit={handleSubmit} className="border-t p-4 flex items-center">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type your medical question..."
          className="flex-1 mr-2"
          disabled={isLoading}
        />
        <Button type="submit" size="icon" disabled={isLoading}>
          <Send className="h-4 w-4" />
          <span className="sr-only">Send</span>
        </Button>
      </form>
    </div>
  );
};

export default ChatInterface;
