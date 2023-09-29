import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/navbar";
import { Shop } from "./pages/shop/shop";
import { Cart } from "./pages/cart/cart";
import { Login } from "./pages/login/login";
import { ShopContextProvider } from "./context/shop-context";
import { User } from "./pages/info/user";

function App() {
  return (
    <div className="App">
      <ShopContextProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Shop />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/user" element={<User />} />
            <Route path="/login" element={<Login />} />

          </Routes>
        </Router>
      </ShopContextProvider>
    </div>
  );
}

export default App;