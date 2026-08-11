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

  const categories = [...new Set(products.map((product) => product.category))];

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

  const similarProducts = selectedProduct
    ? products.filter((product) => {
        return (
          product.category === selectedProduct.category &&
          product.id !== selectedProduct.id
        );
      })
    : [];

  useEffect(() => {
    const savedProducts = localStorage.getItem("products");

    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
      setLoading(false);
      return;
    }

    fetch("https://fakestoreapi.com/products")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setProducts(data);
        localStorage.setItem("products", JSON.stringify(data));
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [searchTerm]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Product Recommendation</h1>
      <div>
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

      <ul>
        {sortedProducts.map((product) => (
          <li key={product.id} onClick={() => setSelectedProduct(product)}>
            <h2>{product.title}</h2>
            <p>{product.description}</p>
            <p>${product.price.toFixed(2)}</p>
          </li>
        ))}
      </ul>
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
