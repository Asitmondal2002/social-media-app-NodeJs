// src/components/common/Avatar.jsx
import React from "react";

const Avatar = ({
  src,
  alt = "User avatar",
  size = "medium",
  className = "",
}) => {
  const sizeClasses = {
    small: "w-8 h-8",
    medium: "w-12 h-12",
    large: "w-16 h-16",
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-full overflow-hidden ${className}`}
    >
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500 text-xl">
            {alt.charAt(0).toUpperCase()}
          </span>
        </div>
      )}
    </div>
  );
};

export default Avatar;
