import React, { useContext, useEffect } from "react";
import { ShopContext } from "../../context/shop-context";
import { CartItem } from "./cart-item";
import { useLocation, useNavigate } from "react-router-dom";
import Axios from "axios";
import { AuthContext } from "../../context/auth-context";
import "./cart.css";

export const Cart = () => {
  const authContext = useContext(AuthContext);
  const { isLoggedIn, userID, username, address } = authContext;

  const navigate = useNavigate();
  const location = useLocation();

  const shopContext = useContext(ShopContext);
  const {
    orderNumber,
    orderNotes,
    deliveryMethod,
    products,
    totalAmount, 
    setOrderNotes,
    setDeliveryMethod,
    settotalAmount,
    setOrderNumber,
    cartItems,
  } = shopContext;

  useEffect(() => {
    if (location.state && location.state.orderNumber) {
      setOrderNumber(location.state.orderNumber);
      setOrderNotes(location.state.orderNotes);
      settotalAmount(location.state.totalAmount);
    }
  }, [location.state, setOrderNotes, setOrderNumber, settotalAmount]);

  const handleDeliveryMethod = (e) => {
    const selectedDeliveryMethod = e.target.value;
    setDeliveryMethod(selectedDeliveryMethod);
  };

  const cartProducts = products.filter(
    (product) => cartItems[product.productid] > 0
  );

  const handleCheckout = async () => {
    if (isLoggedIn) {
      try {
        const cartItemsWithDetails = [];
        for (const itemID in cartItems) {
          const item = cartItems[itemID];
          console.log(item)
          if (item.quantity > 0) {
            console.log(item.quantity)
            const product = products.find(
              (product) => product.productid === Number(itemID)
            );
            if (product) {
              console.log("product存在?", product)
              cartItemsWithDetails.push({
                productid: itemID,
                price: product.price,
                quantity: item.quantity,
              });
            }
          }
        }

        const orderData = {
          orderNumber: orderNumber,
          userID: userID,
          username: username,
          cartItems: cartItemsWithDetails,
          orderNotes: orderNotes,
          deliveryMethod: deliveryMethod,
          totalAmount: totalAmount
        };

        console.log("orderData的值", orderData)

        const response = await Axios.post(
          "http://localhost:3001/checkout",
          orderData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          const responseData = response.data;
          const orderNumber = responseData.orderNumber;
          const orderNotes = responseData.orderNotes;
          const totalAmount = responseData.totalAmount;

          setTimeout(() => {
            alert("成功下單");
            navigate("/checkout", {
              state: { orderNumber, orderNotes, totalAmount },
            });
          }, 500);
        } else {
          console.error("Failed to submit the order");
        }
      } catch (error) {
        console.error("Error during checkout:", error);
      }
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="cart">
      <div>
        <h1>你的購物車</h1>
      </div>
      <div className="cartdetail">
        {cartProducts.map((product) => {
          if (cartItems[product.productid] === 0) {
            return null;
          }
          return <CartItem key={product.productid} data={product} />;
        })}
      </div>

      {totalAmount !== 0 ? (
        <div className="checkout">
          <div>
            <h1>配送方式：</h1>
            <select onChange={handleDeliveryMethod}>
              <option value="1">送貨：{address}</option>
              <option value="2">自取：地點1</option>
              <option value="3">自取：地點2</option>
            </select>
            <h1>備注：</h1>
            <input
              type="text"
              value={orderNotes}
              onChange={(e) => setOrderNotes(e.target.value)}
            />
          </div>

          <b>
            <p> 總計: ${totalAmount} </p>
          </b>
          <button onClick={() => navigate("/")}> 繼續購物 </button>
          <button onClick={handleCheckout}> 結算 </button>
        </div>
      ) : (
        <h1>你的購物車沒有任何物品</h1>
      )}
    </div>
  );
};
