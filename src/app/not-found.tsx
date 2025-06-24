import Link from 'next/link';
import Button from '@/components/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Page Not Found
          </h2>
          <p className="text-gray-600 mb-8">
            Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link href="/">
            <Button variant="primary" size="lg" className="w-full">
              Go to Homepage
            </Button>
          </Link>
          
          <Link href="/blog">
            <Button variant="outline" size="lg" className="w-full">
              Browse Blog
            </Button>
          </Link>
        </div>
        
        <p className="mt-8 text-sm text-gray-500">
          If you believe this is an error, please{' '}
          <a href="mailto:support@bajramedia.com" className="text-primary hover:underline">
            contact support
          </a>
        </p>
      </div>
    </div>
  );
}
