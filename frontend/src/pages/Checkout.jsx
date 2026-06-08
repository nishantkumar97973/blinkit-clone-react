import { useLocation, useNavigate } from "react-router-dom";

function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();

const cartItems =
  location.state?.cartItems || [];

const totalPrice =
  location.state?.totalPrice || 0;

  const handleSubmit = (e) => {
  e.preventDefault();

const order = {
  orderId:
    "BLK-" +
    Math.floor(
      100000 +
        Math.random() * 900000
    ),

  totalPrice,
  items: cartItems,

  date:
    new Date().toLocaleString(),
};

  const existingOrders =
    JSON.parse(
      localStorage.getItem("orders")
    ) || [];

  existingOrders.push(order);

  localStorage.setItem(
    "orders",
    JSON.stringify(existingOrders)
  );

  navigate("/success");
};


  return (
    <div className="checkout-container">
      <div className="checkout-card">

        <h1>Checkout</h1>

        <div className="order-summary">
  <h2>Order Summary</h2>

  {cartItems.map((item) => (
    <div
      key={item.id}
      className="order-item"
    >
      <span>
        {item.name} × {item.quantity}
      </span>

      <span>
        ₹{item.price * item.quantity}
      </span>
    </div>
  ))}

  <hr />

  <div className="order-total">
    <span>Total</span>
    <span>₹{totalPrice}</span>
  </div>
</div>
<form
  className="checkout-form"
  onSubmit={handleSubmit}
>

  <input
    type="text"
    placeholder="Full Name"
    required
  />

  <input
    type="text"
    placeholder="Phone Number"
    required
  />

  <textarea
    placeholder="Delivery Address"
    required
  ></textarea>

  <button type="submit">
    Place Order
  </button>

</form>
        
      </div>
    </div>
  );
}

export default Checkout;