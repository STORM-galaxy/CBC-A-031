import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { FlaskRound, ShieldCheck, MessageSquare } from "lucide-react";

const Features = () => {
  const featuresData = [
    {
      title: "Disease Database",
      description: "Access detailed information on thousands of medical conditions categorized by body systems.",
      icon: <FlaskRound className="h-6 w-6 text-primary" />,
      link: "/disease-database",
      linkText: "Browse conditions",
      bgColor: "bg-primary-100"
    },
    {
      title: "Symptom Checker",
      description: "Answer questions about your symptoms to get potential causes and next steps.",
      icon: <ShieldCheck className="h-6 w-6 text-secondary-600" />,
      link: "/symptom-checker",
      linkText: "Check symptoms",
      bgColor: "bg-secondary-100"
    },
    {
      title: "AI Medical Assistant",
      description: "Chat with our AI-powered assistant to get answers to your medical questions.",
      icon: <MessageSquare className="h-6 w-6 text-primary" />,
      link: "/ai-chat",
      linkText: "Start chatting",
      bgColor: "bg-primary-100"
    }
  ];

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Medical Information & Tools</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuresData.map((feature, index) => (
          <Card key={index} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-6">
              <div className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 mb-4">{feature.description}</p>
              <Link href={feature.link}>
                <a className="text-primary hover:text-primary/90 font-medium">
                  {feature.linkText} &rarr;
                </a>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default Features;
