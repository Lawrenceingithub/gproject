import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./sidebar.css";

export const Sidebar = () => {
  const navigate = useNavigate();

  const headtoFAQ = () => {
    navigate("/user/faq");
  };

  const headtoOrderhistory = () => {
    navigate("/user/orderhistory");
  };

  return (
    <div className="sidebar">
        <div className="links">
          <Link to="/user/orderhistory" onClick={headtoOrderhistory}>
            订单历史
          </Link>
          <Link to="/user/faq" onClick={headtoFAQ}>
            FAQ
          </Link>
        </div>
    </div>
  );
};
