import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Checkout from "./pages/Checkout";
import Success from "./pages/Success";
import ProductDetails from "./pages/ProductDetails";
import MyOrders from "./pages/MyOrders";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />


<Route path="/login" element={<Login />} />

<Route path="/signup" element={<Signup />} />

      <Route
        path="/admin-nishant-2580"
        element={<Admin />}
      />

      <Route
        path="/checkout"
        element={<Checkout />}
      />

      <Route
  path="/success"
  element={<Success />}
/>
<Route
  path="/product/:id"
  element={<ProductDetails />}
/>
<Route
  path="/orders"
  element={<MyOrders />}
/>
    </Routes>
  );
}

export default App;