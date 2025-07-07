import React from "react";
import Footer from "./Footer";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";

function DetailBooking() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));
  const userEmail = user?.email || "email-default@example.com";
  const [showModel, setShowModel] = useState(false);

  const {
    picture = "",
    judul = "",
    harga = 0,
    deskripsi = "",
    tanggal = "",
    jenis_motor = "",
    warna = "",
    qty = 1,
    total_harga = 0,
    nama = "",
    noWa = 0,
  } = location.state || {};

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(angka);
  };

  const initiatePayment = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const userEmail = user?.email || "fallback@example.com";

      const order_id = `ORDER-${Date.now()}`;

      await axios.post("http://localhost:5000/api/bookings", {
        nama,
        noWa,
        tanggal,
        jenis_motor,
        warna,
        qty,
        produkId: location.state.produkId,
        total_harga,
        status_pembayaran: "pending",
        order_id,
      });

      // Ambil Snap Token dari Midtrans
      const res = await axios.post("http://localhost:5000/api/payment-token", {
        order_id,
        gross_amount: total_harga,
        name: user?.name || "Customer Default",
        email: userEmail,
      });

      const snapToken = res.data.token;

      window.snap.pay(snapToken, {
        onSuccess: async function (result) {
          alert("pembayaran berhasil");
          console.log("Success", result);

          // Kirim email
          await axios.post("http://localhost:5000/api/send-email", {
            nama,
            noWa,
            judul,
            tanggal,
            jenis_motor,
            warna,
            qty,
            total_harga: formatRupiah(total_harga),
            to: userEmail,
            payment_info: {
              order_id: result.order_id,
              payment_type: result.payment_type,
              va_number: result.va_numbers?.[0]?.va_number,
              bank: result.va_numbers?.[0]?.bank,
            },
          });

          // Update status pembayaran
          await axios.put(
            `http://localhost:5000/api/booking-status/${result.order_id}`,
            {
              status: result.transaction_status,
            }
          );

          // ✅ Navigasi ke home setelah semua proses selesai
          navigate("/", { replace: true });
        },

        onPending: async function (result) {
          alert("Menunggu pembayaran...");
          console.log("Pending", result);

          await axios.post("http://localhost:5000/api/send-email", {
            nama,
            noWa,
            judul,
            tanggal,
            jenis_motor,
            warna,
            qty,
            total_harga: formatRupiah(total_harga),
            to: userEmail,
            payment_info: {
              order_id: result.order_id,
              payment_type: result.payment_type,
              va_number: result.va_numbers?.[0]?.va_number,
              bank: result.va_numbers?.[0]?.bank,
            },
          });
        },

        onError: function (result) {
          alert("Pembayaran gagal.");
          console.error("Error", result);
        },

        onClose: function () {
          alert("kamu belum melakukan pembayaran");
        },
      });
    } catch (error) {
      console.error("Error:", error);
      alert("Gagal memulai pembayaran atau menyimpan data.");
    }
  };

  if (!judul) {
    return (
      <div className="text-center mt-10">
        <h2>Data booking tidak tersedia.</h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen w-full">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto mb-20 flex-grow">
        <div>
          <h1 className="font-extrabold text-2xl my-7">
            <span
              onClick={() => navigate(`/booking`)}
              className="cursor-pointer pr-3"
            >
              <FontAwesomeIcon icon={faArrowLeft} />
            </span>{" "}
            DETAIL BOOKING
          </h1>
        </div>
        <div className="pt-20 mb-32">
          <h1 className="font-extrabold text-3xl sm:text-4xl md:text-5xl">
            Detail pesanan
          </h1>
        </div>

        <div className="hidden sm:flex flex-col">
          <div className="flex justify-between items-center bg-[#d3d3d3] px-4 py-3 rounded-full">
            <h1 className="font-bold text-[20px] w-1/3">Product</h1>
            <h1 className="font-bold text-[20px] w-1/3 text-center">
              Quantity
            </h1>
            <h1 className="font-bold text-[20px] w-1/3 text-right">Harga</h1>
          </div>
          <div className="flex justify-between items-center px-4 py-5 border-b">
            <div className="w-1/3 space-y-1">
              <h1 className="font-bold text-[18px]">{judul}</h1>
              <p>Nama Customer : {nama}</p>
              <p>No WA : {noWa}</p>
              <p>Tgl Booking : {tanggal}</p>
              <p>Jenis Motor : {jenis_motor}</p>
              <p>Warna : {warna}</p>
            </div>
            <div className="w-1/3 text-center text-lg font-semibold">{qty}</div>
            <div className="w-1/3 text-right text-lg font-semibold">
              {formatRupiah(total_harga)}
            </div>
          </div>
        </div>

        <div className="sm:hidden px-4 py-3 shadow-lg rounded-lg mb-6 space-y-3">
          <div className="flex justify-between">
            <span className="font-bold">Product</span>
            <span>{judul}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-bold">Nama</span>
            <span>{nama}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-bold">No WA</span>
            <span>{noWa}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-bold">Tanggal</span>
            <span>{tanggal}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-bold">Jenis Motor</span>
            <span>{jenis_motor}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-bold">Warna</span>
            <span>{warna}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-bold">Quantity</span>
            <span>{qty}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-bold">Harga</span>
            <span>{formatRupiah(total_harga)}</span>
          </div>
        </div>

        {/* Payment button section */}
        <div className="pt-14 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <p className="px-6 py-3 font-bold text-[18px] sm:text-[20px] text-center sm:text-left">
              Pilih Metode Pembayaran
            </p>
          </div>
          <div className="px-4 w-full sm:w-auto">
            <button
              onClick={initiatePayment}
              className="w-full sm:w-auto bg-[#FD1E0D] font-medium px-5 py-2 rounded-full text-white hover:bg-[#ED1100] transition-all"
            >
              Bayar
            </button>
          </div>
        </div>
        {/* {showModel && (
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
        )} */}
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
}

export default DetailBooking;
