import React, { useEffect, useContext, useState } from "react";
import Axios from "axios";
import { AuthContext } from "../../context/auth-context";
import "./user.css";

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
    isLoading,
  } = authContext;

  const [editingUserId, setEditingUserId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isUser, setIsUser] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userlist, setUserlist] = useState([]);

  useEffect(() => {
    console.log("isAdmin:", isAdmin);
    console.log("isUser:", isUser);
  }, [isAdmin, isUser]);

  useEffect(() => {
    const fetchData = async () => {
      const storedIsLoggedIn = localStorage.getItem("isLoggedIn");

      if (storedIsLoggedIn === "true") {
        setIsLoggedIn(true);
      }

      const storedUserRole = localStorage.getItem("userrole");
      if (storedUserRole === "1") {
        setIsAdmin(true);
      } else if (storedUserRole === "0") {
        setIsUser(true);
      }

      if (isAdmin) {
        try {
          const response = await Axios.get("http://localhost:3001/user");

          if (response.data.length > 0) {
            setUserlist(response.data);
            console.log(response.data);
          } else if (isUser) {
            const response = await Axios.get("http://localhost:3001/user", {
              params: { userID: userID },
            });

            if (response.data.length > 0) {
              setUserlist(response.data);
              console.log(response.data);
            }
          }
        } catch (error) {
          console.log("Error fetching user data:", error);
        }
      }
    };
    fetchData();
  }, [userID, setIsLoggedIn, setIsAdmin, setIsUser, setUserlist]);

  const handleEdit = (userId) => {
    console.log(`Editing user with userID: ${userId}`);

    if (isAdmin || userId === userID) {
      // 如果是管理员或当前用户，允许编辑
      const currentUser = userlist.find((user) => user.userID === userId);
      if (currentUser) {
        setNickname(currentUser.nickname);
        setPhone(currentUser.phone);
        setAddress(currentUser.address);
        setEditingUserId(userId);
      }
    } else {
      // 如果不是管理员且不是当前用户，不允许编辑
      alert("您没有权限编辑该用户的数据");
    }
  };

  const handleSave = async (userId) => {
    const editedNicknameToSend = nickname || null;
    const editedPhoneToSend = phone || null;
    const editedAddressToSend = address || null;
    try {
      const response = await Axios.put("http://localhost:3001/user", {
        userID: userId,
        nickname: editedNicknameToSend,
        phone: editedPhoneToSend,
        address: editedAddressToSend,
      });

      const updatedUserList = userlist.map((user) => {
        if (user.userID === userId) {
          return {
            ...user,
            nickname: editedNicknameToSend,
            phone: editedPhoneToSend,
            address: editedAddressToSend,
          };
        }
        return user;
      });
      setUserlist(updatedUserList);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
  };

  const handleDelete = async (id) => {
    try {
      await Axios.delete(`http://localhost:3001/user/${id}`);

      const updatedUserList = userlist.filter((user) => user.userID !== id);
      setUserlist(updatedUserList);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSidebarClick = (id) => {
    setContentId(id);
  };

  const renderContent = () => {
    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (contentId === "showuser") {
      // 渲染用户资料
      if (isAdmin) {
        return (
          <div className="showuser">
            {userlist.map((user) => (
              <div className="user" key={userID}>
                <h3>Username: {user.username}</h3>
                <h3>Nickname: {user.nickname}</h3>
                <h3>Phone: {user.phone}</h3>
                <h3>Address: {user.address}</h3>
                <div className="user-buttons">
                  <button onClick={() => handleEdit(user.userID)}>修改</button>
                  <button onClick={() => handleDelete(user.userID)}>
                    刪除
                  </button>
                </div>
              </div>
            ))}
          </div>
        );
      } else if (isUser) {
        return (
          <div className="showuser">
            {userlist.map((user) => (
              <div className="user" key={userID}>
                <h3>Username: {user.username}</h3>
                <h3>Nickname: {user.nickname}</h3>
                <h3>Phone: {user.phone}</h3>
                <h3>Address: {user.address}</h3>
                <div className="user-buttons">
                  <button onClick={() => handleEdit(user.userID)}>修改</button>
                  <button onClick={() => handleDelete(user.userID)}>
                    刪除
                  </button>
                </div>
              </div>
            ))}
          </div>
        );
      }
    } else if (contentId === "orderhistory") {
      return (
        <div className="orderhistorypage">
          <h1>订单记录</h1>
        </div>
      );
    } else if (contentId === "faq") {
      return (
        <div className="faqpage">
          <h1>常见问题</h1>
        </div>
      );
    }

    return null;
  };

  const [contentId, setContentId] = useState("showuser");

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
