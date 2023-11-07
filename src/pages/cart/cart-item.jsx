import React, { useContext } from "react";
import { ShopContext } from "../../context/shop-context";

export const CartItem = (prop) => {
  const { productid, productname, price, picture, detail} = prop.data;
  const { cartItems, handleAddToCart, handleRemoveFromCart, handleUpdateCartItemCount, products } =
    useContext(ShopContext);
    
  return (
    <div className="cartItem">
      <img src={`http://localhost:3001/assets/${picture}`} alt={products.picutre}/>
      <div className="description">
        <>
        <p>
          <b>名稱: {productname}</b><br/>
          <b>詳情: {detail}</b><br/><br/>
          <b>價值: ${price}</b>
        </p>

        </>
        <div className="countHandler">
          <button onClick={() => handleRemoveFromCart(productid)}> - </button>
          <input
            value={cartItems[productid]}
            onChange={(e) => handleUpdateCartItemCount(Number(e.target.value), productid)}
          />
          <button onClick={() => handleAddToCart(productid)}> + </button>
        </div>
      </div>
    </div>
  );
};