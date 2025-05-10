import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from 'react-markdown';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AlertCircle, BookOpen, Microscope, LucideHeartPulse, Pill, ShieldAlert, BookMarked, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

interface DiseaseInfo {
  overview: string;
  causes: string;
  symptoms: string;
  diagnosis: string;
  treatments: string;
  prevention: string;
  researchUpdates: string;
  references: string[];
}

const DiseaseDetailed = () => {
  const params = useParams<{ name: string }>();
  const diseaseName = params.name ? decodeURIComponent(params.name) : "";
  const [diseaseInfo, setDiseaseInfo] = useState<DiseaseInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDiseaseInfo = async () => {
      if (!diseaseName) {
        setError("No disease name provided");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await apiRequest("GET", `/api/disease-detailed/${encodeURIComponent(diseaseName)}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch disease information");
        }
        
        const data = await response.json();
        setDiseaseInfo(data);
      } catch (err) {
        console.error("Error fetching disease info:", err);
        setError("Failed to load disease information. Please try again.");
        toast({
          title: "Error",
          description: "Unable to load disease information. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDiseaseInfo();
  }, [diseaseName, toast]);

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-6">
          <Button variant="outline" size="sm" className="mr-4" asChild>
            <Link href="/disease-database">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Disease Database
            </Link>
          </Button>
          <Skeleton className="h-10 w-1/2" />
        </div>
        
        <div className="space-y-6">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !diseaseInfo) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button variant="outline" size="sm" className="mb-6" asChild>
          <Link href="/disease-database">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Disease Database
          </Link>
        </Button>
        
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error || "Information about this disease could not be found. Please try another disease or check back later."}
          </AlertDescription>
        </Alert>
        
        <Card>
          <CardHeader>
            <CardTitle>Disease Information Not Available</CardTitle>
            <CardDescription>
              We could not retrieve information about {diseaseName}. You can:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              <li>Return to the disease database and select another disease</li>
              <li>Try again later as our system updates regularly</li>
              <li>Use the AI chatbot to ask about this condition</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center mb-6">
        <Button variant="outline" size="sm" className="mr-4" asChild>
          <Link href="/disease-database">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Disease Database
          </Link>
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">{diseaseName}</h1>
      </div>
      
      <div className="prose prose-blue max-w-none mb-8">
        <ReactMarkdown>{diseaseInfo.overview}</ReactMarkdown>
      </div>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-3 md:grid-cols-7 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="causes">Causes</TabsTrigger>
          <TabsTrigger value="symptoms">Symptoms</TabsTrigger>
          <TabsTrigger value="diagnosis">Diagnosis</TabsTrigger>
          <TabsTrigger value="treatments">Treatments</TabsTrigger>
          <TabsTrigger value="prevention">Prevention</TabsTrigger>
          <TabsTrigger value="research">Research</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center">
              <BookOpen className="h-5 w-5 text-primary mr-2" />
              <CardTitle>Disease Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-blue max-w-none">
                <ReactMarkdown>{diseaseInfo.overview}</ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="causes" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center">
              <Microscope className="h-5 w-5 text-blue-600 mr-2" />
              <CardTitle>Causes & Risk Factors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-blue max-w-none">
                <ReactMarkdown>{diseaseInfo.causes}</ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="symptoms" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center">
              <LucideHeartPulse className="h-5 w-5 text-red-500 mr-2" />
              <CardTitle>Symptoms & Signs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-blue max-w-none">
                <ReactMarkdown>{diseaseInfo.symptoms}</ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="diagnosis" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center">
              <Microscope className="h-5 w-5 text-amber-600 mr-2" />
              <CardTitle>Diagnosis & Testing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-blue max-w-none">
                <ReactMarkdown>{diseaseInfo.diagnosis}</ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="treatments" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center">
              <Pill className="h-5 w-5 text-green-600 mr-2" />
              <CardTitle>Treatment Approaches</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-blue max-w-none">
                <ReactMarkdown>{diseaseInfo.treatments}</ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="prevention" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center">
              <ShieldAlert className="h-5 w-5 text-indigo-600 mr-2" />
              <CardTitle>Prevention Strategies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-blue max-w-none">
                <ReactMarkdown>{diseaseInfo.prevention}</ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="research" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center">
              <BookMarked className="h-5 w-5 text-purple-600 mr-2" />
              <CardTitle>Latest Research</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-blue max-w-none">
                <ReactMarkdown>{diseaseInfo.researchUpdates}</ReactMarkdown>
              </div>
              
              {diseaseInfo.references && diseaseInfo.references.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-4">References</h3>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="references">
                      <AccordionTrigger className="text-primary">
                        Show References ({diseaseInfo.references.length})
                      </AccordionTrigger>
                      <AccordionContent>
                        <ol className="list-decimal pl-5 space-y-2 text-sm">
                          {diseaseInfo.references.map((reference, index) => (
                            <li key={index} className="text-gray-700">{reference}</li>
                          ))}
                        </ol>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-10 text-center">
        <p className="text-sm text-gray-500 mb-4">Need more information or have questions about {diseaseName}?</p>
        <div className="flex justify-center gap-4">
          <Button asChild>
            <Link href="/ai-chat">
              Chat with MedScience AI
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/find-doctors">
              Find Specialists
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DiseaseDetailed;