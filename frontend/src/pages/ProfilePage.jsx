import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import api from "../api/axios";
import Footer from "../components/Footer";

const ProfilePage = () => {
    const { getUser, logout } = useAuth();
    const user = getUser();
    const navigate = useNavigate();

    const [emailNotif, setEmailNotif] = useState(true);
    const [uploading, setUploading] = useState(false);
   const [picture, setPicture] = useState(() => {
  const u = JSON.parse(localStorage.getItem("user"));
  return u?.picture || null;
});

    const BACKEND = import.meta.env.VITE_BASE_URL;

    const toAbsURL = (path) => {
        if (!path) return null;
        if (path.startsWith("http")) return path;
        return `${BACKEND}${path}`;
    };

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("picture", file);
            const res = await api.post(`/api/user/${user.id}/picture`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setPicture(res.data.picture);
            const updatedUser = { ...user, picture: res.data.picture };
            localStorage.setItem("user", JSON.stringify(updatedUser));
        } catch {
            ("Failed to upload picture");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">

            {/* Navbar */}
            <nav className="bg-white shadow-sm px-6 py-4">
                <div className="max-w-5xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-8">
                        <h1 className="font-bold text-lg">
                            ShortLink
                        </h1>
                        <div className="hidden md:flex gap-6 text-sm text-gray-500">
                            <span
                                className="hover:text-blue-600 cursor-pointer"
                                onClick={() => navigate("/dashboard")}
                            >
                                Dashboard
                            </span>
                            <span className="hover:text-blue-600 cursor-pointer">Analytics</span>
                            <span className="hover:text-blue-600 cursor-pointer">Links</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-blue-600 font-medium flex items-center gap-1">
                            Profile
                        </span>
                        <button
                            onClick={logout}
                            className="text-sm text-gray-500 hover:text-red-500"
                        >
                            Logout
                        </button>
                        <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden flex items-center justify-center text-sm font-bold text-gray-600">
                            {picture ? (
                                <img src={toAbsURL(picture)} alt="profile" className="w-full h-full object-cover" />
                            ) : (
                                user?.name?.[0]?.toUpperCase()
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Content */}
            <div className="flex-1 w-full max-w-2xl mx-auto py-8 px-4">

                <p className="text-xs text-gray-400 uppercase font-semibold mb-4 tracking-wide">
                    Account Management
                </p>

                <div className="bg-white border rounded-lg p-6 space-y-5">

                    {/* Profile Header */}
                    <div className="flex justify-between items-start">
                        <h2 className="text-lg font-bold text-gray-900">Profile</h2>
                        <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded font-semibold">
                            PRO MEMBER
                        </span>
                    </div>

                    {/* Avatar + Info */}
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center text-xl font-bold text-gray-500">
                                {picture ? (
                                    <img src={picture} alt="profile" className="w-full h-full object-cover" />
                                ) : (
                                    user?.name?.[0]?.toUpperCase()
                                )}
                            </div>
                            <label className="absolute bottom-0 right-0 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer text-white text-xs">
                                ✏
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleUpload}
                                    className="hidden"
                                />
                            </label>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-800">{user?.name}</p>
                            <p className="text-sm text-gray-400">{user?.email}</p>
                            {uploading && <p className="text-xs text-blue-500 mt-1">Uploading...</p>}
                        </div>
                    </div>

                    {/* Email + Tenure */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="border rounded-lg p-3">
                            <p className="text-xs text-gray-400 uppercase font-semibold mb-1">
                                Email Address
                            </p>
                            <p className="text-sm text-gray-700">{user?.email}</p>
                        </div>
                        <div className="border rounded-lg p-3">
                            <p className="text-xs text-gray-400 uppercase font-semibold mb-1">
                                Account Tenure
                            </p>
                            <p className="text-sm text-gray-700">
                                Member since: {new Date().toLocaleDateString("en-US", {
                                    month: "long",
                                    day: "numeric",
                                    year: "numeric",
                                })}
                            </p>
                        </div>
                    </div>

                    {/* Active Assets */}
                    <div className="bg-blue-600 rounded-lg px-4 py-3 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <span className="text-white text-lg">👁</span>
                            <div>
                                <p className="text-xs text-blue-200 uppercase font-semibold">
                                    Active Assets
                                </p>
                                <p className="text-2xl font-bold text-white">—</p>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate("/dashboard")}
                            className="bg-white text-blue-600 text-xs font-semibold px-3 py-1.5 rounded-md hover:bg-blue-50"
                        >
                            VIEW LINKS
                        </button>
                    </div>

                    {/* Settings */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b">
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                                <span>🔔</span> Email Notifications
                            </div>
                            <button
                                onClick={() => setEmailNotif(!emailNotif)}
                                className={`w-10 h-5 rounded-full transition-colors ${emailNotif ? "bg-blue-600" : "bg-gray-300"
                                    } relative`}
                            >
                                <span
                                    className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${emailNotif ? "translate-x-5" : "translate-x-0.5"
                                        }`}
                                />
                            </button>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b">
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                                <span>🔒</span> Two-Factor Authentication
                            </div>
                            <span className="text-xs text-red-500 font-semibold">DISABLED</span>
                        </div>
                    </div>

                    {/* Logout Session */}
                    <button
                        onClick={logout}
                        className="w-full border rounded-lg py-2 text-sm text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-2"
                    >
                        ↩ Logout Session
                    </button>

                    <p className="text-xs text-gray-400 text-center">
                        Your data is encrypted using AES-256 standards.{" "}
                        <a href="#" className="text-blue-600 hover:underline">
                            Privacy Policy
                        </a>
                    </p>

                </div>
            </div>

            <Footer />
        </div>
    );
};

export default ProfilePage;