import { useForm } from 'react-hook-form';
import { useReleaseStore } from '../../../hooks/useReleaseStore';
import api from '../../../utils/api';
import Button from '../../ui/Button';
import Label from '../../ui/Label';
import Input from '../../ui/Input';
import { useState } from 'react';

interface SpecificsForm {
  previous_distribution?: string;
  brand_new: boolean;
  previously_released: boolean;
}

const Step4Specifics = () => {
  const { specifics, setSpecifics, setStep, releaseId } = useReleaseStore();
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, watch, setValue } = useForm<SpecificsForm>({
    defaultValues: specifics,
  });

  const brandNew = watch('brand_new');

  const onSubmit = async (data: SpecificsForm) => {
    setIsLoading(true);
    try {
      await api.patch(`/releases/${releaseId}`, data);
      setSpecifics(data);
      setStep(5);
    } catch (error) {
      console.error('Failed to update specifics', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Release History</h3>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="brand_new"
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              checked={brandNew}
              onChange={(e) => {
                setValue('brand_new', e.target.checked);
                if (e.target.checked) setValue('previously_released', false);
              }}
            />
            <Label htmlFor="brand_new">This is a brand new release (never distributed before)</Label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="previously_released"
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              checked={!brandNew}
              onChange={(e) => {
                setValue('previously_released', e.target.checked);
                if (e.target.checked) setValue('brand_new', false);
              }}
            />
            <Label htmlFor="previously_released">This has been released before</Label>
          </div>

          {!brandNew && (
            <div className="pl-6">
              <Label htmlFor="previous_distribution">Previous Distributor (Optional)</Label>
              <Input
                id="previous_distribution"
                placeholder="e.g., Tunecore, CD Baby"
                {...register('previous_distribution')}
                className="mt-1"
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={() => setStep(3)}>
          Back
        </Button>
        <Button type="submit" isLoading={isLoading}>
          Next Step
        </Button>
      </div>
    </form>
  );
};

export default Step4Specifics;
