import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [msg, setMsg] = useState("");
  const baseURL = import.meta.env.VITE_API_URL;

  const handleReset = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${baseURL}/api/auth/reset-password/${token}`,
        {
          password,
          confPassword,
        }
      );

      setMsg(response.data.msg);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setMsg(error?.response?.data?.msg || "Gagal reset password");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <form
        onSubmit={handleReset}
        className="w-full max-w-md bg-white shadow-md p-6 rounded-xl"
      >
        <h1 className="text-2xl font-bold mb-4">Atur Ulang Password</h1>
        {msg && <p className="text-center text-red-500 mb-3">{msg}</p>}
        <input
          type="password"
          placeholder="Password baru"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded mb-4"
          required
        />
        <input
          type="password"
          placeholder="Konfirmasi password"
          value={confPassword}
          onChange={(e) => setConfPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded mb-4"
          required
        />
        <button
          type="submit"
          className="w-full bg-[#FD1E0D] text-white py-2 rounded hover:bg-[#ED1100]"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
}

export default ResetPassword;
