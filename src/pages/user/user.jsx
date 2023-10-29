import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/auth-context";
import "./user.css";
import axios from "axios";

export const User = () => {
  const authContext = useContext(AuthContext);
  const {
    userID,
    nickname,
    phone,
    address,
    setNickname,
    setPhone,
    setAddress,
    isAdmin,
    isUser,
  } = authContext;

  const [contentId, setContentId] = useState("showuser");
  const [userlist, setUserlist] = useState([]);
  const [editedNickname, setEditedNickname] = useState("");
  const [editedPhone, setEditedPhone] = useState("");
  const [editedAddress, setEditedAddress] = useState("");
  const [isEditing, setIsEditing] = useState(false);

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
    console.log("Editing user with userID:", userID);

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

  const handleSave = async () => {
    console.log("Saving user with userID:", userID);

    try {
      const updatedUser = {
        userID, // 将 userID 放入请求体
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
    console.log("Cancel editing");
  };

  const handleDelete = async (userId) => {
    if (isAdmin) {
      try {
        await axios.delete(`/api/users/${userId}`);

        // 如果删除的是当前用户，则清除 AuthContext 中的数据
        if (userId === userID) {
          setNickname("");
          setPhone("");
          setAddress("");
        }

        // 重新获取用户列表
        fetchUserList();
      } catch (error) {
        console.log("Error deleting user:", error);
      }
    }
  };

  const handleSidebarClick = (id) => {
    setContentId(id);
  };

  const renderContent = () => {
    if (userlist.length === 0) {
      return <div>Loading...</div>;
    }

    const currentUser = userlist[0];
    if (contentId === "showuser") {
      if (isEditing) {
        return (
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
        );
      }

      return (
        <div className="showuser">
          <div className="user" key={currentUser.id}>
            <h3>Username: {currentUser.username}</h3>
            <h3>Nickname: {currentUser.nickname}</h3>
            <h3>Phone: {currentUser.phone}</h3>
            <h3>Address: {currentUser.address}</h3>
            <div className="user-buttons">
              <button onClick={() => handleEdit(currentUser.id)}>修改</button>
              <button onClick={() => handleDelete(currentUser.id)}>删除</button>
            </div>
          </div>
        </div>
      );
    } 
    if (contentId === "orderhistory") {
      return <h3>訂單記錄</h3>;
    }
    if (contentId === "faq") {
      return <h3>常見問題</h3>;
    }
  };

  return (
    <div className="userpage">
      <div className="sidebar">
        <button onClick={() => handleSidebarClick("showuser")}>
          <h1>用户资料</h1>
        </button>
        <button onClick={() => handleSidebarClick("orderhistory")}>
          <h1>订单记录</h1>
        </button>
        <button onClick={() => handleSidebarClick("faq")}>
          <h1>常见问题</h1>
        </button>
      </div>
      <div className="maincontent">{renderContent()}</div>
    </div>
  );
};
