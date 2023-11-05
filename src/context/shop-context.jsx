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
  const [orderNumber, setOrderNumber] = useState(""); // 修正初始化
  const [products, setProducts] = useState([]);
  const [totalAmount, settotalAmount] = useState(() => {
    const storedTotalAmount = localStorage.getItem("totalAmount");
    return storedTotalAmount ? parseFloat(storedTotalAmount) : 0;
  });

  useEffect(() => {
    if (cartItems && products.length > 0) {
      let totalAmount = 0;
  
  
      Object.keys(cartItems).forEach((productid) => {
        
        const productIdNumber = productid;
        const product = products.find((product) => product.productid === productIdNumber);
        
        if (product && cartItems[productid] > 0) {
          totalAmount += product.price * cartItems[productid];
        }
      });
  
      settotalAmount(totalAmount);
      localStorage.setItem("totalAmount", totalAmount.toString());
    }
  }, [cartItems, products, settotalAmount]);

  useEffect(() => {
    const storedCart = localStorage.getItem("cartItems");
    console.log("Stored cart data:", storedCart);
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
    setDeliveryMethod,
    setOrderNotes,
    setOrderNumber, // 设置 setOrderNumber 函数
    setProducts,
    settotalAmount,
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {children}
    </ShopContext.Provider>
  );
};
