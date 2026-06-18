import { useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../hooks/useAuth";
import Footer from "../components/Footer";
import { Eye, EyeOff } from "lucide-react"; // Diubah dari EyeClosed ke EyeOff

const LoginPage = () => {
  const { login, loading, error } = useAuth();
  const [form, setForm] = useState({
    id: "",
    email: "",
    password: "",
  });

  // State baru untuk mengontrol visibilitas password
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    await login(form);
  };

  // Fungsi toggle mata
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">

        {/* Title */}
        <h1 className="text-2xl font-bold text-center mb-6">
          ShortLink
        </h1>

        {/* Error */}
        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="email@example.com"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Password</label>
          
          {/* Container pembungkus harus relative */}
          <div className="relative flex items-center">
            <input
              // Tipe input berubah dinamis berdasarkan state showPassword
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••"
              // Ditambahkan pr-10 agar teks password tidak tertutup oleh ikon mata
              className="w-full border rounded-lg pl-3 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
            {/* Tombol mata diletakkan absolut di kanan */}
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Login"}
        </button>

        {/* Link ke Register */}
        <p className="text-sm text-center mt-4">
          Belum punya akun?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>

      </div>
    </div>
  );
};

export default LoginPage;
