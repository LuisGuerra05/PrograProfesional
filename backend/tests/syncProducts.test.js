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

  test('sube productos reales a Algolia en formato correcto, incluyendo productos sin imagen', async () => {
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
      },
      {
        id: 3,
        name: 'Camiseta Sin Imagen',
        team: 'Inter',
        brand: 'Nike',
        type: 'alternativa',
        price: 95.00,
        image_url: null // cubrir el caso del ternario
      }
    ]]);

    console.log = jest.fn();

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
      },
      {
        objectID: 3,
        name: 'Camiseta Sin Imagen',
        team: 'Inter',
        brand: 'Nike',
        type: 'alternativa',
        price: 95.00,
        image: null
      }
    ]);

    expect(console.log).toHaveBeenCalledWith('Productos subidos a Algolia exitosamente.');
  });

  test('maneja errores si saveObjects falla', async () => {
    db.query.mockResolvedValueOnce([[ 
      {
        id: 4,
        name: 'Camiseta con Error',
        team: 'Chelsea',
        brand: 'Nike',
        type: 'local',
        price: 100.00,
        image_url: '/images/Chelsea/Local/Chelsea_Local.jpg'
      }
    ]]);

    const error = new Error('Falla simulada');
    index.saveObjects.mockRejectedValueOnce(error);

    console.error = jest.fn();

    await syncProductsToAlgolia();

    expect(index.saveObjects).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(
      'Error subiendo productos a Algolia:',
      error
    );
  });
});