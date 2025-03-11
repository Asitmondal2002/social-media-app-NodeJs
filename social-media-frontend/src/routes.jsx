import { Navigate, useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { lazy } from 'react';
import React from 'react';

// Page Components
import Home from "./pages/home";
import Login from "./pages/login";
import Signup from "./pages/signup";
import AddComment from "./pages/add_comment";
import AddPost from "./pages/add_post";
import ChangePassword from "./pages/change-password";
import CreateUserProfile from "./pages/create_user_profile";
import DeletePost from "./pages/delete_post";
import EditProfilePage from "./pages/edit_profile_page";
import Friends from "./pages/friends";
import OtherProfile from "./pages/Otherprofile";
import PasswordSuccess from "./pages/password_success";
import Search from "./pages/search";
import UpdatePost from "./pages/update_post";
import NotFound from "./pages/404";
import Dashboard from "./pages/dashboard"; // ✅ Dashboard Component
import Profile from './pages/Profile';
import FullPost from './pages/FullPost';

// Layout Components
import Navigation from "./components/layout/Navigation";

// Lazy load components
const HomePage = lazy(() => import('./pages/Home'));
const LoginPage = lazy(() => import('./pages/Login'));
const SignupPage = lazy(() => import('./pages/Signup'));
const CreatePostComponent = lazy(() => import('./components/post/CreatePost'));

// ✅ Loader Component for smoother transitions
const Loader = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

// ✅ Navigation Wrapper for Protected Pages
const NavigationWithOutlet = () => (
  <Navigation>
    <Outlet />
  </Navigation>
);

// ✅ Protected Route Wrapper (Requires Authentication)
const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <Loader />;
  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

// ✅ Public Route Wrapper (Accessible only when NOT logged in)
const PublicRoute = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <Loader />;
  return user ? <Navigate to="/" replace /> : <>{children}</>;
};

// ✅ Main Routes Configuration
export const routes = [
  // Public Routes (Login & Signup)
  {
    path: "/login",
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  {
    path: "/signup",
    element: (
      <PublicRoute>
        <SignupPage />
      </PublicRoute>
    ),
  },
  {
    path: "/password-success",
    element: <PasswordSuccess />,
  },

  // Protected Routes (Require Authentication)
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <NavigationWithOutlet />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <HomePage /> }, // ✅ Home Page
      { path: "dashboard", element: <Dashboard /> }, // ✅ Dashboard
      { path: "friends", element: <Friends /> },
      { path: "search", element: <Search /> },

      // Post Routes
      {
        path: "post",
        children: [
          { path: "create", element: <AddPost /> },
          { path: "edit/:postId", element: <UpdatePost /> },
          { path: "delete/:postId", element: <DeletePost /> },
          { path: ":postId/comment", element: <AddComment /> },
        ],
      },

      // Profile Routes
      {
        path: "profile",
        children: [
          { index: true, element: <Profile /> },
          { path: "create", element: <CreateUserProfile /> },
          { path: "edit", element: <EditProfilePage /> },
          { path: ":userId", element: <OtherProfile /> }, // ✅ User Profile by ID
        ],
      },

      // Settings Routes
      {
        path: "settings",
        children: [{ path: "change-password", element: <ChangePassword /> }],
      },
    ],
  },

  // 404 Page (Not Found)
  {
    path: "*",
    element: <NotFound />,
  },

  // New routes
  {
    path: '/create-post',
    element: <Navigation><CreatePostComponent /></Navigation>,
  },
  {
    path: '/post/:postId',
    element: <Navigation><FullPost /></Navigation>,
  },
];

// ✅ Helper function to generate breadcrumbs
export const getBreadcrumbs = (pathname) => {
  const paths = pathname.split("/").filter(Boolean);
  return paths.map((path, index) => {
    const fullPath = `/${paths.slice(0, index + 1).join("/")}`;
    const label = path
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    return { label, path: fullPath };
  });
};

// ✅ Helper function to check if a route exists
export const routeExists = (path) => {
  const findRoute = (routes, targetPath) => {
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

// Create a simple placeholder for CreatePost until we have the component
const CreatePost = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold mb-4">Create Post</h1>
    <p>Create post component will be implemented here.</p>
  </div>
);

export default routes;
