import React, { useState, useContext } from "react";
import "./login.css";
import { UserCircle, IdentificationCard, Password } from "phosphor-react";
import Axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/auth-context";

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await Axios.post("http://localhost:3001/login", {
        username: username,
        password: password,
      });

      if (response.status === 200) {
        const { userID, username, nickname, phone, address, userrole } = response.data;

        authContext.login(userID, username, nickname, phone, address, userrole);
        
        setUsername(username);
        alert("歡迎 " + username);

        navigate("/");
      }
    } catch (error) {
      console.log("登錄錯誤：", error);
      if (error.response && error.response.data && error.response.data.error) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage("未知错误");
      }
    }
  };

  return (
    <>
      <div className="logininfo">
        <UserCircle size={150} />
        <IdentificationCard size={30} />
        <label>用户名:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <Password size={30} />
        <label>密码:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <p style={{ color: "red" }}>{errorMessage}</p>
        <button onClick={handleLogin}>登录</button>
        <p>
          注册新帐号? <Link to="/createaccount">注册</Link>
        </p>
      </div>
    </>
  );
};