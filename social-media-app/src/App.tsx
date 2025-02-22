import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useRoutes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthProvider } from './context/AuthContext';
import routes from './routes';
import { Loader } from './components/common/Loader';

// Initialize React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const AppContent: React.FC = () => {
  const element = useRoutes(routes);
  
  return (
    <React.Suspense 
      fallback={
        <div className="h-screen w-screen flex items-center justify-center">
          <Loader size="large" />
        </div>
      }
    >
      {element}
    </React.Suspense>
  );
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <div className="min-h-screen bg-gray-50">
            <AppContent />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                className: 'text-sm',
                success: {
                  className: 'bg-green-50 text-green-800 border border-green-100',
                },
                error: {
                  className: 'bg-red-50 text-red-800 border border-red-100',
                },
              }}
            />
          </div>
        </AuthProvider>
    </QueryClientProvider>
  );
};

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // You could send this to an error reporting service
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Oops! Something went wrong.
            </h1>
            <p className="text-gray-600 mb-4">
              We're sorry for the inconvenience. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Wrap the App with ErrorBoundary
const AppWithErrorBoundary: React.FC = () => {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
};

export default AppWithErrorBoundary;