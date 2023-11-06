import React, { useContext, useEffect } from "react";
import { ShopContext } from "../../context/shop-context";
import { Link } from "react-router-dom";
import Axios from "axios"; // 引入 Axios
import "./productlist.css";

export const Productlist = () => {
  const { handleAddToCart, cartItems, products, setProducts } =
    useContext(ShopContext);

    useEffect(() => {
      Axios.get("http://localhost:3001/productlist")
        .then((response) => {
          setProducts(response.data);
        })
        .catch((error) => {
          console.error("Error fetching products:", error);
        });
    }, [setProducts]);

  const handleAddToCartClick = (productid) => {
   
      handleAddToCart(productid);

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
              <img
                src={`http://localhost:3001/assets/${product.picture}`}
                alt={product.productname}
              />
            </Link>
            <div className="description">
              <p>
                <b>{product.productname}</b>
              </p>
              <p>${product.price}</p>
            </div>
            <button
              className="addToCartBtn"
              onClick={() => {
                handleAddToCartClick(product.productid);
              }}
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
