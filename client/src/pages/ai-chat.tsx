import ChatInterface from "@/components/chatbot/ChatInterface";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const AiChat = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Medical Assistant</h1>
      <p className="text-gray-600 mb-8">
        Chat with our AI-powered medical assistant to get answers to your health questions.
        Responses are based on scientific medical information from trusted sources.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card className="h-[70vh]">
            <CardContent className="p-0 h-full">
              <ChatInterface />
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>About the AI Assistant</CardTitle>
              <CardDescription>
                How our AI medical assistant works
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                Our AI assistant is powered by advanced natural language processing and trained on
                extensive medical knowledge from peer-reviewed sources.
              </p>
              <p className="text-sm text-gray-600">
                While it can provide evidence-based information, it is not a substitute for
                professional medical advice, diagnosis, or treatment.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Sample Questions</CardTitle>
              <CardDescription>
                Try asking about these topics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• What are the common symptoms of diabetes?</li>
                <li>• How does hypertension affect the body?</li>
                <li>• What are effective ways to prevent heart disease?</li>
                <li>• What causes migraine headaches?</li>
                <li>• How is pneumonia diagnosed and treated?</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AiChat;
