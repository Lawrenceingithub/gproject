import React, { useContext} from "react";
import { ShopContext } from "../../context/shop-context";
import { AuthContext } from "../../context/auth-context";
import { useNavigate, useParams } from "react-router-dom";
import "./productdetail.css";

export const ProductDetail = () => {
  const {
    handleAddToCart,
    cartItems,
    handleRemoveFromCart,
    handleUpdateCartItemCount,
    products,
  } = useContext(ShopContext);
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  let params = useParams();
  const productId = params.productid;
  const productDetail = products.find(
    (product) => product.productid === productId
  );

  const handleAddToCartClick = () => {
    handleAddToCart(productDetail.productid);
  };

  const handleRemoveFromCartClick = (productid) => {
    // 更新 React 组件中的购物车状态
    handleRemoveFromCart(productid);

  };
  


  const handleCheckout = () => {
    if (isLoggedIn) {
      // 此处处理结账逻辑
      navigate("/cart");
    } else {
      navigate("/login");
    }
  };

  if (!productDetail) {
    <div className="ProductDetail">
    return <h1>產品不存在</h1>;
    </div>
  }

  return (
    <div className="ProductDetailInfo">
      <div className="ProductDetail">
        <table width="100%">
          <tbody>
            <tr>
              <td align="right">
                <img
                  src={`http://localhost:3001/assets/${productDetail.picture}`}
                  alt={productDetail.productname}
                />
              </td>
              <td width="45%" style={{ padding: "10px" }}>
                <p>名稱 : {productDetail.productname}</p>
                <p>售價 : {productDetail.price}元</p>
                <p>描述 : {productDetail.detail}</p>
                <div className="countHandler">
                  {cartItems[productDetail.productid] <= 0 ? (
                    <button onClick={handleAddToCartClick}>加入購物車</button>
                  ) : (
                    <>
                      <button
                        onClick={() =>
                          handleRemoveFromCartClick(productDetail.productid)
                        }
                      >
                        {" "}
                        -{" "}
                      </button>
                      <input
                        value={cartItems[productDetail.productid] || ""}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          if (!isNaN(value)) {
                            handleUpdateCartItemCount(
                              value,
                              productDetail.productid
                            );
                          }
                        }}
                      />
                      <button onClick={handleAddToCartClick}> + </button>
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
