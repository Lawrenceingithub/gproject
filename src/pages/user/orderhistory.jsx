import React from "react";
import { useNavigate } from "react-router-dom";
import './user.css';

export const OrderHistory = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/user");
  };

  return (
    <div className="orderhistory">
      <h1>訂單歷史：</h1>
      <button onClick={handleGoBack}>返回</button>
    </div>
  );
};