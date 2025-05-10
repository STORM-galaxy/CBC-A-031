import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Globe, 
  Hospital, 
  FileText, 
  Video, 
  Users, 
  BookOpen, 
  GraduationCap, 
  HeartPulse, 
  Building, 
  FlaskConical, 
  Link as LinkIcon, 
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface Resource {
  id: number;
  title: string;
  description: string;
  url: string;
  type: string;
  category: string;
  location?: string;
}

const Resources = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [resourceType, setResourceType] = useState("all");

  // Fetch resources
  const { data: resources, isLoading } = useQuery<Resource[]>({
    queryKey: ['/api/resources/all'],
    staleTime: Infinity,
  });

  // Fallback data when API data is not available
  const fallbackResources: Resource[] = [
    // Professional Resources
    {
      id: 1,
      title: "NEJM (New England Journal of Medicine)",
      description: "The world's leading medical journal featuring the latest medical research and reviews.",
      url: "https://www.nejm.org/",
      type: "journal",
      category: "professional"
    },
    {
      id: 2,
      title: "UpToDate",
      description: "Evidence-based clinical decision support resource with thousands of topics for medical professionals.",
      url: "https://www.uptodate.com/",
      type: "reference",
      category: "professional"
    },
    {
      id: 3,
      title: "JAMA Network",
      description: "Journal of the American Medical Association, featuring original research, reviews, and editorials.",
      url: "https://jamanetwork.com/",
      type: "journal",
      category: "professional"
    },
    {
      id: 4,
      title: "PubMed",
      description: "Free search engine accessing primarily the MEDLINE database of references on life sciences and biomedical topics.",
      url: "https://pubmed.ncbi.nlm.nih.gov/",
      type: "database",
      category: "professional"
    },
    {
      id: 5,
      title: "Mayo Clinic Proceedings",
      description: "Peer-reviewed clinical journal sponsored by Mayo Clinic emphasizing clinical medicine and research.",
      url: "https://www.mayoclinicproceedings.org/",
      type: "journal",
      category: "professional"
    },
    
    // Patient Resources
    {
      id: 6,
      title: "MedlinePlus",
      description: "The National Institutes of Health's website for patients, providing reliable, up-to-date health information.",
      url: "https://medlineplus.gov/",
      type: "website",
      category: "patient"
    },
    {
      id: 7,
      title: "CDC (Centers for Disease Control and Prevention)",
      description: "Provides health information and resources on diseases, conditions, and public health topics.",
      url: "https://www.cdc.gov/",
      type: "organization",
      category: "patient"
    },
    {
      id: 8,
      title: "Mayo Clinic Patient Care and Health Information",
      description: "Comprehensive medical information on diseases, symptoms, and treatments written for patients.",
      url: "https://www.mayoclinic.org/patient-care-and-health-information",
      type: "website",
      category: "patient"
    },
    {
      id: 9,
      title: "WHO (World Health Organization)",
      description: "International organization providing public health information and guidance.",
      url: "https://www.who.int/",
      type: "organization",
      category: "patient"
    },
    {
      id: 10,
      title: "NIH Clinical Trials Database",
      description: "Registry of clinical studies conducted around the world, searchable by condition or disease.",
      url: "https://clinicaltrials.gov/",
      type: "database",
      category: "patient"
    },
    
    // Hospitals
    {
      id: 11,
      title: "Mayo Clinic",
      description: "Leading academic medical center focusing on integrated clinical practice, education, and research.",
      url: "https://www.mayoclinic.org/",
      type: "hospital",
      category: "hospital",
      location: "Rochester, MN (main campus)"
    },
    {
      id: 12,
      title: "Cleveland Clinic",
      description: "Nonprofit multispecialty academic medical center that integrates clinical and hospital care with research and education.",
      url: "https://my.clevelandclinic.org/",
      type: "hospital",
      category: "hospital",
      location: "Cleveland, OH"
    },
    {
      id: 13,
      title: "Johns Hopkins Hospital",
      description: "Academic medical center known for its excellence in research, medical education and clinical care.",
      url: "https://www.hopkinsmedicine.org/",
      type: "hospital",
      category: "hospital",
      location: "Baltimore, MD"
    },
    {
      id: 14,
      title: "Massachusetts General Hospital",
      description: "Original and largest teaching hospital of Harvard Medical School, founded in 1811.",
      url: "https://www.massgeneral.org/",
      type: "hospital",
      category: "hospital",
      location: "Boston, MA"
    },
    {
      id: 15,
      title: "University of California San Francisco Medical Center",
      description: "Medical treatment and research facility that is the medical center of the University of California, San Francisco.",
      url: "https://www.ucsfhealth.org/",
      type: "hospital",
      category: "hospital",
      location: "San Francisco, CA"
    }
  ];

  const displayResources = resources || fallbackResources;

  // Filter resources based on search term and type
  const filteredResources = displayResources.filter(resource => {
    const matchesSearch = searchTerm === "" || 
                         resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = resourceType === "all" || resource.category === resourceType;
    return matchesSearch && matchesType;
  });

  // Group resources by type for better organization
  const groupedResources: {[key: string]: Resource[]} = {};
  filteredResources.forEach(resource => {
    if (!groupedResources[resource.type]) {
      groupedResources[resource.type] = [];
    }
    groupedResources[resource.type].push(resource);
  });

  // Get icon for resource type
  const getResourceIcon = (type: string) => {
    switch(type.toLowerCase()) {
      case 'journal': return <BookOpen className="h-6 w-6 text-blue-500" />;
      case 'reference': return <FileText className="h-6 w-6 text-green-500" />;
      case 'database': return <FlaskConical className="h-6 w-6 text-purple-500" />;
      case 'website': return <Globe className="h-6 w-6 text-orange-500" />;
      case 'organization': return <Building className="h-6 w-6 text-gray-500" />;
      case 'hospital': return <Hospital className="h-6 w-6 text-red-500" />;
      case 'video': return <Video className="h-6 w-6 text-primary" />;
      case 'support': return <Users className="h-6 w-6 text-yellow-500" />;
      case 'education': return <GraduationCap className="h-6 w-6 text-indigo-500" />;
      default: return <LinkIcon className="h-6 w-6 text-gray-500" />;
    }
  };

  // Format type name for display
  const formatTypeName = (type: string): string => {
    return type.charAt(0).toUpperCase() + type.slice(1) + 's';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Medical Resources</h1>
      <p className="text-gray-600 mb-8">
        Access a curated collection of trusted medical resources, including professional references, 
        patient education materials, and healthcare institution directories.
      </p>

      {/* Search and filter */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <Input
            placeholder="Search resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-1/3"
          />
          <Tabs defaultValue="all" onValueChange={setResourceType}>
            <TabsList>
              <TabsTrigger value="all">All Resources</TabsTrigger>
              <TabsTrigger value="professional">For Professionals</TabsTrigger>
              <TabsTrigger value="patient">For Patients</TabsTrigger>
              <TabsTrigger value="hospital">Hospitals</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((j) => (
                    <Skeleton key={j} className="h-24 w-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          {Object.keys(groupedResources).length > 0 ? (
            Object.keys(groupedResources).map((type) => (
              <Card key={type} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center">
                    {getResourceIcon(type)}
                    <span className="ml-2">{formatTypeName(type)}</span>
                  </CardTitle>
                  <Separator className="my-2" />
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {groupedResources[type].map((resource) => (
                      <div key={resource.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between">
                          <h3 className="font-medium">{resource.title}</h3>
                          <Badge variant="outline">{resource.category === "professional" ? "Professional" : resource.category === "patient" ? "Patient" : "Hospital"}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1 mb-3">{resource.description}</p>
                        {resource.location && (
                          <p className="text-xs text-gray-500 mt-1 mb-2">
                            <span className="font-medium">Location:</span> {resource.location}
                          </p>
                        )}
                        <Button variant="outline" size="sm" className="mt-2" asChild>
                          <a href={resource.url} target="_blank" rel="noopener noreferrer" className="flex items-center">
                            Visit Resource
                            <ExternalLink className="ml-1 h-3 w-3" />
                          </a>
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-500">No resources found matching your search criteria.</p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm("");
                    setResourceType("all");
                  }}
                  className="mt-4"
                >
                  Clear filters
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default Resources;
