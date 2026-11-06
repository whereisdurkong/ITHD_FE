import { lazy, Suspense } from 'react';
import { Navigate } from 'react-router-dom';

const LoginPage = lazy(() => import('views/auth/login'));

const AuthGuard = () => {
  const user = localStorage.getItem('user');

  if (user !== null && user !== '') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Suspense fallback={null}>
      <LoginPage />
    </Suspense>
  );
};

const AuthenticationRoutes = {
  path: '/',
  children: [
    {
      path: '/',
      element: <AuthGuard />
    }
  ]
};

export default AuthenticationRoutes;
