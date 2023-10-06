import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/auth-context";
import "./user.css";

export const User = () => {
  const { user, isLoggedIn, logout, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("http://localhost:3001/user", {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        if (data.success) {
          const { user } = data;
          updateUser(user); // 更新用户信息
        } else {
          // 处理获取用户信息失败的情况
        }
      } catch (error) {
        console.log(error);
        // 处理请求失败的情况
      }
    };

    if (isLoggedIn) {
      fetchUser();
    } else {
      navigate("/login"); // 未登录时导航到登录页面
    }
  }, [isLoggedIn, navigate, updateUser]);

  const headtoFAQ = () => {
    navigate("/user/faq");
  };

  const headtoOrderhistory = () => {
    navigate("/user/orderhistory");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="userpage">
      <div className="sidebar">
        <ul>
          <li>
            <Link to="/user/orderhistory" onClick={headtoOrderhistory}>
              订单历史
            </Link>
          </li>
          <li>
            <Link to="/user/faq" onClick={headtoFAQ}>
              FAQ
            </Link>
          </li>
        </ul>
      </div>

      <div className="content">
        <div className="userinfo">
          {user ? (
            <>
              <p>用户名：{user.username}</p>
              <p>电话：{user.phone}</p>
              <p>地址：{user.address}</p>

              <p>这是一些额外的内容</p>

              <button onClick={handleLogout}>退出登录</button>
            </>
          ) : (
            <p>无用户信息</p>
          )}
        </div>
      </div>
    </div>
  );
};