import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
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
  const [errorMessage, setErrorMessage] = useState(""); // Updated for error handling

  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  const handleRegistration = async () => {
    try {
      if (username && password) {
        const response = await Axios.post("http://localhost:3001/createaccount", {
          username: username,
          password: password,
          nickname: nickname,
          phone: phone,
          address: address,
        });
  
        if (response.status === 200) {
          // 注册成功
          const { userID, username, nickname, phone, address, userrole } = response.data;
          authContext.Login(userID, username, nickname, phone, address, userrole);
          alert("注冊成功");
          navigate('/');

        }
      } else {
        setErrorMessage("用户名和密码不能为空");
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setErrorMessage(error.response.data.error);
      }
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

        <button onClick={handleRegistration}>注册</button>

        {errorMessage && <div className="message error">{errorMessage}</div>}
      </div>
    </div>
  );
};
