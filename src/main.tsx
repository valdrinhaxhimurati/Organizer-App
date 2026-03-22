import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { registerSW } from 'virtual:pwa-register';
import { useSettingsStore } from './store/settingsStore';
import './styles.css';

const AppShellPage = React.lazy(() =>
  import('./pages/AppShell').then((module) => ({ default: module.AppShell }))
);
const SettingsPageView = React.lazy(() =>
  import('./pages/SettingsPage').then((module) => ({ default: module.SettingsPage }))
);

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
  {
    path: '/',
    element: (
      <React.Suspense fallback={null}>
        <AppShellPage />
      </React.Suspense>
    )
  },
  {
    path: '/settings',
    element: (
      <React.Suspense fallback={null}>
        <SettingsPageView />
      </React.Suspense>
    )
  },
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