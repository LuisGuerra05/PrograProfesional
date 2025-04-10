import React from 'react';
import './Footer.css';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="container">
        <p>© {t('footer-rights')}</p>
        <p>{t('footer-location')}</p>
      </div>
    </footer>
  );
};

export default Footer;
