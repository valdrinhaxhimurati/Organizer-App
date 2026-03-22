import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AccountInfo } from '@azure/msal-browser';

type AuthState = {
  account: AccountInfo | null;
  setAccount: (account: AccountInfo | null) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      account: null,
      setAccount: (account) => set({ account }),
    }),
    {
      name: 'organizer-auth',
      partialize: (state) => ({ account: state.account }),
    },
  ),
);
