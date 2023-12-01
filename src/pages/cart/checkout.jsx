import React, { useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ShopContext } from "../../context/shop-context";
import { AuthContext } from "../../context/auth-context";
import { Sidebar } from "../../components/sidebar";
import "./checkout.css";

export const Checkout = () => {
  const { username, address, phone } = useContext(AuthContext);
  const {
    deliveryMethod,
    orderNotes,
    totalAmount,
    orderNumber,
    productDetails,
    setOrderNotes,
    setOrderNumber,
    setTotalAmount,
    setProductDetails
  } = useContext(ShopContext);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state && location.state.orderNumber) {
      setOrderNumber(location.state.orderNumber);
      setOrderNotes(location.state.orderNotes);
      setTotalAmount(location.state.totalAmount);
      setProductDetails(location.state.productDetails);
    }
  }, [location.state, setOrderNotes, setOrderNumber, setTotalAmount, setProductDetails]);
  

  return (
    <div className="maincontent1">
      <Sidebar />
    <div className="maincontent2">
      <h1>订单详情：</h1>
  
      <p>订单号码: {orderNumber}</p>
      <p>用户名：{username}</p>
      <p>电话：{phone}</p>
  
      <p>
        配送方式:{" "}
        {deliveryMethod === "1"
          ? `送货：${address}`
          : deliveryMethod === "2"
          ? "自取：地點1"
          : deliveryMethod === "3"
          ? "自取：地點2"
          : ""}
      </p>
  
      {/* 订单备注 */}
      <p>备注：{orderNotes}</p>
  
      {/* 总金额 */}
      <p>总计: ${totalAmount}</p>
  
      {/* 添加产品信息 */}
      <p>产品詳情: {productDetails}</p>
  
      <button
        onClick={() => {
          navigate("/");
          setOrderNotes("");
        }}
      >
        返回首頁
      </button>
    </div>
    </div>
    );
};
