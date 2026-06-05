import { useState, useEffect } from "react";

import milkImage from "./assets/amul milk.png";
import breadImage from "./assets/bread.png";
import butterImage from "./assets/b utter.png";
import cheeseImage from "./assets/cheese.png";
import heroImage from "./assets/hero.png";

import Navbar from "./components/Navbar";
import ProductCard from "./components/ProductCard";

function App() {
  const [cartCount, setCartCount] = useState(0);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [newName, setNewName] = useState("");
const [newPrice, setNewPrice] = useState("");
const [newCategory, setNewCategory] = useState("");
const [editId, setEditId] = useState(null);
const [isAdmin, setIsAdmin] = useState(false);
const [password, setPassword] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/products")
      .then((response) => response.json())
      .then((data) => {
        const productsWithImages = data.map((product) => {
          let image;

          if (product.name === "Amul Milk") {
            image = milkImage;
          } else if (product.name === "Bread") {
            image = breadImage;
          } else if (product.name === "Butter") {
            image = butterImage;
          } else if (product.name === "Cheese") {
            image = cheeseImage;
          }

          return {
            ...product,
            image,
          };
        });

        setProducts(productsWithImages);
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

  const handleAddProduct = async () => {
  if (!newName || !newPrice || !newCategory) {
    alert("Please fill all fields");
    return;
  }

  try {
    const response = await fetch(
      "http://localhost:5000/products",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newName,
          price: Number(newPrice),
          category: newCategory,
        }),
      }
    );

    const data = await response.json();

    alert(data.message);

    setNewName("");
    setNewPrice("");
    setNewCategory("");

    // products refresh
    fetch("http://localhost:5000/products")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
      });

  } catch (error) {
    console.log(error);
    alert("Error adding product");
  }


};

const deleteProduct = async (id) => {
  try {
    const response = await fetch(
      `http://localhost:5000/products/${id}`,
      {
        method: "DELETE",
      }
    );

    const data = await response.json();

    alert(data.message);

    const updatedProducts = products.filter(
      (product) => product.id !== id
    );

    setProducts(updatedProducts);

  } catch (error) {
    console.log(error);
  }
};

const startEdit = (product) => {
  setEditId(product.id);
  setNewName(product.name);
  setNewPrice(product.price);
  setNewCategory(product.category);
};

const handleUpdateProduct = async () => {
  try {
    const response = await fetch(
      `http://localhost:5000/products/${editId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newName,
          price: Number(newPrice),
          category: newCategory,
        }),
      }
    );

    const data = await response.json();

    alert(data.message);

    setEditId(null);
    setNewName("");
    setNewPrice("");
    setNewCategory("");

    window.location.reload();

  } catch (error) {
    console.log(error);
  }
};

const handleAdminLogin = () => {
  if (password === "admin123") {
    setIsAdmin(true);
    alert("Admin Login Successful");
  } else {
    alert("Wrong Password");
  }
};


  return (
    <div>
      <Navbar
        cartCount={cartCount}
        search={search}
        setSearch={setSearch}
      />

      <div className="admin-login">
  {!isAdmin ? (
    <>
      <input
        type="password"
        placeholder="Admin Password"
        value={password}
        onChange={(e) =>
          setPassword(e.target.value)
        }
      />

      <button onClick={handleAdminLogin}>
        Admin Login
      </button>
    </>
  ) : (
    <h3>Admin Mode Active 🔐</h3>
  )}
</div>

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

{isAdmin && (
  <div className="add-product">
    <h2>Add Product</h2>



  <input
    type="text"
    placeholder="Product Name"
    value={newName}
    onChange={(e) => setNewName(e.target.value)}
  />

  <input
    type="number"
    placeholder="Price"
    value={newPrice}
    onChange={(e) => setNewPrice(e.target.value)}
  />

  <input
    type="text"
    placeholder="Category"
    value={newCategory}
    onChange={(e) => setNewCategory(e.target.value)}
  />

{editId ? (
  <button onClick={handleUpdateProduct}>
    Update Product
  </button>
) : (
  <button onClick={handleAddProduct}>
    Add Product
  </button>
)}
</div>
)}

      <h1>Groceries delivered in minutes</h1>

      <div className="main-content">
        <div className="products">
          {filteredProducts.map((product) => (
<ProductCard
  key={product.id}
  product={product}
  addToCart={addToCart}
  deleteProduct={deleteProduct}
  startEdit={startEdit}
  isAdmin={isAdmin}
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;