import React from "react";
import { Link } from "react-router-dom";
import "./sidebar.css";

export const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebarLink">
        <Link to="/orderhistory">订单历史</Link>
        <Link to="/faq">FAQ</Link>
      </div>
    </div>
  );
};