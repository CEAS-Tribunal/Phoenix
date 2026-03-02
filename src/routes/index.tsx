import { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { RootLayout } from '@/components/RootLayout';
import { AdminGuard } from '@/components/AdminGuard';

// Lazy load pages
const HomePage = lazy(() => import('@/pages/HomePage'));
const CommitteesPage = lazy(() => import('@/pages/CommitteesPage'));
const CareerFairPage = lazy(() => import('@/pages/CareerFairPage'));
const ExpoPage = lazy(() => import('@/pages/ExpoPage'));
const AlumniPage = lazy(() => import('@/pages/AlumniPage'));
const ResumeReviewEmployer = lazy(() => import('@/pages/ResumeReviewEmployer'));
const ResourcesPage = lazy(() => import('@/pages/ResourcesPage'));

// Admin pages
const AdminLoginPage = lazy(() => import('@/pages/admin/AdminLoginPage'));
const AdminDashboardPage = lazy(() => import('@/pages/admin/AdminDashboardPage'));
const AdminReimbursementsPage = lazy(() => import('@/pages/admin/AdminReimbursementsPage'));
const AdminRepresentativeSignInPage = lazy(() => import('@/pages/admin/AdminRepresentativeSignInPage'));
const AdminTagsPrintingPage = lazy(() => import('@/pages/admin/AdminTagsPrintingPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

export const router = createBrowserRouter([
    {
      path: '/',
      element: <RootLayout />,
      children: [
        {
          index: true,
          element: <HomePage />,
        },
        {
          path: 'committees',
          element: <CommitteesPage />,
        },
        {
          path: 'career-fair',
          element: <CareerFairPage />,
        },
        {
          path: 'expo',
          element: <ExpoPage />,
        },
        {
          path: 'executives',
          element: <Navigate to="/committees" replace />,
        },
        {
          path: 'alumni',
          element: <AlumniPage />,
        },
        {
          path: 'resume-review-day/employers',
          element: <ResumeReviewEmployer />,
        },
        // Admin (public)
        {
          path: 'admin/login',
          element: <AdminLoginPage />,
        },
        // Admin (protected)
        {
          path: 'admin',
          element: (
            <AdminGuard>
              <AdminDashboardPage />
            </AdminGuard>
          ),
        },
        {
          path: 'admin/reimbursements',
          element: (
            <AdminGuard>
              <AdminReimbursementsPage />
            </AdminGuard>
          ),
        },
        {
          path: 'admin/career-fair/representative-sign-in',
          element: (
            <AdminGuard>
              <AdminRepresentativeSignInPage />
            </AdminGuard>
          ),
        },
        {
          path: 'admin/career-fair/tags',
          element: (
            <AdminGuard>
              <AdminTagsPrintingPage />
            </AdminGuard>
          ),
        },
        {
          path: '*',
          element: <Navigate to="/" replace />,
        },
      ],
    },
]);

export default router;
