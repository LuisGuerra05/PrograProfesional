// userController.js
const db = require('../models/db');

// Obtener todos los usuarios
const getAllUsers = (req, res) => {
  const sql = 'SELECT * FROM users';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error obteniendo usuarios:', err);
      return res.status(500).json({ message: 'Error en el servidor' });
    }
    res.status(200).json(results); // Devolver la lista de usuarios
  });
};

// Eliminar un usuario por ID
const deleteUser = (req, res) => {
  const userId = req.params.id;

  const sql = 'DELETE FROM users WHERE id = ?';
  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error('Error eliminando usuario:', err);
      return res.status(500).json({ message: 'Error en el servidor' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json({ message: `Usuario con ID ${userId} ha sido eliminado` });
  });
};

module.exports = {
  getAllUsers,
  deleteUser,
};
