import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface UserInfo {
  age?: number;
  gender?: string;
  medicalHistory?: string[];
}

interface PossibleCondition {
  name: string;
  probability: string;
  description: string;
  whenToSeekCare: string;
}

interface AnalysisResult {
  possibleConditions: PossibleCondition[];
  disclaimer: string;
}

export const useSymptomChecker = () => {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const analyzeSymptoms = async (symptoms: string[], userInfo?: UserInfo) => {
    if (!symptoms.length) {
      toast({
        title: "Error",
        description: "Please select at least one symptom.",
        variant: "destructive"
      });
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      const response = await apiRequest(
        "POST", 
        "/api/symptom-check", 
        { symptoms, userInfo }
      );
      
      const data: AnalysisResult = await response.json();
      setResult(data);
      
      // Switch to results tab if it exists
      const resultsTab = document.querySelector('[data-value="results"]');
      if (resultsTab) {
        (resultsTab as HTMLElement).click();
      }
    } catch (error) {
      console.error("Error analyzing symptoms:", error);
      toast({
        title: "Error",
        description: "Failed to analyze symptoms. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearResult = () => {
    setResult(null);
  };

  return {
    result,
    analyzeSymptoms,
    clearResult,
    isAnalyzing
  };
};
