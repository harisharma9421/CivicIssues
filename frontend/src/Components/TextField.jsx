import React, { useState } from 'react'

const TextField = ({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  placeholder, 
  autoComplete, 
  error, 
  icon, 
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div
        className={`relative flex items-center rounded-lg border transition-all duration-200 
          ${
            error
              ? 'border-red-500 focus-within:border-red-600 focus-within:ring-1 focus-within:ring-red-500'
              : isFocused
              ? 'border-indigo-500 focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-500'
              : 'border-gray-300 hover:border-gray-400'
          }
        `}
      >
        {icon && (
          <div
            className={`ml-3 transition-colors duration-200 ${
              error ? 'text-red-500' : isFocused ? 'text-indigo-600' : 'text-gray-400'
            }`}
          >
            {icon}
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`flex-1 h-12 px-4 py-3 rounded-lg border-0 bg-transparent outline-none text-gray-800 placeholder-gray-500 transition-all duration-200 ${
            icon ? 'pl-2' : ''
          }`}
          {...props}
        />
      </div>
      {error && (
        <span className="text-xs text-red-600 font-medium flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </span>
      )}
    </div>
  )
}

export default TextField
