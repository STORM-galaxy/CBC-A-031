import { useState } from "react";
import { useSymptomChecker } from "@/lib/hooks/useSymptomChecker";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface Symptom {
  id: number;
  name: string;
  bodySystemId: number | null;
  description: string | null;
}

interface PossibleCondition {
  name: string;
  probability: string;
  description: string;
  whenToSeekCare: string;
  relatedBodySystem: string;
}

interface AnalysisResult {
  possibleConditions: PossibleCondition[];
  disclaimer: string;
  recommendations: string[];
}

const SymptomForm = () => {
  // Fetch available symptoms
  const { data: symptoms, isLoading: isLoadingSymptoms } = useQuery<Symptom[]>({
    queryKey: ['/api/symptoms'],
    staleTime: Infinity
  });

  const { analyzeSymptoms, result, isAnalyzing } = useSymptomChecker();

  // User inputs
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [age, setAge] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [medicalHistory, setMedicalHistory] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Common medical conditions for history
  const commonConditions = [
    "Diabetes", "Hypertension", "Heart Disease", "Asthma", 
    "COPD", "Cancer", "Arthritis", "Depression/Anxiety",
    "Thyroid Disorder", "Kidney Disease"
  ];

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedSymptoms.length === 0) {
      return;
    }
    
    const userInfo = {
      age: age ? parseInt(age) : undefined,
      gender: gender || undefined,
      medicalHistory: medicalHistory.length > 0 ? medicalHistory : undefined
    };
    
    analyzeSymptoms(selectedSymptoms, userInfo);
  };

  // Filter symptoms based on search term
  const filteredSymptoms = symptoms?.filter(symptom => 
    symptom.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Toggle symptom selection
  const toggleSymptom = (symptomName: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptomName)
        ? prev.filter(s => s !== symptomName)
        : [...prev, symptomName]
    );
  };

  // Toggle medical history condition
  const toggleCondition = (condition: string) => {
    setMedicalHistory(prev => 
      prev.includes(condition)
        ? prev.filter(c => c !== condition)
        : [...prev, condition]
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Tabs defaultValue="symptoms" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="symptoms">Symptom Checker</TabsTrigger>
          <TabsTrigger value="results" disabled={!result}>Results</TabsTrigger>
        </TabsList>
        
        <TabsContent value="symptoms">
          <Card>
            <CardHeader>
              <CardTitle>What symptoms are you experiencing?</CardTitle>
              <CardDescription>
                Select all symptoms that apply to you. This information will help analyze possible conditions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Personal Information (Optional)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="age">Age</Label>
                        <Input
                          id="age"
                          type="number"
                          placeholder="Enter your age"
                          min="0"
                          max="120"
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="gender">Gender</Label>
                        <Select value={gender} onValueChange={setGender}>
                          <SelectTrigger id="gender">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Medical History */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Medical History (Optional)</h3>
                    <p className="text-sm text-gray-500">Select any existing medical conditions you have</p>
                    <div className="grid grid-cols-2 gap-2">
                      {commonConditions.map((condition) => (
                        <div key={condition} className="flex items-center space-x-2">
                          <Checkbox
                            id={`condition-${condition}`}
                            checked={medicalHistory.includes(condition)}
                            onCheckedChange={() => toggleCondition(condition)}
                          />
                          <label
                            htmlFor={`condition-${condition}`}
                            className="text-sm font-medium leading-none cursor-pointer"
                          >
                            {condition}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Symptoms Selection */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Symptoms</h3>
                    <p className="text-sm text-gray-500">Select all symptoms you are experiencing</p>
                    
                    <div className="space-y-2">
                      <Label htmlFor="search-symptoms">Search Symptoms</Label>
                      <Input
                        id="search-symptoms"
                        placeholder="Type to search symptoms..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    
                    {isLoadingSymptoms ? (
                      <div className="space-y-2">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Skeleton key={i} className="h-8 w-full" />
                        ))}
                      </div>
                    ) : (
                      <div className="max-h-60 overflow-y-auto border rounded-md p-2">
                        {filteredSymptoms.length > 0 ? (
                          filteredSymptoms.map((symptom) => (
                            <div key={symptom.id} className="flex items-center space-x-2 py-1">
                              <Checkbox
                                id={`symptom-${symptom.id}`}
                                checked={selectedSymptoms.includes(symptom.name)}
                                onCheckedChange={() => toggleSymptom(symptom.name)}
                              />
                              <label
                                htmlFor={`symptom-${symptom.id}`}
                                className="text-sm font-medium leading-none cursor-pointer"
                              >
                                {symptom.name}
                              </label>
                            </div>
                          ))
                        ) : (
                          <p className="text-center py-4 text-gray-500">No symptoms found. Try a different search term.</p>
                        )}
                      </div>
                    )}
                    
                    {selectedSymptoms.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-2">Selected Symptoms:</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedSymptoms.map((symptom) => (
                            <span
                              key={symptom}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
                            >
                              {symptom}
                              <button
                                type="button"
                                onClick={() => toggleSymptom(symptom)}
                                className="ml-1 text-primary hover:text-primary/80"
                              >
                                &times;
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => {
                setSelectedSymptoms([]);
                setAge("");
                setGender("");
                setMedicalHistory([]);
                setSearchTerm("");
              }}>
                Clear All
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={selectedSymptoms.length === 0 || isAnalyzing}
              >
                {isAnalyzing ? "Analyzing..." : "Analyze Symptoms"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="results">
          {result ? (
            <Card>
              <CardHeader>
                <CardTitle>Symptom Analysis Results</CardTitle>
                <CardDescription>
                  Based on the symptoms you provided, these are possible conditions to consider.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Medical Disclaimer</AlertTitle>
                  <AlertDescription>
                    {result.disclaimer}
                  </AlertDescription>
                </Alert>
                
                {/* Recommendations */}
                {result.recommendations && result.recommendations.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-2">Recommendations</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {result.recommendations.map((recommendation, index) => (
                        <li key={index} className="text-gray-700">{recommendation}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Possible Conditions */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Possible Conditions</h3>
                  <div className="space-y-4">
                    {result.possibleConditions.map((condition, index) => (
                      <Card key={index} className={`border-l-4 ${
                        condition.probability === "High" ? "border-l-red-500" : 
                        condition.probability === "Medium" ? "border-l-amber-500" : "border-l-blue-500"
                      }`}>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-center flex-wrap gap-2">
                            <div>
                              <CardTitle className="text-base">{condition.name}</CardTitle>
                              <p className="text-xs text-gray-500">
                                Related to: {condition.relatedBodySystem || "Multiple systems"}
                              </p>
                            </div>
                            <Badge color={
                              condition.probability === "High" ? "red" : 
                              condition.probability === "Medium" ? "yellow" : "blue"
                            }>
                              {condition.probability} probability
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="prose prose-sm max-w-none">
                            <p className="text-sm mb-3">{condition.description}</p>
                            <div className="bg-red-50 border border-red-100 rounded-md p-3 mt-2">
                              <h4 className="text-sm font-medium text-red-800">When to seek care:</h4>
                              <p className="text-sm text-red-700">{condition.whenToSeekCare}</p>
                            </div>
                          </div>
                          <div className="mt-4 flex justify-end">
                            <Button variant="outline" size="sm" asChild>
                              <a 
                                href={`/disease-detailed/${encodeURIComponent(condition.name)}`}
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-xs"
                              >
                                Learn more about {condition.name}
                              </a>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" onClick={() => window.print()} className="mr-2">
                  Print Results
                </Button>
                <Button asChild>
                  <a href="/find-doctors" target="_blank" rel="noopener noreferrer">
                    Find a Doctor
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <p>No analysis results yet. Please complete the symptom checker form.</p>
                  <Button className="mt-4" variant="outline" onClick={() => document.querySelector('[data-value="symptoms"]')?.click()}>
                    Go to Symptom Checker
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Custom Badge component since we can't import directly in this file
const Badge = ({ children, color }: { children: React.ReactNode; color: string }) => {
  const colorClasses = {
    red: "bg-red-100 text-red-800",
    yellow: "bg-yellow-100 text-yellow-800",
    blue: "bg-blue-100 text-blue-800",
    green: "bg-green-100 text-green-800",
  };

  return (
    <span className={`px-2.5 py-0.5 text-xs font-medium ${colorClasses[color as keyof typeof colorClasses]} rounded-full`}>
      {children}
    </span>
  );
};

export default SymptomForm;
