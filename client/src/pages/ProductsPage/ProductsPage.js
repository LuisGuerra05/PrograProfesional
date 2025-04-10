import React, { useState, useEffect } from 'react';
import ProductList from '../../components/product/ProductList';
import { useLocation } from 'react-router-dom';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const location = useLocation();

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(response => response.json())
      .then(data => {
        setProducts(data);
      })
      .catch(error => console.error('Error al cargar los productos:', error));
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const team = queryParams.get('team');

    if (team) {
      const decodedTeam = decodeURIComponent(team).trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const filtered = products.filter(product => {
        if (product.team) {
          const normalizedTeam = product.team.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
          return normalizedTeam.localeCompare(decodedTeam) === 0;
        }
        return false;
      });

      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [location.search, products]);

  return (
    <div className="main-content"> {/* Añadir la clase main-content */}
      <ProductList products={filteredProducts} />
    </div>
  );
};

export default ProductsPage;
