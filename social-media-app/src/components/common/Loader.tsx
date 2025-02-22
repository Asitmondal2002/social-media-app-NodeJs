// src/components/common/Loader.tsx
import React from 'react';

interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
}

export const Loader: React.FC<LoaderProps> = ({ size = 'medium' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className={`${sizeClasses[size]} border-4 border-gray-200 border-t-primary rounded-full animate-spin`}
      />
    </div>
  );
};
