// src/components/common/Input.jsx
import React from "react";

const Input = ({
  type = "text",
  placeholder,
  value,
  onChange,
  name,
  error,
  label,
  required = false,
  className = "",
}) => {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 ${
          error ? "border-red-500" : "border-gray-300"
        } ${className}`}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Input;
