import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

function Header() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login status from localStorage on mount
  useEffect(() => {
    const status = localStorage.getItem("status") === "loggedin";
    setIsLoggedIn(status);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    document.body.style.overflow = isMenuOpen ? "hidden" : "unset";
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    document.body.style.overflow = "unset";
  };

  const handleLogout = () => {
    localStorage.removeItem("status");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <div className="bg-white shadow-lg shadow-violet-500 border border-violet-300">
      <div className="container mx-auto px-4">
        <div className="flex items-center h-16 lg:h-20">
          {/* Menu button */}
          <button
            onClick={toggleMenu}
            className={`rounded-lg text-violet-700 transition duration-200 ${
              isMenuOpen
                ? "hover:text-violet-500 bg-transparent"
                : "hover:text-violet-500 hover:bg-transparent"
            } focus:outline-none focus:ring-2`}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Logo */}
          <div className="flex-1 flex justify-center lg:justify-start lg:ml-8">
            {isLoggedIn ?(<Link to="/home" className="flex items-center space-x-1">
              <span className="text-2xl font-bold text-violet-700 tracking-tight hover:text-violet-800 transition duration-200">
                Xcelifiee
              </span>
            </Link>):(
              <Link to="/" className="flex items-center space-x-1">
              <span className="text-2xl font-bold text-violet-700 tracking-tight hover:text-violet-800 transition duration-200">
                Xcelifiee
              </span>
            </Link>
            )}
          </div>

          {/* Navbar links */}
          <nav className="hidden lg:flex items-center justify-end">
            <ul className="flex space-x-6">
              {isLoggedIn ? (
                <>
                  <li>
                    <Link
                      to="/home"
                      className="px-4 py-2 font-bold text-[20px] text-violet-700 hover:text-white hover:bg-violet-700 rounded-lg transition duration-300"
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/viewdata"
                      className="px-4 py-2 font-bold text-[20px] text-violet-700 hover:text-white hover:bg-violet-700 rounded-lg transition duration-300"
                    >
                      View Data
                    </Link>
                  </li>
                  <li>
                    <Link
                      onClick={handleLogout}
                      className="px-4 py-2 font-bold text-[20px] text-violet-700 hover:text-white hover:bg-violet-700 rounded-lg transition duration-300"
                    >
                      Logout
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link
                      to="/register"
                      className="px-4 py-2 font-bold text-[20px] text-violet-700 hover:text-white hover:bg-violet-700 rounded-lg transition duration-300"
                    >
                      Register
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/login"
                      className="px-4 py-2 font-bold text-[20px] text-violet-700 hover:text-white hover:bg-violet-700 rounded-lg transition duration-300"
                    >
                      Login
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </div>

      {/* Sidebar */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-white/30 backdrop-blur-sm"
          onClick={closeMenu}
        >
          <div
            className="absolute inset-y-0 left-0 w-72 bg-white shadow-lg transform transition-transform duration-300 ease-in-out"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeMenu}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-violet-100 text-violet-700 transition-all duration-200"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
            
            <nav className="flex-1 py-6 space-y-1 ml-5 mt-10">
              {isLoggedIn ? (
                <>
                  <Link
                    to="/home"
                    className="block px-5 py-2 text-base font-bold text-violet-700 hover:text-white hover:bg-violet-700 rounded-lg transition duration-300"
                    onClick={closeMenu}
                  >
                    Home
                  </Link>
                  <Link
                    to="/dashboard"
                    className="block px-5 py-2 text-base font-bold text-violet-700 hover:text-white hover:bg-violet-700 rounded-lg transition duration-300"
                    onClick={closeMenu}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/publications"
                    className="block px-5 py-2 text-base font-bold text-violet-700 hover:text-white hover:bg-violet-700 rounded-lg transition duration-300"
                    onClick={closeMenu}
                  >
                    Add Publication
                  </Link>
                  <Link
                    to="/patents"
                    className="block px-5 py-2 text-base font-bold text-violet-700 hover:text-white hover:bg-violet-700 rounded-lg transition duration-300"
                    onClick={closeMenu}
                  >
                    Add Patent
                  </Link>
                  <Link
                    to="/fundingproposals"
                    className="block px-5 py-2 text-base font-bold text-violet-700 hover:text-white hover:bg-violet-700 rounded-lg transition duration-300"
                    onClick={closeMenu}
                  >
                    Add Funding Proposal
                  </Link>
                  <Link
                    to="/viewdata"
                    className="block px-5 py-2 text-base font-bold text-violet-700 hover:text-white hover:bg-violet-700 rounded-lg transition duration-300"
                    onClick={closeMenu}
                  >
                    View Data
                  </Link>
                  <Link
                    onClick={() => {
                      handleLogout();
                      closeMenu();
                    }}
                    className="block px-5 py-2 text-base font-bold text-violet-700 hover:text-white hover:bg-violet-700 rounded-lg transition duration-300"
                  >
                    Logout
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-5 py-2 text-base font-bold text-violet-700 hover:text-white hover:bg-violet-700 rounded-lg transition duration-300"
                    onClick={closeMenu}
                  >
                    Login
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}

export default Header;
