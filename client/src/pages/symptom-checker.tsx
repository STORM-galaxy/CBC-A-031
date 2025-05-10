import SymptomForm from "@/components/symptom-checker/SymptomForm";

const SymptomChecker = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Symptom Checker</h1>
      <p className="text-gray-600 mb-8">
        Answer questions about your symptoms to get information on possible conditions and next steps.
        This tool is for informational purposes only and should not replace professional medical advice.
      </p>
      
      <SymptomForm />
    </div>
  );
};

export default SymptomChecker;
