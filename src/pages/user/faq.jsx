import React from "react";
import { useNavigate } from "react-router-dom";
import './user.css';

export const FAQ = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/user");
  };

  return (
    <div className="FAQcontent">
      <h1>FAQ</h1>
      <p>当前的活动内容：</p>
      <button onClick={handleGoBack}>返回</button>
    </div>
  );
};