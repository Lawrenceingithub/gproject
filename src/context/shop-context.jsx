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
  const [orderTotal, setOrderTotal] = useState(0);

  useEffect(() => {
    const storedCart = localStorage.getItem("cartItems");
    if (storedCart) {
      const parsedCart = JSON.parse(storedCart);
      for (const key in parsedCart) {
        parsedCart[key] = parsedCart[key] === null ? 0 : parsedCart[key];
      }
      setCartItems(parsedCart);
    } else {
      setCartItems(getDefaultCart());
    }
  }, []);

  // 在 cartItems 变化时更新 localStorage
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const handleAddToCart = (productid) => {
    const updatedAmount = parseInt(cartItems[productid] || 0, 10) + 1;
    setCartItems((prev) => ({
      ...prev,
      [productid]: updatedAmount,
    }));
  };
  
  const handleRemoveFromCart = (productid) => {
    const updatedAmount = cartItems[productid] === null ? 0 : cartItems[productid] - 1;
    handleUpdateCartItemCount(updatedAmount, productid);
  };

  const handleUpdateCartItemCount = (newAmount, productid) => {
    const updatedAmount = newAmount === null ? 0 : newAmount;
    setCartItems((prev) => ({
      ...prev,
      [productid]: updatedAmount,
    }));
  };

  function getTotalCartAmount() {
    let totalAmount = 0;

    if (cartItems) {
      Object.keys(cartItems).forEach((productid) => {
        const product = products.find((product) => product.productid === productid);
        if (product && cartItems[productid] > 0) {
          totalAmount += product.price * cartItems[productid];
        }
        setOrderTotal(totalAmount);
      });
    }
    return totalAmount;
  }
  
  const checkout = () => {
    setCartItems(getDefaultCart());
  };

  const contextValue = {
    cartItems,
    handleAddToCart,
    handleUpdateCartItemCount,
    handleRemoveFromCart,
    getTotalCartAmount,
    checkout,
    deliveryMethod,
    orderNotes,  // 添加 orderNotes 到 contextValue
    setDeliveryMethod,
    setOrderNotes,  // 添加 setOrderNotes 到 contextValue
    products,
    setProducts,
    orderTotal,  // 添加 orderTotal 到 contextValue
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {children}
    </ShopContext.Provider>
  );
};
