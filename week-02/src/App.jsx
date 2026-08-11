import { useEffect, useState } from "react";

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const categories = [...new Set(products.map((product) => product.category))];

  const filteredProducts = products.filter((product) => {
    if (selectedCategory === "all") {
      return true;
    }

    return product.category === selectedCategory;
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
    fetch("https://fakestoreapi.com/products")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

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
      </div>
      <p>Selected: {selectedCategory}</p>

      <ul>
        {filteredProducts.map((product) => (
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
