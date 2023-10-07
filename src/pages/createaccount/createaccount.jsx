import React, { useState, useContext  } from "react";
import { useNavigate  } from "react-router-dom";
import { Phone, AddressBook, Password, IdentificationCard } from "phosphor-react";
import { AuthContext } from "../../context/auth-context";
import "./createaccount.css";
import Axios from "axios";

export const Createaccount = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState({ text: null, type: "" });

  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  const submit = async () => {
    if (username && password) {
      try {
        const response = await Axios.post("http://localhost:3001/createaccount", {
          username: username,
          password: password,
          nickname: nickname,
          phone: phone,
          address: address,
        });
        console.log(response);
        setMessage({ text: "註冊成功", type: "success" });
        setTimeout(() => {
          authContext.login(username);  // 更新 context 中的用户名
          navigate('/');
        }, 1000);
      } catch (error) {
        setMessage({ text: "發生錯誤", type: "error" });
      }
    } else {
      setMessage({ text: "用戶名和密碼不能為空", type: "error" });
    }
  };
  

  return (
    <div className="createaccount">
      <div className="userform">
        <div className="formtitle">
          <h1>注册表</h1>
        </div>
        
        <IdentificationCard />
        <label>用户名:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <Password />
        <label>密码:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <IdentificationCard />
        <label>昵稱:</label>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          required
        />

        <Phone />
        <label>电话号码:</label>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        <AddressBook />
        <label>地址:</label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />

        <button onClick={submit}>注册</button>

        {message.text !== null && <div className={`message ${message.type}`}>{message.text}</div>}
      </div>
    </div>
  );
};