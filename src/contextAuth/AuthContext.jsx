import React, { createContext, useState } from "react";

export const AuthContext = createContext(null);

const safeParse = (value) => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const tokenFromStorage = localStorage.getItem("token");
  const userFromStorage = localStorage.getItem("user");

  const [token, setToken] = useState(tokenFromStorage || null);
  const [user, setUser] = useState(
    userFromStorage && userFromStorage !== "undefined"
      ? safeParse(userFromStorage)
      : null
  );

  const saveToken = (token, userData) => {
    if (!token || !userData) return;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));

    setToken(token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, saveToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
