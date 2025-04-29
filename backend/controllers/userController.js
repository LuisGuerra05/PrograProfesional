const db = require('../models/db.promise');

// Obtener todos los usuarios
const getAllUsers = async (req, res) => {
  try {
    const [users] = await db.query('SELECT * FROM users');
    res.status(200).json(users);
  } catch (err) {
    console.error('Error obteniendo usuarios:', err);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Eliminar un usuario por ID
const deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const [result] = await db.query('DELETE FROM users WHERE id = ?', [userId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json({ message: `Usuario con ID ${userId} ha sido eliminado` });
  } catch (err) {
    console.error('Error eliminando usuario:', err);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

module.exports = {
  getAllUsers,
  deleteUser,
};
