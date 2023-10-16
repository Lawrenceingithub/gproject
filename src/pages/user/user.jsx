import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/auth-context";
import Axios from "axios";
import { Sidebar } from "../../components/sidebar";
import { OrderHistory } from "./orderhistory";
import { FAQ } from "./faq"; 
import "./user.css";

export const User = () => {
  const { username } = useContext(AuthContext);
  const [userlist, setUserlist] = useState([]);
  const [contentId, setContentId] = useState("showuser"); // 设置初始值为 "showuser"

  useEffect(() => {
    showUser(username);
  }, []);

  const showUser = async () => {
    try {
      const response = await Axios.get("http://localhost:3001/user", {
        params: { username: username },
      });

      setUserlist(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = () =>{

  };

  const handleDelete = () =>{

  };


  const handleSidebarClick = (id) => {
    setContentId(id);
  };

  const renderContent = () => {
    if (contentId === "showuser") {
      // 显示原始的 showuser 内容
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
                <button onClick={() => handleDelete(user.id)}>刪除帳號</button>
              </div>
            </div>
          ))}
        </div>
      );
    } else if (contentId === "orderhistory") {
      // 显示订单历史组件
      return <OrderHistory />;
    }
    // 添加其他内容标识符的处理逻辑
  };

  return (
    <div className="userpage">
      <div className="sidebar">
        <Sidebar onSidebarClick={handleSidebarClick} />
      </div>
      <div className="maincontent">
        {renderContent()}
      </div>
    </div>
  );
};