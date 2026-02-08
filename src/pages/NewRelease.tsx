import { useEffect } from 'react';
import { useReleaseStore } from '../hooks/useReleaseStore';
import ReleaseStepper from '../components/features/release/ReleaseStepper';
import Step1Format from '../components/features/release/Step1Format';
import Step2BasicInfo from '../components/features/release/Step2BasicInfo';
import Step3Tracks from '../components/features/release/Step3Tracks';
import Step4Specifics from '../components/features/release/Step4Specifics';
import Step5Review from '../components/features/release/Step5Review';

const NewRelease = () => {
  const { step, reset } = useReleaseStore();

  useEffect(() => {
    // Optional: Reset on unmount or mount? 
    // Usually we want to keep state if user navigates away and back, unless explicit reset.
    // But for "New Release", maybe start fresh.
    return () => {
      // Cleanup if needed
    };
  }, []);

  const renderStep = () => {
    switch (step) {
      case 1:
        return <Step1Format />;
      case 2:
        return <Step2BasicInfo />;
      case 3:
        return <Step3Tracks />;
      case 4:
        return <Step4Specifics />;
      case 5:
        return <Step5Review />;
      default:
        return <Step1Format />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Upload New Release</h1>
      
      <div className="mb-8">
        <ReleaseStepper />
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        {renderStep()}
      </div>
    </div>
  );
};

export default NewRelease;
