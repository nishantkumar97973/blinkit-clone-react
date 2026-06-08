function MyOrders() {
  const orders =
    JSON.parse(
      localStorage.getItem("orders")
    ) || [];

  return (
    <div className="orders-page">
      <h1>🛍 My Orders</h1>

      {orders.length === 0 ? (
        <p>No Orders Yet</p>
      ) : (
        orders
          .slice()
          .reverse()
          .map((order, index) => (
            <div
              key={index}
              className="order-card"
            >
              <div className="order-header">
                <h3>
                  Order #
                  {order.orderId}
                </h3>

                <span className="status">
                  Delivered
                </span>
              </div>

              <p>
                📅 {order.date}
              </p>

              <p>
                💰 Total: ₹
                {order.totalPrice}
              </p>

              <p>
                📦 Items:
                {order.items.length}
              </p>

              <hr />

              <div className="order-items">
                {order.items.map(
                  (item) => (
                    <div
                      key={item.id}
                      className="item-row"
                    >
                      <span>
                        {item.name} ×{" "}
                        {item.quantity}
                      </span>

                      <span>
                        ₹
                        {item.price *
                          item.quantity}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          ))
      )}
    </div>
  );
}

export default MyOrders;