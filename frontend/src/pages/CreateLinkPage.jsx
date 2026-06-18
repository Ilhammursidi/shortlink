import { useState } from "react";
import { Link, useNavigate } from "react-router";
import api from "../api/axios";
import { useAuth } from "../hooks/useAuth";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const CreateLinkPage = () => {
  const { getUser } = useAuth();
  const user = getUser();
  const navigate = useNavigate();

  const [originalURL, setOriginalURL] = useState("");
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const previewSlug = slug || "my-custom-slug";
  const baseURL = import.meta.env.VITE_BASE_URL;

  const handleCreate = async () => {
    setError(null);
    setLoading(true);
    try {
      const finalSlug = slug || Math.random().toString(36).substring(2, 8);
      await api.post("/api/links", {
        user_id: user.id,
        original_url: originalURL,
        slug: finalSlug,
      });
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="flex-1 w-full max-w-xl mx-auto py-8 px-4">

        {/* Back */}
        <Link
          to="/dashboard"
          className="text-sm text-gray-500 hover:text-blue-600 flex items-center gap-1 mb-4"
        >
          ← Back to Dashboard
        </Link>

        <h2 className="text-xl font-bold text-gray-900 mb-1">
          Create New Short Link
        </h2>
        <p className="text-sm text-gray-400 mb-6">
          Transform your long URLs into clean, manageable assets.
        </p>

        {/* Form Card */}
        <div className="bg-white border rounded-lg p-5 sm:p-6 space-y-5">

          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Destination URL */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
              Destination URL <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center border rounded-lg px-3 py-2 gap-2 focus-within:ring-2 focus-within:ring-blue-500">
              <span className="text-gray-400 text-sm shrink-0">🔗</span>
              <input
                type="text"
                value={originalURL}
                onChange={(e) => setOriginalURL(e.target.value)}
                placeholder="https://example.com/your-long-url-here"
                className="flex-1 text-sm focus:outline-none min-w-0"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Ensure your URL starts with http:// or https://
            </p>
          </div>

          {/* Custom Slug */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
              Custom Slug (Optional)
            </label>
            <div className="flex items-center border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
              <span className="bg-gray-100 px-3 py-2 text-sm text-gray-500 border-r shrink-0">
                shortlink:8080/
              </span>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="my-custom-slug"
                className="flex-1 px-3 py-2 text-sm focus:outline-none min-w-0"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Leave blank to generate a random unique identifier.
            </p>
          </div>

          {/* Live Preview */}
          <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3">
            <p className="text-xs text-blue-600 font-semibold mb-1">
              👁 LIVE PREVIEW
            </p>
            <p className="text-sm text-gray-700 break-all">
              Your short link will be:{" "}
              <span className="text-blue-600 font-medium">
                {baseURL}/{previewSlug}
              </span>
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleCreate}
              disabled={loading || !originalURL}
              className="bg-blue-600 text-white px-6 py-2 rounded-md text-sm hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-1"
            >
              {loading ? "Creating..." : "Create Link ⚡"}
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2 text-center"
            >
              Cancel
            </button>
          </div>

        </div>

        {/* Info Section */}
        <div className="flex flex-col sm:flex-row gap-6 mt-6">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-sm shrink-0">
              📊
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700">
                Real-time Analytics
              </p>
              <p className="text-xs text-gray-400">
                Track every click, geographical location, and referral source instantly.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm shrink-0">
              📱
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700">
                Auto-generated QR
              </p>
              <p className="text-xs text-gray-400">
                Every link automatically creates a high-resolution QR code for print.
              </p>
            </div>
          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
};

export default CreateLinkPage;