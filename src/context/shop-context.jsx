import { createContext, useState, useEffect } from "react";
import { Productlist } from "../pages/shop/productlist";

export const ShopContext = createContext(null);

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

  const addToCart = (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
  };

  const updateCartItemCount = (newAmount, itemId) => {
    if (newAmount <= 0) {
      setCartItems((prev) => ({ ...prev, [itemId]: 0 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: newAmount }));
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = Productlist.find((product) => product.productId === Number(item));
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

