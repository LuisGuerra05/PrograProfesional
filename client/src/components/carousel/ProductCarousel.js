import React, { useState, useEffect } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './ProductCarousel.css';
import { CLOUDINARY_BASE_URL, API_URL } from '../../utils/config';

const ProductCarousel = ({ productId, onImagesLoaded }) => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(`${API_URL}/api/products/${productId}/images`);
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

  const handleFirstImageLoad = () => {
    if (onImagesLoaded) {
      onImagesLoaded();
    }
  };

  return (
    <div className="product-carousel-container">
      <Carousel className="product-carousel">
        {images.map((image, index) => (
          <div key={index} className="product-carousel-slide">
            <img
              src={`${CLOUDINARY_BASE_URL}/${image.image_url}`}
              alt={`Imagen ${index + 1}`}
              className="product-carousel-image"
              onLoad={index === 0 ? handleFirstImageLoad : undefined} 
              onError={index === 0 ? handleFirstImageLoad : undefined}
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default ProductCarousel;
