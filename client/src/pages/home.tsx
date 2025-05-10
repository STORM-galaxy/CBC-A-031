import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import DiseaseCategories from "@/components/home/DiseaseCategories";
import LatestResearch from "@/components/home/LatestResearch";
import AIChatbot from "@/components/home/AIChatbot";
import MedicalResources from "@/components/home/MedicalResources";
import Testimonials from "@/components/home/Testimonials";
import Newsletter from "@/components/home/Newsletter";

const Home = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Hero />
      <Features />
      <DiseaseCategories />
      <LatestResearch />
      <AIChatbot />
      <MedicalResources />
      <Testimonials />
      <Newsletter />
    </div>
  );
};

export default Home;
