import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ActiveContentContext } from './user';

export const OrderHistory = () => {
  const activeContent = useContext(ActiveContentContext);
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/user");
  };

  return (
    <div>
      <h1>Order</h1>
      <p>当前的活动内容：{activeContent}</p>
      <button onClick={handleGoBack}>返回</button>
    </div>
  );
};