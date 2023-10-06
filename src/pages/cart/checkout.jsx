import React, { useContext } from 'react';
import { ShopContext } from '../../context/shop-context';
import { AuthContext} from '../../context/auth-context';
import './checkout.css';

export const Checkout = () => {
  const { username, address, phone } = useContext(AuthContext);
  const { cartItems, getTotalCartAmount } = useContext(ShopContext);

  return (
    <div className='checkoutcontent'>
      <h1>订单详情：</h1>

      {/* 用户信息 */}
      <p>用户名：{username}</p>
      <p>电话：{phone}</p>
      <p>地址：{address}</p>

      {/* 总金额 */}
      <p>Total: ${getTotalCartAmount()}</p>

      {/* 渲染每个商品 */}
      {Object.keys(cartItems).map(itemId => {
        const item = cartItems[itemId];
        return (
          <div key={itemId}>
            {/* 商品名称、价格、数量等 */}
            <p>{item.name}</p>
            <p>价格：${item.price}</p>
            <p>数量：{item.quantity}</p>
          </div>
        );
      })}
      
    </div>
  );
};