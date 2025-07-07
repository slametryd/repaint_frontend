import React, { useState } from "react";
import axios from "axios";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/forgot-password",
        {
          email,
        }
      );
      setMsg(response.data.msg);
    } catch (error) {
      setMsg(error.response?.data?.msg || "Gagal mengirim email reset");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white shadow-md p-6 rounded-xl"
      >
        <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
        {msg && <p className="text-center text-red-500 mb-3">{msg}</p>}
        <input
          type="email"
          placeholder="Masukkan email kamu"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border rounded mb-4"
          required
        />
        <button
          type="submit"
          className="w-full bg-[#FD1E0D] text-white py-2 rounded hover:bg-[#ED1100]"
        >
          Kirim Link Reset
        </button>
      </form>
    </div>
  );
}

export default ForgotPassword;
