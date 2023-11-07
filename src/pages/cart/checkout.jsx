import React, { useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ShopContext } from "../../context/shop-context";
import { AuthContext } from "../../context/auth-context";
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
    settotalAmount,
    setProductDetails,
  } = useContext(ShopContext);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state && location.state.orderNumber) {
      setOrderNumber(location.state.orderNumber);
      setOrderNotes(location.state.orderNotes);
      settotalAmount(location.state.totalAmount);
      setProductDetails(location.state.productDetails); // 提取并分配 productDetails
    }
  }, [
    location.state,
    setOrderNotes,
    setOrderNumber,
    settotalAmount,
    setProductDetails,
  ]);

  return (
    <>
      <div className="checkoutcontent">
        <div className="checkoutcontentdetail" style={{ marginLeft: '550px' }}>
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
              : "自取：地點2"}
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
    </>
  );
};
