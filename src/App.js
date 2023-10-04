import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/navbar";
import { Shop } from "./pages/shop/shop";
import { Cart } from "./pages/cart/cart";
import { Login } from "./pages/login/login";
import { Createaccount } from "./pages/createaccount/createaccount";
import { FAQ } from "./pages/user/faq"; 
import { OrderHistory } from "./pages/user/orderhistory";
import { ShopContextProvider } from "./context/shop-context";
import { AuthContextProvider } from "./context/auth-context";
import { User } from "./pages/user/user";

function App() {
  return (
    <div className="App">
      <AuthContextProvider>
        <ShopContextProvider>
          <Router>
            <Navbar />
            <Routes>
              <Route path="/" element={<Shop />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/user" element={<User />} />
              <Route path="/user/faq" element={<FAQ />} />
              <Route path="/user/orderhistory" element={<OrderHistory />} />
              <Route path="/login" element={<Login />} />
              <Route path="/createaccount" element={<Createaccount />} />
            </Routes>
          </Router>
        </ShopContextProvider>
      </AuthContextProvider>
    </div>
  );
}

export default App;