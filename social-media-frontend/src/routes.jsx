// src/routes.jsx
import { Navigate, useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";

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
import Dashboard from "./pages/dashboard"; // ✅ Import Dashboard

// Layout Components
import Navigation from "./components/layout/Navigation";

// Navigation Wrapper
const NavigationWithOutlet = () => (
  <Navigation>
    <Outlet />
  </Navigation>
);

// Protected Route Wrapper (Requires Authentication)
const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

// Public Route Wrapper (Accessible only when NOT logged in)
const PublicRoute = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  return user ? <Navigate to="/" replace /> : <>{children}</>;
};

// Main Routes Configuration
export const routes = [
  // Public Routes (Login & Signup)
  {
    path: "/login",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: "/signup",
    element: (
      <PublicRoute>
        <Signup />
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
      { index: true, element: <Home /> },
      { path: "dashboard", element: <Dashboard /> }, // ✅ Added Dashboard Route
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
          { path: "create", element: <CreateUserProfile /> },
          { path: "edit", element: <EditProfilePage /> },
          { path: ":userId", element: <OtherProfile /> },
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
];

// Helper function to generate breadcrumbs
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

// Helper function to check if a route exists
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

export default routes;
