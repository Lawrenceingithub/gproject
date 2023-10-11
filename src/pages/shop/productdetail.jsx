import React from "react";
import { useParams, Link } from "react-router-dom";
import { PRODUCTS } from "../../products";

export const ProductDetail = () => {
  let params = useParams();
  const productId = parseInt(params.id);

  const productDetail = PRODUCTS.find((product) => product.id === productId);

  if (!productDetail) {
    return <div>產品不存在</div>;
  }

  return (
    <div>
      <div className="ProductDetail">
        <table width="100%">
          <tbody>
            <tr>
              <td align="right">
                <img
                  src={productDetail.productImage}
                  alt={productDetail.productName}
                  width="400"
                />
              </td>
              <td width="45%" style={{ padding: "10px" }}>
                <p>名稱 : {productDetail.productName}</p>
                <p>售價 : {productDetail.price}元</p>
                <p>描述 : {productDetail.productDetail}</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <Link to="/">返回商品列表</Link>
    </div>
  );
};
