import React, {useContext} from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth-context";
import './sidebar.css';

export const Sidebar = () => {
const navigate = useNavigate();
const authContext = useContext(AuthContext);
const { userrole } = authContext;

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
    {userrole==="1"&&(
            <button onClick={()=>{navigate("/productupload")}}>
            產品上傳
        </button>)
    }
    </div>
  </>
  );
};
