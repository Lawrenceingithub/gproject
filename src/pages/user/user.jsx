import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/auth-context";
import "./user.css";
import { users } from "../../userlist";
import { Login } from "../login/login";

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
  const [editingUserId, setEditingUserId] = useState(userID);
  const [userlist, setUserlist] = useState(users); // 使用提供的 users 列表
  const [editedNickname, setEditedNickname] = useState("");
  const [editedPhone, setEditedPhone] = useState("");
  const [editedAddress, setEditedAddress] = useState("");

  console.log("isAdmin?", isAdmin)
  console.log("isUser?", isUser)
  console.log("Nickname?", authContext.nickname);
  

  const handleEdit = (userId) => {
    console.log("Editing user with userID:", userId);
  
    if (isAdmin || userId === userID) {
      const currentUser = userlist.find((user) => user.id === userId);
      console.log("Current user:", currentUser); // 添加此行
  
      if (currentUser) {
        setEditedNickname(currentUser.nickname);
        setEditedPhone(currentUser.phone);
        setEditedAddress(currentUser.address);
        setEditingUserId(userId);
      }
    } else {
      alert("您没有权限编辑该用户的数据");
    }
  };
  

  const handleSave = (userId) => {
    // 在這裡您可以更新 userlist 中的相應用戶信息，或將其發送到後端進行保存。
    // 記得處理保存後的操作，並同步更新 AuthContext 中的數據。
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
  };

  const handleDelete = (userId) => {
    // 處理刪除用戶的邏輯
  };

  const handleSidebarClick = (id) => {
    setContentId(id);
  };

  const renderContent = () => {
    if (userlist.length === 0) {
      return <div>Loading...</div>;
    }
  
    if (isAdmin) {
      return (
        <div className="showuser">
          {userlist.map((user) => (
            <div className="user" key={user.id}>
              <h3>Username: {user.username}</h3>
              <h3>Nickname: {user.nickname}</h3>
              <h3>Phone: {user.phone}</h3>
              <h3>Address: {user.address}</h3>
              <div className="user-buttons">
                <button onClick={() => handleEdit(user.id)}>修改</button>
                <button onClick={() => handleDelete(user.id)}>刪除</button>
              </div>
            </div>
          ))}
        </div>
      );
    } else if (isUser) {
      const currentUser = userlist.find((user) => user.id === userID);
      if (currentUser) {
        return (
          <div className="showuser">
            <div className="user" key={currentUser.id}>
              <h3>Username: {currentUser.username}</h3>
              <h3>Nickname: {currentUser.nickname}</h3>
              <h3>Phone: {currentUser.phone}</h3>
              <h3>Address: {currentUser.address}</h3>
              <div className="user-buttons">
                <button onClick={() => handleEdit(currentUser.id)}>修改</button>
              </div>
            </div>
          </div>
        );
      }
    }
  
    return null;
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
