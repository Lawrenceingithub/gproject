import React, { useState, useContext } from "react";
import "./login.css";
import { UserCircle, IdentificationCard, Password } from "phosphor-react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/auth-context";
import { users } from "../../userlist";

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = () => {
    const user = users.find((user) => user.username === username && user.password === password);

    if (user) {
      const { id, username, nickname, phone, address, userrole } = user;

      authContext.login(id, username, nickname, phone, address, userrole);

      setUsername(username);
      alert("歡迎 " + username);

      navigate("/");
    } else {
      setErrorMessage("用户名或密码不正確");
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
