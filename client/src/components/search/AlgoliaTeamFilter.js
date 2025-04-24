import React from 'react';
import { connectRefinementList } from 'react-instantsearch-dom';
import { Card, Form } from 'react-bootstrap';

const CustomRefinementList = ({ items, refine }) => {
    console.log("🧠 Equipos recibidos por Algolia:", items); // <- debug
    return (
      <Card className="team-filter p-3 mb-4" style={{ border: '1px solid #ccc', borderRadius: '8px' }}>
        <Form.Group>
          <Form.Label style={{ fontWeight: 'bold' }}>Filtro por equipo</Form.Label>
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
  <ConnectedRefinementList attribute={attribute} />
);

export default AlgoliaTeamFilter;
