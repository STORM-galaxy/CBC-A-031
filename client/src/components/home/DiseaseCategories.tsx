import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";

interface BodySystem {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
}

interface Tag {
  name: string;
  color: string;
}

const SystemCard = ({ 
  system, 
  tags 
}: { 
  system: BodySystem;
  tags: Tag[];
}) => {
  return (
    <Card className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
      <img 
        src={system.imageUrl} 
        alt={`${system.name} Illustration`} 
        className="w-full h-48 object-cover"
      />
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{system.name}</h3>
        <p className="text-gray-600 mb-4">{system.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, index) => (
            <Badge 
              key={index} 
              variant="secondary" 
              className={`px-2.5 py-0.5 text-xs font-medium bg-${tag.color}-100 text-${tag.color}-800 rounded-full`}
            >
              {tag.name}
            </Badge>
          ))}
        </div>
        <Link href={`/disease-database?system=${system.id}`}>
          <a className="text-primary hover:text-primary/90 font-medium">
            Explore conditions &rarr;
          </a>
        </Link>
      </CardContent>
    </Card>
  );
};

const DiseaseCategories = () => {
  const { data: bodySystems, isLoading } = useQuery({
    queryKey: ['/api/body-systems'],
    staleTime: Infinity
  });

  // Fallback data when API data is not available
  const fallbackSystems = [
    {
      id: 1,
      name: "Cardiovascular System",
      description: "Diseases affecting the heart and blood vessels, including coronary artery disease, arrhythmias, and heart failure.",
      imageUrl: "https://images.unsplash.com/photo-1628595351029-c2bf17511435?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450"
    },
    {
      id: 2,
      name: "Respiratory System",
      description: "Conditions affecting the lungs and airways, including asthma, COPD, pneumonia, and respiratory infections.",
      imageUrl: "https://images.pexels.com/photos/5938242/pexels-photo-5938242.jpeg?auto=compress&cs=tinysrgb&w=800&h=450"
    },
    {
      id: 3,
      name: "Nervous System",
      description: "Disorders of the brain, spinal cord and nerves, including stroke, epilepsy, multiple sclerosis, and Parkinson's disease.",
      imageUrl: "https://images.unsplash.com/photo-1559757175-5700dde675bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450"
    }
  ];

  const systems = bodySystems || fallbackSystems;
  
  const systemTags = [
    [
      { name: "Heart Disease", color: "red" },
      { name: "Hypertension", color: "red" },
      { name: "Stroke", color: "red" }
    ],
    [
      { name: "Asthma", color: "blue" },
      { name: "COPD", color: "blue" },
      { name: "Pneumonia", color: "blue" }
    ],
    [
      { name: "Alzheimer's", color: "purple" },
      { name: "Epilepsy", color: "purple" },
      { name: "Migraine", color: "purple" }
    ]
  ];

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Browse by Body System</h2>
        <Link href="/disease-database">
          <a className="text-primary hover:text-primary/90 text-sm font-medium">View all systems</a>
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {systems.map((system, index) => (
          <SystemCard 
            key={system.id} 
            system={system} 
            tags={systemTags[index] || []}
          />
        ))}
      </div>
    </section>
  );
};

export default DiseaseCategories;
