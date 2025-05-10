import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { FileText, Users, FilePlus, UserPlus, Video, UserCog } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface Resource {
  id: number;
  title: string;
  description: string;
  url: string;
  type: string;
  category: string;
}

const MedicalResources = () => {
  const { data: professionalResources } = useQuery({ 
    queryKey: ['/api/resources/professional'],
    staleTime: Infinity
  });

  const { data: patientResources } = useQuery({ 
    queryKey: ['/api/resources/patient'],
    staleTime: Infinity
  });

  // Fallback data when API data is not available
  const fallbackProfessionalResources = [
    {
      id: 1,
      title: "Clinical Practice Guidelines",
      description: "Evidence-based recommendations for patient care",
      url: "/resources/clinical-guidelines",
      type: "professional",
      category: "guidelines"
    },
    {
      id: 2,
      title: "Medical Journals Database",
      description: "Access to peer-reviewed research publications",
      url: "/resources/journals",
      type: "professional",
      category: "research"
    },
    {
      id: 3,
      title: "Medical Education Videos",
      description: "Procedural demonstrations and lectures",
      url: "/resources/videos",
      type: "professional",
      category: "education"
    },
    {
      id: 4,
      title: "Healthcare Professional Directory",
      description: "Connect with specialists and researchers",
      url: "/resources/professionals",
      type: "professional",
      category: "networking"
    }
  ];

  const fallbackPatientResources = [
    {
      id: 5,
      title: "Patient Education Materials",
      description: "Easy-to-understand health information",
      url: "/resources/patient-education",
      type: "patient",
      category: "education"
    },
    {
      id: 6,
      title: "Find a Doctor",
      description: "Search for healthcare providers near you",
      url: "/find-doctors",
      type: "patient",
      category: "providers"
    },
    {
      id: 7,
      title: "Support Groups",
      description: "Connect with others with similar conditions",
      url: "/resources/support-groups",
      type: "patient",
      category: "support"
    },
    {
      id: 8,
      title: "Clinical Trials",
      description: "Find research studies seeking participants",
      url: "/resources/clinical-trials",
      type: "patient",
      category: "research"
    }
  ];

  const professionalItems = professionalResources || fallbackProfessionalResources;
  const patientItems = patientResources || fallbackPatientResources;

  const iconMap = {
    "Clinical Practice Guidelines": <FileText className="h-6 w-6 text-primary mr-2" />,
    "Medical Journals Database": <FilePlus className="h-6 w-6 text-primary mr-2" />,
    "Medical Education Videos": <Video className="h-6 w-6 text-primary mr-2" />,
    "Healthcare Professional Directory": <Users className="h-6 w-6 text-primary mr-2" />,
    "Patient Education Materials": <FileText className="h-6 w-6 text-secondary-600 mr-2" />,
    "Find a Doctor": <UserCog className="h-6 w-6 text-secondary-600 mr-2" />,
    "Support Groups": <UserPlus className="h-6 w-6 text-secondary-600 mr-2" />,
    "Clinical Trials": <FileText className="h-6 w-6 text-secondary-600 mr-2" />
  };

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Medical Resources</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Professional Resources */}
        <Card className="bg-white rounded-xl shadow-sm overflow-hidden">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">For Healthcare Professionals</h3>
            <ul className="space-y-3">
              {professionalItems.map((resource) => (
                <li key={resource.id} className="flex">
                  {iconMap[resource.title as keyof typeof iconMap] || <FileText className="h-6 w-6 text-primary mr-2" />}
                  <div>
                    <Link href={resource.url}>
                      <a className="text-primary hover:text-primary/90 font-medium">{resource.title}</a>
                    </Link>
                    <p className="text-sm text-gray-600">{resource.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        
        {/* Patient Resources */}
        <Card className="bg-white rounded-xl shadow-sm overflow-hidden">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">For Patients</h3>
            <ul className="space-y-3">
              {patientItems.map((resource) => (
                <li key={resource.id} className="flex">
                  {iconMap[resource.title as keyof typeof iconMap] || <FileText className="h-6 w-6 text-secondary-600 mr-2" />}
                  <div>
                    <Link href={resource.url}>
                      <a className="text-secondary-600 hover:text-secondary-700 font-medium">{resource.title}</a>
                    </Link>
                    <p className="text-sm text-gray-600">{resource.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default MedicalResources;
