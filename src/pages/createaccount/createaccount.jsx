import React, { useState, useContext  } from "react";
import { useNavigate  } from "react-router-dom";
import { Phone, AddressBook, Password, IdentificationCard } from "phosphor-react";
import { AuthContext } from "../../context/auth-context";
import "./createaccount.css";
import Axios from "axios";

export const Createaccount = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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
          phone: phone,
          address: address,
        });
  
        if (response.data.success) {
          setMessage({ text: "帐号创建成功", type: "success" });
          

          setTimeout(() => {
            authContext.login(username);
            navigate("/");
          }, 1000);
        } else {
          setMessage({ text: response.data.message, type: "error" }); // 显示后端返回的错误消息
        }
      } catch (error) {
        setMessage({ text: "发生错误", type: "error" });
      }
    } else {
      setMessage({ text: "用户名和密码不能为空", type: "error" });
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