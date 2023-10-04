import React, { useState, useContext } from "react";
import "./login.css";
import { UserCircle, IdentificationCard, Password } from "phosphor-react";
import Axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/auth-context";

export const Login = () => {
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  const handleLogin = () => {
    Axios.post("http://localhost:3001/login", {
      username: username,
      password: password,
    })
      .then((response) => {
        // 根据后端返回的响应判断登录是否成功
        if (response.data.success) {
          // 登录成功的逻辑
          console.log("Login successful");
          authContext.login(username); // 触发登录状态更新
          if (navigate() === "/cart") {
            navigate("/cart"); // 登录成功后返回购物车页面
          } else {
            navigate("/"); // 登录成功后返回首页
          }
          
        } else {
          // 登录失败的逻辑
          setErrorMessage("Invalid username or password");
        }
      })
      .catch((error) => {
        console.log(error);
        setErrorMessage("An error occurred");
      });
  };

  return (
    <>
      <div className="logininfo">
        <UserCircle size={150} />
        <IdentificationCard size={30} />
        <label>用戶名:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setusername(e.target.value)}
          required
        />
        <Password size={30} />
        <label>密碼:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setpassword(e.target.value)}
          required
        />
        <p style={{ color: "red" }}>{errorMessage}</p>
        <button onClick={handleLogin}>登入</button>
        <p>
          注冊新帳號? <Link to="/createaccount">注冊</Link>
        </p>
      </div>
    </>
  );
};