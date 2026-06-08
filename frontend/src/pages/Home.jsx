import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import heroImage from "../assets/hero.png";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import ChatBot from "../components/ChatBot";


function Home()
 {
  const [cartCount, setCartCount] = useState(0);const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [darkMode, setDarkMode] =
  useState(false);
 








  useEffect(() => {
 fetch("http://localhost:5000/products")
  .then((response) => response.json())
  .then((data) => {
    setProducts(data);
  });
  }, []);


  

  const addToCart = (product) => {
    const existingItem = cartItems.find(
      (item) => item.id === product.id
    );

    if (existingItem) {
      const updatedCart = cartItems.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );

      setCartItems(updatedCart);
    } else {
      setCartItems([
        ...cartItems,
        {
          ...product,
          quantity: 1,
        },
      ]);
    }

    setCartCount(cartCount + 1);
  };

  const increaseQuantity = (id) => {
    const updatedCart = cartItems.map((item) =>
      item.id === id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );

    setCartItems(updatedCart);

    const totalItems = updatedCart.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    setCartCount(totalItems);
  };

  const decreaseQuantity = (id) => {
    const updatedCart = cartItems
      .map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter((item) => item.quantity > 0);

    setCartItems(updatedCart);

    const totalItems = updatedCart.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    setCartCount(totalItems);
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "All" ||
      product.category === category;

    return matchesSearch && matchesCategory;
  });

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );






  return (
    <div>
      <Navbar
        cartCount={cartCount}
        search={search}
        setSearch={setSearch}
      />

      

<ChatBot />


      <div className="categories">
        <button
          className={category === "All" ? "active" : ""}
          onClick={() => setCategory("All")}
        >
          All
        </button>

        <button
          className={category === "Dairy" ? "active" : ""}
          onClick={() => setCategory("Dairy")}
        >
          Dairy
        </button>

        <button
          className={category === "Bakery" ? "active" : ""}
          onClick={() => setCategory("Bakery")}
        >
          Bakery
        </button>
      </div>

      <div className="hero-banner">
        <img src={heroImage} alt="Hero Banner" />
      </div>


      <h1>Groceries delivered in minutes</h1>

      <div className="main-content">
        <div className="products">
          {filteredProducts.map((product) => (
<ProductCard
  key={product.id}
  product={product}
  addToCart={addToCart}
/>
          ))}
        </div>

        <div className="cart-section">
          <h2>Cart Items</h2>

          {cartItems.length === 0 ? (
            <p>Cart is empty</p>
          ) : (
            <>
              {cartItems.map((item, index) => (
                <div key={index}>
                  <p>
                    {item.name} - ₹{item.price}
                  </p>

                  <button
                    onClick={() =>
                      decreaseQuantity(item.id)
                    }
                  >
                    -
                  </button>

                  <span> {item.quantity} </span>

                  <button
                    onClick={() =>
                      increaseQuantity(item.id)
                    }
                  >
                    +
                  </button>
                </div>
              ))}

              <h3>Total Price: ₹{totalPrice}</h3>
              
<button
  onClick={() =>
    navigate("/checkout", {
      state: {
        cartItems,
        totalPrice,
      },
    })
  }
>
  Proceed to Checkout
</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;