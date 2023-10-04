import React, { createContext, useState } from 'react';
import { Link, Route, Routes, useParams } from 'react-router-dom';
import { FAQ } from './faq';
import { OrderHistory } from './orderhistory';
import './user.css';

export const ActiveContentContext = createContext();

export const User = () => {
  const { content } = useParams();
  const [activeContent, setActiveContent] = useState(content || 'orderhistory');

  const handleContentChange = (content) => {
    setActiveContent(content);
  };

  return (
    <ActiveContentContext.Provider value={activeContent}>
      <div className="userpage">
        <div className="sidebar">
          <ul>
            <li>
              <Link to="/user/orderhistory" onClick={() => handleContentChange('orderhistory')}>
                订单历史
              </Link>
            </li>
            <li>
              <Link to="/user/faq" onClick={() => handleContentChange('faq')}>
                FAQ
              </Link>
            </li>
          </ul>
        </div>

        <div className="content">
          <div className="accountinfo">
            <Routes>
              <Route
                path="/user/orderhistory"
                element={<OrderHistory />}
              />
              <Route path="/user/faq" element={<FAQ />} />
            </Routes>
          </div>
        </div>
      </div>
    </ActiveContentContext.Provider>
  );
};