import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, Stethoscope, Brain, Thermometer, Activity } from "lucide-react";

interface Disease {
  id: number;
  name: string;
  bodySystemId: number;
  description: string;
  imageUrl?: string;
}

interface BodySystem {
  id: number;
  name: string;
  description: string;
  imageUrl?: string;
}

interface DiseaseListProps {
  systemId?: number;
  searchQuery?: string;
}

const DiseaseList = ({ systemId, searchQuery }: DiseaseListProps) => {
  const [selectedSystemId, setSelectedSystemId] = useState<number | undefined>(systemId);
  const [search, setSearch] = useState(searchQuery || "");

  // Fetch body systems
  const { data: bodySystems, isLoading: isLoadingSystems } = useQuery<BodySystem[]>({
    queryKey: ['/api/body-systems'],
    staleTime: Infinity
  });

  // Fetch diseases based on selected system
  const { data: diseases, isLoading: isLoadingDiseases } = useQuery<Disease[]>({
    queryKey: selectedSystemId 
      ? [`/api/diseases/by-system/${selectedSystemId}`] 
      : search 
        ? [`/api/diseases/search?q=${encodeURIComponent(search)}`]
        : ['/api/diseases/by-system/1'], // Default to first system if nothing selected
    staleTime: 60000, // 1 minute
  });

  // Filter diseases based on search query locally
  const filteredDiseases = diseases?.filter(disease => 
    !search || disease.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSystemChange = (value: string) => {
    const systemId = parseInt(value);
    setSelectedSystemId(systemId);
    setSearch("");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    if (e.target.value === "") {
      setSelectedSystemId(1); // Reset to default system if search is cleared
    } else {
      setSelectedSystemId(undefined); // Clear system filter when searching
    }
  };

  const getSystemIcon = (systemId: number) => {
    switch (systemId) {
      case 1: return <Heart className="h-5 w-5 text-red-500" />;
      case 2: return <Stethoscope className="h-5 w-5 text-blue-500" />;
      case 3: return <Thermometer className="h-5 w-5 text-orange-500" />;
      case 4: return <Brain className="h-5 w-5 text-purple-500" />;
      case 5: return <Activity className="h-5 w-5 text-green-500" />;
      default: return <Heart className="h-5 w-5 text-gray-500" />;
    }
  };

  // Fallback data when API data is not available
  const fallbackSystems: BodySystem[] = [
    { id: 1, name: "Cardiovascular System", description: "Heart and blood vessels" },
    { id: 2, name: "Respiratory System", description: "Stethoscope and airways" },
    { id: 3, name: "Digestive System", description: "Stomach and intestines" },
    { id: 4, name: "Nervous System", description: "Brain and nerves" },
    { id: 5, name: "Endocrine System", description: "Hormones and glands" }
  ];

  const systems = bodySystems || fallbackSystems;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-1/3">
          <Select 
            value={selectedSystemId?.toString() || ""} 
            onValueChange={handleSystemChange}
            disabled={isLoadingSystems}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select body system" />
            </SelectTrigger>
            <SelectContent>
              {systems.map(system => (
                <SelectItem key={system.id} value={system.id.toString()}>
                  {system.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-full sm:w-2/3">
          <Input
            placeholder="Search diseases..."
            value={search}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {isLoadingDiseases ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <Skeleton className="h-48 w-full rounded-t-lg" />
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2 mt-1" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full mt-2" />
                <Skeleton className="h-4 w-2/3 mt-2" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-9 w-28" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : filteredDiseases && filteredDiseases.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDiseases.map(disease => (
            <Card key={disease.id} className="overflow-hidden">
              {disease.imageUrl ? (
                <div className="h-48 overflow-hidden">
                  <img 
                    src={disease.imageUrl} 
                    alt={disease.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="h-48 bg-gray-100 flex items-center justify-center">
                  {getSystemIcon(disease.bodySystemId)}
                </div>
              )}
              <CardHeader className="pb-2">
                <CardTitle>{disease.name}</CardTitle>
                <CardDescription>
                  <Badge variant="outline" className="mt-1">
                    {systems.find(s => s.id === disease.bodySystemId)?.name || "Unknown System"}
                  </Badge>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 line-clamp-3">
                  {disease.description}
                </p>
              </CardContent>
              <CardFooter>
                <Link href={`/disease/${disease.id}`}>
                  <a className="text-primary hover:text-primary/90 font-medium">
                    View details &rarr;
                  </a>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No diseases found</CardTitle>
            <CardDescription>
              {search 
                ? `No diseases matching "${search}" were found. Try another search term.` 
                : "No diseases found for the selected system."}
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  );
};

export default DiseaseList;
