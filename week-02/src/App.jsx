import { useEffect, useState } from "react";

function App() {
  // =========================
  // Products
  // =========================

  const [products, setProducts] = useState(() => {
    try {
      const savedProducts = localStorage.getItem("products");

      return savedProducts ? JSON.parse(savedProducts) : [];
    } catch {
      return [];
    }
  });

  const [loading, setLoading] = useState(() => {
    return products.length === 0;
  });

  // =========================
  // Filters
  // =========================

  const [selectedCategory, setSelectedCategory] = useState(() => {
    return localStorage.getItem("selectedCategory") || "all";
  });

  const [minPrice, setMinPrice] = useState(() => {
    return localStorage.getItem("minPrice") || "";
  });

  const [maxPrice, setMaxPrice] = useState(() => {
    return localStorage.getItem("maxPrice") || "";
  });

  const [searchTerm, setSearchTerm] = useState(() => {
    return localStorage.getItem("searchTerm") || "";
  });

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(() => {
    return localStorage.getItem("searchTerm") || "";
  });

  const [sortOption, setSortOption] = useState(() => {
    return localStorage.getItem("sortOption") || "default";
  });

  // =========================
  // Selected Product
  // =========================

  const [selectedProductId, setSelectedProductId] = useState(() => {
    const savedId = localStorage.getItem("selectedProductId");

    return savedId ? Number(savedId) : null;
  });

  // =========================
  // Cart
  // =========================

  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem("cart");

      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  // =========================
  // Categories
  // =========================

  const categories = [...new Set(products.map((product) => product.category))];

  // =========================
  // Selected Product
  // =========================

  const selectedProduct = products.find(
    (product) => product.id === selectedProductId,
  );

  // =========================
  // Cart Functions
  // =========================

  const addToCart = (product) => {
    setCart((prevCart) => {
      return [...prevCart, product];
    });
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
  // Filter Products
  // =========================

  const filteredProducts = products.filter((product) => {
    // Category
    if (selectedCategory !== "all" && product.category !== selectedCategory) {
      return false;
    }

    // Min Price
    if (minPrice !== "") {
      if (product.price < parseFloat(minPrice)) {
        return false;
      }
    }

    // Max Price
    if (maxPrice !== "") {
      if (product.price > parseFloat(maxPrice)) {
        return false;
      }
    }

    // Search
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
  // Sort Products
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
  // Similar Products
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
  // Load Products
  // =========================

  useEffect(() => {
    if (products.length > 0) {
      setLoading(false);
      return;
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
        console.error("Error fetching products:", error);
        setLoading(false);
      });
  }, [products.length]);

  // =========================
  // Save Products
  // =========================

  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem("products", JSON.stringify(products));
    }
  }, [products]);

  // =========================
  // Save Cart
  // =========================

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // =========================
  // Save Category
  // =========================

  useEffect(() => {
    localStorage.setItem("selectedCategory", selectedCategory);
  }, [selectedCategory]);

  // =========================
  // Save Min Price
  // =========================

  useEffect(() => {
    localStorage.setItem("minPrice", minPrice);
  }, [minPrice]);

  // =========================
  // Save Max Price
  // =========================

  useEffect(() => {
    localStorage.setItem("maxPrice", maxPrice);
  }, [maxPrice]);

  // =========================
  // Save Search
  // =========================

  useEffect(() => {
    localStorage.setItem("searchTerm", searchTerm);
  }, [searchTerm]);

  // =========================
  // Save Sort
  // =========================

  useEffect(() => {
    localStorage.setItem("sortOption", sortOption);
  }, [sortOption]);

  // =========================
  // Save Selected Product
  // =========================

  useEffect(() => {
    if (selectedProductId !== null) {
      localStorage.setItem("selectedProductId", selectedProductId);
    } else {
      localStorage.removeItem("selectedProductId");
    }
  }, [selectedProductId]);

  // =========================
  // Debounce Search
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

  // =========================
  // JSX
  // =========================

  return (
    <div>
      <h1>Product Recommendation</h1>

      {/* =========================
          Filters
      ========================= */}

      <div>
        <button
          onClick={() => {
            setSelectedCategory("all");
            setSelectedProductId(null);
          }}
        >
          All
        </button>

        {categories.map((category) => (
          <button
            key={category}
            onClick={() => {
              setSelectedCategory(category);
              setSelectedProductId(null);
            }}
          >
            {category}
          </button>
        ))}

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

        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />

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

      {/* =========================
          Cart
      ========================= */}

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

      {/* =========================
          Products
      ========================= */}

      <ul>
        {sortedProducts.map((product) => (
          <li key={product.id} onClick={() => setSelectedProductId(product.id)}>
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

      {/* =========================
          Similar Products
      ========================= */}

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
