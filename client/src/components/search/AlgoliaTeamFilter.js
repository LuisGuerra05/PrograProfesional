import React, { useEffect } from 'react';
import { connectRefinementList } from 'react-instantsearch-dom';
import { Card, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const CustomRefinementList = ({ items, refine }) => {
  const { t } = useTranslation();

  useEffect(() => {
    console.log("🧠 Equipos recibidos por Algolia:", items);
  }, [items]);

  return (
    <Card className="team-filter p-3 mb-4" style={{ border: '1px solid #ccc', borderRadius: '8px' }}>
      <Form.Group>
        <Form.Label style={{ fontWeight: 'bold' }}>{t('Filter by team')}</Form.Label>
        {items.length === 0 && <p>{t('no-options')}</p>}
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
    </Card>
  );
};

const ConnectedRefinementList = connectRefinementList(CustomRefinementList);

const AlgoliaTeamFilter = ({ attribute }) => (
  <ConnectedRefinementList
    attribute={attribute}
    limit={100}         // ✅ traer hasta 100 equipos
    showMore={true}      // ✅ permitir \"Mostrar más\"
    showMoreLimit={200}  // ✅ hasta 200 equipos
    searchable={true}    // ✅ opcional: habilita búsqueda dentro del filtro
    translations={{
      showMoreButtonText: (isShowingMore) =>
        isShowingMore ? 'Mostrar menos' : 'Mostrar más',
    }}
  />
);

export default AlgoliaTeamFilter;
