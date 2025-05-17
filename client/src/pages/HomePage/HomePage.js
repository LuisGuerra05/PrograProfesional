// frontend/pages/HomePage.js

import React from 'react';
import './HomePage.css';
import PromotionsCarousel from '../../components/carousel/PromotionsCarousel';
import { useTranslation } from 'react-i18next';
import { teams } from '../../utils/imageHelpers';
import { Row, Col } from 'react-bootstrap';

function HomePage() {
  const { t } = useTranslation();

  return (
    <div className="homepage">
      <PromotionsCarousel />
      <h2 className="homepage-title">{t('title')}</h2>
      <p className="homepage-subtitle">{t('subtitle')}</p>

      <section className="home-content">
        <Row className="justify-content-center gx-4 gy-4 px-4">
          {teams.map((team, index) => (
            <Col
              key={index}
              xs={5} sm={4} md={3} lg={2}
              className="d-flex flex-column align-items-center"
              onClick={() =>
                window.location.href = `/products?team=${encodeURIComponent(team.name)}`
              }
            >
              <img src={team.logo} alt={`${team.name} Escudo`} className="team-logo" />
              <p className="text-center">{team.name}</p>
            </Col>
          ))}
        </Row>
      </section>
    </div>
  );
}

export default HomePage;
