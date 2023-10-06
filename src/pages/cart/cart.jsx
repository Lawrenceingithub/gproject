import React, { useContext } from "react";
import { ShopContext } from "../../context/shop-context";
import { AuthContext } from "../../context/auth-context";
import { PRODUCTS } from "../../products";
import { CartItem } from "./cart-item";
import { useNavigate } from "react-router-dom";
import "./cart.css";

export const Cart = () => {
  const { cartItems, getTotalCartAmount, checkout } = useContext(ShopContext);
  const totalAmount = getTotalCartAmount();

  const navigate = useNavigate();

  const authContext = useContext(AuthContext);
  const { isLoggedIn } = authContext;

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
          <p> 總計: ${totalAmount} </p>
          <button onClick={() => navigate("/")}> 繼續購物 </button>
          <button onClick={handleCheckout}> 結算 </button>
        </div>
      ) : (
        <h1>你的購物車沒有任何物品</h1>
      )}
    </div>
  );
};