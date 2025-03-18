const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const crypto = require('crypto');
const db = require('../models/db');

// Configuración de seguridad
const PEPPER = process.env.PEPPER;
const SALT_ROUNDS = 10;
const ALGORITHM = 'aes-256-cbc';
const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY, 'hex'); // Asegurar que es un Buffer de 32 bytes

// Función para cifrar
const encrypt = (text) => {
  const iv = crypto.randomBytes(16); // IV de 16 bytes
  const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
};

// Función para descifrar
const decrypt = (text) => {
  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift(), 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};


// Registro de usuario
const register = async (req, res) => {
  const { name, email, password, address } = req.body;

  const checkEmailQuery = 'SELECT * FROM users WHERE email = ?';
  db.query(checkEmailQuery, [email], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Error en el servidor' });

    if (results.length > 0) return res.status(400).json({ message: 'Este correo electrónico ya está registrado.' });

    if (!name || !email || !password || !address) {
      return res.status(400).json({ message: 'Por favor, completa todos los campos' });
    }

    try {
      const passwordWithPepper = password + PEPPER;
      const hashedPassword = await bcrypt.hash(passwordWithPepper, SALT_ROUNDS);

      const sql = 'INSERT INTO users (username, email, password, address) VALUES (?, ?, ?, ?)';
      db.query(sql, [name, email, hashedPassword, address], (err, result) => {
        if (err) return res.status(500).json({ message: 'Error al registrar usuario' });

        const token = jwt.sign({ id: result.insertId, username: name }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ message: `¡Bienvenido, ${name}!`, token, username: name });
      });
    } catch (err) {
      res.status(500).json({ message: 'Error al cifrar la contraseña' });
    }
  });
};

// Login de usuario con validación de 2FA
const login = (req, res) => {
  const { email, password, otp } = req.body;

  if (!email || !password) return res.status(400).json({ message: 'Por favor, ingresa todos los campos' });

  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Error en el servidor' });

    if (results.length === 0) return res.status(400).json({ message: 'Email o contraseña incorrectos' });

    const user = results[0];

    try {
      const passwordWithPepper = password + PEPPER;
      const validPassword = await bcrypt.compare(passwordWithPepper, user.password);
      if (!validPassword) return res.status(400).json({ message: 'Email o contraseña incorrectos' });

      // Si el usuario tiene 2FA activado, validar el código OTP
      if (user.two_factor_secret) {
        if (!otp) return res.status(401).json({ message: 'Se requiere código de autenticación' });

        let decryptedSecret;
        try {
          decryptedSecret = decrypt(user.two_factor_secret);
        } catch (error) {
          return res.status(500).json({ message: 'Error al descifrar la clave de 2FA' });
        }

        const verified = speakeasy.totp.verify({
          secret: decryptedSecret,
          encoding: 'base32',
          token: otp
        });

        if (!verified) return res.status(401).json({ message: 'Código de autenticación incorrecto' });
      }

      const token = jwt.sign({ id: user.id, email: user.email, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.status(200).json({ token, username: user.username, email: user.email, address: user.address });
    } catch (err) {
      return res.status(500).json({ message: 'Error en el servidor al verificar la contraseña' });
    }
  });
};

// Activar 2FA y generar QR
const enable2FA = (req, res) => {
  const userId = req.user.id;
  const secret = speakeasy.generateSecret({ length: 20 });

  const encryptedSecret = encrypt(secret.base32);

  const sql = 'UPDATE users SET two_factor_secret = ? WHERE id = ?';
  db.query(sql, [encryptedSecret, userId], async (err, result) => {
    if (err) return res.status(500).json({ message: 'Error al activar 2FA' });

    const otpAuthUrl = `otpauth://totp/EpicKick:${req.user.email}?secret=${secret.base32}&issuer=EpicKick`;

    QRCode.toDataURL(otpAuthUrl, (err, qrCodeDataUrl) => {
      if (err) return res.status(500).json({ message: 'Error generando el QR' });

      res.json({ message: '2FA activado', qrCode: qrCodeDataUrl });
    });
  });
};

// Desactivar 2FA
const disable2FA = (req, res) => {
  const userId = req.user.id;

  const sql = 'UPDATE users SET two_factor_secret = NULL WHERE id = ?';
  db.query(sql, [userId], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error al desactivar 2FA' });

    res.json({ message: '2FA desactivado correctamente' });
  });
};

// Actualizar la dirección del usuario
const updateAddress = (req, res) => {
  const { address } = req.body;
  const userId = req.user.id;

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

module.exports = { register, login, enable2FA, disable2FA, updateAddress };
