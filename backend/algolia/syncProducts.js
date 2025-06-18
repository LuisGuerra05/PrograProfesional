const index = require('./algoliaClient');
const db = require('../models/db.promise'); 

const CLOUDINARY_BASE_URL = 'https://res.cloudinary.com/ds0zs3wub/image/upload';

async function syncProductsToAlgolia() {
  try {
    // Obtener productos con la primera imagen asociada
    const [rows] = await db.query(`
      SELECT 
        p.id, 
        p.name, 
        p.team, 
        p.brand, 
        p.type, 
        p.price,
        (SELECT image_url FROM product_images WHERE product_id = p.id LIMIT 1) AS image_url
      FROM products p
    `);

    // Formatear para Algolia
    const formattedProducts = rows.map(p => ({
      objectID: p.id,
      name: p.name,
      team: p.team,
      brand: p.brand,
      type: p.type,
      price: p.price,
      image: p.image_url ? `${CLOUDINARY_BASE_URL}/${p.image_url}` : null,
    }));

    // Subir a Algolia
    await index.saveObjects(formattedProducts);
    console.log('Productos subidos a Algolia exitosamente.');
  } catch (err) {
    console.error('Error subiendo productos a Algolia:', err);
  }
}

// Ejecutar solo si se corre directamente con `node syncProducts.js`
/*istanbul ignore next */
if (require.main === module) {
  syncProductsToAlgolia();
}

// Exportar para Jest u otros usos
module.exports = syncProductsToAlgolia;

