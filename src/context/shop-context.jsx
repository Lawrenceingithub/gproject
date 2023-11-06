import React, { createContext, useState, useEffect } from "react";
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
  const [orderNotes, setOrderNotes] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [products, setProducts] = useState([]);
  const [productDetails, setProductDetails] = useState(""); // 添加 productDetails
  const [totalAmount, settotalAmount] = useState(() => {
    const storedTotalAmount = localStorage.getItem("totalAmount");
    return storedTotalAmount ? parseFloat(storedTotalAmount) : 0;
  });

  useEffect(() => {
    const storedCart = localStorage.getItem("cartItems");
    if (storedCart) {
      const parsedCart = JSON.parse(storedCart);
      const sanitizedCart = {};
      for (const key in parsedCart) {
        sanitizedCart[key] = parseInt(parsedCart[key], 10) || 0;
      }
      setCartItems(sanitizedCart);
    } else {
      setCartItems(getDefaultCart());
    }
  }, []); // 使用空的依赖项数组

  // 在 cartItems 变化时更新 localStorage
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // 计算 totalAmount 和 productDetails 的 useEffect 放在这里
  useEffect(() => {
    if (cartItems && products.length > 0) {
      let totalAmount = 0;
      let updatedProductDetails = ""; // 添加一个变量来保存更新的 productDetails
  
      Object.keys(cartItems).forEach((productid) => {
        const productIdNumber = productid;
        const product = products.find(
          (product) => product.productid === productIdNumber
        );
  
        if (product && cartItems[productid] > 0) {
          totalAmount += product.price * cartItems[productid];
          updatedProductDetails += `${product.productname} ${cartItems[productid]}件 `; // 更新 productDetails
        }
      });
  
      settotalAmount(totalAmount);
      setProductDetails(updatedProductDetails); // 更新 productDetails
      localStorage.setItem("totalAmount", totalAmount.toString());
      localStorage.setItem("productDetails", updatedProductDetails); // 也保存到本地存储
    }
  }, [cartItems, products, settotalAmount, setProductDetails]);

  // 处理添加产品信息的函数
  const handleAddProductDetails = (details) => {
    setProductDetails(details);
  };

  const handleAddToCart = (productid) => {
    // 更新购物车中商品数量的逻辑
    const updatedAmount = parseInt(cartItems[productid] || 0, 10) + 1;
    setCartItems((prev) => ({
      ...prev,
      [productid]: updatedAmount,
    }));
  };

  const handleRemoveFromCart = (productid) => {
    // 更新购物车中商品数量的逻辑
    const updatedAmount = cartItems[productid] === null ? 0 : cartItems[productid] - 1;
    setCartItems((prev) => ({
      ...prev,
      [productid]: updatedAmount,
    }));
  };

  const handleUpdateCartItemCount = (newAmount, productid) => {
    const updatedAmount = newAmount === null ? 0 : newAmount;
    setCartItems((prev) => ({
      ...prev,
      [productid]: updatedAmount,
    }));
  };

  const contextValue = {
    cartItems,
    handleAddToCart,
    handleUpdateCartItemCount,
    handleRemoveFromCart,
    deliveryMethod,
    orderNotes,
    orderNumber, // 将 orderNumber 包括在 contextValue
    products,
    totalAmount,
    productDetails,
    setDeliveryMethod,
    setOrderNotes,
    setOrderNumber, // 设置 setOrderNumber 函数
    setProducts,
    settotalAmount,
    setProductDetails,
    handleAddProductDetails, // 将 handleAddProductDetails 包括在 contextValue
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {children}
    </ShopContext.Provider>
  );
};
