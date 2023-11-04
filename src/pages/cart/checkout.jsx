import React, { useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ShopContext } from '../../context/shop-context';
import { AuthContext } from '../../context/auth-context';
import './checkout.css';

export const Checkout = () => {
  const { username, address, phone } = useContext(AuthContext);
  const { deliveryMethod, orderNotes, cartItems } = useContext(ShopContext);
  const [ orderNumber, setOrderNumber] = useState(''); // 设置订单号码
  const [ orderTotal, setOrderTotal ] = useState(0); // 设置订单总金额

  const location = useLocation(); // 获取当前位置

  // 计算订单总金额
  useEffect(() => {
    if (location.state && location.state.orderNumber) {
      setOrderNumber(location.state.orderNumber);
    }
  }, [location.state]);

  return (
    <div className="checkoutcontent">
      <h1>订单详情：</h1>

      <p>订单号码: {orderNumber}</p>
      <p>用户名：{username}</p>
      <p>电话：{phone}</p>

      <p>配送方式: {deliveryMethod === '1' ? `送货：${address}` : deliveryMethod === '2' ? '自取：地點1' : '自取：地點2'}</p>

      {/* 订单备注 */}
      <p>备注：{orderNotes}</p>

      {/* 总金额 */}
      <p>总计: ${orderTotal}</p>

      {/* 渲染每个商品 */}
      {Object.keys(cartItems).map(itemId => {
        const item = cartItems[itemId];
        if (item.quantity > 0) {
          return (
            <div key={itemId}>
              <p>{item.name}</p>
              <p>价格：${item.price}</p>
              <p>数量：{item.quantity}</p>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};
