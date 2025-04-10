import React, { useState, useEffect } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Estilos básicos del carrusel
import './ProductCarousel.css'; // Estilos específicos para el carrusel de productos
import { CLOUDINARY_BASE_URL } from '../../utils/config';

const ProductCarousel = ({ productId }) => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/products/${productId}/images`);
        const data = await response.json();

        if (Array.isArray(data)) {
          setImages(data);
        } else {
          setImages([]);
        }
      } catch (error) {
        console.error('Error al obtener las imágenes:', error);
        setImages([]);
      }
    };
    fetchImages();
  }, [productId]);

  if (images.length === 0) {
    return <p>No hay imágenes disponibles</p>;
  }

  return (
    <div className="product-carousel-container">
      <Carousel className="product-carousel">
        {images.map((image, index) => (
          <div key={index} className="product-carousel-slide">
            <img src={`${CLOUDINARY_BASE_URL}/${image.image_url}`}
             alt={`Imagen ${index + 1}`} className="product-carousel-image" />
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default ProductCarousel;
