import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/auth-context";
import Axios from "axios";
import { Sidebar } from "../../components/sidebar";
import "./user.css";

export const User = () => {
  const { userId } = useContext(AuthContext);
  const [userlist, setUserlist] = useState([]);

  useEffect(() => {
    showUser();
  }, [userId]);

  const showUser = async () => {
    try {
      const response = await Axios.get("http://localhost:3001/user", {
        params: { userId: userId },
      });
      setUserlist(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="userpage">
      <Sidebar />
      <div className="showuser">
        {userlist.map((user) => (
          <table className="user" key={user.id}>
            <h3>Username: {user.username}</h3>
            <h3>Nickname: {user.nickname}</h3>
            <h3>Phone: {user.phone}</h3>
            <h3>Address: {user.address}</h3>
          </table>
        ))}
      </div>
    </div>
  );
};