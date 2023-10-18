import { useState, useEffect, useContext } from "react";
import Axios from "axios";
import { AuthContext } from "../../context/auth-context";
import "./user.css";

export const User = () => {
  const { username, nickname, phone, address } = useContext(AuthContext);
  const [contentId, setContentId] = useState("orderhistory");
  const [editingUserId, setEditingUserId] = useState(null);
  const [userlist, setUserlist] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Axios.get("http://localhost:3001/user", {
          params: { username: username },
        });
        setUserlist(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [username]);

  const handleEdit = (userId) => {
    setEditingUserId(userId);
  };

  const handleSave = async (userId) => {
    try {
      const response = await Axios.post(
        `http://localhost:3001/user`, // 根据您的API端点进行修改
        {
          nickname: nickname,
          phone: phone,
          address: address,
        }
      );
      console.log(response.data);
      setEditingUserId(null); // 保存成功后重置编辑状态
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancelEdit = () => {
    setEditingUserId(null); // 重置编辑状态
  };

  const handleDelete = (id) => {
    // 处理删除逻辑
  };

  const handleSidebarClick = (id) => {
    setContentId(id);
  };

  const renderContent = () => {
    if (contentId === "showuser") {
      return (
        <div className="showuser">
          {userlist.map((user) => (
            <div className="user" key={user.id}>
              {editingUserId === user.id ? (
                <>
                  <h3>
                    Username: {user.username}
                  </h3> 
                  <h3>
                    Nickname: <input defaultValue={user.nickname} />
                  </h3>
                  <h3>
                    Phone: <input defaultValue={user.phone} />
                  </h3>
                  <h3>
                    Address: <input defaultValue={user.address} />
                  </h3>
                  <div className="user-buttons">
                    <button onClick={() => handleSave(user.id)}>保存</button>
                    <button onClick={() => handleCancelEdit()}>取消</button>
                  </div>
                </>
              ) : (
                <>
                  <h3>Username: {user.username}</h3>
                  <h3>Nickname: {user.nickname}</h3>
                  <h3>Phone: {user.phone}</h3>
                  <h3>Address: {user.address}</h3>
                  <div className="user-buttons">
                    <button onClick={() => handleEdit(user.id)}>修改</button>
                    <button onClick={() => handleDelete(user.id)}>
                      刪除帳號
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <div className="userpage">
      <div className="sidebar">
        <button onClick={() => handleSidebarClick("showuser")}>
          <h1>用戶資料</h1>
        </button>
        <button onClick={() => handleSidebarClick("orderhistory")}>
          <h1>訂單記錄</h1>
        </button>
        <button onClick={() => handleSidebarClick("faq")}>
          <h1>常見問題</h1>
        </button>
      </div>
      <div className="maincontent">{renderContent()}</div>
    </div>
  );
};
