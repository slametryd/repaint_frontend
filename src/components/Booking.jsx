import React from "react";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faL,
  faLariSign,
  faXmark,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

function Booking() {
  const navigate = useNavigate();
  const location = useLocation();
  const [tanggal, setTanggal] = useState("");
  const [jenis_motor, setJenisMotor] = useState("");
  const [warna, setWarna] = useState("");
  const [qty, setQty] = useState(1);
  const [nama, setNama] = useState("");
  const [noWa, setNowa] = useState();
  const { picture, judul, harga, deskripsi } = location.state || {};
  const today = new Date().toISOString().split("T")[0];
  const [showModel, setShowModel] = useState(false);

  const baseURL = import.meta.env.VITE_API_URL;

  // State untuk menampung data dari backend
  const [motorOptions, setMotorOptions] = useState([]);
  const [warnaOptions, setWarnaOptions] = useState([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/motor-options`);
        setMotorOptions(res.data.jenisMotor);
        setWarnaOptions(res.data.warnaMotor);
      } catch (err) {
        console.error("Gagal mengambil data motor options:", err);
      }
    };

    fetchOptions();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validasi
    if (
      !tanggal ||
      !jenis_motor ||
      !warna ||
      !qty ||
      qty <= 0 ||
      !nama ||
      !noWa
    ) {
      setShowModel(true);
      return;
    }

    // Navigasi ke halaman detailbooking tanpa simpan ke database
    navigate("/detailbooking", {
      state: {
        nama,
        noWa,
        picture,
        judul,
        harga,
        deskripsi,
        tanggal,
        jenis_motor,
        warna,
        qty,
        total_harga: harga * qty, // atau biarkan dihitung di backend saat payment
        produkId: location.state?.id,
      },
    });
  };

  return (
    <div className="w-full">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto mb-20 min-h-screen flex flex-col  ">
        <div className="">
          <h1 className="font-extrabold text-2xl  mt-7 ">
            <span onClick={() => navigate(`/`)} className="pr-3 cursor-pointer">
              <FontAwesomeIcon icon={faArrowLeft} />
            </span>{" "}
            BOOKING ORDER
          </h1>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center pt-32">
          <form onSubmit={handleSubmit} className="w-full md:max-w-xl">
            <h1 className="font-extrabold text-3xl sm:text-5xl mb-7">
              Isi detail pesanan
            </h1>
            <div className="flex flex-col justify-center"></div>
            <div className="flex flex-col justify-center mb-4">
              <label className="mb-2 block">Masukkan Nama Anda</label>
              <input
                type="text"
                placeholder="Nama Anda"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                className="outline-0 border-b-2 mb-4"
              />
              <label className="mb-2">Masukkan Nomor Whatsapp</label>
              <input
                type="text"
                placeholder="No Whatsapp"
                value={noWa}
                onChange={(e) => setNowa(e.target.value)}
                className="outline-0 border-b-2 mb-4"
              />
              <label className="mb-2">Pilih tangal booking</label>
              <input
                type="date"
                min={today}
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                className="outline-0 border-b-2"
              />
            </div>
            <div className="flex flex-col justify-center mb-4">
              <label className="mb-2">Jenis Motor</label>
              <select
                value={jenis_motor}
                onChange={(e) => setJenisMotor(e.target.value)}
                className="outline-0 border-b-2"
              >
                <option value="">Pilih jenis motor</option>
                {motorOptions.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col justify-center mb-4">
              <label className="mb-2">Warna yang dipilih</label>
              <select
                value={warna}
                onChange={(e) => setWarna(e.target.value)}
                className="outline-0 border-b-2"
              >
                <option value="">Pilih warna</option>
                {warnaOptions.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col justify-center mb-20">
              <label className="mb-2">Qty</label>
              <input
                type="number"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                className="outline-0 border-b-2"
              />
            </div>
            <div className="">
              <button
                type="submit"
                className="w-full sm:w-auto bg-[#FD1E0D] font-medium px-5 py-2 rounded-full font text-white hover:bg-[#ED1100] transition-all mb-2"
              >
                Check Out
              </button>
            </div>
          </form>
          {picture && (
            <div className=" md:w-auto mt-10 md:mt-0 ">
              <img
                src={`http://localhost:5000/uploads/${picture}`}
                className="w-[400px] mx-auto  rounded-2xl"
                alt=""
              />
            </div>
          )}
        </div>
        {showModel && (
          <div className="popUp  fixed bg-black/50 min-h-screen z-10 w-screen flex justify-center items-center top-0 left-0">
            <div className=" relative rounded-2xl w-[400px] h-[200px] bg-white p-4 flex flex-col gap-4 items-center">
              <span className="text-5xl text-red-500 text-center">
                <FontAwesomeIcon icon={faTriangleExclamation} />
              </span>
              <h2 className="text-xl font-bold ">Harap isi semua data!</h2>
              <p className="text-center font-medium text-gray-400 text-[14px]">
                Untuk memudahkan proses booking data yang dibutuhkan harap
                dilengkapi
              </p>
              <div
                onClick={() => setShowModel(false)}
                className="absolute top-4 font-black right-4 cursor-pointer hover:bg-gray-500 px-4 py-3 rounded-md hover:text-white"
              >
                <span>
                  <FontAwesomeIcon icon={faXmark} />
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="">
        <Footer />
      </div>
    </div>
  );
}

export default Booking;
