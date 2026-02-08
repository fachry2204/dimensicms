import { useState } from 'react';
import { useReleaseStore } from '../../../hooks/useReleaseStore';
import api from '../../../utils/api';
import Button from '../../ui/Button';
import { Disc, Layers } from 'lucide-react';
import { cn } from '../../../lib/utils';

const Step1Format = () => {
  const { setType, setStep, setReleaseId, type: selectedType } = useReleaseStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleSelect = (type: 'single' | 'album') => {
    setType(type);
  };

  const handleNext = async () => {
    if (!selectedType) return;
    setIsLoading(true);
    try {
      const response = await api.post('/releases', { type: selectedType });
      setReleaseId(response.data.id);
      setStep(2);
    } catch (error) {
      console.error('Failed to create release draft', error);
      // Handle error (toast)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Select Release Format</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          onClick={() => handleSelect('single')}
          className={cn(
            "cursor-pointer rounded-lg border-2 p-6 transition-all hover:border-primary",
            selectedType === 'single' ? "border-primary bg-blue-50" : "border-gray-200"
          )}
        >
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-4 bg-blue-100 rounded-full">
              <Disc className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-medium">Single</h3>
              <p className="text-sm text-gray-500 mt-1">
                Upload a single track.
                <br />
                Maximum 1 track.
              </p>
            </div>
          </div>
        </div>

        <div
          onClick={() => handleSelect('album')}
          className={cn(
            "cursor-pointer rounded-lg border-2 p-6 transition-all hover:border-primary",
            selectedType === 'album' ? "border-primary bg-blue-50" : "border-gray-200"
          )}
        >
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-4 bg-blue-100 rounded-full">
              <Layers className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-medium">Album / EP</h3>
              <p className="text-sm text-gray-500 mt-1">
                Upload multiple tracks.
                <br />
                Maximum 15 tracks.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button onClick={handleNext} disabled={!selectedType} isLoading={isLoading}>
          Next Step
        </Button>
      </div>
    </div>
  );
};

export default Step1Format;
