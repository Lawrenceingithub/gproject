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

  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await Axios.post("http://localhost:3001/login", {
        username: username,
        password: password,
      });
  
      if (response.status === 200 && response.data.length > 0) {
        const userData = response.data[0]; // 用户数据数组的第一个元素
        console.log(userData);

        setTimeout(() => {
          authContext.login(username);
          alert("歡迎 " + username);
          navigate('/');
        }, 1000);
      } else if (response.status === 401) {
        setErrorMessage(response.data);
      } else if (response.status === 404) {
        setErrorMessage(response.data);
      } else {
        setErrorMessage(response.data);
      }
    } catch (error) {
      console.log(error);
      console.log(error.response);
      setErrorMessage(error.response.data);
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
          onChange={(e) => setusername(e.target.value)}
          required
        />
        <Password size={30} />
        <label>密码:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setpassword(e.target.value)}
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