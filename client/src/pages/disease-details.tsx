import { useParams } from "wouter";
import DiseaseInfo from "@/components/disease/DiseaseInfo";

const DiseaseDetails = () => {
  const params = useParams<{ id: string }>();
  const diseaseId = parseInt(params.id);

  if (isNaN(diseaseId)) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Invalid Disease ID</h1>
        <p className="text-gray-600">
          The disease ID provided is invalid. Please go back to the disease database and select a valid disease.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <DiseaseInfo diseaseId={diseaseId} />
    </div>
  );
};

export default DiseaseDetails;
