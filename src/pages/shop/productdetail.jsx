import React, { useContext } from "react";
import { ShopContext } from "../../context/shop-context";
import { AuthContext } from "../../context/auth-context";
import { useNavigate } from "react-router-dom";
import "./productdetail.css";

export const ProductDetail = () => {
  const shopContext = useContext(ShopContext)
  const {
    addToCart,
    cartItems,
    removeFromCart,
    updateCartItemCount,
    products,
  } = shopContext;

  const authContext = useContext(AuthContext);
  const { isLoggedIn } = authContext;
  const navigate = useNavigate();

  const handleAddToCart = () => {
    addToCart(products.productId);
  };

  const handleCheckout = () => {
    if (isLoggedIn) {
      updateCartItemCount();
      navigate("/cart");
    } else {
      navigate("/login");
    }
  };
  if (!products) {
    return <div>產品不存在</div>;
  }
        
  return (
    <div className="ProductDetailInfo">
      <div className="ProductDetail">
        <table width="100%">
          <tbody>
            <tr>
              <td align="right">
                <img
                  src={products.picture}
                  alt={products.productname}
                  width="400"
                />
              </td>
              <td width="45%" style={{ padding: "10px" }}>
                <p>名稱 : {products.productname}</p>
                <p>售價 : {products.price}元</p>
                <p>描述 : {products.detail}</p>
                <div className="countHandler">
                  {cartItems[products.productId] <= 0 ? (
                    <button onClick={handleAddToCart}>加入購物車</button>
                  ) : (
                    <>
                      <button onClick={() => removeFromCart(products.productId)}>
                        {" "}
                        -{" "}
                      </button>
                      <input
                        value={cartItems[products.productId]}
                        onChange={(e) => {
                          updateCartItemCount(
                            Number(e.target.value),
                            products.productId
                          );
                        }}
                      />
                      <button onClick={() => addToCart(products.productId)}> + </button>
                    </>
                  )}
                </div>
                <div>
                  <button onClick={() => navigate("/")}> 繼續購物 </button>
                  <button onClick={handleCheckout}> 結算 </button>

                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
