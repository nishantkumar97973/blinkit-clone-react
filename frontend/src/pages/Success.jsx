import { Link } from "react-router-dom";

function Success() {
  return (
    <div className="success-page">
      <div className="success-box">

        <div className="checkmark-circle">
          <div className="checkmark">✓</div>
        </div>

        <h1>Order Placed Successfully!</h1>

        <p>
          Your groceries are being packed and
          will arrive in 10-15 minutes.
        </p>

        <div className="order-id">
          Order ID #
          {Math.floor(
            100000 + Math.random() * 900000
          )}
        </div>

        <Link to="/">
          <button className="home-btn">
            Continue Shopping
          </button>
        </Link>

        <Link to="/orders">
  <button className="orders-btn">
    View My Orders
  </button>
</Link>

      </div>
    </div>
  );
}

export default Success;