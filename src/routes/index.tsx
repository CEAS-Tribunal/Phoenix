import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import LoadingFallback from '@/components/LoadingFallback';
import { AdminGuard } from '@/components/AdminGuard';

// Lazy load pages
const HomePage = lazy(() => import('@/pages/HomePage'));
const CommitteesPage = lazy(() => import('@/pages/CommitteesPage'));
const CareerFairPage = lazy(() => import('@/pages/CareerFairPage'));
const ExpoPage = lazy(() => import('@/pages/ExpoPage'));
const AlumniPage = lazy(() => import('@/pages/AlumniPage'));
const ResumeReviewEmployer = lazy(() => import('@/pages/ResumeReviewEmployer'));
const ResumeReviewStudent = lazy(() => import('@/pages/ResumeReviewStudent'));
const ResourcesPage = lazy(() => import('@/pages/ResourcesPage'));

// Admin pages
const AdminLoginPage = lazy(() => import('@/pages/admin/AdminLoginPage'));
const AdminChangePasswordPage = lazy(() => import('@/pages/admin/AdminChangePasswordPage'));
const AdminDashboardPage = lazy(() => import('@/pages/admin/AdminDashboardPage'));
const AdminReimbursementsPage = lazy(() => import('@/pages/admin/AdminReimbursementsPage'));
const AdminRepresentativeSignInPage = lazy(() => import('@/pages/admin/AdminRepresentativeSignInPage'));
const AdminTagsPrintingPage = lazy(() => import('@/pages/admin/AdminTagsPrintingPage'));
const AdminResumeRosterPage = lazy(() => import('@/pages/admin/AdminResumeRosterPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

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
    path: '/resume-review-day/students',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <ResumeReviewStudent />
      </Suspense>
    )
  },
  {
    path: '/resources',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <ResourcesPage />
      </Suspense>
    ),
  },
  // Admin (public)
  {
    path: '/admin/login',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <AdminLoginPage />
      </Suspense>
    ),
  },
  {
    path: '/admin/change-password',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <AdminChangePasswordPage />
      </Suspense>
    ),
  },
  // Admin (protected)
  {
    path: '/admin',
    element: (
      <AdminGuard>
        <Suspense fallback={<LoadingFallback />}>
          <AdminDashboardPage />
        </Suspense>
      </AdminGuard>
    ),
  },
  {
    path: '/admin/reimbursements',
    element: (
      <AdminGuard>
        <Suspense fallback={<LoadingFallback />}>
          <AdminReimbursementsPage />
        </Suspense>
      </AdminGuard>
    ),
  },
  {
    path: '/admin/career-fair/representative-sign-in',
    element: (
      <AdminGuard>
        <Suspense fallback={<LoadingFallback />}>
          <AdminRepresentativeSignInPage />
        </Suspense>
      </AdminGuard>
    ),
  },
  {
    path: '/admin/career-fair/tags',
    element: (
      <AdminGuard>
        <Suspense fallback={<LoadingFallback />}>
          <AdminTagsPrintingPage />
        </Suspense>
      </AdminGuard>
    ),
  },
  {
    path: '/admin/resume-review-day/roster',
    element: (
      <AdminGuard>
        <Suspense fallback={<LoadingFallback />}>
          <AdminResumeRosterPage />
        </Suspense>
      </AdminGuard>
    ),
  },
  {
    path: '*',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <NotFoundPage />
      </Suspense>
    ),
  },
]);

export default router;
