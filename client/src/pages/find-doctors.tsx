import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Star, 
  Clock, 
  Calendar, 
  User, 
  Users, 
  CheckCircle,
  Stethoscope,
  Brain,
  Heart,
  Thermometer,
  Bone,
  Eye,
  Baby
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  hospital: string;
  location: string;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  verified: boolean;
  education: string;
  acceptingNewPatients: boolean;
  languages: string[];
  contactInfo: {
    phone: string;
    email: string;
    website?: string;
  };
}

interface Hospital {
  id: number;
  name: string;
  location: string;
  type: string;
  specialties: string[];
  imageUrl: string;
  rating: number;
  reviewCount: number;
  contactInfo: {
    phone: string;
    website: string;
  };
}

const FindDoctors = () => {
  // State for filters
  const [searchTerm, setSearchTerm] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [location, setLocation] = useState("");
  const [activeTab, setActiveTab] = useState("doctors");

  // Fetch doctors
  const { data: doctors, isLoading: isLoadingDoctors } = useQuery<Doctor[]>({
    queryKey: ['/api/doctors'],
    staleTime: 300000, // 5 minutes
  });

  // Fetch hospitals
  const { data: hospitals, isLoading: isLoadingHospitals } = useQuery<Hospital[]>({
    queryKey: ['/api/hospitals'],
    staleTime: 300000, // 5 minutes
  });

  // Fallback data when API data is not available
  const fallbackDoctors: Doctor[] = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      specialty: "Cardiology",
      hospital: "Mayo Clinic",
      location: "Rochester, MN",
      rating: 4.9,
      reviewCount: 128,
      imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      verified: true,
      education: "Harvard Medical School, Residency at Johns Hopkins",
      acceptingNewPatients: true,
      languages: ["English", "Spanish"],
      contactInfo: {
        phone: "(507) 555-0123",
        email: "sjohnson@example.com",
        website: "https://example.com/drsjohnson"
      }
    },
    {
      id: 2,
      name: "Dr. Marcus Chen",
      specialty: "Family Medicine",
      hospital: "UCLA Health",
      location: "Los Angeles, CA",
      rating: 4.7,
      reviewCount: 98,
      imageUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      verified: true,
      education: "UCLA School of Medicine",
      acceptingNewPatients: true,
      languages: ["English", "Mandarin"],
      contactInfo: {
        phone: "(310) 555-0124",
        email: "mchen@example.com"
      }
    },
    {
      id: 3,
      name: "Dr. Emily Rodriguez",
      specialty: "Neurology",
      hospital: "Johns Hopkins Hospital",
      location: "Baltimore, MD",
      rating: 4.8,
      reviewCount: 112,
      imageUrl: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      verified: true,
      education: "Johns Hopkins University School of Medicine",
      acceptingNewPatients: false,
      languages: ["English", "French"],
      contactInfo: {
        phone: "(410) 555-0125",
        email: "erodriguez@example.com",
        website: "https://example.com/dremily"
      }
    },
    {
      id: 4,
      name: "Dr. Michael Washington",
      specialty: "Orthopedics",
      hospital: "Cleveland Clinic",
      location: "Cleveland, OH",
      rating: 4.6,
      reviewCount: 87,
      imageUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      verified: true,
      education: "University of Pennsylvania School of Medicine",
      acceptingNewPatients: true,
      languages: ["English"],
      contactInfo: {
        phone: "(216) 555-0126",
        email: "mwashington@example.com"
      }
    },
    {
      id: 5,
      name: "Dr. Jennifer Kim",
      specialty: "Pediatrics",
      hospital: "Boston Children's Hospital",
      location: "Boston, MA",
      rating: 4.9,
      reviewCount: 156,
      imageUrl: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      verified: true,
      education: "Harvard Medical School",
      acceptingNewPatients: true,
      languages: ["English", "Korean"],
      contactInfo: {
        phone: "(617) 555-0127",
        email: "jkim@example.com"
      }
    },
    {
      id: 6,
      name: "Dr. Robert Williams",
      specialty: "Ophthalmology",
      hospital: "Massachusetts Eye and Ear",
      location: "Boston, MA",
      rating: 4.7,
      reviewCount: 92,
      imageUrl: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      verified: true,
      education: "Yale School of Medicine",
      acceptingNewPatients: true,
      languages: ["English"],
      contactInfo: {
        phone: "(617) 555-0128",
        email: "rwilliams@example.com"
      }
    }
  ];

  const fallbackHospitals: Hospital[] = [
    {
      id: 1,
      name: "Mayo Clinic",
      location: "Rochester, MN",
      type: "Academic Medical Center",
      specialties: ["Cardiology", "Neurology", "Oncology", "Orthopedics"],
      imageUrl: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
      rating: 4.9,
      reviewCount: 1243,
      contactInfo: {
        phone: "(507) 284-2511",
        website: "https://www.mayoclinic.org/"
      }
    },
    {
      id: 2,
      name: "Cleveland Clinic",
      location: "Cleveland, OH",
      type: "Nonprofit Medical Center",
      specialties: ["Cardiology", "Gastroenterology", "Rheumatology", "Urology"],
      imageUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
      rating: 4.8,
      reviewCount: 987,
      contactInfo: {
        phone: "(800) 223-2273",
        website: "https://my.clevelandclinic.org/"
      }
    },
    {
      id: 3,
      name: "Johns Hopkins Hospital",
      location: "Baltimore, MD",
      type: "Academic Medical Center",
      specialties: ["Neurology", "Psychiatry", "Rheumatology", "Urology"],
      imageUrl: "https://images.unsplash.com/photo-1516549655669-df64a4ad7c12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
      rating: 4.8,
      reviewCount: 876,
      contactInfo: {
        phone: "(410) 955-5000",
        website: "https://www.hopkinsmedicine.org/"
      }
    },
    {
      id: 4,
      name: "Massachusetts General Hospital",
      location: "Boston, MA",
      type: "Academic Medical Center",
      specialties: ["Oncology", "Cardiology", "Psychiatry", "Endocrinology"],
      imageUrl: "https://images.unsplash.com/photo-1518152006812-edab29b069ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
      rating: 4.7,
      reviewCount: 765,
      contactInfo: {
        phone: "(617) 726-2000",
        website: "https://www.massgeneral.org/"
      }
    }
  ];

  const specialties = [
    "All Specialties",
    "Cardiology",
    "Neurology",
    "Family Medicine",
    "Pediatrics",
    "Orthopedics",
    "Ophthalmology",
    "Dermatology",
    "Gastroenterology",
    "Oncology"
  ];

  const locations = [
    "All Locations",
    "New York, NY",
    "Los Angeles, CA",
    "Chicago, IL",
    "Houston, TX",
    "Phoenix, AZ",
    "Philadelphia, PA",
    "San Antonio, TX",
    "San Diego, CA",
    "Boston, MA",
    "Baltimore, MD",
    "Cleveland, OH",
    "Rochester, MN"
  ];

  const displayDoctors = doctors || fallbackDoctors;
  const displayHospitals = hospitals || fallbackHospitals;

  // Filter doctors based on search term, specialty, and location
  const filteredDoctors = displayDoctors.filter(doctor => {
    const matchesSearch = searchTerm === "" || 
                         doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.hospital.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = specialty === "" || specialty === "All Specialties" || doctor.specialty === specialty;
    const matchesLocation = location === "" || location === "All Locations" || doctor.location === location;
    return matchesSearch && matchesSpecialty && matchesLocation;
  });

  // Filter hospitals based on search term and location
  const filteredHospitals = displayHospitals.filter(hospital => {
    const matchesSearch = searchTerm === "" || 
                         hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hospital.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesLocation = location === "" || location === "All Locations" || hospital.location === location;
    return matchesSearch && matchesLocation;
  });

  // Get specialty icon
  const getSpecialtyIcon = (specialty: string) => {
    switch(specialty.toLowerCase()) {
      case 'cardiology': return <Heart className="h-5 w-5 text-red-500" />;
      case 'neurology': return <Brain className="h-5 w-5 text-purple-500" />;
      case 'family medicine': return <Users className="h-5 w-5 text-blue-500" />;
      case 'pediatrics': return <Baby className="h-5 w-5 text-green-500" />;
      case 'orthopedics': return <Bone className="h-5 w-5 text-orange-500" />;
      case 'ophthalmology': return <Eye className="h-5 w-5 text-cyan-500" />;
      default: return <Stethoscope className="h-5 w-5 text-gray-500" />;
    }
  };

  // Render star rating
  const renderRating = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < Math.floor(rating) 
                ? "text-yellow-400 fill-yellow-400" 
                : i < rating 
                  ? "text-yellow-400 fill-yellow-400 opacity-50" 
                  : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-1 text-sm text-gray-600">{rating}</span>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Healthcare Providers</h1>
      <p className="text-gray-600 mb-8">
        Search our database of trusted doctors, specialists, and medical facilities to find the right healthcare provider for your needs.
      </p>

      {/* Search and filters */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Search by name, specialty, or hospital..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <Select value={specialty} onValueChange={setSpecialty}>
                <SelectTrigger>
                  <SelectValue placeholder="Specialty" />
                </SelectTrigger>
                <SelectContent>
                  {specialties.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((l) => (
                    <SelectItem key={l} value={l}>
                      {l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Doctors and Hospitals */}
      <Tabs defaultValue="doctors" onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="doctors">Doctors</TabsTrigger>
          <TabsTrigger value="hospitals">Hospitals</TabsTrigger>
        </TabsList>

        {/* Doctors Tab */}
        <TabsContent value="doctors">
          {isLoadingDoctors ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/4 p-6">
                        <Skeleton className="h-32 w-32 rounded-full mx-auto" />
                      </div>
                      <div className="md:w-3/4 p-6">
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/4 mb-4" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-3/4" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredDoctors.length > 0 ? (
            <div className="space-y-4">
              {filteredDoctors.map((doctor) => (
                <Card key={doctor.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/4 p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-200">
                        <Avatar className="h-32 w-32 mb-4">
                          <AvatarImage src={doctor.imageUrl} alt={doctor.name} />
                          <AvatarFallback>{doctor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        {renderRating(doctor.rating)}
                        <span className="text-xs text-gray-500 mt-1">{doctor.reviewCount} reviews</span>
                        {doctor.verified && (
                          <Badge variant="outline" className="mt-2 flex items-center gap-1">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <div className="md:w-3/4 p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                          <div>
                            <h2 className="text-xl font-semibold">{doctor.name}</h2>
                            <div className="flex items-center mt-1">
                              {getSpecialtyIcon(doctor.specialty)}
                              <span className="ml-1 text-gray-700">{doctor.specialty}</span>
                            </div>
                          </div>
                          <div className="mt-2 md:mt-0">
                            {doctor.acceptingNewPatients ? (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                Accepting New Patients
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                                Not Accepting New Patients
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <Separator className="my-3" />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4 mb-4">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                            <span className="text-sm">{doctor.hospital}, {doctor.location}</span>
                          </div>
                          <div className="flex items-center">
                            <User className="h-4 w-4 text-gray-500 mr-2" />
                            <span className="text-sm">Languages: {doctor.languages.join(", ")}</span>
                          </div>
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 text-gray-500 mr-2" />
                            <span className="text-sm">{doctor.contactInfo.phone}</span>
                          </div>
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 text-gray-500 mr-2" />
                            <span className="text-sm">{doctor.contactInfo.email}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mt-4">
                          <Button size="sm">
                            <Calendar className="mr-2 h-4 w-4" />
                            Schedule Appointment
                          </Button>
                          <Button variant="outline" size="sm">
                            <Phone className="mr-2 h-4 w-4" />
                            Call
                          </Button>
                          {doctor.contactInfo.website && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={doctor.contactInfo.website} target="_blank" rel="noopener noreferrer">
                                <Globe className="mr-2 h-4 w-4" />
                                Visit Website
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-gray-500 mb-4">No doctors found matching your search criteria.</p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm("");
                    setSpecialty("");
                    setLocation("");
                  }}
                >
                  Clear filters
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Hospitals Tab */}
        <TabsContent value="hospitals">
          {isLoadingHospitals ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
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
                </Card>
              ))}
            </div>
          ) : filteredHospitals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredHospitals.map((hospital) => (
                <Card key={hospital.id} className="overflow-hidden">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={hospital.imageUrl} 
                      alt={hospital.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle>{hospital.name}</CardTitle>
                    <CardDescription className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {hospital.location}
                    </CardDescription>
                    <div className="flex items-center mt-1">
                      {renderRating(hospital.rating)}
                      <span className="text-xs text-gray-500 ml-2">({hospital.reviewCount} reviews)</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-700 mb-2">
                      <span className="font-medium">Type:</span> {hospital.type}
                    </div>
                    <div className="mb-3">
                      <div className="text-sm font-medium mb-1">Specialties:</div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {hospital.specialties.map((specialty, index) => (
                          <Badge key={index} variant="outline" className="bg-gray-50">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="text-sm text-gray-700 mb-1">
                      <span className="font-medium">Phone:</span> {hospital.contactInfo.phone}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button asChild>
                      <a href={hospital.contactInfo.website} target="_blank" rel="noopener noreferrer" className="flex items-center">
                        <Globe className="mr-2 h-4 w-4" />
                        Visit Website
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-gray-500 mb-4">No hospitals found matching your search criteria.</p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm("");
                    setLocation("");
                  }}
                >
                  Clear filters
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FindDoctors;
