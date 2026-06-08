import { Link } from "react-router-dom";

function ProductCard({
  product,
  addToCart,
  deleteProduct,
  startEdit,
  isAdmin,
}) {
  return (
    <div className="product-card">

      <Link to={`/product/${product.id}`}>
        <img
          src={
            product.image
              ? `http://localhost:5000${product.image}`
              : "https://via.placeholder.com/150"
          }
          alt={product.name}
        />
      </Link>

      <div className="product-info">

        <Link
          to={`/product/${product.id}`}
          className="product-link"
        >
          <h3>{product.name}</h3>
        </Link>

        <p className="price">
          ₹{product.price}
        </p>

        <div className="btn-group">

          {!isAdmin && (
            <button
              className="add-btn"
              onClick={() => addToCart(product)}
            >
              ADD
            </button>
          )}

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

      </div>
    </div>
  );
}

export default ProductCard;