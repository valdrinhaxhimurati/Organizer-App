import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { registerSW } from 'virtual:pwa-register';
import { msalInstance, getMsalAccount } from './lib/msal';
import { useAuthStore } from './store/authStore';
import { AppShell } from './pages/AppShell';
import { SettingsPage } from './pages/SettingsPage';
import './styles.css';

// Initialize MSAL before rendering so all components have an initialized instance
await msalInstance.initialize();

// Restore existing Microsoft account from MSAL cache (persisted in localStorage)
const existingAccount = getMsalAccount();
if (existingAccount) {
  useAuthStore.getState().setAccount(existingAccount);
}
useAuthStore.getState().setInitialized(true);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 300000,
      gcTime: 3600000,
    },
  },
});

const router = createBrowserRouter([
  { path: '/', element: <AppShell /> },
  { path: '/settings', element: <SettingsPage /> },
]);

registerSW({ immediate: true });

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>,
);