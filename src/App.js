import { Routes, Route, BrowserRouter } from "react-router-dom";
import { Navbar } from "./components/navbar";
import { Sidebar } from "./components/sidebar";
import { Shop } from "./pages/shop/shop";
import { Cart } from "./pages/cart/cart";
import { Checkout } from "./pages/cart/checkout";
import { Login } from "./pages/login/login";
import { Createaccount } from "./pages/createaccount/createaccount";
import { ShopContextProvider } from "./context/shop-context";
import { AuthContextProvider } from "./context/auth-context";
import { User } from "./pages/user/user";
import { ProductUpload } from "./pages/shop/productupload";
import { ProductDetail } from "./pages/shop/productdetail";
import { Faq } from "./pages/shop/faq";
import { Orderhistory } from "./pages/user/orderhistory";

function App() {
  return (
    <BrowserRouter basename="/">
      <div className="App">
        <AuthContextProvider>
          <ShopContextProvider>
            <Navbar />
            <Routes>
              <Route path="/sidebar" element={<Sidebar />} />
              <Route path="/" element={<Shop />} />
              <Route path="/product" element={<ProductDetail />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/upload" element={<ProductUpload />}/>
              <Route path="/cart" element={<Cart />} />
              <Route path="/login" element={<Login />} />
              <Route path="/createaccount" element={<Createaccount />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/upload" element={<ProductUpload />} />
              <Route path="/user" element={<User />} />
              <Route path="/orderhistory" element={<Orderhistory />} />
              <Route path="/faq" element={<Faq />} />

            </Routes>
          </ShopContextProvider>
        </AuthContextProvider>
      </div>
    </BrowserRouter>
  );
}

export default App;