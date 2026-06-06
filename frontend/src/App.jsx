import { useState, useEffect } from "react";

import { Link } from "react-router-dom";

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

const [imageFile, setImageFile] =
  useState(null);

  useEffect(() => {
 fetch("https://blinkit-clone-react-1.onrender.com/products")
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

  const handleAddProduct = async () => {
  if (!newName || !newPrice || !newCategory) {
    alert("Please fill all fields");
    return;
  }

  try {
    const formData = new FormData();
      formData.append("name", newName);
    formData.append("price", newPrice);
    formData.append("category", newCategory);
    formData.append("image", imageFile);


  const token = localStorage.getItem("token");
  const response = await fetch(
      "https://blinkit-clone-react-1.onrender.com/products",
      {
        method: "POST",
        headers:{
          Authorization: token,
        },
        body: formData,
      }
    );
    

    const data = await response.json();

    alert(data.message);

    setNewName("");
    setNewPrice("");
    setNewCategory("");
    setImageFile(null);

    // products refresh
    fetch("https://blinkit-clone-react-1.onrender.com/products")
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
    const token = localStorage.getItem("token");
    const response = await fetch(
      `https://blinkit-clone-react-1.onrender.com/products/${id}`,
      {
        method: "DELETE",
        headers:{
          Authorization: token,
        },
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
    const token = localStorage.getItem("token");

    const formData = new FormData();

    formData.append("name", newName);
    formData.append("price", newPrice);
    formData.append("category", newCategory);

    if (imageFile) {
      formData.append("image", imageFile);
    }

    const response = await fetch(
      `https://blinkit-clone-react-1.onrender.com/products/${editId}`,
      {
        method: "PUT",
        headers: {
          Authorization: token,
        },
        body: formData,
      }
    );

    const data = await response.json();

    alert(data.message);

    setEditId(null);
    setNewName("");
    setNewPrice("");
    setNewCategory("");
    setImageFile(null);

    window.location.reload();

  } catch (error) {
    console.log(error);
    alert("Error updating product");
  }
};

const handleAdminLogin = async () => {
  try {
    const response = await fetch(
      "https://blinkit-clone-react-1.onrender.com/admin/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "nishant",
          password: password,
        }),
      }
    );

    const data = await response.json();

    if (data.success) {
      localStorage.setItem(
        "token",
        data.token
      );
      setIsAdmin(true);
      alert("Login Successful");
    } else {
      alert("Invalid Credentials");
    }
  } catch (error) {
    console.log(error);
    alert("Server Error");
  }
};


  return (
    <div>
      <Navbar
        cartCount={cartCount}
        search={search}
        setSearch={setSearch}
      />

     
{isAdmin && (
<div className="admin-stats">
  <div className="stat-card">
    <h3>{products.length}</h3>
    <p>Total Products</p>
  </div>


  <div className="stat-card">
    <h3>₹{
      products.reduce(
        (sum, p) => sum + Number(p.price),
        0
      )
    }</h3>
    <p>Inventory Value</p>
  </div>
</div>
)}

//       <div className="admin-login">
//   {!isAdmin ? (
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
    <div className="admin-badge">
      🔐 Admin Dashboard
    </div>
  )}

   {isAdmin && (
  <button
    onClick={() => {
      localStorage.removeItem("token");
      setIsAdmin(false);
    }}
    className="logout-btn"
  >
    Logout
  </button>
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

  <input
  type="file"
  onChange={(e) =>
    setImageFile(e.target.files[0])
  }
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