// src/components/layout/Sidebar.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Home', path: '/', icon: '🏠' },
    { name: 'Friends', path: '/friends', icon: '👥' },
    { name: 'Profile', path: '/profile', icon: '👤' },
    { name: 'Settings', path: '/settings', icon: '⚙️' },
  ];

  if (!user) return null;

  return (
    <aside className="w-64 bg-white border-r h-screen sticky top-0">
      <nav className="p-4">
        <ul className="space-y-2">
          {navigation.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${
                  location.pathname === item.path
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};