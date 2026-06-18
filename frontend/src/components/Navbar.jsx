import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

const Navbar = () => {
  const { getUser, logout } = useAuth();
  const user = getUser();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm px-6 py-4">
      <div className="max-w-5xl mx-auto flex justify-between items-center">

        {/* Logo */}
        <h1 className="font-bold text-lg">
          ShortLink
        </h1>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-sm text-gray-600">
          <Link to="/dashboard" className="hover:text-blue-600 border-b-2 border-blue-600">
            Dashboard
          </Link>
          <span className="hover:text-blue-600 cursor-pointer">Analytics</span>
          <span className="hover:text-blue-600 cursor-pointer">Links</span>
        </div>

        {/* Desktop Right */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => navigate("/links/create")}
            className="bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm hover:bg-blue-700"
          >
            + Create New Link
          </button>
          <div
            className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden flex items-center justify-center cursor-pointer text-sm font-bold text-gray-600"
            onClick={() => navigate("/profile")}
          >
            {user?.picture ? (
              <img src={user.picture} alt="profile" className="w-full h-full object-cover" />
            ) : (
              user?.name?.[0]?.toUpperCase()
            )}
          </div>
          <button
            onClick={logout}
            className="text-sm text-gray-600 hover:text-red-500"
          >
            Logout
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-gray-600 text-xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>

      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mt-3 px-6 pb-4 flex flex-col gap-3 text-sm text-gray-600 border-t pt-3">
          <Link to="/dashboard" className="hover:text-blue-600">Dashboard</Link>
          <span className="hover:text-blue-600 cursor-pointer">Analytics</span>
          <span className="hover:text-blue-600 cursor-pointer">Links</span>
          <button
            onClick={() => { navigate("/links/create"); setMenuOpen(false); }}
            className="bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm hover:bg-blue-700 text-left"
          >
            + Create New Link
          </button>
          <button
            onClick={() => { navigate("/profile"); setMenuOpen(false); }}
            className="text-left hover:text-blue-600"
          >
            Profile
          </button>
          <button
            onClick={logout}
            className="text-left text-red-500 hover:text-red-600"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;