import Footer from "../components/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import React, { useState, useContext } from "react";

function MasukLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const { login } = useContext(AuthContext);

  // ✅ Login dengan Google
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;
      const googleIdToken = await firebaseUser.getIdToken();

      const response = await axios.post(
        "http://localhost:5000/api/auth/google-login",
        { token: googleIdToken },
        { withCredentials: true }
      );

      const { accessToken, user: userData } = response.data;

      if (accessToken && userData) {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("user", JSON.stringify(userData));
        login(userData);

        // ✅ Navigasi sesuai peran
        navigate(userData.role === "admin" ? "/admin" : "/");
      } else {
        throw new Error("Data user atau token tidak lengkap.");
      }
    } catch (error) {
      console.error("Login Google gagal:", error);
      alert("Login dengan Google gagal. Silakan coba lagi.");
    }
  };

  // ✅ Login dengan email dan password
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setMsg("Email dan password wajib diisi");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password },
        { withCredentials: true }
      );

      const { accessToken, user: userData } = response.data;

      if (accessToken && userData) {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("user", JSON.stringify(userData));
        login(userData);

        navigate(userData.role === "admin" ? "/admin" : "/");
      } else {
        throw new Error("Data user tidak lengkap.");
      }
    } catch (error) {
      const msg = error?.response?.data?.msg || "Terjadi kesalahan saat login";
      setMsg(msg);
    }
  };

  return (
    <div className="flex flex-col justify-between min-h-screen">
      <div className="flex justify-center items-center flex-grow px-4 sm:px-6 lg:px-8 py-10">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md bg-white shadow-lg rounded-2xl px-6 py-8"
        >
          <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-6">
            Login
          </h1>

          {msg && <p className="text-red-500 text-center mb-4">{msg}</p>}

          <div className="mb-4">
            <label className="block mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border-b-2 outline-none"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border-b-2 outline-none"
              required
            />
          </div>

          <div className="text-center mb-4">
            <button
              type="submit"
              className="w-full bg-[#FD1E0D] hover:bg-[#ED1100] text-white font-medium py-2 rounded-full transition-all"
            >
              Login
            </button>

            <p className="text-gray-500 mt-3">Atau login dengan Google</p>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full mt-2 bg-[#DFDFDF] hover:bg-[#808080] hover:text-white text-black font-medium py-2 rounded-full flex items-center justify-center gap-2 transition-all"
            >
              <FontAwesomeIcon icon={faGoogle} />
              Gunakan akun Google
            </button>
          </div>

          <div className="text-sm text-center mt-4 space-y-2">
            <p>
              <Link
                to="/forgot-password"
                className="text-blue-500 hover:underline"
              >
                Lupa password?
              </Link>
            </p>
            <p>
              Belum punya akun?{" "}
              <span
                onClick={() => navigate("/signup")}
                className="text-red-500 font-semibold cursor-pointer hover:underline"
              >
                Signup
              </span>
            </p>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default MasukLogin;
