import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft } from "lucide-react";
import { Link } from "wouter";

interface DiseaseInfoProps {
  diseaseId: number;
}

const DiseaseInfo = ({ diseaseId }: DiseaseInfoProps) => {
  const { data: disease, isLoading, error } = useQuery({
    queryKey: [`/api/diseases/${diseaseId}`],
    staleTime: Infinity,
  });

  if (isLoading) {
    return <DiseaseInfoSkeleton />;
  }

  if (error || !disease) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>
            There was an error loading the disease information. Please try again later.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Link href="/disease-database" className="inline-flex items-center text-primary hover:text-primary/80">
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to Disease Database
      </Link>
      
      <Card className="overflow-hidden">
        {disease.imageUrl && (
          <div className="w-full h-60 overflow-hidden">
            <img
              src={disease.imageUrl}
              alt={disease.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{disease.name}</CardTitle>
              <CardDescription>
                <Link href={`/disease-database?system=${disease.bodySystemId}`}>
                  <Badge variant="outline" className="mt-2">
                    {getBodySystemName(disease.bodySystemId)}
                  </Badge>
                </Link>
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="causes">Causes</TabsTrigger>
              <TabsTrigger value="symptoms">Symptoms</TabsTrigger>
              <TabsTrigger value="treatments">Treatments</TabsTrigger>
              <TabsTrigger value="prevention">Prevention</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-4">
              <div className="prose max-w-none">
                <p>{disease.description}</p>
              </div>
            </TabsContent>
            
            <TabsContent value="causes" className="mt-4">
              <div className="prose max-w-none">
                <p>{disease.causes || "Information about causes is not available."}</p>
              </div>
            </TabsContent>
            
            <TabsContent value="symptoms" className="mt-4">
              <div className="prose max-w-none">
                <p>{disease.symptoms || "Information about symptoms is not available."}</p>
              </div>
            </TabsContent>
            
            <TabsContent value="treatments" className="mt-4">
              <div className="prose max-w-none">
                <p>{disease.treatments || "Information about treatments is not available."}</p>
              </div>
            </TabsContent>
            
            <TabsContent value="prevention" className="mt-4">
              <div className="prose max-w-none">
                <p>{disease.prevention || "Information about prevention is not available."}</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

// Helper function to get body system name based on ID
function getBodySystemName(id: number): string {
  const systems: {[key: number]: string} = {
    1: "Cardiovascular System",
    2: "Respiratory System",
    3: "Digestive System",
    4: "Nervous System",
    5: "Endocrine System",
    6: "Immune System",
    7: "Musculoskeletal System",
    8: "Urinary System",
    9: "Reproductive System",
    10: "Integumentary System"
  };
  
  return systems[id] || "Unknown System";
}

const DiseaseInfoSkeleton = () => (
  <div className="space-y-6">
    <Skeleton className="h-6 w-40" />
    
    <Card className="overflow-hidden">
      <Skeleton className="h-60 w-full" />
      <CardHeader>
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/4 mt-2" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <div className="mt-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full mt-2" />
            <Skeleton className="h-4 w-3/4 mt-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default DiseaseInfo;
