import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faPenToSquare } from "@fortawesome/free-solid-svg-icons";

function UploadProduct() {
  const [judul, setJudul] = useState("");
  const [harga, setHarga] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [picture, setPicture] = useState(null);
  const [preview, setPreview] = useState(null);
  const [pindahMenu, setPindahMenu] = useState("upload");
  const [produkList, setProdukList] = useState([]);
  const [editId, setEditId] = useState(null);
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  useEffect(() => {
    if (pindahMenu === "produkSaya") {
      const fetchProduk = async () => {
        try {
          const res = await axios.get("http://localhost:5000/api/produk");
          setProdukList(res.data);
        } catch (error) {
          console.error("Gagal mengambil produk:", error);
        }
      };

      fetchProduk();
    }
  }, [pindahMenu]);

  const handleDelete = async (id) => {
    const konfirmasi = window.confirm(
      "Apakah yakin ingin menghapus produk ini?"
    );
    if (!konfirmasi) return;

    try {
      await axios.delete(`http://localhost:5000/api/produk/${id}`);
      // Refresh daftar produk
      setProdukList((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      alert("Gagal menghapus produk");
      console.error(error);
    }
  };

  const handleEdit = (produk) => {
    setJudul(produk.judul);
    setHarga(produk.harga);
    setDeskripsi(produk.deskripsi);
    setPreview(`http://localhost:5000/uploads/${produk.picture}`);
    setPicture(null); // karena kita belum ganti gambar
    setEditId(produk.id); // simpan ID produk
    setPindahMenu("upload");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setPicture(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("judul", judul);
    formData.append("harga", harga);
    formData.append("deskripsi", deskripsi);

    if (picture) {
      formData.append("picture", picture);
    }

    try {
      if (editId) {
        // Mode edit
        await axios.put(
          `http://localhost:5000/api/produk/${editId}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        alert("Produk berhasil diupdate!");

        // Update produkList secara lokal tanpa fetch ulang
        setProdukList((prev) =>
          prev.map((item) =>
            item.id === editId
              ? {
                  ...item,
                  judul,
                  harga,
                  deskripsi,
                  picture: picture ? picture.name : item.picture,
                }
              : item
          )
        );
      } else {
        // Mode tambah
        await axios.post("http://localhost:5000/api/produk", formData);
        alert("Produk berhasil disimpan!");

        // Setelah tambah, fetch ulang produk atau bisa push produk baru ke produkList
        // Cara simpel: fetch ulang seluruh produk (opsional, tergantung backend response)
        const res = await axios.get("http://localhost:5000/api/produk");
        setProdukList(res.data);
      }

      // Reset form
      setJudul("");
      setHarga("");
      setDeskripsi("");
      setPicture(null);
      setPreview(null);
      setEditId(null);

      // Kembali ke daftar produk
      setPindahMenu("produkSaya");
    } catch (err) {
      alert("Gagal menyimpan produk");
      console.error(err);
    }
  };

  console.log(produkList);
  return (
    <div className="min-h-screen flex flex-col rounded-md container mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="button flex flex-col sm:flex-row gap-4 sm:gap-8 mb-6">
        <button
          onClick={() => setPindahMenu("upload")}
          className={`w-full sm:w-auto font-medium py-3 rounded-full px-4 ${
            pindahMenu === "upload" ? "bg-[#FD1E0D] text-white" : "bg-[#DFDFDF]"
          } transition-all`}
        >
          Tambah Produk
        </button>
        <button
          onClick={() => setPindahMenu("produkSaya")}
          className={`w-full sm:w-auto font-medium py-3 rounded-full px-4 ${
            pindahMenu === "produkSaya"
              ? "bg-[#FD1E0D] text-white"
              : "bg-[#DFDFDF]"
          } transition-all`}
        >
          Produk Saya
        </button>
      </div>

      <div className="flex-grow">
        {pindahMenu === "upload" && (
          <div className="mx-auto mt-6 border-2 text-gray-500 px-4 py-8 shadow-md rounded-2xl max-w-md w-full">
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Judul Produk"
                value={judul}
                onChange={(e) => setJudul(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="number"
                placeholder="Harga"
                value={harga}
                onChange={(e) => setHarga(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
              <textarea
                placeholder="Deskripsi"
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                className="w-full p-2 border rounded"
              />
              <input
                type="file"
                onChange={handleImageChange}
                className="w-full"
              />
              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full max-h-64 object-contain mt-2 rounded border"
                />
              )}
              <button
                type="submit"
                className="bg-[#FD1E0D] text-white px-4 py-2 rounded-full hover:bg-[#ED1100] w-full"
              >
                Simpan Produk
              </button>
            </form>
          </div>
        )}

        {pindahMenu === "produkSaya" && (
          <div className="mt-10">
            <h2 className="text-xl font-bold mb-4 text-center sm:text-left">
              Produk Saya
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {produkList.map((produk) => (
                <div
                  key={produk.id}
                  className="p-4 rounded shadow hover:shadow-md transition relative border"
                >
                  <img
                    src={`http://localhost:5000/uploads/${produk.picture}`}
                    alt={produk.judul}
                    className="w-full h-48 object-cover rounded mb-2"
                  />
                  <div className="flex justify-between">
                    <h3 className="font-semibold">{produk.judul}</h3>
                    <div className="flex justify-between gap-2">
                      <button
                        onClick={() => handleEdit(produk)}
                        className="text-sm bg-blue-600 px-3 py-1 rounded hover:bg-blue-700 text-white"
                      >
                        <FontAwesomeIcon icon={faPenToSquare} />
                      </button>
                      <button
                        onClick={() => handleDelete(produk.id)}
                        className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        <FontAwesomeIcon icon={faTrashCan} />
                      </button>
                    </div>
                  </div>

                  <p className="text-red-500">Rp {produk.harga}</p>
                  <p className="text-sm text-gray-950">{produk.deskripsi}</p>

                  <div className="mt-2">
                    <div className="dellate flex justify-between ">
                      <div className="text-xs text-gray-500 mt-1">
                        Dibuat: {formatDate(produk.createdAt)} <br />
                        Diperbarui: {formatDate(produk.updatedAt)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UploadProduct;
