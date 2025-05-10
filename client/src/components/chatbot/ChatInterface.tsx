import { useState, useRef, useEffect } from "react";
import { useChat } from "@/lib/hooks/useChat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Send, X, RefreshCw, Copy, Brain, Stethoscope, Shield, BookOpen } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import ReactMarkdown from 'react-markdown';

interface ChatInterfaceProps {
  onClose?: () => void;
}

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: Date;
}

interface SuggestedTopic {
  title: string;
  questions: string[];
  icon: JSX.Element;
  description: string;
}

const ChatInterface = ({ onClose }: ChatInterfaceProps) => {
  const { sendMessage, messages, clearMessages, isLoading } = useChat();
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState("chat");

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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const suggestedTopics: SuggestedTopic[] = [
    {
      title: "Disease Information",
      icon: <Brain className="h-5 w-5 text-primary" />,
      description: "Get detailed information about specific diseases and medical conditions",
      questions: [
        "What are the latest treatments for Alzheimer's disease?",
        "Explain the pathophysiology of Type 2 Diabetes",
        "What's the difference between Crohn's disease and ulcerative colitis?",
        "Tell me about recent research on multiple sclerosis"
      ]
    },
    {
      title: "Symptom Analysis",
      icon: <Stethoscope className="h-5 w-5 text-amber-500" />,
      description: "Understand symptoms and when to seek medical attention",
      questions: [
        "What could cause persistent headaches and fatigue?",
        "When should I be concerned about chest pain?",
        "What are the early warning signs of a stroke?",
        "What symptoms indicate a serious allergic reaction?"
      ]
    },
    {
      title: "Preventive Health",
      icon: <Shield className="h-5 w-5 text-green-600" />,
      description: "Learn about prevention strategies and healthy lifestyle choices",
      questions: [
        "How can I lower my risk of cardiovascular disease?",
        "What preventive screenings are recommended for my age?",
        "What dietary changes can help prevent hypertension?",
        "What exercises are best for joint health?"
      ]
    },
    {
      title: "Medical Resources",
      icon: <BookOpen className="h-5 w-5 text-blue-500" />,
      description: "Find reliable medical resources and information",
      questions: [
        "What are the most reputable medical journals?",
        "Recommend reliable sources for patient education about diabetes",
        "What resources exist for caregivers of Alzheimer's patients?",
        "Recommend medical apps for tracking health metrics"
      ]
    }
  ];

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-xl">
      {/* Chat header */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-600 to-primary text-white rounded-t-lg">
        <div className="flex items-center">
          <Avatar className="h-10 w-10 mr-3 border-2 border-white">
            <AvatarImage src="https://images.unsplash.com/photo-1507146153580-69a1fe6d8aa1?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" alt="AI" />
            <AvatarFallback className="bg-blue-800 text-white">AI</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-bold text-lg">MedScience AI Assistant</h3>
            <div className="flex items-center">
              <Badge variant="secondary" className="text-xs bg-white/20 hover:bg-white/30 text-white mr-2">
                GPT-4o
              </Badge>
              <p className="text-xs text-blue-100">Medical knowledge updated to May 2025</p>
            </div>
          </div>
        </div>
        <div className="flex space-x-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-white hover:bg-white/20"
                  onClick={clearMessages}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>New Conversation</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {onClose && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          )}
        </div>
      </div>

      {/* Tabs navigation */}
      <Tabs defaultValue="chat" value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="mx-4 mt-2 bg-gray-100 p-1">
          <TabsTrigger value="chat" className="flex-1">Chat</TabsTrigger>
          <TabsTrigger value="topics" className="flex-1">Suggested Topics</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="flex-1 flex flex-col data-[state=active]:flex-1">
          {/* Chat messages */}
          <ScrollArea className="flex-1 p-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-primary to-blue-700 bg-clip-text text-transparent">Welcome to MedScience AI</h3>
                <p className="text-gray-600 mb-6 max-w-md">
                  I'm your comprehensive medical information assistant. Ask me about diseases, symptoms, treatments, or any medical topic you're curious about.
                </p>
                <div className="grid grid-cols-1 gap-2 w-full max-w-md">
                  <Button 
                    variant="outline" 
                    className="justify-start text-left h-auto py-3"
                    onClick={() => sendMessage("Tell me about the latest advances in cancer treatment")}
                  >
                    <div>
                      <span className="font-medium">Tell me about the latest advances in cancer treatment</span>
                      <p className="text-xs text-gray-500 mt-1">Learn about cutting-edge oncology research and therapies</p>
                    </div>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="justify-start text-left h-auto py-3"
                    onClick={() => sendMessage("What are the early warning signs of diabetes and how is it diagnosed?")}
                  >
                    <div>
                      <span className="font-medium">What are the early warning signs of diabetes and how is it diagnosed?</span>
                      <p className="text-xs text-gray-500 mt-1">Understand symptoms, risk factors, and diagnostic criteria</p>
                    </div>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="justify-start text-left h-auto py-3"
                    onClick={() => sendMessage("Explain how mRNA vaccines work and their advantages")}
                  >
                    <div>
                      <span className="font-medium">Explain how mRNA vaccines work and their advantages</span>
                      <p className="text-xs text-gray-500 mt-1">Learn about this innovative vaccine technology</p>
                    </div>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {messages.map((message, index) => (
                  <div 
                    key={index}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {message.role !== "user" && (
                      <Avatar className="h-8 w-8 mr-2 mt-1 flex-shrink-0">
                        <AvatarImage src="https://images.unsplash.com/photo-1507146153580-69a1fe6d8aa1?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" alt="AI" />
                        <AvatarFallback className="bg-primary text-white">AI</AvatarFallback>
                      </Avatar>
                    )}
                    <div 
                      className={`relative group max-w-[85%] p-3 rounded-lg shadow-sm ${
                        message.role === "user" 
                          ? "bg-primary text-white rounded-br-none ml-4" 
                          : "bg-gray-100 text-gray-800 rounded-bl-none mr-4"
                      }`}
                    >
                      {message.role === "assistant" && (
                        <div className="absolute -right-10 top-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => copyToClipboard(message.content)}
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Copy response</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      )}

                      <div className="prose prose-sm max-w-none dark:prose-invert">
                        {message.role === "assistant" ? (
                          <ReactMarkdown>
                            {message.content}
                          </ReactMarkdown>
                        ) : (
                          <p>{message.content}</p>
                        )}
                      </div>
                      
                      <div 
                        className={`text-xs mt-2 ${
                          message.role === "user" ? "text-blue-100" : "text-gray-500"
                        }`}
                      >
                        {message.timestamp && new Date(message.timestamp).toLocaleTimeString([], { 
                          hour: "2-digit", 
                          minute: "2-digit" 
                        })}
                      </div>
                    </div>
                    {message.role === "user" && (
                      <Avatar className="h-8 w-8 ml-2 mt-1 flex-shrink-0">
                        <AvatarImage src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150" alt="User" />
                        <AvatarFallback className="bg-gray-200">U</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>

          {/* Input form */}
          <form onSubmit={handleSubmit} className="border-t p-4 bg-white">
            <div className="flex items-center rounded-lg border bg-gray-50 focus-within:ring-1 focus-within:ring-primary focus-within:border-primary overflow-hidden">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={isLoading ? "AI is thinking..." : "Type your medical question..."}
                className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                disabled={isLoading}
              />
              <Button 
                type="submit" 
                size="sm" 
                disabled={isLoading} 
                variant="ghost"
                className={`h-10 px-3 mx-1 ${isLoading ? 'opacity-50' : 'text-primary hover:text-primary hover:bg-gray-100'}`}
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              MedScience AI provides information, not medical advice. Always consult healthcare professionals.
            </p>
          </form>
        </TabsContent>

        <TabsContent value="topics" className="flex-1 p-4 data-[state=active]:flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {suggestedTopics.map((topic, index) => (
              <div key={index} className="border rounded-lg p-4 shadow-sm">
                <div className="flex items-center mb-3">
                  {topic.icon}
                  <h3 className="font-bold ml-2">{topic.title}</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">{topic.description}</p>
                <div className="space-y-2">
                  {topic.questions.map((question, qIndex) => (
                    <Button 
                      key={qIndex}
                      variant="outline" 
                      size="sm"
                      className="w-full justify-start text-left h-auto py-2 text-sm hover:bg-gray-100"
                      onClick={() => {
                        sendMessage(question);
                        setActiveTab("chat");
                      }}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ChatInterface;
