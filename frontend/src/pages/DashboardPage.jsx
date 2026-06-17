import { useState, useEffect } from "react";
import api from "../api/axios";
import { useAuth } from "../hooks/useAuth";
import Navbar from "../components/Navbar";
import LinkCard from "../components/LinkCard";

const DashboardPage = () => {
  const { getUser } = useAuth();
  const user = getUser();

  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    original_url: "",
    slug: "",
  });

  const fetchLinks = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/api/links/${user.id}`);
      setLinks(res.data || []);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch links");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await api.post("/api/links", {
        user_id: user.id,
        original_url: form.original_url,
        slug: form.slug,
      });
      setForm({ original_url: "", slug: "" });
      fetchLinks();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create link");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Navbar */}
      <Navbar />

      <div className="max-w-2xl mx-auto py-8 px-4">

        {/* Form Buat Link */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-lg font-semibold mb-4">Buat Shortlink</h2>

          {/* Error */}
          {error && (
            <p className="text-red-500 text-sm mb-4">{error}</p>
          )}

          {/* Original URL */}
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">
              Original URL
            </label>
            <input
              type="text"
              name="original_url"
              value={form.original_url}
              onChange={handleChange}
              placeholder="https://example.com/very-long-url"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Slug */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Slug</label>
            <div className="flex items-center border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
              <span className="bg-gray-100 px-3 py-2 text-gray-500 text-sm border-r">
                shortlink/
              </span>
              <input
                type="text"
                name="slug"
                value={form.slug}
                onChange={handleChange}
                placeholder="my-link"
                className="flex-1 px-3 py-2 focus:outline-none text-sm"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleCreate}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Buat Link
          </button>
        </div>

        {/* List Link */}
        <h2 className="text-lg font-semibold mb-3">Link Saya</h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : links.length === 0 ? (
          <p className="text-center text-gray-500">Belum ada link</p>
        ) : (
          links.map((link) => (
            <LinkCard key={link.id} link={link} />
          ))
        )}

      </div>
    </div>
  );
};

export default DashboardPage;