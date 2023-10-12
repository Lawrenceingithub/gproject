import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User } from "phosphor-react";
import { AuthContext } from "../context/auth-context";
import "./navbar.css";

export const Navbar = () => {
  const authContext = useContext(AuthContext);
  const { isLoggedIn, username, logout } = authContext;
  const navigate = useNavigate();

  return (
    <div className="navbar">
      <div className="links">
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
                await navigate("/");
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