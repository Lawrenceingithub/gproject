import { useState, useEffect, useContext } from "react";
import Axios from "axios";
import { AuthContext } from "../../context/auth-context";
import "./user.css";

export const User = () => {
  const authContext = useContext(AuthContext);
  const { userID, nickname, phone, address, userrole } = authContext; // 从 AuthContext 获取用户数据

  const [contentId, setContentId] = useState("showuser");
  const [editingUserId, setEditingUserId] = useState(userID);
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
  
        console.log("User data received:", response.data);
        console.log(authContext.userrole);
  
        if (Array.isArray(response.data) && response.data.length > 0) {
          // 使用数组的第一个元素作为用户数据
          setUserlist([response.data[0]]);
        } else {
          // 数据为空或不是数组
          console.log("Invalid user data received:", response.data);
        }
      } catch (error) {
        console.log("Error fetching user data:", error);
      }
    };
    fetchData();
  }, [userID]);

  const handleEdit = (userID) => {
    console.log(`Editing user with userID: ${userID}`);
  
    // 在 userlist 数组中找到当前用户的索引
    const userIndex = userlist.findIndex(user => user.userID === userID);
  
    if (userIndex !== -1) {
      const currentUser = userlist[userIndex];
  
      // 检查用户角色
      if (authContext.userrole === "admin" || authContext.userID === userID) {
        // 如果是管理员或当前用户，允许编辑
        setEditedNickname(currentUser.nickname);
        setEditedPhone(currentUser.phone);
        setEditedAddress(currentUser.address);
      } else {
        // 如果不是管理员且不是当前用户，不允许编辑
        alert("您没有权限编辑该用户的数据");
      }
    }
  };

  const handleSave = async (userID) => {
    const editedNicknameToSend = editedNickname !== undefined ? editedNickname : null;
    const editedPhoneToSend = editedPhone !== undefined ? editedPhone : null;
    const editedAddressToSend = editedAddress !== undefined ? editedAddress : null;
  
    console.log(userID);
    try {
      const response = await Axios.put("http://localhost:3001/user", {
        userID,
        nickname: editedNicknameToSend,
        phone: editedPhoneToSend,
        address: editedAddressToSend,
      });
  
      // 处理响应
      console.log(response.data);
      setEditingUserId(null); // 这里保持为 null，以停留在“显示用户”模式
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
                  <h3>Username: {authContext.username}</h3>
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
                    <button onClick={() => handleSave(userID)}>保存</button>
                    <button onClick={() => handleCancelEdit()}>取消</button>
                  </div>
                </>
              ) : (
                <>
                  <h3>Username: {authContext.username}</h3>
                  <h3>Nickname: {nickname}</h3>
                  <h3>Phone: {phone}</h3>
                  <h3>Address: {address}</h3>
                  <div className="user-buttons">
                    <button onClick={() => handleEdit(userID)}>修改</button>
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
