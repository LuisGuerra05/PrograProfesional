import React from 'react';
import './HomePage.css';
import PromotionsCarousel from '../../components/carousel/PromotionsCarousel';
import { useTranslation } from 'react-i18next';
import { teams } from '../../utils/imageHelpers';

function HomePage() {
  const { t } = useTranslation();

  return (
    <div className="homepage">
      <PromotionsCarousel />
      <h2 className="homepage-title">{t('title')}</h2>
      <p className="homepage-subtitle">{t('subtitle')}</p>
      <section className="home-content">
        <div className="grid-container">
          {teams.map((team, index) => (
            <div
              key={index}
              className="grid-item"
              onClick={() => window.location.href = `/products?team=${encodeURIComponent(team.name)}`}
            >
              <img src={team.logo} alt={`${team.name} Escudo`} className="team-logo" />
              <p>{team.name}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default HomePage;