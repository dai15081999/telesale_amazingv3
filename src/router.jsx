//! modules
import { createBrowserRouter, Outlet, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Toaster } from 'react-hot-toast';
//Components
import LoginPage from './pages/Auth/LoginPage';
import SignupPage from './pages/Auth/SignupPage';
const BrandManagement = lazy(() =>
  import('./pages/Admin/RightAdmin/BrandManagement'),
);
const Configuration = lazy(() =>
  import('./pages/Admin/RightAdmin/Configuration'),
);
const UserManagement = lazy(() =>
  import('./pages/Admin/RightAdmin/UserManagement'),
);
const WorkflowManagement = lazy(() =>
  import('./pages/Admin/RightAdmin/WorkflowManagement'),
);
const Brand = lazy(() => import('./pages/Brand'));
const DetailsUser = lazy(() => import('./pages/DetailsUser'));
const Order = lazy(() => import('./pages/DetailsUser/Order'));
const Schedule = lazy(() => import('./pages/DetailsUser/Schedule'));
const StaffManager = lazy(() => import('./pages/Staff/PageStaff/StaffManager'));
const Calendar = lazy(() => import('./pages/Staff/PageStaff/Calendar'));
const CallReport = lazy(() => import('./pages/Staff/PageStaff/CallReport'));
const Campaign = lazy(() => import('./pages/Staff/PageStaff/Campaign'));
const NewsBoard = lazy(() => import('./pages/Staff/PageStaff/NewsBoard'));
const OrderReport = lazy(() => import('./pages/Staff/PageStaff/OrderReport'));

const CampaignReport = lazy(() =>
  import('./pages/Staff/PageStaff/CampaignReport'),
);
//Layouts
import { RootLayout } from './layouts/RootLayout';
import { AuthLayout } from './layouts/AuthLayout';
import { AuthProvider } from './context/AuthContext';
import { SipProvider } from './context/SipContext';
import AxiosProvider from './context/AxiosContex';
import LoadingLazy from './components/LoadingLazy';
import { AdminLayout } from './layouts/AdminLayout';

export const router = createBrowserRouter([
  {
    element: <ContextWrapper />,
    children: [
      {
        path: '/brand',
        element: (
          <Suspense fallback={<LoadingLazy />}>
            <Brand />
          </Suspense>
        ),
      },
      {
        element: <RootLayout />,
        children: [
          {
            path: '*',
            element: (
              <Navigate
                to='/staff'
                replace
              />
            ),
          },
          {
            path: '/staff',
            element: (
              <Suspense fallback={<LoadingLazy />}>
                <StaffManager />
              </Suspense>
            ),
          },
          {
            path: '/lich',
            element: (
              <Suspense fallback={<LoadingLazy />}>
                <Calendar />
              </Suspense>
            ),
          },
          {
            path: '/chien-dich',
            element: (
              <Suspense fallback={<LoadingLazy />}>
                <Campaign />
              </Suspense>
            ),
          },
          {
            path: '/new-board',
            element: (
              <Suspense fallback={<LoadingLazy />}>
                <NewsBoard />
              </Suspense>
            ),
          },
          {
            path: '/call-report',
            element: (
              <Suspense fallback={<LoadingLazy />}>
                <CallReport />
              </Suspense>
            ),
          },
          {
            path: '/order-report',
            element: (
              <Suspense fallback={<LoadingLazy />}>
                <OrderReport />
              </Suspense>
            ),
          },
          {
            path: '/campaign-report',
            element: (
              <Suspense fallback={<LoadingLazy />}>
                <CampaignReport />
              </Suspense>
            ),
          },
          {
            path: '/staff/:id',
            element: (
              <Suspense fallback={<LoadingLazy />}>
                <DetailsUser />
              </Suspense>
            ),
          },
          {
            path: '/staff/:id/order',
            element: (
              <Suspense fallback={<LoadingLazy />}>
                <Order />
              </Suspense>
            ),
          },
          {
            path: '/staff/:id/schedule',
            element: (
              <Suspense fallback={<LoadingLazy />}>
                <Schedule />
              </Suspense>
            ),
          },
        ],
      },
      {
        element: <AdminLayout />,
        children: [
          {
            path: '*',
            element: (
              <Navigate
                to='/admin'
                replace
              />
            ),
          },
          {
            path: '/admin',
            element: (
              <Suspense fallback={<LoadingLazy />}>
                <BrandManagement />
              </Suspense>
            ),
          },
          {
            path: '/admin-manager-user',
            element: (
              <Suspense fallback={<LoadingLazy />}>
                <UserManagement />
              </Suspense>
            ),
          },
          {
            path: '/admin-manager-work',
            element: (
              <Suspense fallback={<LoadingLazy />}>
                <WorkflowManagement />
              </Suspense>
            ),
          },
          {
            path: '/admin-manager-config',
            element: (
              <Suspense fallback={<LoadingLazy />}>
                <Configuration />
              </Suspense>
            ),
          },
        ],
      },
      {
        element: <AuthLayout />,
        children: [
          {
            path: '*',
            element: (
              <Navigate
                to='/login'
                replace
              />
            ),
          },
          { path: 'login', element: <LoginPage /> },
          { path: 'signup', element: <SignupPage /> },
        ],
      },
    ],
  },
]);

// bao quát
function ContextWrapper() {
  return (
    <AxiosProvider>
      <AuthProvider>
        <SipProvider>
          <Toaster
            position='bottom-right'
            reverseOrder={true}
          />
          <Outlet />
        </SipProvider>
      </AuthProvider>
    </AxiosProvider>
  );
}
