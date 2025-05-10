import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const Hero = () => {
  return (
    <section className="mb-12">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Evidence-Based Medical Information</h1>
            <p className="text-lg text-gray-700 mb-6">Access comprehensive, scientifically accurate information about human diseases, disorders, and treatments - trusted by medical professionals worldwide.</p>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <Button asChild className="inline-flex justify-center items-center px-6 py-3">
                <Link href="/disease-database">
                  Explore Diseases
                </Link>
              </Button>
              <Button asChild variant="outline" className="inline-flex justify-center items-center px-6 py-3">
                <Link href="/symptom-checker">
                  Take Symptom Checker
                </Link>
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 h-64 md:h-auto">
            {/* A team of diverse medical professionals discussing findings with digital displays */}
            <img 
              src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
              alt="Medical professionals collaborating" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
