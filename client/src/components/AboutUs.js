// src/AboutUs.js
import React from 'react';
import './AboutUs.css';
import { useTranslation } from 'react-i18next';
import { CLOUDINARY_BASE_URL } from '../utils/config';

function AboutUs() {
  const { t } = useTranslation();
  return (
    <div className="about-us-container">
      <h1>{t('About Us')}</h1>
      <p>
      {t('ms1-about-us')}
      </p>
      <div className="features-container">
        <div className="feature-card">
          <img src={`${CLOUDINARY_BASE_URL}/images/UI/feature1.png`} alt="Calidad Garantizada" />
          <h3>{t('sub1-about-us')}</h3>
          <p>{t('sub1-p-about-us')}</p>
        </div>
        <div className="feature-card">
          <img src={`${CLOUDINARY_BASE_URL}/images/UI/feature2.jpg`} alt="Pasión por el Fútbol" />
          <h3>{t('sub2-about-us')}</h3>
          <p>{t('sub2-p-about-us')}</p>
        </div>
        <div className="feature-card">
          <img src={`${CLOUDINARY_BASE_URL}/images/UI/feature3.png`} alt="Envíos a Todo el Mundo" />
          <h3>{t('sub3-about-us')}</h3>
          <p>{t('sub3-p-about-us')}</p>
        </div>
        <div className="feature-card">
          <img src={`${CLOUDINARY_BASE_URL}/images/UI/feature4.png`} alt="Atención al Cliente" />
          <h3>{t('sub4-about-us')}</h3>
          <p>{t('sub4-p-about-us')}</p>
        </div>
      </div>
      <div className="mission-section">
        <h2>{t('sub-mission-about-us')}</h2>
        <p>{t('p-mission-about-us')}</p>
      </div>
    </div>
  );
}

export default AboutUs;
