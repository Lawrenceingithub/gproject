import React, { useContext } from "react";
import { ShopContext } from "../../context/shop-context";
import { PRODUCTS } from "../../products";
import { CartItem } from "./cart-item";
import { useNavigate } from "react-router-dom";
import "./cart.css";

export const Cart = () => {
  const { cartItems, getTotalCartAmount, checkout } = useContext(ShopContext);
  const totalAmount = getTotalCartAmount();

  const navigate = useNavigate();

  return (
    <div className="cart">
      <div>
        <h1>你的購物車</h1>
      </div>
      <div className="cart">
        {PRODUCTS.map((product) => {  //這是第20行
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
          <button
            onClick={() => {
              checkout();
              navigate("/checkout");
            }}
          >
            {" "}
            結算{" "}
          </button>
        </div>
      ) : (
        <h1>你的購物車沒有任何物品</h1>
      )}
    </div>
  );
};