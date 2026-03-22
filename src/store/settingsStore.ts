import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppSettings } from '../lib/types';

const defaultLat = Number(import.meta.env.VITE_DEFAULT_LAT ?? 47.3769);
const defaultLon = Number(import.meta.env.VITE_DEFAULT_LON ?? 8.5417);

type SettingsState = {
  settings: AppSettings;
  updateSettings: (patch: Partial<AppSettings>) => void;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: {
        city: 'Zuerich',
        latitude: defaultLat,
        longitude: defaultLon,
        weatherRefreshMinutes: 15
      },
      updateSettings: (patch) =>
        set((state) => ({
          settings: {
            ...state.settings,
            ...patch
          }
        }))
    }),
    {
      name: 'organizer-settings'
    }
  )
);