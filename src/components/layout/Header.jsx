import {
  Menu,
  Search,
  X,
  User,
  LogOut,
  Calendar,
  Heart,
  Settings,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import useLogout from "../../hooks/useLogout";

// Header Component
const Header = () => {
  const [currentPage, setCurrentPage] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { isAuthenticated, user } = useAuth();
  const { logoutMutation } = useLogout();

  const userDropdownRef = useRef(null);
  const searchDropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target)
      ) {
        setUserDropdownOpen(false);
      }
      if (
        searchDropdownRef.current &&
        !searchDropdownRef.current.contains(event.target)
      ) {
        setSearchDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (searchDropdownOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchDropdownOpen]);

  const handleLogout = () => {
    logoutMutation();
    setUserDropdownOpen(false);
    setCurrentPage("home");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Call your search API here
      console.log("Searching for:", searchQuery);
      setSearchDropdownOpen(false);
      setSearchQuery("");
    }
  };

  const handleSearchToggle = () => {
    setSearchDropdownOpen(!searchDropdownOpen);
    setUserDropdownOpen(false);
  };

  const handleUserToggle = () => {
    setUserDropdownOpen(!userDropdownOpen);
    setSearchDropdownOpen(false);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link
            onClick={() => setCurrentPage("home")}
            to="/"
            className="flex items-center space-x-4"
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-orange-500 bg-clip-text text-transparent tangerine-bold">
              LuxuryStay
            </h1>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              onClick={() => setCurrentPage("home")}
              className={`hover:text-yellow-600 transition-colors ${
                currentPage === "home"
                  ? "text-yellow-600 font-semibold"
                  : "text-gray-700"
              }`}
            >
              Home
            </Link>
            <Link
              to="/room-listing"
              onClick={() => setCurrentPage("room-listing")}
              className={`hover:text-yellow-600 transition-colors ${
                currentPage === "room-listing"
                  ? "text-yellow-600 font-semibold"
                  : "text-gray-700"
              }`}
            >
              Rooms
            </Link>
            <Link
              to="/services"
              onClick={() => setCurrentPage("services")}
              className={`hover:text-yellow-600 transition-colors ${
                currentPage === "services"
                  ? "text-yellow-600 font-semibold"
                  : "text-gray-700"
              }`}
            >
              Services
            </Link>
            <Link
              to="/about-us"
              onClick={() => setCurrentPage("about-us")}
              className={`hover:text-yellow-600 transition-colors ${
                currentPage === "about-us"
                  ? "text-yellow-600 font-semibold"
                  : "text-gray-700"
              }`}
            >
              About Us
            </Link>
            <Link
              to="/contact"
              onClick={() => setCurrentPage("contact")}
              className={`hover:text-yellow-600 transition-colors ${
                currentPage === "contact"
                  ? "text-yellow-600 font-semibold"
                  : "text-gray-700"
              }`}
            >
              Contact
            </Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            {/* Search Dropdown */}
            <div className="relative" ref={searchDropdownRef}>
              <button
                onClick={handleSearchToggle}
                className="text-gray-600 hover:text-yellow-600 transition-all duration-200 p-2 rounded-lg hover:bg-yellow-50"
              >
                <Search size={20} />
              </button>

              {/* Search Dropdown Menu */}
              <div
                className={`absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 ease-out transform ${
                  searchDropdownOpen
                    ? "opacity-100 scale-100 translate-y-0"
                    : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                }`}
              >
                <div className="p-4">
                  <form onSubmit={handleSearch}>
                    <div className="relative">
                      <Search
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                      <input
                        ref={searchInputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search rooms, services..."
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full mt-3 bg-gradient-to-r from-yellow-600 to-orange-500 text-white py-2 rounded-lg hover:from-yellow-700 hover:to-orange-600 transition-all duration-200 font-medium"
                    >
                      Search
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {isAuthenticated ? (
              /* User Dropdown */
              <div className="relative" ref={userDropdownRef}>
                <button
                  onClick={handleUserToggle}
                  className="flex items-center space-x-2 text-gray-700 hover:text-yellow-600 transition-all duration-200 p-2 rounded-lg hover:bg-yellow-50"
                >
                  <User size={20} />
                  <span className="text-sm font-medium">
                    {user?.fullName || user?.email || "Account"}
                  </span>
                </button>

                {/* User Dropdown Menu */}
                <div
                  className={`absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 ease-out transform ${
                    userDropdownOpen
                      ? "opacity-100 scale-100 translate-y-0"
                      : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                  }`}
                >
                  <div className="py-2">
                    <div className="px-4 pt-2 pb-4 border-gray-100 border-b">
                      <p className="text-sm font-medium text-gray-900">
                        {user?.fullName || "User"}
                      </p>
                      <p className="text-xs text-gray-600 truncate">
                        {user?.email}
                      </p>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-600 transition-colors duration-200"
                    >
                      <Settings size={16} />
                      <span>Profile Settings</span>
                    </Link>

                    <Link
                      to="/bookings"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-600 transition-colors duration-200"
                    >
                      <Calendar size={16} />
                      <span>My Bookings</span>
                    </Link>

                    <Link
                      to="/favorites"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-600 transition-colors duration-200"
                    >
                      <Heart size={16} />
                      <span>Favorites</span>
                    </Link>

                    <hr className="my-1 border-gray-100" />

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                    >
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link to="/login" className="px-4 py-2 main-btn text-sm">
                Login
              </Link>
            )}
          </div>

          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Mobile Search */}
              <div className="px-3 py-2">
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>
                </form>
              </div>

              <hr className="my-2" />

              <Link
                to="/"
                onClick={() => {
                  setCurrentPage("home");
                  setMobileMenuOpen(false);
                }}
                className="block px-3 py-2 text-gray-700 hover:text-yellow-600"
              >
                Home
              </Link>
              <Link
                to="/rooms"
                onClick={() => {
                  setCurrentPage("rooms");
                  setMobileMenuOpen(false);
                }}
                className="block px-3 py-2 text-gray-700 hover:text-yellow-600"
              >
                Rooms
              </Link>
              <Link
                to="/services"
                onClick={() => {
                  setCurrentPage("services");
                  setMobileMenuOpen(false);
                }}
                className="block px-3 py-2 text-gray-700 hover:text-yellow-600"
              >
                Services
              </Link>
              <Link
                to="/about-us"
                onClick={() => {
                  setCurrentPage("about-us");
                  setMobileMenuOpen(false);
                }}
                className="block px-3 py-2 text-gray-700 hover:text-yellow-600"
              >
                About Us
              </Link>
              <Link
                to="/contact"
                onClick={() => {
                  setCurrentPage("contact");
                  setMobileMenuOpen(false);
                }}
                className="block px-3 py-2 text-gray-700 hover:text-yellow-600"
              >
                Contact
              </Link>

              {/* Mobile Auth Section */}
              <hr className="my-2" />
              {isAuthenticated ? (
                <>
                  <div className="px-3 py-2 text-sm text-gray-500 bg-gray-50 rounded">
                    Welcome, {user?.fullName || user?.email}
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-yellow-600"
                  >
                    <Settings size={16} />
                    <span>Profile Settings</span>
                  </Link>
                  <Link
                    to="/bookings"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-yellow-600"
                  >
                    <Calendar size={16} />
                    <span>My Bookings</span>
                  </Link>
                  <Link
                    to="/favorites"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-yellow-600"
                  >
                    <Heart size={16} />
                    <span>Favorites</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left flex items-center space-x-2 px-3 py-2 text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 text-gray-700 hover:text-yellow-600 border rounded-lg text-center"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 bg-yellow-600 text-white rounded-lg text-center mt-2"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
