import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext({
  username: "",
  userID: null,
  login: () => {},
  logout: () => {},
  setUserID: () => {},
  setNickname: () => {},
  setPhone: () => {},
  setAddress: () => {},
  setuserRole: () => {},
  setIsLoggedIn: ()=>{},
  isAdmin: false,
  isUser: false,
});

export const AuthContextProvider = ({ children }) => {
  // 使用对象存储所有本地存储键值对
  const localStorageKeys = {
    isLoggedIn: "isLoggedIn",
    username: "username",
    userID: "userID",
    nickname: "nickname",
    phone: "phone",
    address: "address",
    userrole: "userrole",
  };

  const [userrole, setuserRole] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isUser, setIsUser] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // 檢查本地存儲并設置用戶角色
    const storedUserrole = localStorage.getItem(localStorageKeys.userrole);
    if (storedUserrole) {
      setuserRole(storedUserrole);
      if (storedUserrole === "1") {
        setIsAdmin(true);
      } else if (storedUserrole === "0") {
        setIsUser(true);
      }
    }
    
    // 检查本地存储并设置登录状态
    const storedIsLoggedIn = localStorage.getItem(localStorageKeys.isLoggedIn);
    if (storedIsLoggedIn === "true") {
      setIsLoggedIn(true);
    }
  }, []);
  
  const login = async (userID, username, nickname, phone, address, userrole) => {
    // 设置用户信息
    const userInfo = {
      userID,
      username,
      nickname,
      phone,
      address,
      userrole,
    };
  
    // 将用户信息存储在本地存儲中，包括 username
    for (const key in localStorageKeys) {
      localStorage.setItem(localStorageKeys[key], userInfo[key]);
    }
  
    setIsLoggedIn(true);
  
    // 设置用户角色
    setuserRole(userrole);
    if (userrole === "1") {
      setIsAdmin(true);
    } else if (userrole === "0") {
      setIsUser(true);
    }
  
    // 設置 username
    localStorage.setItem(localStorageKeys.username, username);
  };

  const logout = () => {
    // 清除本地存儲中的用戶信息和角色
    for (const key in localStorageKeys) {
      localStorage.removeItem(localStorageKeys[key]);
    }
    
    // 清除 username
    localStorage.removeItem(localStorageKeys.username);
    
    // 重置用戶角色
    setuserRole("");
    setIsAdmin(false);
    setIsUser(false);
    setIsLoggedIn(false);
  };

  const authContextValue = {
    username: localStorage.getItem(localStorageKeys.username) || "",
    userID: localStorage.getItem(localStorageKeys.userID) || null,
    login,
    logout,
    setUserID: (userID) => {
      // 设置 userID 并存储在本地存储中
      localStorage.setItem(localStorageKeys.userID, userID);
    },
    setNickname: (nickname) => {
      // 设置 nickname 并存储在本地存储中
      localStorage.setItem(localStorageKeys.nickname, nickname);
    },
    setPhone: (phone) => {
      // 设置 phone 并存储在本地存储中
      localStorage.setItem(localStorageKeys.phone, phone);
    },
    setAddress: (address) => {
      // 设置 address 并存储在本地存储中
      localStorage.setItem(localStorageKeys.address, address);
    },
    setuserRole: (userrole) => {
      // 设置 address 并存储在本地存储中
      localStorage.setItem(localStorageKeys.userrole, userrole);
    },
    setuserRole,
    isAdmin,
    isUser,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};
