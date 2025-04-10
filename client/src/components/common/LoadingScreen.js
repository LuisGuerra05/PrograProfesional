// src/components/common/LoadingScreen.js
import React from 'react';
import './LoadingScreen.css';
import { useTranslation } from 'react-i18next';

const LoadingScreen = () => {
  const { t } = useTranslation();

  return (
    <div className="loading-overlay">
      <div className="spinner"></div>
      <p>{t('loading-message')}</p>
    </div>
  );
};

export default LoadingScreen;