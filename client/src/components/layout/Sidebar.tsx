import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Home, 
  FileText, 
  Link2, 
  Users, 
  BarChart4, 
  ShieldCheck, 
  MessageSquare, 
  Heart,
  Stethoscope,
  Brain,
  Pill,
  Thermometer,
  Activity,
  MoreHorizontal 
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const [location] = useLocation();

  const bodySystems = [
    { name: "Cardiovascular System", path: "/disease-database?system=1", icon: <Heart className="mr-3 h-5 w-5" /> },
    { name: "Respiratory System", path: "/disease-database?system=2", icon: <Stethoscope className="mr-3 h-5 w-5" /> },
    { name: "Digestive System", path: "/disease-database?system=3", icon: <Pill className="mr-3 h-5 w-5" /> },
    { name: "Nervous System", path: "/disease-database?system=4", icon: <Brain className="mr-3 h-5 w-5" /> },
    { name: "Endocrine System", path: "/disease-database?system=5", icon: <Activity className="mr-3 h-5 w-5" /> }
  ];

  const mainNavItems = [
    { name: "Home", path: "/", icon: <Home className="mr-3 h-5 w-5" /> },
    { name: "Latest News", path: "/medical-news", icon: <FileText className="mr-3 h-5 w-5" /> },
    { name: "Resources", path: "/resources", icon: <Link2 className="mr-3 h-5 w-5" /> },
    { name: "Find Doctors", path: "/find-doctors", icon: <Users className="mr-3 h-5 w-5" /> }
  ];

  const toolsNavItems = [
    { name: "Symptom Checker", path: "/symptom-checker", icon: <ShieldCheck className="mr-3 h-5 w-5" /> },
    { name: "AI Medical Chat", path: "/ai-chat", icon: <MessageSquare className="mr-3 h-5 w-5" /> }
  ];

  // Mobile sidebar backdrop
  const MobileSidebarBackdrop = () => (
    <div
      className={`${isOpen ? "block" : "hidden"} lg:hidden fixed inset-0 z-40 bg-gray-600 bg-opacity-75 transition-opacity`}
      onClick={() => setIsOpen(false)}
    />
  );

  // Sidebar content (shared between mobile and desktop)
  const SidebarContent = () => (
    <>
      <div className="flex items-center justify-center h-16 border-b border-gray-200">
        <h1 className="text-xl font-bold text-primary">MedScience Hub</h1>
      </div>
      <ScrollArea className="h-full pb-16">
        <nav className="mt-4 px-2">
          <div className="pb-2">
            <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Main</p>
            {mainNavItems.map((item) => (
              <Link 
                key={item.path} 
                href={item.path}
                className={cn(
                  "mt-1 group flex items-center px-3 py-2 text-sm font-medium rounded-md",
                  location === item.path 
                    ? "bg-primary-50 text-primary" 
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </div>
          
          <div className="pb-2 mt-6">
            <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Body Systems</p>
            {bodySystems.map((system) => (
              <Link 
                key={system.path} 
                href={system.path}
                className={cn(
                  "mt-1 group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100",
                  location === system.path && "bg-primary-50 text-primary"
                )}
              >
                {system.icon}
                {system.name}
              </Link>
            ))}
            <Link 
              href="/disease-database"
              className="mt-1 group flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md bg-white hover:bg-gray-100"
            >
              <MoreHorizontal className="mr-3 h-5 w-5 text-gray-500" />
              More Systems
            </Link>
          </div>
          
          <div className="pb-2 mt-6">
            <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Tools</p>
            {toolsNavItems.map((item) => (
              <Link 
                key={item.path} 
                href={item.path}
                className={cn(
                  "mt-1 group flex items-center px-3 py-2 text-sm font-medium rounded-md",
                  location === item.path 
                    ? "bg-primary-50 text-primary" 
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </div>
        </nav>
      </ScrollArea>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="lg:block hidden w-64 bg-white border-r border-gray-200 flex-shrink-0 relative">
        <SidebarContent />
      </div>

      {/* Mobile sidebar */}
      <MobileSidebarBackdrop />
      <div
        className={`lg:hidden fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="absolute top-0 right-0 -mr-12 pt-2">
          <button
            className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            onClick={() => setIsOpen(false)}
          >
            <span className="sr-only">Close sidebar</span>
            <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <SidebarContent />
      </div>
    </>
  );
};

export default Sidebar;
