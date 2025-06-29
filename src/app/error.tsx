'use client';

import { useEffect } from 'react';
import Button from '@/components/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Simple error logging without potential apply() issues
    try {
      if (typeof window !== 'undefined' && window.console && window.console.error) {
        window.console.error('Application error:', error?.message || 'Unknown error');
      }
    } catch (e) {
      // Prevent any console errors from breaking the app
    }
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-300 mb-4">500</h1>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Something went wrong!
          </h2>
          <p className="text-gray-600 mb-8">
            We apologize for the inconvenience. An unexpected error has occurred.
          </p>
        </div>

        <div className="space-y-4">
          <Button
            onClick={() => {
              try {
                reset();
              } catch (e) {
                window.location.reload();
              }
            }}
            variant="primary"
            size="lg"
            className="w-full"
          >
            Try again
          </Button>

          <Button
            onClick={() => window.location.href = '/'}
            variant="outline"
            size="lg"
            className="w-full"
          >
            Go to Homepage
          </Button>
        </div>

        {/* Only show error details in development */}
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-8 text-left">
            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
              Error Details (Development Only)
            </summary>
            <div className="mt-4 p-4 bg-gray-100 rounded text-xs text-red-600 overflow-auto max-h-64">
              <div><strong>Error:</strong></div>
              <div>{error?.message || 'Unknown error occurred'}</div>
              <br />
              <div><strong>Type:</strong></div>
              <div>{error?.name || 'Error'}</div>
              {error?.digest && (
                <>
                  <br />
                  <div><strong>Digest:</strong></div>
                  <div>{error.digest}</div>
                </>
              )}
            </div>
          </details>
        )}
      </div>
    </div>
  );
}
