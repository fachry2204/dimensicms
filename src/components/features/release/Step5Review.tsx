import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReleaseStore } from '../../../hooks/useReleaseStore';
import api from '../../../utils/api';
import Button from '../../ui/Button';
import { CheckCircle, Music } from 'lucide-react';

const Step5Review = () => {
  const { basicInfo, specifics, tracks, type, releaseId, reset } = useReleaseStore();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await api.patch(`/releases/${releaseId}/status`, { status: 'pending' });
      reset();
      navigate('/releases');
    } catch (error) {
      console.error('Failed to submit release', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-green-50 p-4 rounded-lg flex items-start space-x-3">
        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
        <div>
          <h3 className="text-sm font-medium text-green-800">Ready to Submit</h3>
          <p className="text-sm text-green-700 mt-1">
            Please review all information carefully before submitting. Once submitted, you won't be able to edit this release until it's reviewed.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium border-b pb-2 mb-4">Release Information</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Title</span>
                <span className="font-medium">{basicInfo.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Type</span>
                <span className="font-medium capitalize">{type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Label</span>
                <span className="font-medium">{basicInfo.label}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Genre</span>
                <span className="font-medium">{basicInfo.genre}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Release Date</span>
                <span className="font-medium">{basicInfo.release_date}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium border-b pb-2 mb-4">Specifics</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span className="font-medium">{specifics.brand_new ? 'New Release' : 'Previously Released'}</span>
              </div>
              {specifics.previous_distribution && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Previous Distributor</span>
                  <span className="font-medium">{specifics.previous_distribution}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium border-b pb-2 mb-4">Tracks ({tracks.length})</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {tracks.map((track, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="p-2 bg-white rounded-full shadow-sm">
                  <Music className="h-4 w-4 text-gray-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {track.track_number}. {track.title}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {track.genre} {track.explicit && '• Explicit'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {basicInfo.cover_preview && (
        <div>
          <h3 className="text-lg font-medium border-b pb-2 mb-4">Cover Art</h3>
          <img
            src={basicInfo.cover_preview}
            alt="Cover Art"
            className="h-48 w-48 rounded-lg shadow-md object-cover"
          />
        </div>
      )}

      <div className="flex justify-end pt-4">
        <Button onClick={handleSubmit} isLoading={isLoading} className="bg-green-600 hover:bg-green-700">
          Submit Release
        </Button>
      </div>
    </div>
  );
};

export default Step5Review;
