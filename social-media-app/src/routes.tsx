import React from 'react';
import { Navigate, RouteObject } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

// Page Components
import  Home  from './pages/home';
import Login  from './pages/login';
import Signup  from './pages/signup';
import AddComment from './pages/add_comment';
import AddPost from './pages/add_post';
import ChangePassword from './pages/change-password';
import CreateUserProfile from './pages/create_user_profile';
import DeletePost from './pages/delete_post';
import EditProfilePage from './pages/edit_profile_page';
import  Friends  from './pages/friends';
import OtherProfile from './pages/Otherprofile';
import PasswordSuccess from './pages/password_success';
import Search  from './pages/search';
import UpdatePost from './pages/update_post';
import  NotFound  from './pages/404';

// Layout Components
import { Navigation } from './components/layout/Navigation';

// Type Definitions
interface NavigationProps {
  children: React.ReactNode;
}

interface ProtectedRouteProps {
  children: React.ReactNode;
}

interface PublicRouteProps {
  children: React.ReactNode;
}

// Navigation Component with Outlet
const NavigationWithOutlet: React.FC = () => {
  return (
    <Navigation>
      <Outlet />
    </Navigation>
  );
};

// Protected Route Wrapper Component
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>; // Consider using a proper loading component
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Public Route Wrapper Component (accessible only when not logged in)
const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>; // Consider using a proper loading component
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Main Routes Configuration
export const routes: RouteObject[] = [
  // Public Routes
  {
    path: '/login',
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: '/signup',
    element: (
      <PublicRoute>
        <Signup />
      </PublicRoute>
    ),
  },
  {
    path: '/password-success',
    element: <PasswordSuccess />,
  },

  // Protected Routes (with Navigation Layout)
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <NavigationWithOutlet />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'friends',
        element: <Friends />,
      },
      {
        path: 'search',
        element: <Search />,
      },
      {
        path: 'post',
        children: [
          {
            path: 'create',
            element: <AddPost />,
          },
          {
            path: 'edit/:postId',
            element: <UpdatePost />,
          },
          {
  path: 'delete/:postId',
  element: <DeletePost postId={undefined} onClose={() => {}} />,
},

          {
  path: ':postId/comment',
  element: <AddComment onCommentAdded={() => {}} />, // Pass a dummy function
},
        ],
      },
      {
        path: 'profile',
        children: [
          {
            path: 'create',
            element: <CreateUserProfile />,
          },
          {
            path: 'edit',
            element: <EditProfilePage />,
          },
          {
            path: ':userId',
            element: <OtherProfile />,
          },
        ],
      },
      {
        path: 'settings',
        children: [
          {
            path: 'change-password',
            element: <ChangePassword />,
          },
        ],
      },
    ],
  },

  // 404 Route
  {
    path: '*',
    element: <NotFound />,
  },
];

// Route Configuration Types
export interface RouteConfig {
  path: string;
  element: React.ReactNode;
  children?: RouteConfig[];
}

// Helper function to generate breadcrumbs
export const getBreadcrumbs = (pathname: string): { label: string; path: string }[] => {
  const paths = pathname.split('/').filter(Boolean);
  return paths.map((path, index) => {
    const fullPath = `/${paths.slice(0, index + 1).join('/')}`;
    // Convert path to breadcrumb label (e.g., 'create-post' -> 'Create Post')
    const label = path
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    return { label, path: fullPath };
  });
};

// Helper function to check if a route exists
export const routeExists = (path: string): boolean => {
  const findRoute = (routes: RouteObject[], targetPath: string): boolean => {
    for (const route of routes) {
      if (route.path === targetPath) return true;
      if (route.children) {
        const found = findRoute(route.children, targetPath);
        if (found) return true;
      }
    }
    return false;
  };

  return findRoute(routes, path);
};

export default routes;