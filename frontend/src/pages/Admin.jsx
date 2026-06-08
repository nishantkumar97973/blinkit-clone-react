import { useState } from "react";
import { useEffect } from "react";


function Admin() {
  const [password, setPassword] = useState("");
  const [products, setProducts] = useState([]);
  const token = localStorage.getItem("token");
const [newName, setNewName] = useState("");
const [newPrice, setNewPrice] = useState("");
const [newCategory, setNewCategory] = useState("");
const [imageFile, setImageFile] = useState(null);
const [editId, setEditId] = useState(null);
const [searchProduct, setSearchProduct] =
  useState("");
  const [orders, setOrders] = useState([]);

  useEffect(() => {
  if (token) {
    fetch("http://localhost:5000/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }
}, [token]);

useEffect(() => {
  const savedOrders =
    JSON.parse(
      localStorage.getItem("orders")
    ) || [];

  setOrders(savedOrders);
}, []);

  const handleAdminLogin = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/admin/login",
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
        localStorage.setItem("token", data.token);
      window.location.reload();
      } else {
        alert("Invalid Credentials");
      }
    } catch (error) {
      console.log(error);
    }
  };
      const handleAddProduct = async () => {
  const formData = new FormData();

  formData.append("name", newName);
  formData.append("price", newPrice);
  formData.append("category", newCategory);
  formData.append("image", imageFile);

  const response = await fetch(
    "http://localhost:5000/products",
    {
      method: "POST",
      headers: {
        Authorization: token,
      },
      body: formData,
    }
  );

  const data = await response.json();

  alert(data.message);

  window.location.reload();
};

const handleUpdateProduct = async () => {
  const formData = new FormData();

  formData.append("name", newName);
  formData.append("price", newPrice);
  formData.append("category", newCategory);

  if (imageFile) {
    formData.append("image", imageFile);
  }

  const response = await fetch(
    `http://localhost:5000/products/${editId}`,
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

  window.location.reload();
};

const deleteProduct = async (id) => {
  try {
    const response = await fetch(
      `http://localhost:5000/products/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: token,
        },
      }
    );

    const data = await response.json();

    alert(data.message);

    window.location.reload();
  } catch (error) {
    console.log(error);
  }
};
if (token) {
  return (
    <div className = "admin-container">
      <h1>Admin Dashboard</h1>

      <button className = "log-out"
        onClick={() => {
          localStorage.removeItem("token");
          window.location.reload();
        }}
      >
        Logout
      </button>
      <div className="add-product-card">

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






<div className="dashboard-stats">

  <div className="stat-card">
    <h2>{products.length}</h2>
    <p>Total Products</p>
  </div>

  <div className="stat-card">
  <h2>{orders.length}</h2>
  <p>Total Orders</p>
</div>

  <div className="stat-card">
    <h2>₹{
      products.reduce(
        (sum, p) => sum + Number(p.price),
        0
      )
    }</h2>
    <p>Inventory Value</p>
  </div>

  <div className="stat-card">
    <h2>Admin</h2>
    <p>Dashboard Active</p>
  </div>

  <div className="search-box">
  <input
    type="text"
    placeholder="Search Product..."
    value={searchProduct}
    onChange={(e) =>
      setSearchProduct(e.target.value)
    }
  />
</div>

</div>
<div className="admin-products-grid">
  {products
  .filter((product) =>
    product.name
      .toLowerCase()
      .includes(
        searchProduct.toLowerCase()
      )
  )
  .map((product) => (
    <div
      key={product.id}
      className="admin-product-card"
    >
      <img
        src={`http://localhost:5000${product.image}`}
        alt={product.name}
        width="100"
      />

      <h3>{product.name}</h3>

      <p>₹{product.price}</p>

      <p>{product.category}</p>

      <button
        onClick={() => {
          setEditId(product.id);
          setNewName(product.name);
          setNewPrice(product.price);
          setNewCategory(product.category);
        }}
      >
        Edit
      </button>
      

      <button
        onClick={() => deleteProduct(product.id)}
      >
        Delete
      </button>
      
    </div>
  ))}
</div>

</div>
);
}
 


  return (
  <div className="admin-login-container">
    <div className="admin-login-card">
<div className="admin-logo">🛒</div>
      <h1>Admin Login</h1>

      <input
        type="password"
        placeholder="Enter Admin Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="admin-login-input"
      />
      <button
        onClick={handleAdminLogin}
        className="admin-login-btn"
      >
        Login
      </button>
    </div>
  </div>
);
}

export default Admin;