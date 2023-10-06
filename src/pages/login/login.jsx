import React, { useState, useContext } from "react";
import "./login.css";
import { UserCircle, IdentificationCard, Password } from "phosphor-react";
import Axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/auth-context";
import Cookies from "js-cookie";

export const Login = () => {
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false); // 新增的状态和函数

  const handleLogin = () => {
    Axios.post("http://localhost:3001/login", {
      username: username,
      password: password,
    })
      .then((response) => {
        if (response.data.success) {
          Cookies.set("token", response.data.token, { expires: 1 });
          authContext.login(username);

          if (navigate() === "/cart") {
            navigate("/cart");
          } else {
            navigate("/");
          }
          setShowModal(true); // 登录成功后显示模态框
        } else {
          setErrorMessage("无效的帐号或密码");
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
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <p>登录成功</p>
            <button onClick={() => setShowModal(false)}>关闭</button>
          </div>
        </div>
      )}
    </>
  );
};