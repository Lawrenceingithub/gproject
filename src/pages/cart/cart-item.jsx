import React, { useContext } from "react";
import { ShopContext } from "../../context/shop-context";

export const CartItem = (props) => {
  const { productId, productname, price, picutre, detail } = props.data;
  const { cartItems, addToCart, removeFromCart, updateCartItemCount, products } =
    useContext(ShopContext);

  return (
    <div className="cartItem">
      <img src={picutre} alt={picutre}/>
      <div className="description">
        <>
        <p>
          <b>名稱: {productname}</b><br/>
          <b>詳情: {detail}</b>
        </p>
        </>
        <p> 價值: ${price}</p>
        <div className="countHandler">
          <button onClick={() => removeFromCart(productId)}> - </button>
          <input
            value={cartItems[productId]}
            onChange={(e) => updateCartItemCount(Number(e.target.value), productId)}
          />
          <button onClick={() => addToCart(productId)}> + </button>
        </div>
      </div>
    </div>
  );
};