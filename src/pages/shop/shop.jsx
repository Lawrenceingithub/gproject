import React, { useContext } from "react";
import { ShopContext } from "../../context/shop-context";
import { PRODUCTS } from "../../products";
import { Link } from "react-router-dom";
import "./shop.css";

export const Shop = () => {
  const { addToCart, cartItems } = useContext(ShopContext);

  const handleAddToCart = (id) => {
    addToCart(id);
  };

  return (
    <div className="shop">
      <div className="shopTitle">
        <h1>測試店</h1>
      </div>

      <div className="products">
        {PRODUCTS.map((product) => (
          <div className="product" key={product.id}>
            <Link to={`product/${product.id}`}>
              <img src={product.productImage} alt={product.productName} />
            </Link>
            <div className="description">
              <p>
                <b>{product.productName}</b>
              </p>
              <p>${product.price}</p>
            </div>
            <button
              className="addToCartBtn"
              onClick={() => handleAddToCart(product.id)}
            >
              加入購物車{" "}
              {cartItems[product.id] > 0 && (
                <>
                  ({cartItems[product.id]})
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};