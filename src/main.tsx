import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { registerSW } from 'virtual:pwa-register';
import { msalInstance, getMsalAccount } from './lib/msal';
import { useAuthStore } from './store/authStore';
import { useSettingsStore } from './store/settingsStore';
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

const initialTheme = useSettingsStore.getState().settings.theme;
document.documentElement.dataset.theme = initialTheme;
document.documentElement.style.colorScheme = initialTheme;

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

function ThemeController() {
  const theme = useSettingsStore((state) => state.settings.theme);

  React.useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  return null;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeController />
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>,
);