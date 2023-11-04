import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../../context/shop-context";
import { CartItem } from "./cart-item";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import "./cart.css";

import { getDefaultCart } from "../../context/shop-context";
import { AuthContext } from "../../context/auth-context";

export const Cart = () => {
  const authContext = useContext(AuthContext);
  const { isLoggedIn, userID, username, address, orderTotal } = authContext;
  const navigate = useNavigate();

  const shopContext = useContext(ShopContext);
  const {
    orderNotes,
    deliveryMethod,
    getTotalCartAmount,
    setOrderNotes,
    setDeliveryMethod,
    products,
  } = shopContext;

  const totalAmount = getTotalCartAmount();

  const [cartItems, setCartItems] = useState(() => {
    const storedCart = localStorage.getItem("cartItems");
    return storedCart ? JSON.parse(storedCart) : getDefaultCart();
  });

  useEffect(() => {
    // 当 cartItems 发生变化时，保存到 localStorage
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const handleDeliveryMethod = (e) => {
    const selectedDeliveryMethod = e.target.value;
    setDeliveryMethod(selectedDeliveryMethod); // 使用 setDeliveryMethod 函数来更新值
  };

  // 过滤购物车中有数量的产品
  const cartProducts = products.filter(
    (product) => cartItems[product.productid] > 0
  );

  // 当用户点击结算时，将购物车信息传递给checkout函数
  const handleCheckout = async () => {
    if (isLoggedIn) {
      try {
        const cartItemsWithDetails = []; // 存储购物车商品的详细信息
  
        // 遍历购物车中的商品，获取商品详细信息并添加到 cartItemsWithDetails 数组
        for (const itemID in cartItems) {
          const item = cartItems[itemID];
          if (item.quantity > 0) {
            const product = products.find((product) => product.productid === Number(itemID));
            if (product) {
              cartItemsWithDetails.push({
                productid: itemID,
                price: product.price,
                quantity: item.quantity,
              });
            }
          }
        }
  
        const orderData = {
          userID: userID,
          username: username,
          cartItems: cartItemsWithDetails, // 包括购物车商品的详细信息
          orderNotes: orderNotes,
          deliveryMethod: deliveryMethod,
        };
  
        // 发送包括商品详细信息的订单数据到服务器端
        const response = await Axios.post("http://localhost:3001/checkout", orderData, {
          headers: {
            "Content-Type": "application/json",
          },
        });
  
        if (response.status === 200) {
          // 处理订单生成成功的情况
          const responseData = response.data;
          const orderNumber = responseData.orderID;
          setOrderNotes(""); // 清空 orderNotes
          navigate("/checkout", { state: { orderNumber, orderNotes, orderTotal } });
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
        {cartProducts.map((product) => {
          if (cartItems[product.productid] === 0) {
            return null; // 如果产品的数量为0，则不渲染
          }
          return <CartItem key={product.productid} data={product} />;
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
