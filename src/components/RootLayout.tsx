import { Suspense } from 'react';
import { Outlet, ScrollRestoration } from 'react-router-dom';
import LoadingFallback from '@/components/LoadingFallback';

/**
 * Root layout that wraps all routes. Renders ScrollRestoration so that
 * navigating to a new page scrolls to the top instead of keeping the
 * previous page's scroll position.
 */
export function RootLayout() {
  return (
    <>
      <ScrollRestoration />
      <Suspense fallback={<LoadingFallback />}>
        <Outlet />
      </Suspense>
    </>
  );
}
