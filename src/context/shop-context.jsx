import { createContext, useState, useEffect } from "react";
import { Productlist } from "../pages/shop/productlist";

export const ShopContext = createContext();

export const getDefaultCart = () => {
  let cart = {};
  for (let i = 1; i < Productlist.length + 1; i++) {
    cart[i] = 0;
  }
  return cart;
};

export const ShopContextProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(getDefaultCart());
  const [deliveryMethod, setDeliveryMethod] = useState("1");
  const [orderNotes, setOrderNotes] = useState(""); // 修正初始化
  const [products, setProducts] = useState([]);

  const addToCart = (productid) => {
    setCartItems((prev) => ({ ...prev, [productid]: prev[productid] + 1 }));
  };

  const removeFromCart = (productid) => {
    setCartItems((prev) => ({ ...prev, [productid]: prev[productid] - 1 }));
  };

  const updateCartItemCount = (newAmount, productid) => {
    if (newAmount < 0) {
      // 防止负数输入
      return;
    }
    setCartItems((prev) => ({ ...prev, [productid]: newAmount }));
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = products.find((product) => product.productid === Number(item));
        totalAmount += cartItems[item] * itemInfo.price;
      }
    }
    return totalAmount;
  };

  const checkout = () => {
    setCartItems(getDefaultCart());
    
  };

  useEffect(() => {
    // 在组件加载时，从LocalStorage加载购物车数据
    const storedCart = localStorage.getItem("cartItems");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    } else {
      // 如果 localStorage 中没有购物车数据，设置一个默认的空购物车
      setCartItems(getDefaultCart());
    }
  }, []);

  useEffect(() => {
    // 每当购物车数据更改时，保存到LocalStorage
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const contextValue = {
    cartItems,
    addToCart,
    updateCartItemCount,
    removeFromCart,
    getTotalCartAmount,
    checkout,
    deliveryMethod,
    orderNotes,
    setDeliveryMethod, // 新增设置 deliveryMethod 的函数
    setOrderNotes, // 新增设置 orderNotes 的函数
    products,
    setProducts
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {children}
    </ShopContext.Provider>
  );
};

