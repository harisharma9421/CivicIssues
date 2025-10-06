import React, { useState } from 'react';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import withLoading from '../components/withLoading.jsx';
import { useApiLoading } from '../hooks/useApiLoading.js';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';

// Example component to be wrapped with loading
const DataDisplay = ({ data }) => (
  <div className="p-4">
    <h3 className="text-lg font-semibold mb-2">Data Display</h3>
    <pre className="bg-gray-100 p-2 rounded">
      {JSON.stringify(data, null, 2)}
    </pre>
  </div>
);

// Wrap component with loading HOC
const LoadingDataDisplay = withLoading(DataDisplay, "Loading data display...");

const LoadingExamples = () => {
  const [basicLoading, setBasicLoading] = useState(false);
  const [data, setData] = useState(null);
  const { loading: apiLoading, error, execute } = useApiLoading();

  // Simulate basic loading
  const handleBasicLoading = () => {
    setBasicLoading(true);
    setTimeout(() => {
      setBasicLoading(false);
    }, 2000);
  };

  // Simulate API call with useApiLoading hook
  const handleApiCall = async () => {
    await execute(
      // Simulate API call
      () => new Promise(resolve => 
        setTimeout(() => resolve({ 
          success: true, 
          data: { message: 'API call successful!', timestamp: new Date().toISOString() }
        }), 1500)
      ),
      // Success callback
      (result) => {
        setData(result.data);
      },
      // Error callback (optional)
      (error) => {
        console.error('API call failed:', error);
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Loading Animation Examples
          </h1>
          <p className="text-gray-600">
            Demonstrations of different loading patterns in CivicConnect
          </p>
        </div>

        {/* Basic LoadingSpinner Example */}
        <Card>
          <h2 className="text-xl font-semibold mb-4">1. Basic Loading Spinner</h2>
          <div className="space-y-4">
            <Button onClick={handleBasicLoading} disabled={basicLoading}>
              {basicLoading ? 'Loading...' : 'Trigger Basic Loading'}
            </Button>
            
            {basicLoading && (
              <div className="h-64">
                <LoadingSpinner 
                  message="Loading basic example..." 
                  className="bg-white"
                />
              </div>
            )}
          </div>
        </Card>

        {/* API Loading Hook Example */}
        <Card>
          <h2 className="text-xl font-semibold mb-4">2. API Loading Hook</h2>
          <div className="space-y-4">
            <Button 
              onClick={handleApiCall} 
              disabled={apiLoading}
              loading={apiLoading}
            >
              {apiLoading ? 'Making API Call...' : 'Simulate API Call'}
            </Button>
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded p-4">
                <p className="text-red-700">Error: {error}</p>
              </div>
            )}
            
            {data && !apiLoading && (
              <div className="bg-green-50 border border-green-200 rounded p-4">
                <h3 className="font-semibold text-green-800 mb-2">API Response:</h3>
                <pre className="text-sm text-green-700">
                  {JSON.stringify(data, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </Card>

        {/* HOC Loading Example */}
        <Card>
          <h2 className="text-xl font-semibold mb-4">3. Higher-Order Component Loading</h2>
          <div className="space-y-4">
            <p className="text-gray-600">
              This demonstrates wrapping a component with loading state using the withLoading HOC.
            </p>
            
            <LoadingDataDisplay
              data={data}
              isLoading={apiLoading}
              loadingMessage="Loading wrapped component..."
              loadingClassName="bg-white"
            />
          </div>
        </Card>

        {/* Lazy Loading Info */}
        <Card>
          <h2 className="text-xl font-semibold mb-4">4. Lazy Loading</h2>
          <div className="space-y-4">
            <p className="text-gray-600">
              All major components and pages in this application are lazy-loaded using React.lazy() 
              and Suspense. This means:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Components are only loaded when needed</li>
              <li>Initial bundle size is reduced</li>
              <li>Loading animations show during component loading</li>
              <li>Better performance and user experience</li>
            </ul>
            <div className="bg-blue-50 border border-blue-200 rounded p-4">
              <p className="text-blue-800">
                <strong>Note:</strong> Navigate between different pages to see lazy loading in action!
              </p>
            </div>
          </div>
        </Card>

        {/* Implementation Notes */}
        <Card>
          <h2 className="text-xl font-semibold mb-4">Implementation Notes</h2>
          <div className="text-sm text-gray-600 space-y-2">
            <p><strong>Loader Component:</strong> Custom animated loader with bars and bouncing ball</p>
            <p><strong>LoadingSpinner:</strong> Wrapper with consistent styling and messaging</p>
            <p><strong>withLoading HOC:</strong> Higher-order component for adding loading states</p>
            <p><strong>useApiLoading Hook:</strong> Custom hook for API loading and error management</p>
            <p><strong>Lazy Loading:</strong> All routes use React.lazy() and Suspense</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoadingExamples;
