import { useAuth } from "../hooks/useAuth";

const Navbar = () => {
  const { getUser, logout } = useAuth();
  const user = getUser();

  return (
    <nav className="bg-white shadow-md px-6 py-4">
      <div className="max-w-2xl mx-auto flex justify-between items-center">

        {/* Logo */}
        <h1 className="text-blue-600 font-bold text-xl">
          Short<span className="text-gray-800">Link</span>
        </h1>

        {/* User Info */}
        <div className="flex items-center gap-4">
          {user?.picture && (
            <img
              src={user.picture}
              alt="profile"
              className="w-8 h-8 rounded-full object-cover"
            />
          )}

          <p className="text-sm text-gray-700 font-medium">
            {user?.name}
          </p>

          <button
            onClick={logout}
            className="text-sm text-red-500 hover:underline"
          >
            Logout
          </button>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;