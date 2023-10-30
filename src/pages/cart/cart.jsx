import React, { useContext, useState } from "react";
import { ShopContext } from "../../context/shop-context";
import { AuthContext } from "../../context/auth-context";
import { PRODUCTS } from "../../products";
import { CartItem } from "./cart-item";
import { useNavigate } from "react-router-dom";
import "./cart.css";

export const Cart = () => {
  const { cartItems, getTotalCartAmount, checkout } = useContext(ShopContext);

  const authContext = useContext(AuthContext);
  const { isLoggedIn, userID, username, address, phone } = authContext;

  const totalAmount = getTotalCartAmount();
  const [deliveryMethod, setDeliveryMethod] = useState("delivery");
  const [orderNotes, setOrderNotes] = useState("");

  const navigate = useNavigate();

  const handleDeliveryMethod = (e) => {
    const selectedDeliveryMethod = e.target.value;
    setDeliveryMethod(selectedDeliveryMethod);
  };

  // 当用户点击结算时，将购物车信息传递给checkout函数
  const handleCheckout = () => {
    if (isLoggedIn) {
      checkout(orderNotes, deliveryMethod);
      navigate("/checkout");
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
          if (cartItems[product.id] !== 0) {
            return <CartItem data={product} />;
          }
          return null;
        })}
      </div>

      {totalAmount > 0 ? (
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
