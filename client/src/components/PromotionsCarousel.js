import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import { useTranslation } from 'react-i18next';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Import the carousel styles
import './PromotionsCarousel.css'; // Optional CSS file for custom styles

function PromotionsCarousel() {
  const { t } = useTranslation(); // Hook para la traducción

  return (
    <Carousel
      showArrows={true}
      autoPlay={true}
      infiniteLoop={true}
      showThumbs={false}
      interval={3000}
      stopOnHover={true}
    >
      <div>
        <img src="/images/Barca/Local/Barca_Local_24_3.jpg" alt={t('Promotion 1')} />
        <p className="legend">{t('Limited time only! 20% off on official FC Barcelona jerseys. Don\'t miss out!')}</p>
      </div>
      <div>
        <img src="/images/Madrid/Madrid_Promocion.jpg" alt={t('Promotion 2')} />
        <p className="legend">{t('2x1 offer on Real Madrid jerseys! Gear up and share with your friends. Valid while supplies last.')}</p>
      </div>
      <div>
        <img src="/images/Atletico/Local/Atletico_Local_24_3.jpg" alt={t('Promotion 3')} />
        <p className="legend">{t('Exclusive for members! Get a 15% discount on the new Atlético de Madrid jersey. Join the red and white passion!')}</p>
      </div>
    </Carousel>
  );
}

export default PromotionsCarousel;
