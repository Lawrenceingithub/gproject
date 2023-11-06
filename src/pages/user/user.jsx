import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/auth-context";
import "./user.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../../components/sidebar";

export const User = () => {
  const authContext = useContext(AuthContext);
  const { logout, userID, setNickname, setPhone, setAddress } = authContext;

  const [userlist, setUserlist] = useState([]);
  const [editedNickname, setEditedNickname] = useState("");
  const [editedPhone, setEditedPhone] = useState("");
  const [editedAddress, setEditedAddress] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchUserList();
  }, []);

  const fetchUserList = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/user?userID=${userID}`
      );
      const currentUser = response.data[0];
      setUserlist([currentUser]);
    } catch (error) {
      console.log("Error fetching user list:", error);
    }
  };

  const handleEdit = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/user?userID=${userID}`
      );
      const currentUser = response.data[0];
      console.log("Current user:", currentUser);

      setEditedNickname(currentUser.nickname);
      setEditedPhone(currentUser.phone);
      setEditedAddress(currentUser.address);
      setIsEditing(true);
    } catch (error) {
      console.log("Error fetching user information:", error);
    }
  };

  const handleSave = async (id) => {
    try {
      const updatedUser = {
        userID: id,
        nickname: editedNickname,
        phone: editedPhone,
        address: editedAddress,
      };

      await axios.put(`http://localhost:3001/user`, updatedUser);

      // 更新 AuthContext 中的数据
      setNickname(editedNickname);
      setPhone(editedPhone);
      setAddress(editedAddress);

      // 重新获取用户列表
      fetchUserList();

      setIsEditing(false);
    } catch (error) {
      console.log("Error saving user information:", error);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/user?userID=${id}`);

      setNickname("");
      setPhone("");
      setAddress("");
      // 退出登录
      logout();

      alert("删除成功，现在返回首页");
      navigate("/");
    } catch (error) {
      console.log("Error deleting user:", error);
    }
  };

  const currentUser = userlist[0];
  if (isEditing) {
    return (
      <>
        <Sidebar />
        <div className="maincontent">
          <div className="edituser">
            <div className="user" key={currentUser.id}>
              <h3>Username: {currentUser.username}</h3>
              <h3>
                <label>
                  Nickname:
                  <input
                    type="text"
                    value={editedNickname}
                    onChange={(e) => setEditedNickname(e.target.value)}
                  />
                </label>
              </h3>
              <h3>
                <label>
                  Phone:
                  <input
                    type="text"
                    value={editedPhone}
                    onChange={(e) => setEditedPhone(e.target.value)}
                  />
                </label>
              </h3>
              <h3>
                <label>
                  Address:
                  <input
                    type="text"
                    value={editedAddress}
                    onChange={(e) => setEditedAddress(e.target.value)}
                  />
                </label>
              </h3>
              <div className="user-buttons">
                <button onClick={() => handleSave(currentUser.id)}>保存</button>
                <button onClick={handleCancelEdit}>取消</button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  } else if (userlist.length === 0) {
    <div className="maincontent">
      return <div>Loading...</div>;
    </div>;
  } else {
    return (
      <>
        <Sidebar />
        <div className="maincontent">
          <div className="showuser">
            <h2>用戶資料：</h2>
            <div className="user" key={currentUser.id}>
              <h4>Username: {currentUser.username}</h4>
              <h4>Nickname: {currentUser.nickname}</h4>
              <h4>Phone: {currentUser.phone}</h4>
              <h4>Address: {currentUser.address}</h4>
              <div className="user-buttons">
                <button onClick={() => handleEdit(currentUser.id)}>修改</button>
                <button onClick={() => handleDelete(currentUser.id)}>
                  删除
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
};
