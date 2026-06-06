function ProductCard({
  product,
  addToCart,
  deleteProduct,
  startEdit,
  isAdmin,
}) {
  return (
    <div className="product-card">
    <img
  src={
    product.image
      ? `http://localhost:5000${product.image}`
      : "https://via.placeholder.com/150"
  }
  alt={product.name}
/>

      <h3>{product.name}</h3>

      <p>₹{product.price}</p>

      <button
        className="add-btn"
        onClick={() => addToCart(product)}
      >
        ADD
      </button>

      {isAdmin && (
        <>
          <button
            className="edit-btn"
            onClick={() => startEdit(product)}
          >
            EDIT
          </button>

          <button
            className="delete-btn"
            onClick={() =>
              deleteProduct(product.id)
            }
          >
            DELETE
          </button>
        </>
      )}
    </div>
  );
}

export default ProductCard;