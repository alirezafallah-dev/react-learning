import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("default");

  const [filtersLoaded, setFiltersLoaded] = useState(false);

  const categories = [...new Set(products.map((product) => product.category))];

  const [cartOpen, setCartOpen] = useState(false);

  const resetFilters = () => {
    setSelectedCategory("all");
    setSelectedProduct(null);
    setMinPrice("");
    setMaxPrice("");
    setSearchTerm("");
    setDebouncedSearchTerm("");
    setSortOption("default");
  };

  // =========================
  // Cart
  // =========================

  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem("cart");

      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Failed to load cart:", error);
      return [];
    }
  });

  const addToCart = (product) => {
    setCart((prevCart) => [...prevCart, product]);
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => {
      const index = prevCart.findIndex((product) => product.id === productId);

      if (index === -1) {
        return prevCart;
      }

      return prevCart.filter((_, i) => i !== index);
    });
  };

  // =========================
  // Filter products
  // =========================

  const filteredProducts = products.filter((product) => {
    if (selectedCategory !== "all" && product.category !== selectedCategory) {
      return false;
    }

    if (minPrice !== "") {
      if (product.price < parseFloat(minPrice)) {
        return false;
      }
    }

    if (maxPrice !== "") {
      if (product.price > parseFloat(maxPrice)) {
        return false;
      }
    }

    if (debouncedSearchTerm !== "") {
      if (
        !product.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      ) {
        return false;
      }
    }

    return true;
  });

  // =========================
  // Sort products
  // =========================

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === "price-asc") {
      return a.price - b.price;
    }

    if (sortOption === "price-desc") {
      return b.price - a.price;
    }

    if (sortOption === "name-asc") {
      return a.title.localeCompare(b.title);
    }

    return 0;
  });

  // =========================
  // Similar products
  // =========================

  const similarProducts = selectedProduct
    ? products.filter((product) => {
        return (
          product.category === selectedProduct.category &&
          product.id !== selectedProduct.id
        );
      })
    : [];

  // =========================
  // Load products
  // =========================

  useEffect(() => {
    const savedProducts = localStorage.getItem("products");

    if (savedProducts) {
      try {
        setProducts(JSON.parse(savedProducts));
        setLoading(false);
        return;
      } catch (error) {
        console.error("Failed to load products:", error);
        localStorage.removeItem("products");
      }
    }

    fetch("https://fakestoreapi.com/products")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        return response.json();
      })
      .then((data) => {
        setProducts(data);
        localStorage.setItem("products", JSON.stringify(data));
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  // =========================
  // Load filters
  // =========================

  useEffect(() => {
    try {
      const savedFilters = localStorage.getItem("filters");

      if (savedFilters) {
        const filters = JSON.parse(savedFilters);

        setSelectedCategory(filters.selectedCategory ?? "all");
        setMinPrice(filters.minPrice ?? "");
        setMaxPrice(filters.maxPrice ?? "");
        setSearchTerm(filters.searchTerm ?? "");
        setSortOption(filters.sortOption ?? "default");

        setDebouncedSearchTerm(filters.searchTerm ?? "");
      }
    } catch (error) {
      console.error("Failed to load filters:", error);
    }

    setFiltersLoaded(true);
  }, []);

  // =========================
  // Save cart
  // =========================

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // =========================
  // Save filters
  // =========================

  useEffect(() => {
    if (!filtersLoaded) {
      return;
    }

    localStorage.setItem(
      "filters",
      JSON.stringify({
        selectedCategory,
        minPrice,
        maxPrice,
        searchTerm,
        sortOption,
      }),
    );
  }, [
    filtersLoaded,
    selectedCategory,
    minPrice,
    maxPrice,
    searchTerm,
    sortOption,
  ]);

  // =========================
  // Debounce search
  // =========================

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [searchTerm]);

  // =========================
  // Loading
  // =========================

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="app">
      {/* Hero */}
      <header className="hero">
        <div className="container">
          <h1>Product Recommendation</h1>

          <p>Js & React Traning Page - Daneshkar</p>
        </div>
      </header>

      {/* Floating Cart */}

      <button className="cart-toggle" onClick={() => setCartOpen(!cartOpen)}>
        <span>Cart</span>
        <span className="cart-toggle-count">{cart.length}</span>
      </button>

      {cartOpen && (
        <div className="cart-overlay" onClick={() => setCartOpen(false)} />
      )}

      <aside className={cartOpen ? "cart-panel open" : "cart-panel"}>
        <div className="cart-panel-header">
          <div>
            <span className="section-label">YOUR CART</span>
            <h2>Shopping Cart</h2>
          </div>

          <button className="cart-close" onClick={() => setCartOpen(false)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-x-lg"
              viewBox="0 0 16 16"
            >
              <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
            </svg>
          </button>
        </div>

        <div className="cart-panel-content">
          {cart.length === 0 ? (
            <div className="empty-state">
              <h3>Your cart is empty</h3>
              <p>Add some products to get started.</p>
            </div>
          ) : (
            <div className="cart-list">
              {cart.map((product, index) => (
                <div className="cart-item" key={`${product.id}-${index}`}>
                  <div className="cart-item-info">
                    <h3>{product.title}</h3>

                    <span>${product.price.toFixed(2)}</span>
                  </div>

                  <button
                    className="remove-btn"
                    onClick={() => removeFromCart(product.id)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>

      <main className="main-content container">
        {/* Filters */}
        <section className="filters-section">
          <div className="section-header">
            <div>
              <span className="section-label">FILTERS</span>
            </div>

            <span className="result-count">
              {sortedProducts.length} products
            </span>
          </div>

          {/* Categories */}
          <div className="category-list">
            <button
              className={
                selectedCategory === "all"
                  ? "category-btn active"
                  : "category-btn"
              }
              onClick={() => {
                setSelectedCategory("all");
                setSelectedProduct(null);
              }}
            >
              All
            </button>

            {categories.map((category) => (
              <button
                className={
                  selectedCategory === category
                    ? "category-btn active"
                    : "category-btn"
                }
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setSelectedProduct(null);
                }}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Search / Price / Sort */}
          <div className="filter-grid">
            <div className="search-field">
              <label>Search</label>

              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>

            <div className="price-fields">
              <div>
                <label>Min Price</label>

                <input
                  type="number"
                  placeholder="$10"
                  value={minPrice}
                  onChange={(event) => setMinPrice(event.target.value)}
                />
              </div>

              <div>
                <label>Max Price</label>

                <input
                  type="number"
                  placeholder="$50"
                  value={maxPrice}
                  onChange={(event) => setMaxPrice(event.target.value)}
                />
              </div>
            </div>

            <div className="sort-field">
              <label>Sort by</label>

              <select
                value={sortOption}
                onChange={(event) => setSortOption(event.target.value)}
              >
                <option value="default">Default</option>
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
                <option value="name-asc">Name: A → Z</option>
              </select>
            </div>

            <button className="reset-filters-btn" onClick={resetFilters}>
              Reset Filters
            </button>
          </div>
        </section>

        {/* Products + Cart */}
        <div className="products-cart-layout">
          {/* Products */}
          <section className="products-section">
            <div className="section-header">
              <div>
                <span className="section-label">PRODUCTS</span>
              </div>

              <span className="selected-category">{selectedCategory}</span>
            </div>

            {sortedProducts.length === 0 ? (
              <div className="empty-state">
                <h3>No products found</h3>
                <p>Try changing your filters or search term.</p>
              </div>
            ) : (
              <div className="products-grid">
                {sortedProducts.map((product) => (
                  <article
                    className={
                      selectedProduct?.id === product.id
                        ? "product-card selected"
                        : "product-card"
                    }
                    key={product.id}
                    onClick={() => setSelectedProduct(product)}
                  >
                    <div className="product-content">
                      <span className="product-category">
                        {product.category}
                      </span>

                      <h3>{product.title}</h3>

                      <p>{product.description}</p>

                      <div className="product-footer">
                        <strong>${product.price.toFixed(2)}</strong>

                        <button
                          className="add-btn"
                          onClick={(event) => {
                            event.stopPropagation();
                            addToCart(product);
                          }}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Similar Products */}
        {selectedProduct && (
          <section className="similar-section">
            <div className="section-header">
              <div>
                <span className="section-label">YOU MAY ALSO LIKE</span>

                <h2>Similar Products</h2>
              </div>
            </div>

            <div className="similar-grid">
              {similarProducts.map((product) => (
                <article className="similar-card" key={product.id}>
                  <div>
                    <span>{product.category}</span>

                    <h3>{product.title}</h3>

                    <strong>${product.price.toFixed(2)}</strong>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
