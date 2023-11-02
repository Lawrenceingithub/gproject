import React, { useContext } from "react";
import { ShopContext } from "../../context/shop-context";
import { AuthContext } from "../../context/auth-context";
import { useParams, useNavigate } from "react-router-dom";
import { Productlist } from "./productlist";
import "./productdetail.css";

export const ProductDetail = () => {
  const {
    addToCart,
    cartItems,
    removeFromCart,
    updateCartItemCount,
    checkout,
  } = useContext(ShopContext);

  const authContext = useContext(AuthContext);
  const { isLoggedIn } = authContext;

  const navigate = useNavigate();

  let params = useParams();
  const productId = parseInt(params.id);
  const productDetail = Productlist.find((product) => product.id === productId);

  const handleAddToCart = () => {
    addToCart(params.id);
  };

  const handleCheckout = () => {
    if (isLoggedIn) {
      updateCartItemCount();
      navigate("/cart");
    } else {
      navigate("/login");
    }
  };
  if (!productDetail) {
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
                  src={productDetail.picture}
                  alt={productDetail.productname}
                  width="400"
                />
              </td>
              <td width="45%" style={{ padding: "10px" }}>
                <p>名稱 : {productDetail.productname}</p>
                <p>售價 : {productDetail.price}元</p>
                <p>描述 : {productDetail.detail}</p>
                <div className="countHandler">
                  {cartItems[params.id] <= 0 ? (
                    <button onClick={handleAddToCart}>加入購物車</button>
                  ) : (
                    <>
                      <button onClick={() => removeFromCart(params.id)}>
                        {" "}
                        -{" "}
                      </button>
                      <input
                        value={cartItems[params.id]}
                        onChange={(e) => {
                          updateCartItemCount(
                            Number(e.target.value),
                            params.id
                          );
                        }}
                      />
                      <button onClick={() => addToCart(params.id)}> + </button>
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
