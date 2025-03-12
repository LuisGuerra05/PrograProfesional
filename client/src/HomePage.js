import React from 'react';
import './HomePage.css';
import PromotionsCarousel from './components/PromotionsCarousel';
import { useTranslation } from 'react-i18next';

const teams = [
  { name: 'FC Barcelona', logo: '/images/Barca/Barca_Escudo.png' },
  { name: 'Real Madrid', logo: '/images/Madrid/Madrid_Escudo.png' },
  { name: 'Atlético de Madrid', logo: '/images/Atletico/Atletico_Escudo.png' },
  { name: 'Athletic Club', logo: '/images/Bilbao/Bilbao_Escudo.png' },
  { name: 'Celta de Vigo', logo: '/images/Calta/Celta_Escudo.png' },
  { name: 'Deportivo Alavés', logo: '/images/Alaves/Alaves_Escudo.png' },
  { name: 'Espanyol', logo: '/images/Espanyol/Espanyol_Escudo.png' },
  { name: 'Getafe', logo: '/images/Getafe/Getafe_Escudo.png' },
  { name: 'Girona', logo: '/images/Girona/Girona_Escudo.png' },
  { name: 'Leganés', logo: '/images/Leganes/Leganes_Escudo.png' },
  { name: 'Osasuna', logo: '/images/Osasuna/Osasuna_Escudo.png' },
  { name: 'RCD Mallorca', logo: '/images/Mallorca/Mallorca_Escudo.png' },
  { name: 'Rayo Vallecano', logo: '/images/Rayo/Rayo_Escudo.png' },
  { name: 'Real Betis', logo: '/images/Betis/Betis_Escudo.png' },
  { name: 'Real Sociedad', logo: '/images/Sociedad/Sociedad_Escudo.png' },
  { name: 'Sevilla FC', logo: '/images/Sevilla/Sevilla_Escudo.png' },
  { name: 'U.D. Las Palmas', logo: '/images/Palmas/Palmas_Escudo.png' },
  { name: 'Valencia', logo: '/images/Valencia/Valencia_Escudo.png' },
  { name: 'Valladolid', logo: '/images/Valladolid/Valladolid_Escudo.png' },
  { name: 'Villarreal', logo: '/images/Villarreal/Villarreal_Escudo.png' }
];

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