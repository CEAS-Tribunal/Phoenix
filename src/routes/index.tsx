import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import LoadingFallback from '@/components/LoadingFallback';

// Lazy load layout
const HomePage = lazy(() => import('@/pages/HomePage'));
const CommitteesPage = lazy(() => import('@/pages/CommitteesPage'));
const CareerFairPage = lazy(() => import('@/pages/CareerFairPage'));
const ExpoPage = lazy(() => import('@/pages/ExpoPage'));
const AlumniPage = lazy(() => import('@/pages/AlumniPage'));
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
    path: '/career-fair',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <CareerFairPage />
      </Suspense>
    )
  },
  {
    path: '/expo',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <ExpoPage />
      </Suspense>
    ),
  },
  {
    path: '/executives',
    element: <Navigate to="/committees" replace />,
  },
  {
    path: '/alumni',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <AlumniPage />
      </Suspense>
    ),
  },
  {
    path: '/resume-review-day/employers',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <ResumeReviewEmployer />
      </Suspense>
    )
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

export default router;
