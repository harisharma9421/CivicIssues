import React from 'react';
import LoadingSpinner from './LoadingSpinner.jsx';

/**
 * Higher-order component that adds loading state functionality
 * @param {React.Component} WrappedComponent - Component to wrap
 * @param {string} defaultMessage - Default loading message
 */
const withLoading = (WrappedComponent, defaultMessage = "Loading...") => {
  return function WithLoadingComponent(props) {
    if (props.isLoading) {
      return (
        <LoadingSpinner 
          message={props.loadingMessage || defaultMessage}
          className={props.loadingClassName}
        />
      );
    }

    return <WrappedComponent {...props} />;
  };
};

export default withLoading;
