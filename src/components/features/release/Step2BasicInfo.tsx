import { useForm } from 'react-hook-form';
import { useReleaseStore } from '../../../hooks/useReleaseStore';
import api from '../../../utils/api';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import Label from '../../ui/Label';
import FileInput from '../../ui/FileInput';
import { useState } from 'react';

interface BasicInfoForm {
  title: string;
  label: string;
  p_line: string;
  c_line: string;
  genre: string;
  language: string;
  version?: string;
  upc?: string;
  release_date: string;
}

const Step2BasicInfo = () => {
  const { basicInfo, setBasicInfo, setStep, releaseId } = useReleaseStore();
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<BasicInfoForm>({
    defaultValues: basicInfo,
  });
  const [coverFile, setCoverFile] = useState<File | undefined>(basicInfo.cover_file);
  const [preview, setPreview] = useState<string | undefined>(basicInfo.cover_preview);

  const handleFileSelect = (file: File) => {
    setCoverFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data: BasicInfoForm) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });
      if (coverFile) {
        formData.append('cover', coverFile);
      }

      const response = await api.patch(`/releases/${releaseId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Update store
      setBasicInfo({
        ...data,
        cover_file: coverFile,
        cover_preview: preview,
      });

      // If server returns updated cover path, we could store it, but preview is enough for now.
      setStep(3);
    } catch (error) {
      console.error('Failed to update release info', error);
      // Handle error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <FileInput
            label="Upload Cover"
            onFileSelect={handleFileSelect}
            preview={preview}
          />
        </div>
        <div className="md:col-span-2 space-y-4">
          <div>
            <Label htmlFor="title">Release Title</Label>
            <Input id="title" {...register('title', { required: 'Title is required' })} />
            {errors.title && <span className="text-red-500 text-xs">{errors.title.message}</span>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="label">Record Label</Label>
              <Input id="label" {...register('label', { required: 'Label is required' })} />
              {errors.label && <span className="text-red-500 text-xs">{errors.label.message}</span>}
            </div>
            <div>
              <Label htmlFor="genre">Genre</Label>
              <Input id="genre" {...register('genre', { required: 'Genre is required' })} />
              {errors.genre && <span className="text-red-500 text-xs">{errors.genre.message}</span>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="p_line">P-Line</Label>
              <Input id="p_line" placeholder="℗ 2024 Record Label" {...register('p_line', { required: 'P-Line is required' })} />
            </div>
            <div>
              <Label htmlFor="c_line">C-Line</Label>
              <Input id="c_line" placeholder="© 2024 Record Label" {...register('c_line', { required: 'C-Line is required' })} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="language">Language</Label>
              <Input id="language" {...register('language', { required: 'Language is required' })} />
            </div>
            <div>
              <Label htmlFor="release_date">Release Date</Label>
              <Input type="date" id="release_date" {...register('release_date', { required: 'Date is required' })} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="version">Version (Optional)</Label>
              <Input id="version" {...register('version')} />
            </div>
            <div>
              <Label htmlFor="upc">UPC (Optional)</Label>
              <Input id="upc" placeholder="Leave blank to auto-generate" {...register('upc')} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={() => setStep(1)}>
          Back
        </Button>
        <Button type="submit" isLoading={isLoading}>
          Next Step
        </Button>
      </div>
    </form>
  );
};

export default Step2BasicInfo;
