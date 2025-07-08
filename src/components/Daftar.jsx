import React, { useState } from "react";
import Footer from "./Footer";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
axios.defaults.withCredentials = true;
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";

const Daftar = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [msg, setMsg] = useState(""); // Untuk pesan error

  const baseURL = import.meta.env.VITE_API_URL;

  const navigate = useNavigate();
  const Register = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${baseURL}/api/auth/users`, {
        name: name,
        email: email,
        password: password,
        confPassword: confPassword,
      });
      navigate("/login");
    } catch (error) {
      if (error.response && error.response.data.msg) {
        setMsg(error.response.data.msg);
      } else {
        setMsg("Terjadi kesalahan saat mendaftar");
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // 1. Login pakai popup Google (Firebase)
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // 2. Ambil ID Token (penting untuk keamanan)
      const idToken = await user.getIdToken();

      // 3. Kirim ID Token ke backend (bukan data mentah)
      const response = await axios.post(`${baseURL}/api/auth/google-login`, {
        token: idToken,
      });

      // 4. Simpan data user (yang sudah diverifikasi backend)
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // 5. Arahkan user ke halaman utama
      navigate("/login");
    } catch (error) {
      console.error("Login gagal:", error);
      alert("Login gagal. Coba lagi.");
    }
  };

  return (
    <div className="flex flex-col justify-between min-h-screen">
      <div className="flex justify-center items-center flex-grow px-4 sm:px-6 py-10">
        <form
          onSubmit={Register}
          className="w-full max-w-md bg-white shadow-lg rounded-2xl px-6 py-8"
        >
          <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-6">
            Sign Up
          </h1>

          {msg && <p className="text-red-500 text-center mb-4">{msg}</p>}

          <div className="mb-4">
            <label className="block mb-1">Nama</label>
            <input
              className="w-full px-3 py-2 border-b-2 outline-none"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Email</label>
            <input
              className="w-full px-3 py-2 border-b-2 outline-none"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Password</label>
            <input
              className="w-full px-3 py-2 border-b-2 outline-none"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block mb-1">Konfirmasi Password</label>
            <input
              className="w-full px-3 py-2 border-b-2 outline-none"
              type="password"
              value={confPassword}
              onChange={(e) => setConfPassword(e.target.value)}
              required
            />
          </div>

          <div className="text-center mb-4">
            <button
              type="submit"
              className="w-full bg-[#FD1E0D] hover:bg-[#ED1100] text-white font-medium py-2 rounded-full transition-all"
            >
              Sign Up
            </button>
            <p className="text-gray-500 mt-3">Atau daftar dengan Google</p>
            <button
              onClick={handleGoogleLogin}
              type="button"
              className="w-full mt-2 bg-[#DFDFDF] hover:bg-[#808080] hover:text-white text-black font-medium py-2 rounded-full flex items-center justify-center gap-2 transition-all"
            >
              <FontAwesomeIcon icon={faGoogle} />
              Gunakan akun Google
            </button>
          </div>

          <div className="text-sm text-center mt-4">
            <p>
              Sudah punya akun?{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-red-500 font-semibold cursor-pointer hover:underline"
              >
                Login
              </span>
            </p>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default Daftar;
