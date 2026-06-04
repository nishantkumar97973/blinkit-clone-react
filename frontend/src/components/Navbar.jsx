function Navbar({ cartCount, search, setSearch }) {
  return (
    <nav>
      <h2>Blinkit</h2>

      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <button>Cart ({cartCount})</button>
    </nav>
  );
}

export default Navbar;