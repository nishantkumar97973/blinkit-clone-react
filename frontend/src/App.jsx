import { useState } from "react";
import milkImage from "./assets/amul milk.png";
import breadImage from "./assets/bread.png";
import butterImage from "./assets/b utter.png";
import cheeseImage from "./assets/cheese.png";
import Navbar from "./components/Navbar";
import ProductCard from "./components/ProductCard";

function App() {
  const [cartCount, setCartCount] = useState(0);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    setCartCount(cartCount + 1);
    setCartItems([...cartItems, product]);
  };

  const removeFromCart = (indexToRemove) => {
  const updatedCart = cartItems.filter(
    (_, index) => index !== indexToRemove
  );

  setCartItems(updatedCart);
  setCartCount(updatedCart.length);
};

  const products = [
  {
    id: 1,
    name: "Amul Milk",
    price: 30,
    image: milkImage,
    category: "Dairy",
  },
  {
    id: 2,
    name: "Bread",
    price: 40,
    image: breadImage,
    category: "Bakery",
  },
  {
    id: 3,
    name: "Butter",
    price: 60,
    image: butterImage,
    category: "Dairy",
  },
  {
    id: 4,
    name: "Cheese",
    price: 90,
    image: cheeseImage,
    category: "Dairy",
  },
];

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
  (total, item) => total + item.price,
  0
);

  return (
    <div>
      <Navbar
  cartCount={cartCount}
  search={search}
  setSearch={setSearch}
/>
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

      <h1>Groceries delivered in minutes</h1>

      <div className="products">
        {filteredProducts.map((product) => (
<ProductCard
  key={product.id}
  product={product}
  addToCart={addToCart}
/> 
        ))}
      </div>

      <h2>Cart Items</h2>

  {cartItems.map((item, index) => (
  <div key={index}>
    <p>
      {item.name} - ₹{item.price}
    </p>

    <button onClick={() => removeFromCart(index)}>
      Remove
    </button>
  </div>
))}
      
      <h3>Total Price: ₹{totalPrice}</h3>
    </div>
  );
}

export default App;