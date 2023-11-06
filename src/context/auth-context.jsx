import React, { createContext, useState } from "react";

export const AuthContext = createContext({
  userID: null,
  username: "",
  address: "",
  phone: "",
  userrole:"",
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
    userrole: "userrole",
  };

  const initializeIsLoggedIn = () => {
    const storedIsLoggedIn = localStorage.getItem(localStorageKeys.isLoggedIn);
    return storedIsLoggedIn === "true";
  };

  const [isLoggedIn, setIsLoggedIn] = useState(initializeIsLoggedIn);
  const [username, setUsername] = useState(
    localStorage.getItem(localStorageKeys.username) || ""
  );
  const [userID, setUserID] = useState(
    localStorage.getItem(localStorageKeys.userID) || ""
  );
  const [nickname, setNickname] = useState(
    localStorage.getItem(localStorageKeys.nickname) || ""
  );
  const [phone, setPhone] = useState(
    localStorage.getItem(localStorageKeys.phone) || ""
  );
  const [address, setAddress] = useState(
    localStorage.getItem(localStorageKeys.address) || ""
  );
  const [userrole, setUserrole] = useState(
    localStorage.getItem(localStorageKeys.userrole) || ""
  );

  const Login = async (
    userID,
    username,
    nickname,
    phone,
    address,
    userrole
  ) => {
    const userInfo = {
      userID,
      username,
      nickname,
      phone,
      address,
      userrole,
    };

    Object.entries(userInfo).forEach(([key, value]) => {
      localStorage.setItem(localStorageKeys[key], value);
    });

    localStorage.setItem(localStorageKeys.isLoggedIn, "true");
    setUserID(userID);
    setUserrole(userrole);
    setUsername(username);
    setNickname(nickname);
    setPhone(phone);
    setAddress(address);
    setIsLoggedIn(true);
  };

  const logout = () => {
    Object.values(localStorageKeys).forEach((key) =>
      localStorage.removeItem(key)
    );
    setUserID("");
    setUserrole("");
    setUsername("");
    setNickname("");
    setPhone("");
    setAddress("");
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
