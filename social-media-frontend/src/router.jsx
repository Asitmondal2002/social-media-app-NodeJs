import React, { Suspense } from "react";
import { createBrowserRouter, Outlet } from "react-router-dom";

// Import only existing components
import Home from "./pages/home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CreatePost from "./components/post/CreatePost";
import Profile from './pages/Profile';
import FullPost from './pages/FullPost';
import NotFound from './pages/NotFound';

// Loading component for Suspense
const Loading = () => (
  <div className="flex justify-center items-center mt-[100px]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
  </div>
);

// Root layout component
const RootLayout = () => {
  return (
    <div className="app">
      <div className="content">
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

// Create router configuration using createBrowserRouter
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<Loading />}>
        <RootLayout />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
      {
        path: "create-post",
        element: <CreatePost />,
      },
      {
        path: 'profile/:userId',
        element: <Profile />
      },
      {
        path: 'post/:postId',
        element: <FullPost />
      },
      {
        path: '*',
        element: <NotFound />
      }
    ],
  },
]);

export default router;
