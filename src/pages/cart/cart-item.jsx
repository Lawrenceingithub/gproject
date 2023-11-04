import React, { useContext } from "react";
import { ShopContext } from "../../context/shop-context";

export const CartItem = () => {
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
          <button onClick={() => removeFromCart(products.productid)}> - </button>
          <input
            value={cartItems[products.productid]}
            onChange={(e) => updateCartItemCount(Number(e.target.value), products.productid)}
          />
          <button onClick={() => addToCart(products.productid)}> + </button>
        </div>
      </div>
    </div>
  );
};