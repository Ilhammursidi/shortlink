import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import api from "../api/axios";
import Navbar from "../components/Navbar";

const LandingPage = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleShorten = async () => {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const slug = Math.random().toString(36).substring(2, 8);
      const res = await api.post("/api/links", {
        user_id: user.id,
        original_url: url,
        slug,
      });
      setResult(res.data.short_url);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to shorten URL");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* Navbar */}
      <nav className="bg-white shadow-sm px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <h1 className="font-bold text-lg">
            ShortLink
          </h1>
          <div className="flex gap-6 text-sm text-gray-600">
 
          </div>
        </div>
        <div className="flex gap-3">
          {isAuthenticated() ? (
            <button
              onClick={logout}
              className="bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm hover:bg-blue-700"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm hover:bg-blue-700"
            >
              Login
            </Link>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center text-center py-20 px-4">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Shorten URLs. <span className="text-blue-600">Share Easily.</span>
        </h2>
        <p className="text-gray-500 max-w-md mb-8">
          Create short, memorable links for your team communications.
          Transform long, cumbersome URLs into powerful digital assets that
          drive engagement.
        </p>
        <div className="flex gap-3 mb-10">
          <Link
            to={isAuthenticated() ? "/dashboard" : "/register"}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 text-sm"
          >
            Get Started
          </Link>
          <a
            href="#features"
            className="border border-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-100 text-sm"
          >
            Learn More
          </a>
        </div>

        {/* Input Shortener */}
        <div className="flex items-center bg-white border rounded-lg overflow-hidden shadow-sm w-full max-w-lg">
          <span className="px-3 text-gray-400 text-sm border-r py-2">URL</span>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://very-long-architecture-url-example-of-492160-v1"
            className="flex-1 px-3 py-2 text-sm focus:outline-none"
          />
          <button
            onClick={handleShorten}
            className="bg-blue-600 text-white px-4 py-2 text-sm hover:bg-blue-700"
          >
            Shorten
          </button>
        </div>

        {/* Result */}
        {result && (
          <div className="mt-4 text-sm text-green-600">
            Short URL:{" "}
            <a href={result} target="_blank" rel="noreferrer" className="underline">
              {result}
            </a>
          </div>
        )}
        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
      </section>

      {/* Features */}
      <section id="features" className="bg-gray-100 py-16 px-8">
        <p className="text-xs text-blue-600 font-semibold uppercase mb-2">
          Architectural Features
        </p>
        <h3 className="text-2xl font-bold text-gray-900 mb-8">
          Built for Enterprise Precision
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center mb-4">
              ⚡
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">Easy Create</h4>
            <p className="text-sm text-gray-500">
              Instantly generate high-performance short links with a single
              click or through our surgical API endpoints.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center mb-4">
              🔗
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">Custom Slugs</h4>
            <p className="text-sm text-gray-500">
              Maintain brand authority with flexible, custom link endings that
              resonate with your digital audience.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center mb-4">
              👥
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">Team Ready</h4>
            <p className="text-sm text-gray-500">
              Collaborate across departments with shared workspaces, permissions,
              and unified analytics dashboards.
            </p>
          </div>
        </div>
      </section>

      {/* Data Insight */}
      <section className="py-16 px-8 flex flex-col md:flex-row items-center justify-between gap-12 max-w-5xl mx-auto">
        <img className="h-80 rounded-md shadow-2xl" src="/public/komen.png" alt="" />
        <div className="w-full md:w-1/2">
          <p className="text-xs text-blue-600 font-semibold uppercase mb-2">
            Data Driven Insights
          </p>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Observe your link architecture in real-time.
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            Every click is a data point. Our dashboard provides surgical
            precision into where your traffic originates, who is engaging,
            and how your team communications are performing across the globe.
          </p>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-center gap-2">
              <span className="text-blue-600">✔</span> Geographic Distribution Maps
            </li>
            <li className="flex items-center gap-2">
              <span className="text-blue-600">✔</span> Device & Browser Breakdown
            </li>
            <li className="flex items-center gap-2">
              <span className="text-blue-600">✔</span> UTM Parameter Tracking
            </li>
          </ul>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t py-6 px-8 mt-auto">
        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-400 gap-4">
          <p>© 2024 SHORTLINK, THE DIGITAL ARCHITECT.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gray-600">PRIVACY POLICY</a>
            <a href="#" className="hover:text-gray-600">TERMS OF SERVICE</a>
            <a href="#" className="hover:text-gray-600">API DOCUMENTATION</a>
            <a href="#" className="hover:text-gray-600">SUPPORT</a>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;