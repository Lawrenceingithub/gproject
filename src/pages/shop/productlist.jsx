import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../../context/shop-context";
import { Link } from "react-router-dom";
import Axios from "axios"; // 引入 Axios
import './productlist.css';

export const Productlist = () => {
  const { addToCart, cartItems } = useContext(ShopContext);
  const [ products, setProducts] = useState([]); // 用于存储产品数据的状态

  useEffect(() => {
    // 在组件加载时获取产品数据
    Axios.get("http://localhost:3001/productlist") // 请替换成后端路由的 URL
      .then((response) => {
        setProducts(response.data); // 保存产品数据到状态
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []); // 空依赖数组确保这个 effect 只运行一次

  const handleAddToCart = (id) => {
    addToCart(id);
  };

  return (
    <div className="productlist">
      <div className="productlisttitle">
        <h1>測試店</h1>
      </div>

      <div className="products">
        {products.map((product) => (
          <div className="product" key={product.productId}>
            <Link to={`product/${product.productId}`}>
              <img src={product.picture} alt={product.productname} />
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
                <>
                  ({cartItems[product.productId]})
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};