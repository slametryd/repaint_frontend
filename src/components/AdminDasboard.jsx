import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpFromBracket,
  faCartFlatbedSuitcase,
  faPenToSquare,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import UploadProduct from "../components/dasboardAdmin/UploadProduct";
import DataOrderan from "../components/dasboardAdmin/DataOrderan";
import UpdateBooking from "../components/dasboardAdmin/UpdateBooking";
import mainLogo from "../assets/logo-putih.png";

function AdminDasboard() {
  const [activeMenu, setActiveMenu] = useState("upload");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const renderContent = () => {
    switch (activeMenu) {
      case "upload":
        return <UploadProduct />;
      case "order":
        return <DataOrderan />;
      case "booking":
        return <UpdateBooking />;
      default:
        return null;
    }
  };

  return (
    <div className="dasboard">
      <div className="container px-4 py-3 mx-auto">
        <div className="box">
          <div className="cover_view min-h-full flex grid-cols-2 gap-12">
            <div className="menu shadow-md bg-[#1d1d1d] w-1/4 py-3 rounded-md text-white">
              <div className="img">
                <img src={mainLogo} alt="" className="w-[150px] mx-auto mt-5" />
              </div>
              <ul className="flex flex-col mt-8">
                <li>
                  <button
                    onClick={() => setActiveMenu("upload")}
                    className="hover:bg-[#FD1E0D] transition-all w-full px-0 py-3"
                  >
                    <span className="mr-3">
                      <FontAwesomeIcon icon={faArrowUpFromBracket} />
                    </span>
                    Upload Product
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveMenu("order")}
                    className="w-full py-3 hover:bg-[#FD1E0D] transition-all"
                  >
                    <span className="mr-3">
                      <FontAwesomeIcon icon={faCartFlatbedSuitcase} />
                    </span>
                    Data Orderan
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveMenu("booking")}
                    className="w-full py-3 hover:bg-[#FD1E0D] transition-all"
                  >
                    <span className="mr-3">
                      <FontAwesomeIcon icon={faPenToSquare} />
                    </span>
                    Update Data
                  </button>
                </li>
              </ul>
            </div>

            <div className="tampilan flex-1 min-h-screen">
              <div className="navbar py-3 mb-12">
                <div className="box flex justify-between items-center py-3 px-4 rounded-full shadow-md">
                  <h2 className="font-bold text-2xl">Dasboard Admin</h2>
                  <div className="relative" ref={dropdownRef}>
                    <div
                      className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-400 text-white font-bold cursor-pointer"
                      onClick={toggleDropdown}
                    >
                      <FontAwesomeIcon icon={faUser} className="text-white" />
                    </div>

                    {dropdownOpen && (
                      <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md z-50">
                        <button
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
                          onClick={handleLogout}
                        >
                          LogOut
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex">{renderContent()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDasboard;
