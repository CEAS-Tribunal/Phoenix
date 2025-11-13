import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import LoadingFallback from '@/components/LoadingFallback';

// Lazy load layout
const HomePage = lazy(() => import('@/pages/HomePage'));
const CommitteesPage = lazy(() => import('@/pages/CommitteesPage'));
const ResumeReviewEmployer = lazy(() => import('@/pages/ResumeReviewEmployer'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <HomePage />
      </Suspense>
    ),
  },
  {
    path: '/committees',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <CommitteesPage />
      </Suspense>
    ),
  },
  {
    path: '/resume-review-day/employers',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <ResumeReviewEmployer />
      </Suspense>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

export default router;