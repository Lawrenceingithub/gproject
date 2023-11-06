import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { Sidebar } from "../../components/sidebar";
import { AuthContext } from "../../context/auth-context";

export const Orderhistory = () => {
  const { userID, username, address, phone } = useContext(AuthContext);
  const [orderHistory, setOrderHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // 初始设为 true

  const fetchOrderhistory = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/orderhistory?userID=${userID}`
      );
      setOrderHistory(response.data);
    } catch (error) {
      console.log("Error fetching order history:", error);
    } finally {
      setIsLoading(false); // 请求完成后，将 isLoading 设置为 false
    }
  };

  useEffect(() => {
    fetchOrderhistory();
  }, []);

  return (
    <>
      <Sidebar />
      {orderHistory.length === 0 ? (
        <>
          <h2>沒有訂單記錄</h2>
        </>
      ) : (
        <>
          <div className="maincontent">
            {orderHistory.map((order, index) => (
              <div className="orderhistorycontent" key={index}>
                <h2>訂單資料：</h2>
                <h4>订单号码: {order.orderNumber}</h4>
                <h4>用户名：{username}</h4>
                <h4>电话：{phone}</h4>
                <h4>
                  配送方式:{" "}
                  {order.deliveryMethod === "1"
                    ? `送货：${address}`
                    : order.deliveryMethod === "2"
                    ? "自取：地點1"
                    : "自取：地點2"}
                </h4>
                <h4>备注：{order.orderNotes}</h4>
                <h4>总计: ${order.totalAmount}</h4>
                <h4>产品詳情: {order.productDetails}</h4>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
};
