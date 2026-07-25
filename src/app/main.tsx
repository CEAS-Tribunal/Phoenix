import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient } from '@tanstack/react-query';
import App from './App';
import { AppProviders } from './providers';
import { restoreAuthSession } from '@auth';
import '../index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 2,
      refetchOnWindowFocus: true,
    },
  },
});

async function bootstrap() {
  await restoreAuthSession(queryClient);
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <AppProviders client={queryClient}>
        <App />
      </AppProviders>
    </StrictMode>,
  );
}

void bootstrap();
