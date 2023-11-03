import React, { useContext, useEffect } from "react";
import { ShopContext } from "../../context/shop-context";
import { Link } from "react-router-dom";
import Axios from "axios"; // 引入 Axios
import "./productlist.css";

export const Productlist = () => {
  const { addToCart, cartItems, products, setProducts } = useContext(ShopContext);

  useEffect(() => {
    // 在组件加载时获取产品数据
    Axios.get("http://localhost:3001/productlist")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, [setProducts]);

  const handleAddToCart = (productId) => {
    addToCart(productId);
  };


  return (
    <div className="productlist">
      <div className="productlisttitle">
        <h1>測試店</h1>
      </div>

      <div className="products">
        {products.map((product) => {
          // 将图像数据转换为Base64字符串

          return (
            <div className="product" key={product.productId}>
              <Link to={`product/${product.productId}`}>
              <img src={`data:image/jpeg;base64,${btoa(String.fromCharCode.apply(null, new Uint8Array(product.picture)))}`} alt={product.productname} />
              </Link>
              <div className="description">
                <p>
                  <b>{product.productname}</b>
                </p>
                <p>${product.price}</p>
              </div>
              <button
                className="addToCartBtn"
                onClick={() => handleAddToCart(product.productId)}
              >
                加入購物車{" "}
                {cartItems[product.productId] > 0 && (
                  <>({cartItems[product.productId]})</>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
