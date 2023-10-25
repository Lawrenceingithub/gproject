import { useState, useEffect, useContext } from "react";
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
    isAdmin,
    isUser,
  } = authContext;

  const [contentId, setContentId] = useState("showuser");
  const [editingUserId, setEditingUserId] = useState(userID);
  const [userlist, setUserlist] = useState([]);
  const [editedNickname, setEditedNickname] = useState("");
  const [editedPhone, setEditedPhone] = useState("");
  const [editedAddress, setEditedAddress] = useState("");
  const [isLoading, setIsLoading] = useState(true); // 新增加载状态

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 模拟延迟加载
        setTimeout(async () => {
          const response = await Axios.get("http://localhost:3001/user", {
            params: { userID: userID },
          });
          if (Array.isArray(response.data) && response.data.length > 0) {
            setUserlist(response.data);
          } else {
            console.log("Invalid user data received:", response.data);
          }
          setIsLoading(false); // 数据加载完成后设置加载状态为 false
        }, 100); // 延迟时间为 0.1 秒
      } catch (error) {
        console.log("Error fetching user data:", error);
        setIsLoading(false); // 发生错误时设置加载状态为 false
      }
    };
    fetchData();
  }, [userID]);

  const handleEdit = (userId) => {
    console.log(`Editing user with userID: ${userId}`);

    if (isAdmin || userId === userID) {
      // 如果是管理员或当前用户，允许编辑
      const currentUser = userlist.find((user) => user.userID === userId);
      if (currentUser) {
        setEditedNickname(currentUser.nickname);
        setEditedPhone(currentUser.phone);
        setEditedAddress(currentUser.address);
        setEditingUserId(userId);
      }
    } else {
      // 如果不是管理员且不是当前用户，不允许编辑
      alert("您没有权限编辑该用户的数据");
    }
  };

  const handleSave = async (userId) => {
    const editedNicknameToSend = editedNickname || null;
    const editedPhoneToSend = editedPhone || null;
    const editedAddressToSend = editedAddress || null;
    try {
      const response = await Axios.put("http://localhost:3001/user", {
        userID: userId,
        nickname: editedNicknameToSend,
        phone: editedPhoneToSend,
        address: editedAddressToSend,
      });

      // 更新 AuthContext 中的数据
      setNickname(editedNicknameToSend);
      setPhone(editedPhoneToSend);
      setAddress(editedAddressToSend);
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
    if (userlist.length === 0) {
      return <div>Loading...</div>;
    }

    if (isAdmin) {
      // 管理员角色显示所有用户数据
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
                <button onClick={() => handleDelete(user.userID)}>刪除</button>
              </div>
            </div>
          ))}
        </div>
      );
    } else if (isUser) {
      const currentUser = userlist.find((user) => user.userID === userID);
      if (currentUser) {
        console.log(currentUser.username)
        return (
          <div className="showuser">
            <div className="user" key={userID}>
              <h3>Username: {currentUser.username}</h3>
              <h3>Nickname: {currentUser.nickname}</h3>
              <h3>Phone: {currentUser.phone}</h3>
              <h3>Address: {currentUser.address}</h3>
              <div className="user-buttons">
                <button onClick={() => handleEdit(currentUser.userID)}>
                  修改
                </button>
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
