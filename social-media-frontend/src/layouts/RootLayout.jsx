import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar'; // Adjust this path if your Navbar is elsewhere
import { Toaster } from 'react-hot-toast';

const RootLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="container mx-auto py-6 px-4">
        <Outlet />
      </main>
      <Toaster position="top-right" />
    </div>
  );
};

export default RootLayout; 