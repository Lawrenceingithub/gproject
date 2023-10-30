import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../../context/shop-context';
import { AuthContext } from '../../context/auth-context';
import './checkout.css';
import axios from 'axios';

export const Checkout = () => {
  const { username, address, phone } = useContext(AuthContext);
  const { cartItems } = useContext(ShopContext);
  const [orderNumber, setOrderNumber] = useState('');
  const [orderTotal, setOrderTotal] = useState(0);
  const [orderNotes, setOrderNotes] = useState(''); // 添加订单备注

  useEffect(() => {
    const checkout = async () => {
      try {
        // 将购物车商品信息传递到后端
        const orderData = {
          items: Object.keys(cartItems).map(itemId => ({
            itemId,
            name: cartItems[itemId].name,
            price: cartItems[itemId].price,
            quantity: cartItems[itemId].quantity,
          })),
          notes: orderNotes, // 添加订单备注
        };

        const response = await axios.post("http://localhost:3001/checkout", orderData, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.status === 200) {
          setOrderNumber(response.data.orderNumber);
          setOrderTotal(response.data.orderTotal);
        } else {
          console.error('Failed to generate order number');
        }
      } catch (error) {
        console.error('Error generating order number:', error);
      }
    };

    checkout();
  }, [cartItems, orderNotes]);

  return (
    <div className="checkoutcontent">
      <h1>订单详情：</h1>

      <p>订单号码: {orderNumber}</p>

      {/* 用户信息 */}
      {typeof username === 'string' && <p>用户名：{username}</p>}
      {typeof phone === 'string' && <p>电话：{phone}</p>}
      {typeof address === 'string' && <p>地址：{address}</p>}

      {/* 订单备注 */}
      <p>备注：{orderNotes}</p>
      
      {/* 总金额 */}
      <p>总计: ${orderTotal}</p>

      {/* 渲染每个商品 */}
      {Object.keys(cartItems).map(itemId => {
        const item = cartItems[itemId];
        return (
          <div key={itemId}>
            <p>{item.name}</p>
            <p>价格：${item.price}</p>
            <p>数量：{item.quantity}</p>
          </div>
        );
      })}
    </div>
  );
};
