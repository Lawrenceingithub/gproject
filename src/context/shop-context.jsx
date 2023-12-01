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
  const [cartItems, setCartItems] = useState(() => {
    const storedCart = localStorage.getItem("cartItems");
    if (storedCart) {
      return JSON.parse(storedCart);
    } else {
      return getDefaultCart();
    }
  });

  const [deliveryMethod, setDeliveryMethod] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [products, setProducts] = useState([]);
  const [productDetails, setProductDetails] = useState(""); // 添加 productDetails
  const [totalAmount, setTotalAmount] = useState(() => {
    const storedTotalAmount = localStorage.getItem("totalAmount");
    return storedTotalAmount ? parseFloat(storedTotalAmount) : 0;
  });

  // 在 cartItems 变化时更新 localStorage
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // 计算 totalAmount 和 productDetails 的 useEffect 放在这里
  useEffect(() => {
    if (cartItems && products.length > 0) {
      let totalAmount = 0;
      let updatedProductDetails = "";
  
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
  
      setTotalAmount(totalAmount);
      setProductDetails(updatedProductDetails); // 更新 productDetails
      localStorage.setItem("totalAmount", totalAmount.toString());
      localStorage.setItem("productDetails", updatedProductDetails); // 也保存到本地存储
    }
  }, [cartItems, products, setTotalAmount, setProductDetails]);

  // 处理添加产品信息的函数
  const handleAddProductDetails = (details) => {
    setProductDetails(details);
  };

  const handleAddToCart = (productId) => {
    setCartItems((prevCartItems) => {
      const updatedCartItems = { ...prevCartItems };
      if (updatedCartItems[productId]) {
        updatedCartItems[productId] += 1;
      } else {
        updatedCartItems[productId] = 1;
      }
      return updatedCartItems;
    });
  };

  const handleRemoveFromCart = (productId) => {
    setCartItems((prevCartItems) => {
      const updatedCartItems = { ...prevCartItems };
      if (updatedCartItems[productId] && updatedCartItems[productId] > 0) {
        updatedCartItems[productId] -= 1;
        if (updatedCartItems[productId] === 0) {
          delete updatedCartItems[productId];
        }
      }
      return updatedCartItems;
    });
  };

  const handleUpdateCartItemCount = (newAmount, productid) => {
    const updatedAmount = newAmount === null ? 0 : newAmount;
    setCartItems((prev) => ({
      ...prev,
      [productid]: updatedAmount,
    }));
  };

  const clearCartItems = () => {
    setCartItems(getDefaultCart());
  };

  return (
    <ShopContext.Provider
      value={{
        cartItems,
        deliveryMethod,
        orderNotes,
        orderNumber,
        products,
        productDetails,
        totalAmount,
        setProductDetails,
        setTotalAmount,
        setDeliveryMethod,
        setOrderNotes,
        setOrderNumber,
        setProducts,
        handleAddProductDetails,
        handleAddToCart,
        handleRemoveFromCart,
        handleUpdateCartItemCount,
        clearCartItems,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};