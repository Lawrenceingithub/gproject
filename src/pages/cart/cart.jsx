import React, { useContext, useState } from "react";
import { ShopContext } from "../../context/shop-context";
import { AuthContext } from "../../context/auth-context";
import { PRODUCTS } from "../../products";
import { CartItem } from "./cart-item";
import { useNavigate } from "react-router-dom";
import "./cart.css";

export const Cart = () => {
  const { cartItems, getTotalCartAmount, checkout } = useContext(ShopContext);
  const totalAmount = getTotalCartAmount();
  const [deliveryMethod, setDeliveryMethod] = useState("delivery");

  const handleDeliveryMethod = (event) => {
    setDeliveryMethod(event.target.value);
  };

  const navigate = useNavigate();

  const authContext = useContext(AuthContext);
  const { isLoggedIn, userID, username, address, phone } = authContext;

  console.log(userID, username, address, phone);

  const handleCheckout = () => {
    if (isLoggedIn) {
      checkout();
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
              <option value="delivery">送貨：{address}</option>
              <option value="pickup1">自取：地點1</option>
              <option value="pickup2">自取：地點2</option>
            </select>
            <h1>備注：</h1>
            <input></input>
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
