import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] =
    useState(null);

  useEffect(() => {
    fetch(
      `http://localhost:5000/products/${id}`
    )
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
      });
  }, [id]);

  if (!product) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="product-details">

      <div className="product-details-card">

        <img
          src={`http://localhost:5000${product.image}`}
          alt={product.name}
        />

        <div className="product-info">

          <h1>{product.name}</h1>

          <p className="category">
            {product.category}
          </p>

          <h2>₹{product.price}</h2>

          <button>
            Add To Cart
          </button>

        </div>

      </div>

    </div>
  );
}

export default ProductDetails;