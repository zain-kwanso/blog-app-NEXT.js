import React from "react";
import Link from "next/link";

const NotFoundPage: React.FC = (): React.JSX.Element => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">
          Oops! The page you’re looking for doesn’t exist.
        </p>
        <p className="text-gray-500 mb-6">
          It seems like you might have taken a wrong turn.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-blue-500 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-colors"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
