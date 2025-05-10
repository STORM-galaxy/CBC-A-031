import { Card, CardContent } from "@/components/ui/card";
import { Star, StarHalf } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Testimonial {
  text: string;
  author: {
    name: string;
    role: string;
    avatarUrl: string;
  };
}

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
  return (
    <Card className="bg-white rounded-xl shadow-sm p-6">
      <CardContent className="p-0">
        <div className="flex items-center mb-4">
          <div className="text-amber-400 flex">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-current" />
            ))}
          </div>
        </div>
        <p className="text-gray-600 mb-4">{testimonial.text}</p>
        <div className="flex items-center">
          <Avatar className="h-10 w-10 rounded-full mr-3">
            <AvatarImage src={testimonial.author.avatarUrl} alt={testimonial.author.name} />
            <AvatarFallback>{testimonial.author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium text-gray-900">{testimonial.author.name}</p>
            <p className="text-sm text-gray-500">{testimonial.author.role}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Testimonials = () => {
  const testimonials: Testimonial[] = [
    {
      text: "As a cardiologist, I rely on this platform daily for up-to-date information. The disease database is comprehensive and the research summaries save me valuable time.",
      author: {
        name: "Dr. Sarah Johnson",
        role: "Cardiologist, Mayo Clinic",
        avatarUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
      }
    },
    {
      text: "The symptom checker has become an essential tool in my practice. It helps patients articulate their concerns before appointments, making our consultations more productive.",
      author: {
        name: "Dr. Marcus Chen",
        role: "Family Medicine, UCLA Health",
        avatarUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
      }
    },
    {
      text: "I recommend this platform to all my medical students. The information is not only scientifically accurate but presented in a way that facilitates both learning and clinical application.",
      author: {
        name: "Prof. Emily Rodriguez, MD, PhD",
        role: "Medical Education, Johns Hopkins",
        avatarUrl: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
      }
    }
  ];

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Trusted by Medical Professionals</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <TestimonialCard key={index} testimonial={testimonial} />
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
