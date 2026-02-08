import { useState } from 'react';
import { useReleaseStore, Track } from '../../../hooks/useReleaseStore';
import api from '../../../utils/api';
import Button from '../../ui/Button';
import TrackForm from './TrackForm';
import { Plus, Trash2, Music } from 'lucide-react';

const Step3Tracks = () => {
  const { tracks, addTrack, removeTrack, setStep, releaseId, type } = useReleaseStore();
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddTrack = async (track: Track) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      Object.entries(track).forEach(([key, value]) => {
        if (key !== 'audio_file' && key !== 'audio_clip' && value !== undefined) {
          formData.append(key, value.toString());
        }
      });
      if (track.audio_file) formData.append('audio_file', track.audio_file);
      if (track.audio_clip) formData.append('audio_clip', track.audio_clip);

      await api.post(`/releases/${releaseId}/tracks`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      addTrack(track);
      setIsAdding(false);
    } catch (error) {
      console.error('Failed to add track', error);
      // Handle error
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTrack = (index: number) => {
    // Ideally call API to delete track if needed, but for now just local state as we don't have delete track API in this scope yet
    removeTrack(index);
  };

  const handleNext = () => {
    if (tracks.length === 0) {
      alert('Please add at least one track');
      return;
    }
    setStep(4);
  };

  const canAddMore = type === 'single' ? tracks.length < 1 : tracks.length < 15;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Track Details</h2>
        {!isAdding && canAddMore && (
          <Button onClick={() => setIsAdding(true)} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Track
          </Button>
        )}
      </div>

      {isAdding && (
        <TrackForm
          onSave={handleAddTrack}
          onCancel={() => setIsAdding(false)}
          trackNumber={tracks.length + 1}
        />
      )}

      <div className="space-y-4">
        {tracks.map((track, index) => (
          <div key={index} className="flex items-center justify-between p-4 bg-white border rounded-lg shadow-sm">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-50 rounded-full">
                <Music className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">
                  {track.track_number}. {track.title}
                </h3>
                <p className="text-sm text-gray-500">
                  {track.genre} • {track.isrc || 'No ISRC'}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
              onClick={() => handleDeleteTrack(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}

        {tracks.length === 0 && !isAdding && (
          <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
            <p className="text-gray-500">No tracks added yet. Click "Add Track" to begin.</p>
          </div>
        )}
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={() => setStep(2)}>
          Back
        </Button>
        <Button onClick={handleNext} disabled={tracks.length === 0 || isAdding} isLoading={isLoading}>
          Next Step
        </Button>
      </div>
    </div>
  );
};

export default Step3Tracks;
