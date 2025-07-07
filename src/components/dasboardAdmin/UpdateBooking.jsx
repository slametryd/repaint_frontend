import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faPenToSquare } from "@fortawesome/free-solid-svg-icons";

function UpdateBooking() {
  const [activeTab, setActiveTab] = useState("update");
  const [warna, setWarna] = useState("");
  const [jenis, setJenis] = useState("");
  const [warnaList, setWarnaList] = useState([]);
  const [jenisList, setJenisList] = useState([]);
  const [editWarnaId, setEditWarnaId] = useState(null);
  const [editJenisId, setEditJenisId] = useState(null);
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
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const warnaRes = await axios.get("http://localhost:5000/api/warna_motor");
      const jenisRes = await axios.get("http://localhost:5000/api/jenis_motor");

      setWarnaList(warnaRes.data);
      setJenisList(jenisRes.data);
    } catch (error) {
      console.error("Gagal mengambil data", error);
    }
  };

  const handleSimpanData = async (e) => {
    e.preventDefault();

    try {
      if (editWarnaId) {
        await axios.put(
          `http://localhost:5000/api/warna_motor/${editWarnaId}`,
          { warna }
        );
        setEditWarnaId(null);
      } else if (warna) {
        await axios.post("http://localhost:5000/api/warna_motor", { warna });
      }

      if (editJenisId) {
        await axios.put(
          `http://localhost:5000/api/jenis_motor/${editJenisId}`,
          { jenis }
        );
        setEditJenisId(null);
      } else if (jenis) {
        await axios.post("http://localhost:5000/api/jenis_motor", { jenis });
      }

      alert("Data berhasil disimpan!");
      setWarna("");
      setJenis("");
      fetchData();
    } catch (error) {
      alert("Gagal menyimpan data");
    }
  };

  const handleDeleteWarna = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/warna_motor/${id}`);
      fetchData();
    } catch (error) {
      alert("Gagal menghapus warna");
    }
  };

  const handleDeleteJenis = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/jenis_motor/${id}`);
      fetchData();
    } catch (error) {
      alert("Gagal menghapus jenis");
    }
  };

  // Tambahkan dua fungsi ini
  const handleSimpanWarna = async (e) => {
    e.preventDefault();
    try {
      if (editWarnaId) {
        await axios.put(
          `http://localhost:5000/api/warna_motor/${editWarnaId}`,
          {
            warna,
          }
        );
        setEditWarnaId(null);
      } else {
        await axios.post("http://localhost:5000/api/warna_motor", { warna });
      }
      setWarna("");
      fetchData();
    } catch (error) {
      alert("Gagal menyimpan warna");
    }
  };

  // const handleSimpanJenis = async (e) => {
  //   e.preventDefault();
  //   try {
  //     if (editJenisId) {
  //       await axios.put(
  //         `http://localhost:5000/api/jenis_motor/${editJenisId}`,
  //         {
  //           jenis,
  //         }
  //       );
  //       setEditJenisId(null);
  //     } else {
  //       await axios.post("http://localhost:5000/api/jenis_motor", { jenis });
  //     }
  //     setJenis("");
  //     fetchData();
  //   } catch (error) {
  //     alert("Gagal menyimpan jenis");
  //   }
  // };

  const handleEditWarna = (id, value) => {
    setEditWarnaId(id);
    setWarna(value);
    setActiveTab("update");
  };

  const handleEditJenis = (id, value) => {
    setEditJenisId(id);
    setJenis(value);
    setActiveTab("update");
  };

  const handleCancelEdit = () => {
    setEditWarnaId(null);
    setEditJenisId(null);
    setWarna("");
    setJenis("");
  };

  return (
    <div className="w-full min-h-screen p-4">
      <div className="container mx-auto max-w-screen-lg">
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={() => setActiveTab("update")}
            className={`px-4 py-2 rounded-full font-semibold text-sm md:text-base ${
              activeTab === "update"
                ? "bg-[#FD1E0D] text-white"
                : "bg-gray-200 text-black"
            }`}
          >
            Update Data
          </button>
          <button
            onClick={() => setActiveTab("data")}
            className={`px-4 py-2 rounded-full font-semibold text-sm md:text-base ${
              activeTab === "data"
                ? "bg-[#FD1E0D] text-white"
                : "bg-gray-200 text-black"
            }`}
          >
            Data Saya
          </button>
        </div>

        {/* Update Tab */}
        {activeTab === "update" && (
          <div className="bg-white shadow-lg rounded-2xl px-4 py-6 border mb-10">
            {/* Warna Form */}
            <form onSubmit={handleSimpanWarna}>
              <h2 className="font-bold text-xl md:text-2xl mb-2">
                Update Warna Motor
              </h2>
              <input
                type="text"
                value={warna}
                onChange={(e) => setWarna(e.target.value)}
                placeholder="Tambah warna motor"
                className="w-full border rounded-md px-4 py-2 mt-2 text-sm md:text-base"
                required
              />
              <div className="flex flex-wrap gap-3 mt-4">
                {editWarnaId ? (
                  <>
                    <button
                      type="submit"
                      className="bg-[#FD1E0D] text-white px-4 py-2 rounded-full"
                    >
                      Simpan
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="bg-gray-400 text-white px-4 py-2 rounded-full"
                    >
                      Batal
                    </button>
                  </>
                ) : (
                  <button
                    type="submit"
                    className="bg-[#FD1E0D] text-white px-4 py-2 rounded-full"
                  >
                    Simpan
                  </button>
                )}
              </div>
            </form>

            {/* Jenis Form */}
            <form onSubmit={handleSimpanData} className="mt-10">
              <h2 className="font-bold text-xl md:text-2xl mb-2">
                Update Jenis Motor
              </h2>
              <input
                type="text"
                value={jenis}
                onChange={(e) => setJenis(e.target.value)}
                placeholder="Tambah jenis motor"
                className="w-full border rounded-md px-4 py-2 mt-2 text-sm md:text-base"
                required
              />
              <div className="flex flex-wrap gap-3 mt-4">
                {editJenisId ? (
                  <>
                    <button
                      type="submit"
                      className="bg-[#FD1E0D] text-white px-4 py-2 rounded-full"
                    >
                      Simpan
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="bg-gray-400 text-white px-4 py-2 rounded-full"
                    >
                      Batal
                    </button>
                  </>
                ) : (
                  <button
                    type="submit"
                    className="bg-[#FD1E0D] text-white px-4 py-2 rounded-full"
                  >
                    Simpan
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* Data Tab */}
        {activeTab === "data" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Warna List */}
            <ul className="space-y-3">
              {warnaList.map(({ id, nama, createdAt, updatedAt }) => (
                <li
                  key={id}
                  className="border rounded-md p-3 text-sm md:text-base"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">{nama}</span>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleDeleteWarna(id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FontAwesomeIcon icon={faTrashCan} />
                      </button>
                      <button
                        onClick={() => handleEditWarna(id, nama)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FontAwesomeIcon icon={faPenToSquare} />
                      </button>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Dibuat: {formatDate(createdAt)} <br />
                    Diperbarui: {formatDate(updatedAt)}
                  </div>
                </li>
              ))}
            </ul>

            {/* Warna List */}
            <ul className="space-y-3">
              {jenisList.map(({ id, nama, createdAt, updatedAt }) => (
                <li
                  key={id}
                  className="border rounded-md p-3 text-sm md:text-base"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">{nama}</span>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleDeleteJenis(id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FontAwesomeIcon icon={faTrashCan} />
                      </button>
                      <button
                        onClick={() => handleEditJenis(id, nama)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FontAwesomeIcon icon={faPenToSquare} />
                      </button>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Dibuat: {formatDate(createdAt)} <br />
                    Diperbarui: {formatDate(updatedAt)}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default UpdateBooking;
