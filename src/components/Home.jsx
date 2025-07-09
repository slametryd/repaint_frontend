import heroImg from "../assets/heroimg.png";
import asetBundel from "../assets/asetBundel1.png";
import fotoAll from "../assets/fotoall.png";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronUp,
  faChevronDown,
  faArrowLeft,
  faXmark,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "./AuthContext";
import React, { useEffect, useState, useContext, useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const FAQ = [
  {
    title: `KAK, SAYA MAU BOOKING SLOT DONG! CARANYA GIMANA?`,
    description: `Pilih jasa yang anda di pesan inginkan\n
      Isi informasi-informasi yang dibutuhkan\n Datang sesuai waktu dan tanggal yang sudah dipilih`,
  },
  {
    title: "KAK ADA GARANSI NGGAK?",
    description: `Garansi dari bengkel diberikan 1 bulan sejak tanggal pengecatan ya, diluar waktu ditentukan sudah bukan tanggungjawab kami`,
  },

  {
    title: "KAK BODY MOTOR SAYA BEKAS CAT-AN",
    description: `Diliat dulu nanti teknisnya, kalau diharuskan di remover cat sebelumnya +50.000 s/d +100.000 ya, jika bisa langsung naik cat harga normal. Velg bekas cat disarankan Senin sampai Jumat dan datang dari pagi ya kak`,
  },
];

const Home = ({ sectionRefs }) => {
  const navigate = useNavigate();
  const [actived, setActived] = useState(null);
  const [produk, setProduk] = useState([]);
  const { user, login } = useContext(AuthContext);
  const location = useLocation();
  const [showModel, setShowModel] = useState(false);
  const baseURL = import.meta.env.VITE_API_URL;

  const { berandaRef, tentangKamiRef, layananKamiRef, galeriRef, faqRef } =
    sectionRefs;

  useEffect(() => {
    if (location.state?.result) {
      alert("Pembayaran berhasil!");
    }
  }, [location.state]);

  // Mengambil produk dari server
  useEffect(() => {
    const fetchProduk = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/produk`);
        setProduk(response.data);
      } catch (error) {
        console.error("Gagal mengambil produk:", error);
      }
    };

    fetchProduk();
  }, []);

  const toggleFunction = (i) => {
    if (actived === i) {
      setActived(null);
    } else {
      setActived(i);
    }
  };

  const handleBooking = async (item) => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      setShowModel(true);
      return;
    }

    try {
      const response = await axios.get(`${baseURL}/api/auth/users`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      });

      // Jika perlu update token baru:
      if (response.data.accessToken) {
        localStorage.setItem("accessToken", response.data.accessToken);
      }

      navigate(`/booking`, {
        state: {
          id: item.id,
          picture: item.picture,
          judul: item.judul,
          harga: item.harga,
          deskripsi: item.deskripsi,
        },
      });
    } catch (error) {
      console.error("Refresh token tidak valid:", error);
      setShowModel(true);
    }
  };

  return (
    <div id="beranda" className="home-page pb-10">
      <div className="container px-4 mx-auto">
        <div
          ref={berandaRef}
          className="hero grid 
        md:grid-cols-2 grid-cols-1 pt-32 items-center gap-10 md:gap-20"
        >
          <div className="box ">
            <h1 className="font-extrabold text-3xl md:text-5xl  md:mb-7">
              Bikin Motor Kamu Tampil Beda dengan Repaint{" "}
              <span className="text-[#FD1E0D]">Berkualitas!</span>
            </h1>
            <p className="mb-4 md:mb-7  md:font-medium font-normal">
              Spesialis cat ulang body motor dengan hasil halus,
              <br /> warna tajam, dan tahan lama
            </p>
            <a
              href="#layanan-kami"
              className="bg-[#FD1E0D] font-medium text-center px-3 py-2 rounded-full font text-white hover:bg-[#ED1100] transition-all "
            >
              Lihat Detail
            </a>
          </div>
          <div className="box">
            <img src={heroImg} className="w-[537px] h-auto mx-auto" alt="" />
          </div>
        </div>

        <div
          ref={tentangKamiRef}
          id="tentang-kami"
          className="grid md:grid-cols-2 grid-cols-1 items-center justify-center pt-32 gap-10 "
        >
          <div className="order-1 md:order-none ">
            <img
              src={fotoAll}
              className="w-[380px] justify-center mx-auto rounded-2xl"
              alt=""
            />
          </div>
          <div className="box ">
            <h2 className="font-bold text-3xl  md:text-left text-center mb-7">
              Tentang Kami
            </h2>
            <h1 className="font-extrabold text-3xl md:text-5xl  md:mb-7">
              Kami Bukan Sekadar Bengkel, Kami{" "}
              <span className="text-[#FD1E0D]">Seniman Warna</span> untuk Motor
              Kamu!
            </h1>
            <p className="mb-7 font-medium">
              Kami adalah tim spesialis repaint body motor yang punya passion
              besar dalam mempercantik tampilan motor kamu. Dengan pengalaman
              lebih dari 2 tahun, kami sudah membantu ratusan pelanggan bikin
              motornya tampil beda, lebih segar, dan lebih keren.
            </p>
          </div>
        </div>

        <div
          ref={layananKamiRef}
          id="layanan-kami"
          className="layanan-kami pt-32"
        >
          <h2
            className="font-bold text-3xl mb-4 text-center
          "
          >
            Layanan Kami
          </h2>
          <p className="mb-7 font-medium text-center">
            Apakah kamu ingin tampilan motor yang klasik, elegan, atau nyentrik?{" "}
          </p>
          <div className="card-box flex flex-wrap gap-12 items-center justify-between">
            {produk.map((item) => (
              <div
                key={item.id}
                className="box rounded-md max-w-[400px] pb-7 shadow-md "
              >
                <img
                  src={`${baseURL}/uploads/${item.picture}`}
                  className="w-[400px] h-[200px] object-cover rounded-t-md mb-5 "
                  alt=""
                />
                <h3 className="font-bold text-[20px] px-4 ">{item.judul}</h3>
                <p className="text-[#FD1E0D] mb-4 px-4"> Rp.{item.harga}</p>
                <p className="mb-5 font-medium px-4">{item.deskripsi}</p>
                <div className="button flex justify-between items-center  px-4">
                  <button
                    onClick={() => handleBooking(item)}
                    className="bg-[#FD1E0D] font-medium text-center px-4 py-2 rounded-md font text-white hover:bg-[#ED1100] transition-all "
                  >
                    Booking Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div
          ref={galeriRef}
          id="galeri"
          className="galeri grid md:grid-cols-2 grid-cols-1 items-center justify-center pt-32 gap-10"
        >
          <div className="box ">
            <h2 className="font-bold text-3xl text-center md:text-left mb-7">
              Galeri
            </h2>
            <h1 className="font-extrabold text-3xl md:text-5xl  md:mb-7">
              Hasil
              <span className="text-[#FD1E0D]">Repaint Terbaik</span>dari
              Bengkel Kami
            </h1>
            <p className="mb-7 font-medium">
              Lihat bagaimana kami mengubah tampilan motor-motor <br />{" "}
              pelanggan jadi lebih keren dan baru lagi.
            </p>
          </div>
          <div className="box">
            <img
              src={asetBundel}
              className="w-[250px] mx-auto rounded-md"
              alt=""
            />
          </div>
        </div>

        <div ref={faqRef} id="faq" className="faq pt-32 px-4">
          <div className="box ">
            <h2 className="font-bold text-3xl mb-7 text-center ">FAQ</h2>

            <p className="mb-7 font-medium text-center">
              Yang sering orang tanyakan.
            </p>
          </div>
          {FAQ.map((item, i) => (
            <div
              key={i}
              className={`mb-7 box-faq  shadow-md  rounded-2xl ${
                actived === i ? "" : ""
              }`}
            >
              <div
                className="content-faq overflow-hidden flex justify-between items-center transition-all font-bold text-[16px] px-6 py-4 "
                onClick={() => toggleFunction(i)}
              >
                <h3 className=" ">{item.title}</h3>
                <span className="transition-all">
                  {actived === i ? (
                    <FontAwesomeIcon icon={faChevronUp} />
                  ) : (
                    <FontAwesomeIcon icon={faChevronDown} />
                  )}
                </span>
              </div>
              {actived === i && (
                <div className="isi-faq transition-all px-6 pb-4 rounded-2xl   text-gray-600">
                  {item.description.split(`\n`).map((line, i) => (
                    <p key={i} className="">
                      {" "}
                      {line}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        {showModel && (
          <div className="popUp  fixed bg-black/50 min-h-screen z-10 w-screen flex justify-center items-center top-0 left-0">
            <div className=" relative rounded-2xl w-[400px] h-[200px] bg-white p-4 flex flex-col gap-4 items-center">
              <span className="text-5xl text-red-500 text-center">
                <FontAwesomeIcon icon={faTriangleExclamation} />
              </span>
              <h2 className="text-xl font-bold ">
                Silahkan login terlebih dahulu!{" "}
              </h2>
              <p className="text-center font-medium text-gray-400 text-[14px]">
                Untuk melakukan proses booking harap login terlebih dahulu
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
    </div>
  );
};

export default Home;
