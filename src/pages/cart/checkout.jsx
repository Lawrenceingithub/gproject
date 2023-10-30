import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../../context/shop-context';
import { AuthContext } from '../../context/auth-context';
import './checkout.css';

export const Checkout = () => {
  const { username, address, phone } = useContext(AuthContext);
  const { deliveryMethod, orderNotes, cartItems } = useContext(ShopContext);
  const [orderNumber, setOrderNumber] = useState('');
  const [orderTotal, setOrderTotal] = useState(0);

  useEffect(() => {
    // 在这里执行你的提交订单的逻辑，然后更新订单号和总金额

    // 模拟异步提交订单，设置一个延迟
    const simulateOrderSubmission = () => {
      // 在这里执行提交订单的逻辑，模拟异步操作
      const orderData = {
        username,
        address,
        phone,
        deliveryMethod,
        orderNotes,
        cartItems,
      };

      // 模拟服务器响应
      setTimeout(() => {
        const response = {
          orderNumber: '123456',
          orderTotal: 100, // 假设这里是订单的总金额
        };
        setOrderNumber(response.orderNumber);
        setOrderTotal(response.orderTotal);
      }, 2000); // 模拟2秒后服务器响应
    };

    simulateOrderSubmission();
  }, [username, address, phone, deliveryMethod, orderNotes, cartItems]);

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