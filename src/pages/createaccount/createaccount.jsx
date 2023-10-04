import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Phone,
  AddressBook,
  Password,
  IdentificationCard,
} from "phosphor-react";
import "./createaccount.css";
import Axios from "axios";  

export const Createaccount = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const navigate = useNavigate();

  const Submit = () => {
    Axios.post("http://localhost:3001/createaccount", {
      username: username,
      password: password,
      phone: phone,
      address: address,
    })
      .then((response) => {
        if (response.data.success) {
          console.log("submit successful");
          setMessage({ text: "提交成功", type: "success" });
          navigate('/');

        } else {
          setErrorMessage("Invalid information");
          setMessage({ text: "无效的信息", type: "error" });
        }
      })
      .catch((error) => {
        console.log(error);
        setErrorMessage("An error occurred");
        setMessage({ text: "发生错误", type: "error" });
      });
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

        <button onClick={Submit}>注册</button>

        {errorMessage && <div className="error">{errorMessage}</div>}
        {message.text && (
          <div className={`message ${message.type}`}>{message.text}</div>
        )}
      </div>
    </div>
  );
};