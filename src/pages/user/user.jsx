import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/auth-context";
import Axios from "axios";
import "./user.css";

export const User = () => {
  const { username, logout, userId } = useContext(AuthContext);
  const navigate = useNavigate();
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


  const headtoFAQ = () => {
    navigate("/user/faq");
  };

  const headtoOrderhistory = () => {
    navigate("/user/orderhistory");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="userpage">
      <div className="sidebar">
        <ul>
          <li>
            <Link to="/user/orderhistory" onClick={headtoOrderhistory}>
              订单历史
            </Link>
          </li>
          <li>
            <Link to="/user/faq" onClick={headtoFAQ}>
              FAQ
            </Link>
          </li>
        </ul>
      </div>

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
