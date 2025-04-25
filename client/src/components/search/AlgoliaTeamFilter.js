import React, { useEffect, useState } from 'react';
import { connectRefinementList } from 'react-instantsearch-dom';
import { Card, Form, Button, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

const CustomRefinementList = ({ items, refine, attribute, showHeader }) => {
  const { t } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const teamParam = params.get('team');

    if (teamParam) {
      const decoded = decodeURIComponent(teamParam);
      // Aplicamos solo si el equipo está en los items renderizados
      const found = items.find(item => item.label === decoded);
      if (found && !found.isRefined) {
        refine(found.value);
      }
    }
  }, [items, location.search, refine]);

  return (
    <Form.Group>
      {/* Renderiza el encabezado solo si showHeader es true */}
      {showHeader && (
        <Form.Label style={{ fontWeight: 'bold' }}>{t('Filter by team')}</Form.Label>
      )}
      {items.map(item => (
        <Form.Check
          key={item.label}
          type="checkbox"
          label={`${item.label} (${item.count})`}
          value={item.label}
          checked={item.isRefined}
          onChange={() => refine(item.value)}
          className="mb-1"
        />
      ))}
    </Form.Group>
  );
};

const ConnectedRefinementList = connectRefinementList(CustomRefinementList);

const AlgoliaTeamFilter = ({ attribute }) => {
  const [showModal, setShowModal] = useState(false);
  const { t } = useTranslation();

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  return (
    <>
      {/* Botón para abrir el filtro en modo celular */}
      <Button
        variant="secondary"
        className="d-block d-md-none mb-3"
        onClick={handleShow}
      >
        {t('Filter by team')}
      </Button>

      {/* Filtro en pantalla completa para dispositivos más grandes */}
      <Card className="team-filter p-3 mb-4 d-none d-md-block" style={{ border: '1px solid #ccc', borderRadius: '8px' }}>
        <ConnectedRefinementList
          attribute={attribute}
          limit={100}
          showMore
          showMoreLimit={200}
          searchable
          showHeader={true}
          translations={{
            showMoreButtonText: (isShowingMore) =>
              isShowingMore ? t('Show less') : t('Show more'),
          }}
        />
      </Card>

      {/* Modal para dispositivos móviles */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{t('Filter by team')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ConnectedRefinementList
            attribute={attribute}
            limit={100}
            showMore
            showMoreLimit={200}
            searchable
            showHeader={false}
            translations={{
              showMoreButtonText: (isShowingMore) =>
                isShowingMore ? t('Show less') : t('Show more'),
            }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            {t('Close')}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AlgoliaTeamFilter;
