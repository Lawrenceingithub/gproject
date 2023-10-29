import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext({
  userID: null,
  username: "",
  address: "",
  phone: "",
  Login: () => {},
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
    role: "role", // 修改键名为 "role"
  };

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [userID, setUserID] = useState("");
  const [nickname, setNickname] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [userrole, setUserrole] = useState("");

  useEffect(() => {
    const storedIsLoggedIn = localStorage.getItem(localStorageKeys.isLoggedIn);

    if (storedIsLoggedIn === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  const Login = async (userID, username, nickname, phone, address, userrole) => {
    const userInfo = {
      userID,
      username,
      nickname,
      phone,
      address,
      role: userrole,
    };
  
    for (const key of Object.keys(userInfo)) {
      localStorage.setItem(localStorageKeys[key], userInfo[key]);
    }
  
    localStorage.setItem(localStorageKeys.isLoggedIn, "true");
    setUserID(userID);
    setUsername(username);
    setNickname(nickname);
    setPhone(phone);
    setAddress(address);
    setIsLoggedIn(true);
  
  };


  const logout = () => {
    for (const key in localStorageKeys) {
      localStorage.removeItem(localStorageKeys[key]);
    }
  
    localStorage.removeItem(localStorageKeys.username);
    localStorage.removeItem(localStorageKeys.isLoggedIn);
    localStorage.removeItem(localStorageKeys.role); // 修改为正确的键名 role
  
    setIsLoggedIn(false);
  };

  const authContextValue = {

    username,
    userID,
    nickname,
    phone,
    address,
    userrole,
    Login,
    logout,
    setUserID,
    setNickname,
    setPhone,
    setAddress,
    isLoggedIn,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};