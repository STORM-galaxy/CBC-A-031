import { useLocation } from "wouter";
import DiseaseList from "@/components/disease/DiseaseList";

const DiseaseDatabase = () => {
  const [location] = useLocation();
  
  // Parse query parameters
  const params = new URLSearchParams(location.split("?")[1]);
  const systemId = params.get("system") ? parseInt(params.get("system")!) : undefined;
  const searchQuery = params.get("search") || undefined;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Disease Database</h1>
      <p className="text-gray-600 mb-8">
        Browse our comprehensive database of medical conditions categorized by body systems.
        Access detailed information about symptoms, causes, treatments, and prevention.
      </p>
      
      <DiseaseList systemId={systemId} searchQuery={searchQuery} />
    </div>
  );
};

export default DiseaseDatabase;
