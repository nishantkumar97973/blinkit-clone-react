function Navbar({ cartCount, search, setSearch }) {
    const user = JSON.parse(localStorage.getItem("user"));
  return (
    <nav>
      <h2>Blinkit</h2>

      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
  {user && (
  <div className="user-info">
    👤 {user?.name}
  </div>
)}

      <button className = "cart-btn">Cart ({cartCount})</button>
{user && (
  <button className = "logout-btn"
    onClick={() => {
      localStorage.removeItem("user");
      localStorage.removeItem("userToken");
      window.location.reload();
    }}
  >
    Logout
  </button>
)}
    </nav>
  );
}

export default Navbar;