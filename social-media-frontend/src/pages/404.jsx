import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center">
      <h1 className="text-6xl font-bold text-red-600">404</h1>
      <p className="text-xl text-gray-700 mt-2">
        Oops! The page you are looking for does not exist.
      </p>
      <Link
        to="/"
        className="mt-4 px-6 py-2 bg-blue-600 text-white text-lg rounded-lg shadow-md hover:bg-blue-700 transition-all"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
