import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import Home from './pages/home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import FullPost from './pages/FullPost';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Create a simple layout component
const RootLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto py-6 px-4">
        <Outlet />
      </main>
    </div>
  );
};

// Create the router
const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <ProtectedRoute><Home /></ProtectedRoute>
      },
      {
        path: 'login',
        element: <Login />
      },
      {
        path: 'register',
        element: <Register />
      },
      {
        path: 'profile/:userId',
        element: <ProtectedRoute><Profile /></ProtectedRoute>
      },
      {
        path: 'post/:postId',
        element: <ProtectedRoute><FullPost /></ProtectedRoute>
      }
    ]
  }
]);

export default router; 