import React, { useContext } from "react";
import { ShopContext } from "../../context/shop-context";

export const CartItem = (props) => {
  const { cartItems, addToCart, removeFromCart, updateCartItemCount, products } =
    useContext(ShopContext);

  return (
    <div className="cartItem">
      <img src={products.picutre} alt={products.picutre}/>
      <div className="description">
        <>
        <p>
          <b>名稱: {products.productname}</b><br/>
          <b>詳情: {products.detail}</b>
        </p>
        </>
        <p> 價值: ${products.price}</p>
        <div className="countHandler">
          <button onClick={() => removeFromCart(products.productId)}> - </button>
          <input
            value={cartItems[products.productId]}
            onChange={(e) => updateCartItemCount(Number(e.target.value), products.productId)}
          />
          <button onClick={() => addToCart(products.productId)}> + </button>
        </div>
      </div>
    </div>
  );
};