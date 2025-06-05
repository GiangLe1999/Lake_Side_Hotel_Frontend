import { Menu, Search, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

// Header Component
const Header = () => {
  const [currentPage, setCurrentPage] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-orange-500 bg-clip-text text-transparent">
              LuxuryStay
            </h1>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#"
              onClick={() => setCurrentPage("home")}
              className={`hover:text-yellow-600 transition-colors ${
                currentPage === "home"
                  ? "text-yellow-600 font-semibold"
                  : "text-gray-700"
              }`}
            >
              Trang chủ
            </a>
            <a
              href="#"
              onClick={() => setCurrentPage("rooms")}
              className={`hover:text-yellow-600 transition-colors ${
                currentPage === "rooms"
                  ? "text-yellow-600 font-semibold"
                  : "text-gray-700"
              }`}
            >
              Phòng
            </a>
            <a
              href="#"
              onClick={() => setCurrentPage("services")}
              className={`hover:text-yellow-600 transition-colors ${
                currentPage === "services"
                  ? "text-yellow-600 font-semibold"
                  : "text-gray-700"
              }`}
            >
              Dịch vụ
            </a>
            <a
              href="#"
              onClick={() => setCurrentPage("about")}
              className={`hover:text-yellow-600 transition-colors ${
                currentPage === "about"
                  ? "text-yellow-600 font-semibold"
                  : "text-gray-700"
              }`}
            >
              Về chúng tôi
            </a>
            <a
              href="#"
              onClick={() => setCurrentPage("contact")}
              className={`hover:text-yellow-600 transition-colors ${
                currentPage === "contact"
                  ? "text-yellow-600 font-semibold"
                  : "text-gray-700"
              }`}
            >
              Liên hệ
            </a>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <button className="text-gray-600 hover:text-yellow-600 transition-colors">
              <Search size={20} />
            </button>
            <Link
              to="/login"
              className="px-4 py-2 main-btn font-semibold text-sm"
            >
              Login
            </Link>
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
              <a
                href="#"
                onClick={() => {
                  setCurrentPage("home");
                  setMobileMenuOpen(false);
                }}
                className="block px-3 py-2 text-gray-700 hover:text-yellow-600"
              >
                Trang chủ
              </a>
              <a
                href="#"
                onClick={() => {
                  setCurrentPage("rooms");
                  setMobileMenuOpen(false);
                }}
                className="block px-3 py-2 text-gray-700 hover:text-yellow-600"
              >
                Phòng
              </a>
              <a
                href="#"
                onClick={() => {
                  setCurrentPage("services");
                  setMobileMenuOpen(false);
                }}
                className="block px-3 py-2 text-gray-700 hover:text-yellow-600"
              >
                Dịch vụ
              </a>
              <a
                href="#"
                onClick={() => {
                  setCurrentPage("about");
                  setMobileMenuOpen(false);
                }}
                className="block px-3 py-2 text-gray-700 hover:text-yellow-600"
              >
                Về chúng tôi
              </a>
              <a
                href="#"
                onClick={() => {
                  setCurrentPage("contact");
                  setMobileMenuOpen(false);
                }}
                className="block px-3 py-2 text-gray-700 hover:text-yellow-600"
              >
                Liên hệ
              </a>
              <Link
                to="/login"
                className="w-full text-left px-3 py-2 bg-yellow-600 text-white rounded-lg mt-2"
              >
                Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
