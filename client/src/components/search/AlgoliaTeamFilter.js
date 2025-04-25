import React, { useEffect } from 'react';
import { connectRefinementList } from 'react-instantsearch-dom';
import { Card, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

const CustomRefinementList = ({ items, refine, attribute }) => {
  const { t } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const teamParam = params.get('team');

    if (teamParam) {
      const decoded = decodeURIComponent(teamParam);
      // 🔥 Aplicamos solo si el equipo está en los items renderizados
      const found = items.find(item => item.label === decoded);
      if (found && !found.isRefined) {
        refine(found.value);
      }
    }
  }, [items, location.search, refine]);

  return (
    <Card className="team-filter p-3 mb-4" style={{ border: '1px solid #ccc', borderRadius: '8px' }}>
      <Form.Group>
        <Form.Label style={{ fontWeight: 'bold' }}>{t('Filter by team')}</Form.Label>
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
    limit={100}
    showMore
    showMoreLimit={200}
    searchable
    translations={{
      showMoreButtonText: (isShowingMore) =>
        isShowingMore ? 'Mostrar menos' : 'Mostrar más',
    }}
  />
);

export default AlgoliaTeamFilter;
