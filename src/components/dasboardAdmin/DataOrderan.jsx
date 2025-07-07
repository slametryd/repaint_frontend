import React, { useEffect, useState } from "react";
import axios from "axios";

function DataOrderan() {
  const [booking, setBooking] = useState([]);
  const [produk, setProduk] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resBooking = await axios.get("http://localhost:5000/api/booking");
        setBooking(resBooking.data);

        const resProduk = await axios.get("http://localhost:5000/api/produk");
        setProduk(resProduk.data);
      } catch (error) {
        console.error("Gagal memuat data", error);
      }
    };

    //  const resStatus = await axios.put(
    //       `http://localhost:5000/api/booking-status/${order_id}`,
    //       { status_pembayaran: "settlement" },
    //       { headers: { "Content-Type": "application/json" } }
    //     );

    fetchData();
    const interval = setInterval(fetchData, 10000); // refresh setiap 10 detik
    return () => clearInterval(interval);
  }, []);

  const getProdukJudul = (produkId) => {
    const product = produk.find((p) => p.id === produkId);
    return product ? product.judul : "Produk Tidak Ditemukan";
  };

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(angka);
  };

  const getStatusPembayaran = (status) => {
    const statusMap = {
      settlement: "Lunas",
      pending: "Menunggu Pembayaran",
      cancel: "Dibatalkan",
      expire: "Kadaluarsa",
    };
    return statusMap[status] || "Belum Bayar";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "settlement":
        return "text-green-600 font-semibold";
      case "pending":
        return "text-yellow-600 font-semibold";
      case "cancel":
      case "expire":
        return "text-red-600 font-semibold";
      default:
        return "text-gray-600 font-semibold";
    }
  };

  return (
    <div className="w-full min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center sm:text-left">
          Data Orderan
        </h2>

        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
          <div className="min-w-[900px] border border-gray-300 rounded-md shadow-sm">
            <div className="grid grid-cols-9 gap-2 items-center text-center p-4 bg-gray-100 font-semibold text-sm sm:text-base">
              <p>Nama Produk</p>
              <p>Jenis Motor</p>
              <p>Warna</p>
              <p>Quantity</p>
              <p>Total Harga</p>
              <p>Tanggal</p>
              <p>Status</p>
              <p>Nama Customer</p>
              <p>No. WhatsApp</p>
            </div>

            {booking.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-9 gap-2 items-center text-center p-4 text-sm sm:text-base border-t"
              >
                <p className="break-words">{getProdukJudul(item.produkId)}</p>
                <p>{item.jenis_motor}</p>
                <p>{item.warna}</p>
                <p>{item.qty}</p>
                <p>{formatRupiah(item.total_harga)}</p>
                <p>{new Date(item.tanggal).toLocaleDateString("id-ID")}</p>
                <p className={getStatusColor(item.status_pembayaran)}>
                  {getStatusPembayaran(item.status_pembayaran)}
                </p>
                <p>{item.nama}</p>
                <p>{item.noWa}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DataOrderan;
