import React from 'react';
import Loader from './Loader.jsx';

const LoadingSpinner = ({ message = "Loading...", className = "" }) => {
  return (
    <div className={` flex items-center justify-center ${className}`}>
      <div className="text-center">
        <Loader />
        <p className={`font-medium mt-4`}>{message}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
