import React, { useContext } from 'react';
import { ShopContext } from '../../context/shop-context';
import './checkout.css';

export const Checkout = () => {

  const { cartItems, getTotalCartAmount, checkout } = useContext(ShopContext);

  const handleCheckout = () => {
    // 結算邏輯
    checkout(); 
  }

  return (
    <div>
      <h1>Checkout Page</h1>
      
      {/* 總金額 */}
      <p>Total: ${getTotalCartAmount()}</p>  

      {/* 渲染每個商品 */}
      {Object.keys(cartItems).map(itemId => {
        return (
          <div key={itemId}>
            {/* 商品名稱等 */}
          </div>
        )  
      })}
      
    </div>
  )
}