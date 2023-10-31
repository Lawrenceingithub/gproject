import React from "react";
import { useNavigate } from "react-router-dom";
import './sidebar.css';

export const Sidebar = () => {
const navigate = useNavigate();

  return (
    <>
    <div className="sidebar">
      <button onClick={()=>{navigate("/user")}}>
          用戶資料
      </button>
      <button onClick={()=>{navigate("/orderhistory")}}>
          訂單記錄
      </button>
      <button onClick={()=>{navigate("/faq")}}>
          常見問題
      </button>
      <button onClick={()=>{navigate("/upload")}}>
          產品上傳
      </button>
    </div>
  </>
  );
};
