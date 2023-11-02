import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User } from "phosphor-react";
import { AuthContext } from "../context/auth-context";
import "./navbar.css";

export const Navbar = () => {
  const authContext = useContext(AuthContext);
  const { isLoggedIn, username, logout, setUserID, setAddress, setPhone, setNickname } = authContext;
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedUserID = localStorage.getItem("userID");
    const storedAddress = localStorage.getItem("address");
    const storedPhone = localStorage.getItem("phone");
    const storedNickname = localStorage.getItem("nickname");

    if (storedUsername && storedUserID) {
      // 如果在 localStorage 中找到用户信息，将其设置到 AuthContext 中
      setUserID(storedUserID);
      setNickname(storedNickname);
      setPhone(storedPhone);
      setAddress(storedAddress);
    }
  }, [setUserID, setNickname, setPhone, setAddress]);

  return (
    <div className="navbar">
      <div className="navbarLink">
        <Link to="/">測試頁</Link>
        {isLoggedIn ? (
          <>
            <Link to="/cart">
              <ShoppingCart size={32} />
            </Link>
            <Link to="/user">
              <User size={32} />
            </Link>
            <h2 style={{ color: "white" }}>歡迎 {username}</h2>
            <button
              onClick={async () => {
                logout();
                alert("成功登出");
                navigate("/");
              }}
            >
              登出
            </button>
          </>
        ) : (
          <>
            <Link to="/cart">
              <ShoppingCart size={32} />
            </Link>
            <Link to="/login">
              <button>登入</button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};