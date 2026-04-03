import React, { createContext, useState, useEffect } from "react";
import API from "../api/axios";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  // FIX 1: Initialize state DIRECTLY from localStorage. 
  // This prevents the 'null' state during the first millisecond of page load.
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("userInfo");
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (error) {
        localStorage.removeItem("userInfo");
        return null;
      }
    }
    return null;
  });

  // Since we initialize state above, we can start loading as false or 
  // use it only for backend verification.
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    try {
      const { data } = await API.post('/auth/login', { email, password });
      localStorage.setItem('userInfo', JSON.stringify(data));
      setUser(data);
      return data; 
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      <div className="min-h-screen bg-slate-900 text-white">
        {children}
      </div>
    </AuthContext.Provider>
  );
};

export default AuthProvider;