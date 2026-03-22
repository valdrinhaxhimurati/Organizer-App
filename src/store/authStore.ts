import { create } from 'zustand';
import type { AccountInfo } from '@azure/msal-browser';

type AuthState = {
  account: AccountInfo | null;
  isInitialized: boolean;
  setAccount: (account: AccountInfo | null) => void;
  setInitialized: (v: boolean) => void;
};

export const useAuthStore = create<AuthState>()((set) => ({
  account: null,
  isInitialized: false,
  setAccount: (account) => set({ account }),
  setInitialized: (isInitialized) => set({ isInitialized }),
}));
