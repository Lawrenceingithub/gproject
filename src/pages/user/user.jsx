import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/auth-context";
import Axios from "axios";
import { Sidebar } from "../../components/sidebar";
import "./user.css";

export const User = () => {
  const { username, logout, userId } = useContext(AuthContext);
  const [userlist, setUserlist] = useState([]);

  
  const showuser = async () => {
    try {
      const response = await Axios.get(`http://localhost:3001/user`, {
        params: { userId: userId },
      });
      setUserlist(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="userpage">
      <Sidebar/>
      <div className="showuser">
        <button onClick={showuser}>showuser</button>

        {userlist.map((val, key) => {
          return (
            <div className="user" key={val.id}>
                <h3>Username: {val.username}</h3>
                <h3>Nickname: {val.nickname}</h3>
                <h3>Phone: {val.phone}</h3>
                <h3>Adress: {val.address}</h3>
            </div>
          );
        })}
      </div>
    </div>
  );
};
