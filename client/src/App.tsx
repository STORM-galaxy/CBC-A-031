import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import ChatButton from "@/components/layout/ChatButton";

import Home from "@/pages/home";
import DiseaseDatabase from "@/pages/disease-database";
import DiseaseDetails from "@/pages/disease-details";
import SymptomChecker from "@/pages/symptom-checker";
import AiChat from "@/pages/ai-chat";
import MedicalNews from "@/pages/medical-news";
import Resources from "@/pages/resources";
import FindDoctors from "@/pages/find-doctors";
import NotFound from "@/pages/not-found";

import { useState } from "react";

function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/disease-database" component={DiseaseDatabase} />
            <Route path="/disease/:id" component={DiseaseDetails} />
            <Route path="/symptom-checker" component={SymptomChecker} />
            <Route path="/ai-chat" component={AiChat} />
            <Route path="/medical-news" component={MedicalNews} />
            <Route path="/resources" component={Resources} />
            <Route path="/find-doctors" component={FindDoctors} />
            <Route component={NotFound} />
          </Switch>
        </main>

        <ChatButton />
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AppContent />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
