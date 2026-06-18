import { useNavigate } from "react-router";
import Footer from "../components/Footer";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center">

        {/* Illustration */}
        <div className="relative mb-6">
          <div className="w-32 h-32 bg-blue-50 rounded-full flex items-center justify-center">
            <span className="text-5xl">🔗</span>
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-xs">!</span>
          </div>
        </div>

        {/* 404 */}
        <h1 className="text-5xl font-bold text-blue-600 mb-2">404</h1>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Page Not Found</h2>
        <p className="text-sm text-gray-400 max-w-xs mb-8">
          The page you're looking for doesn't exist. It may have been moved,
          deleted, or the link might be broken.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mb-12">
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-blue-600 text-white px-6 py-2 rounded-md text-sm hover:bg-blue-700 flex items-center justify-center gap-1"
          >
            ← Go to Dashboard
          </button>
          <button
            onClick={() => navigate("/")}
            className="border border-gray-300 text-gray-600 px-6 py-2 rounded-md text-sm hover:bg-gray-100"
          >
            Report an Issue
          </button>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl w-full">
          <div
            className="bg-white border rounded-lg p-4 text-left cursor-pointer hover:shadow-md"
            onClick={() => navigate("/dashboard")}
          >
            <span className="text-lg mb-2 block">📊</span>
            <p className="text-sm font-semibold text-gray-700">Check Analytics</p>
            <p className="text-xs text-gray-400 mt-1">
              Track your active links and traffic sources in real-time.
            </p>
          </div>
          <div
            className="bg-white border rounded-lg p-4 text-left cursor-pointer hover:shadow-md"
            onClick={() => navigate("/links/create")}
          >
            <span className="text-lg mb-2 block">🔗</span>
            <p className="text-sm font-semibold text-gray-700">New ShortLink</p>
            <p className="text-xs text-gray-400 mt-1">
              Create a brand new architected URL in seconds.
            </p>
          </div>
          <div
            className="bg-white border rounded-lg p-4 text-left cursor-pointer hover:shadow-md"
            onClick={() => navigate("/")}
          >
            <span className="text-lg mb-2 block">⚡</span>
            <p className="text-sm font-semibold text-gray-700">Developer API</p>
            <p className="text-xs text-gray-400 mt-1">
              Integrate our link infrastructure into your apps.
            </p>
          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
};

export default NotFoundPage;