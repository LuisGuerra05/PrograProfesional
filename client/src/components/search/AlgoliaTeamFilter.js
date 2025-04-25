import React, { useEffect } from 'react';
import { connectRefinementList } from 'react-instantsearch-dom';
import { Accordion, Card, Form } from 'react-bootstrap';
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
      const found = items.find((item) => item.label === decoded);
      if (found && !found.isRefined) {
        refine(found.value);
      }
    }
  }, [items, location.search, refine]);

  return (
    <Form.Group>
      {showHeader && (
        <Form.Label style={{ fontWeight: 'bold' }}>{t('Filter by team')}</Form.Label>
      )}
      {items.map((item) => (
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
  const { t } = useTranslation();

  return (
    <>
      {/* Filtro para dispositivos móviles */}
      <Accordion className="d-block d-md-none mb-4">
        <Accordion.Item eventKey="0">
          <Accordion.Header>{t('Filter by team')}</Accordion.Header>
          <Accordion.Body>
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
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      {/* Filtro para dispositivos más grandes */}
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
    </>
  );
};

export default AlgoliaTeamFilter;
