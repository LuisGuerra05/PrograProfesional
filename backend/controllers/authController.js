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
  console.log("Función register fue llamada");
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
  console.log("Función login fue llamada");
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
        if (!otp) {
          const tempToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '5m' }); // Genera un token temporal válido por 5 minutos
          return res.status(401).json({ message: 'Se requiere código de autenticación', tempToken });
      }
      

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

// Verificación de OTP
const verifyOTP = (req, res) => {
  console.log("Función verifyOTP fue llamada");
  const userId = req.user.id;
  const { otp } = req.body;

  const sql = 'SELECT * FROM users WHERE id = ?';
  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error en el servidor' });

    if (results.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' });

    const user = results[0];

    if (!user.two_factor_secret) return res.status(400).json({ message: '2FA no está activado' });

    let decryptedSecret;
    try {
      decryptedSecret = decrypt(user.two_factor_secret);
    } catch (error) {
      return res.status(500).json({ message: 'Error al descifrar la clave de 2FA' });
    }

    const verified = speakeasy.totp.verify({
      secret: decryptedSecret,
      encoding: 'base32',
      token: otp,
    });

    if (!verified) return res.status(401).json({ message: 'Código de autenticación incorrecto' });

    const token = jwt.sign({ id: user.id, email: user.email, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, username: user.username, email: user.email, address: user.address });
  });
};

// Generar código QR para 2FA sin activar
const generate2FA = (req, res) => {
  console.log("Función generate2FA fue llamada");
  const secret = speakeasy.generateSecret({ length: 20 });

  const otpAuthUrl = `otpauth://totp/EpicKick:${req.user.email}?secret=${secret.base32}&issuer=EpicKick`;

  QRCode.toDataURL(otpAuthUrl, (err, qrCodeDataUrl) => {
    if (err) return res.status(500).json({ message: 'Error generando el QR' });

    res.json({ qrCode: qrCodeDataUrl, tempSecret: secret.base32 });
  });
};


// Desactivar 2FA
const disable2FA = (req, res) => {
  console.log("Función disable2FA fue llamada");
  const userId = req.user.id;

  // Consulta para desactivar 2FA y eliminar códigos de respaldo
  const sql = 'UPDATE users SET two_factor_secret = NULL WHERE id = ?';
  const deleteBackupCodesSql = 'DELETE FROM backup_codes WHERE user_id = ?';

  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error('Error al desactivar 2FA:', err);
      return res.status(500).json({ message: 'Error al desactivar 2FA' });
    }

    // Eliminar códigos de respaldo asociados al usuario
    db.query(deleteBackupCodesSql, [userId], (err, result) => {
      if (err) {
        console.error('Error al eliminar códigos de respaldo:', err);
        return res.status(500).json({ message: 'Error al eliminar códigos de respaldo' });
      }

      console.log('Códigos de respaldo eliminados correctamente.');
      res.json({ message: '2FA desactivado correctamente y códigos de respaldo eliminados.' });
    });
  });
};



// Obtener perfil del usuario
const getProfile = (req, res) => {
  const userId = req.user.id;

  const sql = 'SELECT username, email, address, two_factor_secret FROM users WHERE id = ?';
  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error al obtener perfil' });

    if (results.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' });

    res.json({
      username: results[0].username,
      email: results[0].email,
      address: results[0].address,
      two_factor_secret: !!results[0].two_factor_secret, // Enviar si 2FA está activado
    });
  });
};

// Confirmar 2FA con OTP antes de guardarlo en la base de datos
const confirm2FA = (req, res) => {
  console.log("Función confirm2FA fue llamada");
  const userId = req.user.id;
  const { otp, tempSecret } = req.body;

  if (!otp || !tempSecret) return res.status(400).json({ message: 'OTP y clave temporal requeridos' });

  const verified = speakeasy.totp.verify({
    secret: tempSecret,
    encoding: 'base32',
    token: otp,
  });

  if (!verified) {
    console.log('Código OTP incorrecto');
    return res.status(401).json({ message: 'Código de autenticación incorrecto' });
  }

  console.log('\tOTP correcto, activando 2FA y generando códigos de respaldo...');

  // Si el OTP es válido, guardar la clave cifrada en la base de datos
  const encryptedSecret = encrypt(tempSecret);

  const sql = 'UPDATE users SET two_factor_secret = ? WHERE id = ?';
  db.query(sql, [encryptedSecret, userId], (err, result) => {
    if (err) {
      console.error('Error al confirmar 2FA:', err);
      return res.status(500).json({ message: 'Error al confirmar 2FA' });
    }

    // Generar códigos de respaldo
    const backupCodes = generateBackupCodes();
    const backupCodesPlain = backupCodes.map(codeObj => codeObj.code); // Desencriptados para mostrar al usuario

    // Cifrar cada código antes de guardarlo en la base de datos
    const encryptedBackupCodes = backupCodes.map(codeObj => ({
      code: encrypt(codeObj.code), 
      status: codeObj.status
    }));

    // Guardar códigos cifrados en la base de datos
    saveBackupCodes(userId, encryptedBackupCodes);

    console.log('\tCódigos de respaldo generados y guardados correctamente.');

    // Devolver los códigos generados y desencriptados al frontend para mostrarlos
    res.json({ 
      message: '2FA confirmado y activado', 
      backupCodes: backupCodesPlain 
    });
  });
};




