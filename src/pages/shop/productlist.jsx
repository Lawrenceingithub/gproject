import React, { useContext, useEffect } from "react";
import { ShopContext } from "../../context/shop-context";
import { Link, useParams } from "react-router-dom";
import Axios from "axios"; // 引入 Axios
import "./productlist.css";

export const Productlist = () => {
  const { addToCart, cartItems, products, setProducts } =
    useContext(ShopContext);

  const params = useParams(); // 使用 useParams 获取 URL 参数

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

  const handleAddToCart = (productid) => {
    addToCart(productid);
  };



  return (
    <div className="productlist">
      <div className="productlisttitle">
        <h1>測試店</h1>
      </div>

      <div className="products">
        {products.map((product) => (
            <div className="product" key={product.productid}>
            <Link to={`product/${product.productid}`}>
            <img src={`./assets/${product.picture}`} alt={product.productname} />
            </Link>
              <div className="description">
                <p>
                  <b>{product.productname}</b>
                </p>
                <p>${product.price}</p>
              </div>
              <button
                className="addToCartBtn"
                onClick={() => handleAddToCart(product.productid)}
              >
                加入購物車{" "}
                {cartItems[product.productid] > 0 && (
                  <>({cartItems[product.productid]})</>
                )}
              </button>
            </div>
        ))}
      </div>
    </div>
  );
};
