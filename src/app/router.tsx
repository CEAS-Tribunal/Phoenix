import { Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

import LoadingFallback from '@shared/components/LoadingFallback';
import NotFoundPage from '@shared/components/NotFoundPage';
import { RootLayout } from '@shared/components/layout/RootLayout';
import {
  AdminChangePasswordPage,
  AdminGuard,
  AdminLoginPage,
  OrgFundingChairGuard,
  TreasurerGuard,
} from '@auth';
import { AlumniPage, HomePage, ResourcesPage } from '@home';
import { ExpoPage } from '@home';
import { CommitteesPage } from '@committees';
import {
  AdminRepresentativeSignInPage,
  AdminTagsPrintingPage,
  CareerFairPage,
} from '@career-fair';
import {
  AdminResumeRosterPage,
  ResumeReviewEmployer,
  ResumeReviewStudent,
} from '@resume-review';
import {
  AdminReimbursementRequestsPage,
  AdminReimbursementsPage,
} from '@reimbursement';
import {
  AdminOrgFundingDatesPage,
  AdminOrgFundingPage,
  OrgFundingPage,
} from '@org-funding';
import { AdminDashboardPage } from '@dashboard';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <HomePage />
          </Suspense>
        ),
      },
      {
        path: 'committees',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <CommitteesPage />
          </Suspense>
        ),
      },
      {
        path: 'career-fair',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <CareerFairPage />
          </Suspense>
        ),
      },
      {
        path: 'expo',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ExpoPage />
          </Suspense>
        ),
      },
      {
        path: 'executives',
        element: <Navigate to="/committees" replace />,
      },
      {
        path: 'alumni',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AlumniPage />
          </Suspense>
        ),
      },
      {
        path: 'resume-review-day/employers',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ResumeReviewEmployer />
          </Suspense>
        ),
      },
      {
        path: 'resume-review-day/students',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ResumeReviewStudent />
          </Suspense>
        ),
      },
      {
        path: 'org-funding',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <OrgFundingPage />
          </Suspense>
        ),
      },
      {
        path: 'resources',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ResourcesPage />
          </Suspense>
        ),
      },
      {
        path: 'admin/login',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AdminLoginPage />
          </Suspense>
        ),
      },
      {
        path: 'admin/change-password',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AdminChangePasswordPage />
          </Suspense>
        ),
      },
      {
        path: 'admin',
        element: (
          <AdminGuard>
            <Suspense fallback={<LoadingFallback />}>
              <AdminDashboardPage />
            </Suspense>
          </AdminGuard>
        ),
      },
      {
        path: 'admin/reimbursements/requests',
        element: (
          <AdminGuard>
            <TreasurerGuard>
              <Suspense fallback={<LoadingFallback />}>
                <AdminReimbursementRequestsPage />
              </Suspense>
            </TreasurerGuard>
          </AdminGuard>
        ),
      },
      {
        path: 'admin/reimbursements',
        element: (
          <AdminGuard>
            <Suspense fallback={<LoadingFallback />}>
              <AdminReimbursementsPage />
            </Suspense>
          </AdminGuard>
        ),
      },
      {
        path: 'admin/org-funding',
        element: (
          <AdminGuard>
            <OrgFundingChairGuard>
              <Suspense fallback={<LoadingFallback />}>
                <AdminOrgFundingPage />
              </Suspense>
            </OrgFundingChairGuard>
          </AdminGuard>
        ),
      },
      {
        path: 'admin/org-funding/dates',
        element: (
          <AdminGuard>
            <OrgFundingChairGuard>
              <Suspense fallback={<LoadingFallback />}>
                <AdminOrgFundingDatesPage />
              </Suspense>
            </OrgFundingChairGuard>
          </AdminGuard>
        ),
      },
      {
        path: 'admin/career-fair/representative-sign-in',
        element: (
          <AdminGuard>
            <Suspense fallback={<LoadingFallback />}>
              <AdminRepresentativeSignInPage />
            </Suspense>
          </AdminGuard>
        ),
      },
      {
        path: 'admin/career-fair/tags',
        element: (
          <AdminGuard>
            <Suspense fallback={<LoadingFallback />}>
              <AdminTagsPrintingPage />
            </Suspense>
          </AdminGuard>
        ),
      },
      {
        path: 'admin/resume-review-day/roster',
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
        element: <NotFoundPage />,
      },
    ],
  },
]);

export default router;
