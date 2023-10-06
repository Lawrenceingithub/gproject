import React, { createContext, useState } from "react";

export const AuthContext = createContext({
  isLoggedIn: false,
  username: "",
  login: () => {},
  logout: () => {},
});

export const AuthContextProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null); // 添加 user 状态

  const login = (username) => {
    setIsLoggedIn(true);
    setUsername(username);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null); // 在登出时清除用户信息
  };

  const updateUser = (userData) => {
    setUser(userData); // 更新用户信息
  };

  const authContextValue = {
    isLoggedIn,
    username,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};