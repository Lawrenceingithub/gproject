import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../../context/shop-context";
import { AuthContext } from "../../context/auth-context";
import { useNavigate, useParams } from "react-router-dom";
import "./productdetail.css";

export const ProductDetail = () => {
  const { addToCart, cartItems, removeFromCart, updateCartItemCount, products } =
    useContext(ShopContext);
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const { productid } = useParams();

  const productDetail = products.find((product) => product.productid === productid);

  console.log("products:", products); // 添加调试信息
  console.log("productdetail:", productDetail.picture); // 添加调试信息


    const handleAddToCart = () => {
      addToCart(productDetail.productid);
    };

  const handleCheckout = () => {
    if (isLoggedIn) {
      updateCartItemCount();
      navigate("/cart");
    } else {
      navigate("/login");
    }
  };

  (!productDetail&&
    (<h1>產品不存在</h1>))


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
                  {cartItems[products.productid] <= 0 ? (
                    <button onClick={handleAddToCart}>加入購物車</button>
                  ) : (
                    <>
                      <button onClick={() => removeFromCart(products.productid)}>
                        {" "}
                        -{" "}
                      </button>
                      <input
                        value={cartItems[products.productid]}
                        onChange={(e) => {
                          updateCartItemCount(
                            Number(e.target.value),
                            products.productid
                          );
                        }}
                      />
                      <button onClick={() => addToCart(products.productid)}> + </button>
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
