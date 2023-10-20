import React, { createContext, useState, useEffect, useContext } from "react";

export const AuthContext = createContext({
  isLoggedIn: false,
  userID:null,
  username: "",
  login: () => {},
  logout: () => {},
  setUserID: () => {}, // 添加 setUserID 方法
});

export const AuthContextProvider = ({ children }) => {
  const [userRole, setUserRole] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [userID, setUserID] = useState(""); // 添加 userId 变量
  const [isAdmin, setIsAdmin] = useState(false);
  const [isUser, setIsUser] = useState(false);

  useEffect(() => {
    // 在应用启动时检查本地存储中是否有登录状态
    const storedLoggedIn = localStorage.getItem("isLoggedIn");
    if (storedLoggedIn === "true") {
      const storedUsername = localStorage.getItem("username");
      setIsLoggedIn(true);
      setUsername(storedUsername);
    }
  }, []);

  useEffect(() => {
    // 获取用户的角色信息，可以从服务器端或本地存储中获取
    const storedUserRole = localStorage.getItem("userRole");
    if (storedUserRole) {
      setUserRole(storedUserRole);
    }
  }, []);

  const login = (username, role, userID) => {
    setIsLoggedIn(true);
    setUsername(username);
    setUserID(userID); // 设置 userID 的值

    // 将登录状态存储在本地存储中
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("username", username);

    if (role === "1") {
      setIsAdmin(true);
    } else if (role === "0") {
      setIsUser(true);
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUsername("");
    setIsAdmin(false);
    setIsUser(false);

    // 清除本地存储中的登录状态
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
  };

  const updateUser = (userData) => {
    setUserRole(userData.role); // 更新用户角色

    // 将用户角色存储在本地存储中
    localStorage.setItem("userRole", userData.role);
  };

  const authContextValue = {
    isLoggedIn,
    username,
    userRole,
    userID, // 确保定义了 userId
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
