import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../../context/shop-context";
import { PRODUCTS } from "../../products";
import { CartItem } from "./cart-item";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import "./cart.css";


import { getDefaultCart } from "../../context/shop-context";
import { AuthContext } from "../../context/auth-context";

export const Cart = () => {
  const authContext = useContext(AuthContext);
  const { isLoggedIn, userID, username, address, phone } = authContext;
  const navigate = useNavigate();

  const shopContext = useContext(ShopContext); // 获取 ShopContext

  const { orderNotes, deliveryMethod, getTotalCartAmount, checkout, setOrderNotes, setDeliveryMethod } = shopContext;

  const totalAmount = getTotalCartAmount();

  const [cartItems, setCartItems] = useState(() => {
    const storedCart = localStorage.getItem("cartItems");
    return storedCart ? JSON.parse(storedCart) : getDefaultCart();
  });

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const handleDeliveryMethod = (e) => {
    const selectedDeliveryMethod = e.target.value;
    setDeliveryMethod(selectedDeliveryMethod); // 使用 setDeliveryMethod 函数来更新值
  };

  // 当用户点击结算时，将购物车信息传递给checkout函数
  const handleCheckout = async () => {
    if (isLoggedIn) {
      try {
        const orderData = {
          userID: userID,
          username: username,
          cartItems: cartItems,
          orderNotes: orderNotes,
          deliveryMethod: deliveryMethod,
        };
  
        const response = await Axios.post("http://localhost:3001/checkout", orderData, {
          headers: {
            "Content-Type": "application/json",
          },
        });
  
        if (response.status === 200) {
          const responseData = response.data;
          const orderNumber = responseData.orderID;
  
          setOrderNotes(""); // 清空 orderNotes
          navigate("/checkout", { state: { orderNumber } }); // 传递订单号到checkout页面
        } else {
          console.error("Failed to submit the order");
        }
      } catch (error) {
        console.error("Error during checkout:", error);
        // 处理错误，如果有必要
      }
    } else {
      navigate("/login");
    }
  };
  

  return (
    <div className="cart">
      <div>
        <h1>你的購物車</h1>
      </div>
      <div className="cartdetail">
        {PRODUCTS.map((product) => {
          if (cartItems[product.id] === 0) {
            return null;
          }
          return <CartItem data={product} />;
        })}
      </div>

      {totalAmount !== 0 ? (
        <div className="checkout">
          <div>
            <h1>配送方式：</h1>
            <select onChange={handleDeliveryMethod}>
              <option value="1">送貨：{address}</option>
              <option value="2">自取：地點1</option>
              <option value="3">自取：地點2</option>
            </select>
            <h1>備注：</h1>
            <input
              type="text"
              value={orderNotes}
              onChange={(e) => setOrderNotes(e.target.value)}
            />
          </div>

          <b>
            <p> 總計: ${totalAmount} </p>
          </b>
          <button onClick={() => navigate("/")}> 繼續購物 </button>
          <button onClick={handleCheckout}> 結算 </button>
        </div>
      ) : (
        <h1>你的購物車沒有任何物品</h1>
      )}
    </div>
  );
};
