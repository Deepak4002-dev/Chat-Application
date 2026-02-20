import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { User, LogOut, UserCircle } from "lucide-react";
import { logout } from "../../rtk/auth/authAsyncThunk";
import { toast } from "sonner";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await dispatch(logout()).unwrap();
      toast.success(res.message);
      setIsOpen(false);
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <nav className="w-full h-16 bg-white border-b border-gray-100 flex justify-between items-center px-6 md:px-10 sticky top-0 z-50">
      {/* Logo Section */}
      <Link
        to="/"
        className="flex flex-col items-center cursor-pointer select-none"
      >
        <h1 className="text-blue-600 font-[600] text-lg leading-none">
          AauChat
        </h1>
        <span className="text-gray-400 text-[13px] font-medium tracking-widest uppercase">
          Garau
        </span>
      </Link>

      {/* Navigation Actions */}
      <div className="flex items-center gap-x-4">
        {!isLoggedIn ? (
          <div className="flex items-center gap-x-3">
            <Link
              to="/signup"
              className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
            >
              Signup
            </Link>
            <Link
              to="/"
              className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition-all shadow-sm"
            >
              Login
            </Link>
          </div>
        ) : (
          <div className="relative">
            {/* User Icon Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors focus:outline-none"
            >
              <User size={20} className="text-gray-700" />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
              <>
                {/* Invisible backdrop to close dropdown when clicking outside */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsOpen(false)}
                ></div>

                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg py-2 z-20 overflow-hidden">
                  <div className="px-4 py-2 border-b border-gray-50">
                    <p className="text-xs text-gray-400">Signed in as</p>
                    <p className="text-sm font-semibold truncate">
                      {user?.name || "User"}
                    </p>
                  </div>

                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <UserCircle size={16} />
                    Profile
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
