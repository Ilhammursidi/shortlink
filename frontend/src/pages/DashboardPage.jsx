import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router"; // 1. Ditambahkan useLocation
import api from "../api/axios";
import { useAuth } from "../hooks/useAuth";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { toast } from "sonner";

const DashboardPage = () => {
  const { getUser } = useAuth();
  const user = getUser();
  const navigate = useNavigate();
  const location = useLocation(); // 2. Inisialisasi useLocation

  const [links, setLinks] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const perPage = 4;

  // 3. Efek untuk menangkap status sukses login dari halaman sebelumnya
  useEffect(() => {
    if (location.state?.loginSuccess) {
      toast.success("Login berhasil! Selamat datang kembali.");
      
      // Bersihkan state di browser history agar saat di-refresh toast tidak muncul lagi
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const fetchLinks = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/api/links/${user.id}`);
      const data = Array.isArray(res.data.results) ? res.data.results : [];
      setLinks(data);
      setFiltered(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch links");
      setLinks([]);
      setFiltered([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      links.filter(
        (l) =>
          l.slug.toLowerCase().includes(q) ||
          l.original_url.toLowerCase().includes(q)
      )
    );
    setPage(1);
  }, [search, links]);

  const handleCopy = (shortURL) => {
    navigator.clipboard.writeText(shortURL);
    toast.success("Copied!");
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus link ini?")) return;
    try {
      await api.delete(`/api/links/${id}`);
      fetchLinks();
      toast.success("Link deleted successfully"); // Tambahan toast agar lebih informatif
    } catch {
      toast.error("Failed to delete");
    }
  };

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="flex-1 w-full max-w-2xl mx-auto py-8 px-4">

        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">My Links</h2>
            <p className="text-sm text-gray-400">
              Manage and track your shortened digital assets.
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400 uppercase font-semibold tracking-wide">
              Total Active
            </p>
            <p className="text-3xl font-bold text-blue-600">{links.length}</p>
          </div>
        </div>

        {/* Search */}
        <div className="flex items-center bg-white border rounded-lg px-3 py-2 mb-4 gap-2">
          <span className="text-gray-400 text-sm">🔍</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or URL..."
            className="flex-1 text-sm focus:outline-none"
          />
          <span className="text-gray-400 cursor-pointer">⚙</span>
        </div>

        {/* Error */}
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {/* Create button mobile */}
        <button
          onClick={() => navigate("/links/create")}
          className="md:hidden w-full mb-4 bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700"
        >
          + Create New Link
        </button>

        {/* Link List */}
        {loading ? (
          <p className="text-center text-gray-400 py-10">Loading...</p>
        ) : paginated.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-400 mb-4">Belum ada link</p>
            <button
              onClick={() => navigate("/links/create")}
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
            >
              + Create Your First Link
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {paginated.map((link) => {
              // 4. Definisikan string URL pendek agar rapi dan bisa dipakai berulang
              const shortUrlString = `http://shortlink:8080/r/${link.slug}`;
              
              return (
                <div
                  key={link.id}
                  className="bg-white border rounded-lg px-4 py-3 flex justify-between items-start sm:items-center gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-blue-600 text-sm font-medium truncate">
                      🔗 <a href={shortUrlString} target="_blank" rel="noreferrer">{shortUrlString}</a>
                    </p>
                    <p className="text-gray-400 text-xs truncate">
                      {link.original_url}
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      📅{" "}
                      {new Date(link.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }).toUpperCase()}
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      // 5. Mengubah customURL menjadi shortUrlString yang sudah valid
                      onClick={() => handleCopy(shortUrlString)}
                      className="p-1.5 hover:bg-gray-100 rounded text-gray-500 text-sm"
                      title="Copy"
                    >
                      📋
                    </button>
                    <button
                      onClick={() => handleDelete(link.id)}
                      className="p-1.5 hover:bg-gray-100 rounded text-gray-500 text-sm"
                      title="Delete"
                    >
                      🗑
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-6 text-sm text-gray-500">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="hover:text-blue-600 disabled:opacity-40"
            >
              ‹ Prev Page
            </button>
            <span>{page} of {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="hover:text-blue-600 disabled:opacity-40"
            >
              Next ›
            </button>
          </div>
        )}

      </div>

      <Footer />
    </div>
  );
};

export default DashboardPage;
