require('dotenv').config(); // Cargar las variables de entorno
const express = require('express');
const cors = require('cors'); // Habilitar CORS
const path = require('path'); // Módulo para manejar rutas de archivo
const db = require('./models/db'); // Conexión a la base de datos
const authRoutes = require('./routes/authRoutes'); // Importar las rutas de autenticación
const productRoutes = require('./routes/productRoutes'); // Importar las rutas de productos
const cartRoutes = require('./routes/cartRoutes'); // Importar las rutas del carrito de compras
const reviewRoutes = require('./routes/reviewRoutes'); // Importar las rutas de las reseñas
const userRoutes = require('./routes/userRoutes'); // Importar las rutas de los usuarios

const app = express();

// Middleware
app.use(express.json()); // Parsear JSON en las solicitudes
app.use(cors()); // Habilitar CORS para permitir solicitudes del frontend

// Configurar el middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.use('/api', userRoutes); // Usar las rutas de usuarios bajo /api/users
app.use('/api/auth', authRoutes); // Usar las rutas de autenticación bajo /api/auth
app.use('/api', productRoutes); // Usar las rutas de productos bajo /api/products
app.use('/api/cart', cartRoutes); // Usar las rutas de carrito de compras /api/cart
app.use('/api/reviews', reviewRoutes); // Usar las rutas de las reseñas /api/reviews


const PORT = process.env.PORT || 5000;
const baseUrl = process.env.NODE_ENV === 'production' 
  ? `https://${process.env.WEBSITE_HOSTNAME}` // Azure pone automáticamente esta variable
  : `http://localhost:${PORT}`;

// Ruta de prueba para verificar si el servidor está funcionando
app.get('/', (req, res) => {
  res.send(`API funcionando correctamente en: ${baseUrl}`);
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en: ${baseUrl}`);
});



