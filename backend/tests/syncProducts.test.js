const index = require('../algolia/algoliaClient');
const db = require('../models/db.promise');
const syncProductsToAlgolia = require('../algolia/syncProducts');

jest.mock('../algolia/algoliaClient', () => ({
  saveObjects: jest.fn(),
}));

jest.mock('../models/db.promise');

describe('syncProductsToAlgolia', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('sube productos reales a Algolia en formato correcto', async () => {
    db.query.mockResolvedValueOnce([[
      {
        id: 1,
        name: 'Camiseta Local 2024-2025',
        team: 'FC Barcelona',
        brand: 'Nike',
        type: 'local',
        price: 119.99,
        image_url: '/images/Barca/Local/Barca_Local_24_1.jpg'
      },
      {
        id: 2,
        name: 'Camiseta Visita 2024-2025',
        team: 'Real Madrid',
        brand: 'Adidas',
        type: 'visita',
        price: 117.99,
        image_url: '/images/Madrid/Visita/Madrid_Visita_24_1.jpg'
      }
    ]]);

    await syncProductsToAlgolia();

    expect(index.saveObjects).toHaveBeenCalledWith([
      {
        objectID: 1,
        name: 'Camiseta Local 2024-2025',
        team: 'FC Barcelona',
        brand: 'Nike',
        type: 'local',
        price: 119.99,
        image: 'https://res.cloudinary.com/ds0zs3wub/image/upload//images/Barca/Local/Barca_Local_24_1.jpg'
      },
      {
        objectID: 2,
        name: 'Camiseta Visita 2024-2025',
        team: 'Real Madrid',
        brand: 'Adidas',
        type: 'visita',
        price: 117.99,
        image: 'https://res.cloudinary.com/ds0zs3wub/image/upload//images/Madrid/Visita/Madrid_Visita_24_1.jpg'
      }
    ]);
  });
});
