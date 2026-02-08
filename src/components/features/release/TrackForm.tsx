import { useForm } from 'react-hook-form';
import { useState } from 'react';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import Label from '../../ui/Label';
import { Track } from '../../../hooks/useReleaseStore';

interface TrackFormProps {
  onSave: (track: Track) => void;
  onCancel: () => void;
  trackNumber: number;
}

const TrackForm = ({ onSave, onCancel, trackNumber }: TrackFormProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<Track>({
    defaultValues: {
      track_number: trackNumber,
      explicit: false,
    }
  });
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [clipFile, setClipFile] = useState<File | null>(null);

  const onSubmit = (data: Track) => {
    if (!audioFile || !clipFile) {
      alert('Audio file and clip are required');
      return;
    }
    onSave({ ...data, audio_file: audioFile, audio_clip: clipFile });
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-medium mb-4">Add Track {trackNumber}</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="title">Track Title</Label>
            <Input id="title" {...register('title', { required: 'Title is required' })} />
            {errors.title && <span className="text-red-500 text-xs">{errors.title.message}</span>}
          </div>
          <div>
            <Label htmlFor="genre">Genre</Label>
            <Input id="genre" {...register('genre', { required: 'Genre is required' })} />
            {errors.genre && <span className="text-red-500 text-xs">{errors.genre.message}</span>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="isrc">ISRC (Optional)</Label>
            <Input id="isrc" {...register('isrc')} />
          </div>
          <div className="flex items-center space-x-2 pt-6">
            <input type="checkbox" id="explicit" {...register('explicit')} className="h-4 w-4 rounded border-gray-300" />
            <Label htmlFor="explicit">Explicit Content</Label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="composer">Composer</Label>
            <Input id="composer" {...register('composer')} />
          </div>
          <div>
            <Label htmlFor="lyricist">Lyricist</Label>
            <Input id="lyricist" {...register('lyricist')} />
          </div>
        </div>

        <div>
          <Label htmlFor="lyrics">Lyrics</Label>
          <textarea
            id="lyrics"
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            {...register('lyrics')}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Audio File (WAV)</Label>
            <input
              type="file"
              accept=".wav"
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
            />
          </div>
          <div>
            <Label>Audio Clip (60s)</Label>
            <input
              type="file"
              accept=".wav,.mp3"
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              onChange={(e) => setClipFile(e.target.files?.[0] || null)}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit">Save Track</Button>
        </div>
      </form>
    </div>
  );
};

export default TrackForm;
