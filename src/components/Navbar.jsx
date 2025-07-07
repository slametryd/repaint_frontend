import mainLogo from "../assets/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faBars, faL } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { useState, useEffect, useContext, useRef } from "react";

const Navbar = ({ scrollRefs }) => {
  const { berandaRef, tentangKamiRef, layananKamiRef, galeriRef, faqRef } =
    scrollRefs;
  const navigate = useNavigate();
  const [scroll, setScroll] = useState(false);
  const [showDropDown, setShowDropDown] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScroll(window.scrollY > 5);
      setShowDropDown(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollActive = scroll ? "shadow-lg" : "";
  const scroll_profile = scroll ? "" : "";

  return (
    <div className="navbar fixed w-full transition-all py-4 z-50 bg-transparent">
      <div className="container mx-auto px-4">
        <div
          className={`navbar-box flex justify-between items-center bg-white px-6 py-2 rounded-full ${scrollActive}`}
        >
          {/* Logo */}
          <div className="logo">
            <img src={mainLogo} className="w-[102px] h-[62px]" alt="Logo" />
          </div>

          {/* Menu */}
          <div
            className={`${
              isMenuOpen
                ? "right-0 opacity-100"
                : "right-[100%] opacity-0 md:opacity-100"
            } absolute md:static bg-[#FD1E0D] md:bg-transparent top-full left-0 w-1/2 rounded-lg shadow-md md:shadow-none md:w-auto transition-all duration-300 z-40 md:z-auto`}
          >
            <ul className="flex flex-col md:flex-row md:items-center gap-6 md:gap-12  text-center py-4 md:py-0 px-4 text-white md:text-black">
              <li
                onClick={() => scrollToSection(berandaRef)}
                className="md:hover:font-medium md:hover:underline transition-all cursor-pointer"
              >
                <span>Beranda</span>
              </li>
              <li
                onClick={() => scrollToSection(tentangKamiRef)}
                className="hover:font-medium hover:underline transition-all  cursor-pointer"
              >
                <span>Tentang Kami</span>
              </li>
              <li
                onClick={() => scrollToSection(layananKamiRef)}
                className="hover:font-medium hover:underline transition-all  cursor-pointer"
              >
                <span>Layanan Kami</span>
              </li>
              <li
                onClick={() => scrollToSection(galeriRef)}
                className="hover:font-medium hover:underline transition-all  cursor-pointer"
              >
                <span>Galeri</span>
              </li>
              <li
                onClick={() => scrollToSection(faqRef)}
                className="hover:font-medium hover:underline transition-all  cursor-pointer"
              >
                <span>FAQ</span>
              </li>
            </ul>
          </div>

          {/* login */}
          <div className="relative flex items-center gap-4">
            {!user ? (
              <button
                onClick={() => navigate("/login")}
                className="bg-[#FD1E0D] font-medium px-5 py-2 rounded-full text-white hover:bg-[#ED1100] transition-all"
              >
                Login
              </button>
            ) : (
              <div className="relative">
                <div
                  onClick={() => setShowDropDown(!showDropDown)}
                  className="account w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center hover:bg-gray-200 text-white font-bold cursor-pointer"
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt="Avatar"
                      className="w-full h-full object-cover  rounded-full"
                    />
                  ) : (
                    <FontAwesomeIcon icon={faUser} className="text-white" />
                  )}
                </div>

                {/* Dropdown */}
                {showDropDown && (
                  <div
                    className={`absolute right-0 mt-3 w-35 rounded-lg text-sm z-50 bg-white shadow-lg ${scroll_profile}`}
                  >
                    <button
                      className="block w-full text-left px-4 py-2 rounded-lg hover:hover:bg-gray-100 text-red-500"
                      onClick={() => {
                        logout();
                        setShowDropDown(false);
                        navigate("/login");
                      }}
                    >
                      LogOut
                    </button>
                  </div>
                )}
              </div>
            )}
            <div
              className="md:hidden text-2xl text-gray-600 cursor-pointer ml-4"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span>
                <FontAwesomeIcon icon={faBars} />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
