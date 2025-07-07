import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Sinkronisasi user dari localStorage saat mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("user"); // hapus jika corrupt
        setUser(null);
      }
    }
  }, []);

  // Fungsi login: simpan ke state & localStorage
  const login = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  // Fungsi logout: hapus data dari state & localStorage
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken"); // kalau kamu simpan token
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
