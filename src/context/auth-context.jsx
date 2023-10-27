import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext({
  username: "",
  userID: null,
  login: () => {},
  logout: () => {},
  setUserID: (userID) => {},
  setNickname: (nickname) => {},
  setPhone: (phone) => {},
  setAddress: (address) => {},
  isLoggedIn: false,
  isAdmin: false,
  isUser: false,
});

export const AuthContextProvider = ({ children }) => {
  const localStorageKeys = {
    isLoggedIn: "isLoggedIn",
    username: "username",
    userID: "userID",
    nickname: "nickname",
    phone: "phone",
    address: "address",
    userrole: "userrole"
  };
  const [isAdmin, setIsAdmin] = useState(false);
  const [isUser, setIsUser] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const storedIsLoggedIn = localStorage.getItem(localStorageKeys.isLoggedIn);
  
    if (storedIsLoggedIn === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  const login = async (userID, username, nickname, phone, address, userrole) => {
    const userInfo = {
      userID,
      username,
      nickname,
      phone,
      address,
      userrole
    };

    for (const key of Object.keys(userInfo)) {
      localStorage.setItem(localStorageKeys[key], userInfo[key]);
    }

    localStorage.setItem(localStorageKeys.isLoggedIn, "true");
    setIsLoggedIn(true);

    if (userrole === "1") {
      setIsAdmin(true);
      console.log("isAdmin set to true");
      localStorage.setItem(localStorageKeys.userrole, userrole);
    } else if (userrole === "0") {
      setIsUser(true);
      console.log("isUser set to true");
      localStorage.setItem(localStorageKeys.userrole, userrole);
    }
  };

  const logout = () => {
    for (const key in localStorageKeys) {
      localStorage.removeItem(localStorageKeys[key]);
    }

    localStorage.removeItem(localStorageKeys.username);
    localStorage.removeItem(localStorageKeys.isLoggedIn); // 更新本地存储中的 isLoggedIn 值
    localStorage.removeItem(localStorageKeys.userrole);

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
      localStorage.setItem(localStorageKeys.userID, userID);
    },
    setNickname: (nickname) => {
      localStorage.setItem(localStorageKeys.nickname, nickname);
    },
    setPhone: (phone) => {
      localStorage.setItem(localStorageKeys.phone, phone);
    },
    setAddress: (address) => {
      localStorage.setItem(localStorageKeys.address, address);
    },
    isLoggedIn,
    isAdmin,
    isUser,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};