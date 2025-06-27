export default function AdminLoading() {
  return (
    <div className="flex items-center justify-center min-h-64">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading admin panel...</p>
      </div>
    </div>
  );
}