// Generar códigos de respaldo y cifrarlos antes de retornarlos
const generateBackupCodes = () => {
  const codes = [];
  for (let i = 0; i < 10; i++) {
    const code = Math.random().toString(36).substring(2, 12); // Código de 10 caracteres alfanumérico
    codes.push({ code: code, status: 'unused' });
  }
  return codes;
};

// Guardar códigos de respaldo cifrados en la base de datos
const saveBackupCodes = (userId, encryptedBackupCodes) => {
  const sql = 'INSERT INTO backup_codes (user_id, code, status) VALUES (?, ?, ?)';

  encryptedBackupCodes.forEach(codeObj => {
      db.query(sql, [userId, codeObj.code, 'not_used'], (err, result) => { // Aquí va 'unused'
          if (err) {
              console.error('Error al guardar códigos de respaldo:', err);
          }
      });
  });
};


// Función para regenerar códigos de recuperación
const regenerateRecoveryCodes = (req, res) => {

  const userId = req.user.id; 

  // Generar 10 códigos nuevos
  const backupCodes = generateBackupCodes();

  // Encriptar los códigos generados
  const encryptedBackupCodes = backupCodes.map(codeObj => ({
      code: encrypt(codeObj.code),
      status: codeObj.status
  }));

  // Primero eliminar los códigos antiguos del usuario
  const deleteSql = 'DELETE FROM backup_codes WHERE user_id = ?';
  db.query(deleteSql, [userId], (deleteErr) => {
      if (deleteErr) {
          console.error('Error al eliminar códigos antiguos:', deleteErr);
          return res.status(500).json({ message: 'Error al eliminar códigos anteriores' });
      }

      // Guardar los códigos nuevos en la base de datos
      saveBackupCodes(userId, encryptedBackupCodes);

      // Devolver los códigos sin encriptar al frontend para mostrarlos al usuario
      const codesToReturn = backupCodes.map(codeObj => codeObj.code);
      res.json({ message: 'Códigos de recuperación regenerados con éxito', codes: codesToReturn });
  });
};


// Ruta para usar códigos de recuperación
const recoveryLogin = (req, res) => {
  console.log("Función recoveryLogin fue llamada");
  const { email, recoveryCode } = req.body;

  if (!email || !recoveryCode) {
      return res.status(400).json({ message: 'El correo y el código de recuperación son requeridos' });
  }

  // Buscar el usuario por su correo
  const findUserSql = 'SELECT id FROM users WHERE email = ?';
  db.query(findUserSql, [email], (err, userResults) => {
      if (err || userResults.length === 0) {
          console.error('Usuario no encontrado o error al buscar el usuario:', err);
          return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      const userId = userResults[0].id;

      // Buscar códigos de recuperación del usuario
      const sql = 'SELECT code, status FROM backup_codes WHERE user_id = ?';
      db.query(sql, [userId], (err, results) => {
          if (err) {
              console.error('Error al recuperar códigos de recuperación:', err);
              return res.status(500).json({ message: 'Server error' });
          }

          const validCode = results.find(codeObj => {
              const decryptedCode = decrypt(codeObj.code);
              return decryptedCode === recoveryCode && codeObj.status === 'not_used';
          });

          if (!validCode) {
              return res.status(401).json({ message: 'Código de recuperación inválido' });
          }

          // Marcar el código como usado en la base de datos
          const updateSql = 'UPDATE backup_codes SET status = ? WHERE code = ?';
          db.query(updateSql, ['used', validCode.code], (updateErr) => {
              if (updateErr) {
                  console.error('Error al actualizar el estado del código de recuperación:', updateErr);
                  return res.status(500).json({ message: 'Server error' });
              }

              // Calcular códigos restantes
              console.log("Calculo de codigos restantes");
              const remainingCodes = results.filter(codeObj => codeObj.status === 'not_used').length - 1;

              // Generar un token para el usuario y enviarlo al frontend
              const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });

              // Enviar alerta al usuario
              res.json({
                  token,
                  message: `Se ha utilizado un código de recuperación. Te quedan ${remainingCodes} códigos restantes.`,
                  remainingCodes
              });
          });
      });
  });
};




// Actualizar la dirección del usuario
const updateAddress = (req, res) => {
  console.log("Función updateAddress fue llamada");
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

// Validar si el token aún es válido
const validateToken = (req, res) => {
  // Si llega a esta función, es porque pasó el middleware "authenticate"
  res.status(200).json({ message: 'Token válido' });
};

module.exports = { validateToken, register, login, generate2FA, disable2FA,  updateAddress, getProfile, confirm2FA, verifyOTP, recoveryLogin, regenerateRecoveryCodes };