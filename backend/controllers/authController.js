const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models/db');

// Cargar la pimienta desde una variable de entorno
const PEPPER = process.env.PEPPER;
const SALT_ROUNDS = 10; 

// Registro de usuario
const register = async (req, res) => {
  const { name, email, password, address } = req.body;

  // Primero verificamos si el correo ya está registrado
  const checkEmailQuery = 'SELECT * FROM users WHERE email = ?';
  db.query(checkEmailQuery, [email], async (err, results) => {
    if (err) {
      console.error('Error verificando el email:', err);
      return res.status(500).json({ message: 'Error en el servidor' });
    }

    if (results.length > 0) {
      return res.status(400).json({ message: 'Este correo electrónico ya está registrado.' });
    }

    // Ahora validamos los demás campos
    if (!name || !email || !password || !address) {
      return res.status(400).json({ message: 'Por favor, completa todos los campos' });
    }

    try {
      const passwordWithPepper = password + PEPPER;
      const hashedPassword = await bcrypt.hash(passwordWithPepper, SALT_ROUNDS);

      // Insertar el nuevo usuario, incluyendo la dirección
      const sql = 'INSERT INTO users (username, email, password, address) VALUES (?, ?, ?, ?)';
      db.query(sql, [name, email, hashedPassword, address], (err, result) => {
        if (err) {
          console.error('Error insertando usuario:', err);
          return res.status(500).json({ message: 'Error en el servidor al insertar el usuario' });
        }

        // Generar el token JWT
        const token = jwt.sign(
          { id: result.insertId, username: name },
          process.env.JWT_SECRET,
          { expiresIn: '1h' }
        );

        res.status(201).json({
          message: `¡Bienvenido, ${name}!`,
          token: token,
          username: name,
        });
      });
    } catch (err) {
      console.error('Error cifrando la contraseña:', err);
      res.status(500).json({ message: 'Error al cifrar la contraseña' });
    }
  });
};



// Login de usuario
const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Por favor, ingresa todos los campos' });
  }

  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email], async (err, results) => {
    if (err) {
      console.error('Error buscando usuario:', err);
      return res.status(500).json({ message: 'Error en el servidor' });
    }

    if (results.length === 0) {
      return res.status(400).json({ message: 'Email o contraseña incorrectos' });
    }

    const user = results[0];

    // Verificar la contraseña usando bcrypt
    try {
      const passwordWithPepper = password + PEPPER;
      const validPassword = await bcrypt.compare(passwordWithPepper, user.password);
      if (!validPassword) {
        return res.status(400).json({ message: 'Email o contraseña incorrectos' });
      }

      // Generar el token JWT
      const token = jwt.sign(
        { id: user.id, email: user.email, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.status(200).json({
        token,
        username: user.username,
        email: user.email,
        address: user.address,
        message: 'Inicio de sesión exitoso'
      });
    } catch (err) {
      console.error('Error verificando la contraseña:', err);
      return res.status(500).json({ message: 'Error en el servidor al verificar la contraseña' });
    }
  });
};


// Actualizar la dirección del usuario
const updateAddress = (req, res) => {
  const { address } = req.body;
  const userId = req.user.id;  // Extraer el id del usuario del token

  if (!address) {
    return res.status(400).json({ message: 'Address is required' });
  }

  const sql = 'UPDATE users SET address = ? WHERE id = ?';
  db.query(sql, [address, userId], (err, result) => {
    if (err) {
      console.error('Error updating address:', err);
      return res.status(500).json({ message: 'Error updating the address' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Address updated successfully' });
  });
};

module.exports = { register, login, updateAddress};
