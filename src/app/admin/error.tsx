'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Button from '@/components/Button';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Admin panel error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 18.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Admin Panel Error
          </h2>
          <p className="text-gray-600 mb-8">
            Something went wrong in the admin panel. Please try again or return to the dashboard.
          </p>
        </div>

        <div className="space-y-4">
          <Button
            onClick={reset}
            variant="primary"
            size="lg"
            className="w-full"
          >
            Try again
          </Button>

          <Link href="/admin">
            <Button variant="outline" size="lg" className="w-full">
              Back to Dashboard
            </Button>
          </Link>

          <Link href="/">
            <Button variant="outline" size="lg" className="w-full">
              Exit Admin Panel
            </Button>
          </Link>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <details className="mt-8 text-left">
            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
              Error Details (Development Only)
            </summary>
            <pre className="mt-4 p-4 bg-gray-100 rounded text-xs text-red-600 overflow-auto">
              {error.message}
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
