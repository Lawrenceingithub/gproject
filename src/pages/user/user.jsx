import { useState, useEffect, useContext } from "react";
import Axios from "axios";
import { AuthContext } from "../../context/auth-context";
import "./user.css";

export const User = () => {
  const { userID, nickname, phone, address } = useContext(AuthContext);
  const [contentId, setContentId] = useState("showuser");
  const [editingUserId, setEditingUserId] = useState(null);
  const [userlist, setUserlist] = useState([]);
  const [editedNickname, setEditedNickname] = useState("");
  const [editedPhone, setEditedPhone] = useState("");
  const [editedAddress, setEditedAddress] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Axios.get("http://localhost:3001/user", {
          params: { userID: userID },
        });
        console.log(response.data);
        setUserlist([response.data]);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [userID]);

  const handleEdit = (userID) => {
    setEditingUserId(userID);
    const currentUser = userlist.find((user) => user.userID === userID);
    setEditedNickname(currentUser.nickname);
    setEditedPhone(currentUser.phone);
    setEditedAddress(currentUser.address);
  };

  const handleSave = async (userID) => {
    if (
      editedNickname === undefined ||
      editedPhone === undefined ||
      editedAddress === undefined
    ) {
      console.error("Invalid user data");
      return;
    }

    try {
      const response = await Axios.put(`http://localhost:3001/user`, {
        userID: userID,
        nickname: editedNickname || "", // 给 nickname 设置默认值
        phone: editedPhone || "", // 给 phone 设置默认值
        address: editedAddress || "", // 给 address 设置默认值
      });
      console.log(response.data);
      setEditingUserId(null);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
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
            <div className="user" key={user.userID}>
              {editingUserId === user.userID ? (
                <>
                  <h3>Username: {user.username}</h3>
                  <h3>
                    Nickname:{" "}
                    <input
                      value={editedNickname}
                      onChange={(e) => setEditedNickname(e.target.value)}
                    />
                  </h3>
                  <h3>
                    Phone:{" "}
                    <input
                      value={editedPhone}
                      onChange={(e) => setEditedPhone(e.target.value)}
                    />
                  </h3>
                  <h3>
                    Address:{" "}
                    <input
                      value={editedAddress}
                      onChange={(e) => setEditedAddress(e.target.value)}
                    />
                  </h3>
                  <div className="user-buttons">
                    <button onClick={() => handleSave(user.userID)}>
                      保存
                    </button>
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
                    <button onClick={() => handleEdit(user.userID)}>
                      修改
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      );
    } else {
      return <div>No user data available</div>;
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
