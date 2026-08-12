import { useEffect, useState } from "react";

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
    <div>
      <h1>Product Recommendation</h1>

      <div>
        {/* Categories */}

        <button
          onClick={() => {
            setSelectedCategory("all");
            setSelectedProduct(null);
          }}
        >
          All
        </button>

        {categories.map((category) => (
          <button
            key={category}
            onClick={() => {
              setSelectedCategory(category);
              setSelectedProduct(null);
            }}
          >
            {category}
          </button>
        ))}

        {/* Price filters */}

        <div>
          <input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={(event) => setMinPrice(event.target.value)}
          />

          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(event) => setMaxPrice(event.target.value)}
          />
        </div>

        {/* Search */}

        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />

        {/* Sort */}

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

      <p>Selected: {selectedCategory}</p>

      {/* Cart */}

      <div>
        <h2>Cart ({cart.length})</h2>

        <ul>
          {cart.map((product, index) => (
            <li key={`${product.id}-${index}`}>
              <h3>{product.title}</h3>

              <p>${product.price.toFixed(2)}</p>

              <button onClick={() => removeFromCart(product.id)}>Remove</button>
            </li>
          ))}
        </ul>
      </div>

      {/* Products */}

      <ul>
        {sortedProducts.map((product) => (
          <li key={product.id} onClick={() => setSelectedProduct(product)}>
            <h2>{product.title}</h2>

            <p>{product.description}</p>

            <p>${product.price.toFixed(2)}</p>

            <button
              onClick={(event) => {
                event.stopPropagation();
                addToCart(product);
              }}
            >
              Add to Cart
            </button>
          </li>
        ))}
      </ul>

      {/* Similar products */}

      {selectedProduct && (
        <div>
          <h2>Similar Products</h2>

          <ul>
            {similarProducts.map((product) => (
              <li key={product.id}>
                <h3>{product.title}</h3>

                <p>{product.description}</p>

                <p>${product.price.toFixed(2)}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
