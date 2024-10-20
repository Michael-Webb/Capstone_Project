export default function NotFound() {
    return (
      <div className="flex flex-col items-center p-[25vh] min-h-screen text-gray-900 dark:text-white">
        <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="text-lg">
          Sorry, This page does not exist. Please go back to the
          <a href="/h" className="text-blue-500 hover:underline">
            homepage
          </a>
        </p>
      </div>
    );
  }
  