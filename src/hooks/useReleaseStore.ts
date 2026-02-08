import { create } from 'zustand';

export interface Track {
  title: string;
  track_number: number;
  isrc?: string;
  genre: string;
  explicit: boolean;
  composer?: string;
  lyricist?: string;
  lyrics?: string;
  audio_file?: File;
  audio_clip?: File;
}

interface ReleaseState {
  step: number;
  releaseId: number | null;
  type: 'single' | 'album' | null;
  basicInfo: {
    title: string;
    label: string;
    p_line: string;
    c_line: string;
    genre: string;
    language: string;
    version?: string;
    upc?: string;
    release_date: string;
    cover_file?: File;
    cover_preview?: string;
  };
  specifics: {
    previous_distribution?: string;
    brand_new: boolean;
    previously_released: boolean;
  };
  tracks: Track[];
  
  setStep: (step: number) => void;
  setReleaseId: (id: number) => void;
  setType: (type: 'single' | 'album') => void;
  setBasicInfo: (info: Partial<ReleaseState['basicInfo']>) => void;
  setSpecifics: (info: Partial<ReleaseState['specifics']>) => void;
  addTrack: (track: Track) => void;
  updateTrack: (index: number, track: Track) => void;
  removeTrack: (index: number) => void;
  reset: () => void;
}

export const useReleaseStore = create<ReleaseState>((set) => ({
  step: 1,
  releaseId: null,
  type: null,
  basicInfo: {
    title: '',
    label: '',
    p_line: '',
    c_line: '',
    genre: '',
    language: '',
    release_date: '',
  },
  specifics: {
    brand_new: true,
    previously_released: false,
  },
  tracks: [],

  setStep: (step) => set({ step }),
  setReleaseId: (id) => set({ releaseId: id }),
  setType: (type) => set({ type }),
  setBasicInfo: (info) => set((state) => ({ basicInfo: { ...state.basicInfo, ...info } })),
  setSpecifics: (info) => set((state) => ({ specifics: { ...state.specifics, ...info } })),
  addTrack: (track) => set((state) => ({ tracks: [...state.tracks, track] })),
  updateTrack: (index, track) => set((state) => {
    const newTracks = [...state.tracks];
    newTracks[index] = track;
    return { tracks: newTracks };
  }),
  removeTrack: (index) => set((state) => ({ tracks: state.tracks.filter((_, i) => i !== index) })),
  reset: () => set({
    step: 1,
    releaseId: null,
    type: null,
    basicInfo: {
      title: '',
      label: '',
      p_line: '',
      c_line: '',
      genre: '',
      language: '',
      release_date: '',
    },
    specifics: {
      brand_new: true,
      previously_released: false,
    },
    tracks: [],
  }),
}));
