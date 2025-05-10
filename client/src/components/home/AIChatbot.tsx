import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const AIChatbot = () => {
  return (
    <section className="mb-12">
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-xl shadow-sm overflow-hidden">
        <div className="p-8 md:p-12 flex flex-col md:flex-row items-center">
          <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">AI Medical Assistant</h2>
            <p className="text-primary-100 mb-6">Get instant answers to your medical questions from our AI assistant. Powered by the latest medical research and clinical guidelines.</p>
            <div className="bg-white bg-opacity-10 rounded-lg p-4 mb-6 border border-primary-400 border-opacity-20">
              <p className="text-white italic">"What are the early symptoms of diabetes that I should watch for?"</p>
            </div>
            <Button asChild variant="secondary" size="lg" className="inline-flex justify-center items-center px-6 py-3 text-primary-700 bg-white hover:bg-primary-50">
              <Link href="/ai-chat">
                Start Conversation
              </Link>
            </Button>
          </div>
          <div className="md:w-1/3">
            {/* A futuristic AI or virtual assistant interface visualization */}
            <img 
              src="https://images.unsplash.com/photo-1507146153580-69a1fe6d8aa1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500" 
              alt="AI Medical Assistant" 
              className="w-full rounded-xl shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIChatbot;
