import React, { useContext, useState } from 'react';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/auth-context';
import { Sidebar } from '../../components/sidebar';

export const ProductUpload = () => {
  const { userID } = useContext(AuthContext);
  const navigate = useNavigate();
  const [productData, setProductData] = useState({
    productname: '',
    price: 0,
    detail: '',
    sort: '1', // 默认为 '食物'
    storage: 0,
    status: '1', // 默认为 '已上架'
    picture: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData({
      ...productData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setProductData({
      ...productData,
      picture: e.target.files[0],
    });
  };

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append('productname', productData.productname);
      formData.append('price', productData.price);
      formData.append('detail', productData.detail);
      formData.append('sort', productData.sort);
      formData.append('storage', productData.storage);
      formData.append('status', productData.status);
      formData.append('userID', userID); // 附加 userID 到 formData

      if (productData.picture) {
        formData.append('picture', productData.picture); // 保证 'picture' 是选中文件的正确数据
      }
      console.log(productData.picture)

      const response = await Axios.post('http://localhost:3001/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        // 上传成功
        console.log('Product uploaded successfully');
        navigate('/upload');
      } else {
        console.error('Error uploading product. Response:', response);
      }
    } catch (error) {
      console.error('Error uploading product:', error);
    }
  };

  return (
    <>
    <Sidebar />
    <div className='maincontent'>
      <h2>产品上传</h2>
      <form encType="multipart/form-data">
      <div>
        <label>产品名称: </label>
        <input
          type="text"
          name="productname"
          placeholder="产品名称"
          value={productData.productname}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>价格: </label>
        <input
          type="number"
          name="price"
          placeholder="价格"
          value={productData.price}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>详情: </label>
        <input
          type="text"
          name="detail"
          placeholder="详情"
          value={productData.detail}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>分类: </label>
        <select name="sort" onChange={handleInputChange}>
          <option value="1">食物</option>
          <option value="2">电子用具</option>
          <option value="3">生活用品</option>
        </select>
      </div>
      <div>
        <label>库存数量: </label>
        <input
          type="number"
          name="storage"
          placeholder="库存"
          value={productData.storage}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>状态: </label>
        <select name="status" onChange={handleInputChange}>
          <option value="1">已上架</option>
          <option value="2">未上架</option>
          <option value="3">售罄</option>
        </select>
      </div>
      <label>文件图片: </label>
      <div>
        <input type="file" name="picture" onChange={handleFileChange} />
      </div>
      <div>
        <button onClick={handleUpload}>上传产品</button>
      </div>
      </form>
      <button onClick={()=>navigate('/user')}>返回</button>
    </div>
    </>
  );
};
