const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const crypto = require('crypto');
const db = require('../models/db.promise'); // usamos db.promise

// Configuración de seguridad
const PEPPER = process.env.PEPPER;
const SALT_ROUNDS = 10;
const ALGORITHM = 'aes-256-cbc';
const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');

// Función para cifrar
const encrypt = (text) => {
  const iv = crypto.randomBytes(16);
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

  if (!name || !email || !password || !address) {
    return res.status(400).json({ message: 'Por favor, completa todos los campos' });
  }

  try {
    // Verificar si el correo ya está registrado
    const [existingUsers] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'Este correo electrónico ya está registrado.' });
    }

    // Cifrar la contraseña
    const passwordWithPepper = password + PEPPER;
    const hashedPassword = await bcrypt.hash(passwordWithPepper, SALT_ROUNDS);

    // Insertar el nuevo usuario
    const [result] = await db.query(
      'INSERT INTO users (username, email, password, address) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, address]
    );

    // Generar token JWT
    const token = jwt.sign(
      { id: result.insertId, username: name },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({ message: `¡Bienvenido, ${name}!`, token, username: name });

  } catch (err) {
    console.error('Error en registro:', err);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Login de usuario con validación de 2FA
const login = async (req, res) => {
  console.log("Función login fue llamada");
  const { email, password, otp } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Por favor, ingresa todos los campos' });
  }

  try {
    // Buscar usuario por email
    const [results] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    if (results.length === 0) {
      return res.status(400).json({ message: 'Email o contraseña incorrectos' });
    }

    const user = results[0];

    // Verificar contraseña
    const passwordWithPepper = password + PEPPER;
    const validPassword = await bcrypt.compare(passwordWithPepper, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Email o contraseña incorrectos' });
    }

    // Verificar 2FA si está activado
    if (user.two_factor_secret) {
      if (!otp) {
        // Generar token temporal si no envió OTP
        const tempToken = jwt.sign(
          { id: user.id },
          process.env.JWT_SECRET,
          { expiresIn: '5m' }
        );
        return res.status(401).json({ message: 'Se requiere código de autenticación', tempToken });
      }

      let decryptedSecret;
      try {
        decryptedSecret = decrypt(user.two_factor_secret);
      } catch (error) {
        console.error('Error descifrando 2FA:', error);
        return res.status(500).json({ message: 'Error al descifrar la clave de 2FA' });
      }

      const verified = speakeasy.totp.verify({
        secret: decryptedSecret,
        encoding: 'base32',
        token: otp
      });

      if (!verified) {
        return res.status(401).json({ message: 'Código de autenticación incorrecto' });
      }
    }

    // Generar token JWT normal
    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      token,
      username: user.username,
      email: user.email,
      address: user.address
    });

  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ message: 'Error en el servidor al intentar iniciar sesión' });
  }
};

// Verificación de OTP
const verifyOTP = async (req, res) => {
  console.log("Función verifyOTP fue llamada");
  const userId = req.user.id;
  const { otp } = req.body;

  try {
    // Buscar usuario por ID
    const [results] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);

    if (results.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const user = results[0];

    if (!user.two_factor_secret) {
      return res.status(400).json({ message: '2FA no está activado' });
    }

    let decryptedSecret;
    try {
      decryptedSecret = decrypt(user.two_factor_secret);
    } catch (error) {
      console.error('Error descifrando 2FA:', error);
      return res.status(500).json({ message: 'Error al descifrar la clave de 2FA' });
    }

    const verified = speakeasy.totp.verify({
      secret: decryptedSecret,
      encoding: 'base32',
      token: otp,
    });

    if (!verified) {
      return res.status(401).json({ message: 'Código de autenticación incorrecto' });
    }

    // Generar nuevo token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      username: user.username,
      email: user.email,
      address: user.address
    });

  } catch (err) {
    console.error('Error en verificación de OTP:', err);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Generar código QR para 2FA sin activar
const generate2FA = async (req, res) => {
  console.log("Función generate2FA fue llamada");

  const secret = speakeasy.generateSecret({ length: 20 });
  const otpAuthUrl = `otpauth://totp/EpicKick:${req.user.email}?secret=${secret.base32}&issuer=EpicKick`;

  try {
    const qrCodeDataUrl = await QRCode.toDataURL(otpAuthUrl);

    res.json({
      qrCode: qrCodeDataUrl,
      tempSecret: secret.base32
    });
  } catch (err) {
    console.error('Error generando QR:', err);
    res.status(500).json({ message: 'Error generando el QR' });
  }
};

// Desactivar 2FA
const disable2FA = async (req, res) => {
  console.log("Función disable2FA fue llamada");
  const userId = req.user.id;

  try {
    // Desactivar 2FA en el usuario
    await db.query('UPDATE users SET two_factor_secret = NULL WHERE id = ?', [userId]);

    // Eliminar códigos de respaldo asociados al usuario
    await db.query('DELETE FROM backup_codes WHERE user_id = ?', [userId]);

    console.log('Códigos de respaldo eliminados correctamente.');
    res.json({ message: '2FA desactivado correctamente y códigos de respaldo eliminados.' });

  } catch (err) {
    console.error('Error al desactivar 2FA:', err);
    res.status(500).json({ message: 'Error al desactivar 2FA' });
  }
};

// Obtener perfil del usuario
const getProfile = async (req, res) => {
  const userId = req.user.id;

  try {
    const [results] = await db.query(
      'SELECT username, email, address, two_factor_secret FROM users WHERE id = ?',
      [userId]
    );

    if (results.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({
      username: results[0].username,
      email: results[0].email,
      address: results[0].address,
      two_factor_secret: !!results[0].two_factor_secret, // Enviar si 2FA está activado
    });

  } catch (err) {
    console.error('Error al obtener perfil:', err);
    res.status(500).json({ message: 'Error al obtener perfil' });
  }
};

// Confirmar 2FA con OTP antes de guardarlo en la base de datos
const confirm2FA = async (req, res) => {
  console.log("Función confirm2FA fue llamada");
  const userId = req.user.id;
  const { otp, tempSecret } = req.body;

  if (!otp || !tempSecret) {
    return res.status(400).json({ message: 'OTP y clave temporal requeridos' });
  }

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

  try {
    // Cifrar la clave secreta y actualizar en la tabla users
    const encryptedSecret = encrypt(tempSecret);

    await db.query('UPDATE users SET two_factor_secret = ? WHERE id = ?', [encryptedSecret, userId]);

    // Generar códigos de respaldo
    const backupCodes = generateBackupCodes();
    const backupCodesPlain = backupCodes.map(codeObj => codeObj.code);

    const encryptedBackupCodes = backupCodes.map(codeObj => ({
      code: encrypt(codeObj.code),
      status: codeObj.status
    }));

    // Guardar los códigos cifrados
    await saveBackupCodes(userId, encryptedBackupCodes);

    console.log('\tCódigos de respaldo generados y guardados correctamente.');

    // Devolver al frontend los códigos en texto plano
    res.json({
      message: '2FA confirmado y activado',
      backupCodes: backupCodesPlain
    });

  } catch (err) {
    console.error('Error al confirmar 2FA:', err);
    res.status(500).json({ message: 'Error al confirmar 2FA' });
  }
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
const saveBackupCodes = async (userId, encryptedBackupCodes) => {
  const sql = 'INSERT INTO backup_codes (user_id, code, status) VALUES (?, ?, ?)';

  try {
    for (const codeObj of encryptedBackupCodes) {
      await db.query(sql, [userId, codeObj.code, 'not_used']); // <- ojo aquí, también corregí 'unused' a 'not_used' si es que tu tabla usa 'not_used'
    }
  } catch (err) {
    console.error('Error al guardar códigos de respaldo:', err);
    throw err; // Propagar el error para que quien llame pueda capturarlo
  }
};

// Función para regenerar códigos de recuperación
const regenerateRecoveryCodes = async (req, res) => {
  const userId = req.user.id;

  try {
    // Generar 10 códigos nuevos
    const backupCodes = generateBackupCodes();

    // Encriptar los códigos generados
    const encryptedBackupCodes = backupCodes.map(codeObj => ({
      code: encrypt(codeObj.code),
      status: codeObj.status
    }));

    // Eliminar los códigos antiguos
    await db.query('DELETE FROM backup_codes WHERE user_id = ?', [userId]);

    // Guardar los nuevos códigos
    await saveBackupCodes(userId, encryptedBackupCodes);

    // Devolver los códigos en texto plano al frontend
    const codesToReturn = backupCodes.map(codeObj => codeObj.code);
    res.json({
      message: 'Códigos de recuperación regenerados con éxito',
      codes: codesToReturn
    });

  } catch (err) {
    console.error('Error al regenerar códigos de recuperación:', err);
    res.status(500).json({ message: 'Error al regenerar los códigos de recuperación' });
  }
};

// Ruta para usar códigos de recuperación
const recoveryLogin = async (req, res) => {
  console.log("Función recoveryLogin fue llamada");
  const { email, recoveryCode } = req.body;

  if (!email || !recoveryCode) {
    return res.status(400).json({ message: 'El correo y el código de recuperación son requeridos' });
  }

  try {
    // Buscar el usuario por su correo
    const [userResults] = await db.query('SELECT id FROM users WHERE email = ?', [email]);

    if (userResults.length === 0) {
      console.error('Usuario no encontrado');
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const userId = userResults[0].id;

    // Buscar códigos de recuperación del usuario
    const [codesResults] = await db.query('SELECT code, status FROM backup_codes WHERE user_id = ?', [userId]);

    // Buscar si existe un código válido
    const validCode = codesResults.find(codeObj => {
      const decryptedCode = decrypt(codeObj.code);
      return decryptedCode === recoveryCode && codeObj.status === 'not_used';
    });

    if (!validCode) {
      return res.status(401).json({ message: 'Código de recuperación inválido o ya usado' });
    }

    // Marcar el código como usado
    await db.query('UPDATE backup_codes SET status = ? WHERE code = ?', ['used', validCode.code]);

    // Calcular códigos restantes
    const remainingCodes = codesResults.filter(codeObj => codeObj.status === 'not_used').length - 1;

    // Generar token JWT
    const token = jwt.sign(
      { id: userId },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      message: `Se ha utilizado un código de recuperación. Te quedan ${remainingCodes} códigos restantes.`,
      remainingCodes
    });

  } catch (err) {
    console.error('Error en recuperación de login:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


// Actualizar la dirección del usuario
const updateAddress = async (req, res) => {
  console.log("Función updateAddress fue llamada");
  const { address } = req.body;
  const userId = req.user.id;

  if (!address) {
    return res.status(400).json({ message: 'Address is required' });
  }

  try {
    const [result] = await db.query('UPDATE users SET address = ? WHERE id = ?', [address, userId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Address updated successfully' });

  } catch (err) {
    console.error('Error updating address:', err);
    res.status(500).json({ message: 'Error updating the address' });
  }
};

// Validar si el token aún es válido
const validateToken = (req, res) => {
  // Si llega a esta función, es porque pasó el middleware "authenticate"
  res.status(200).json({ message: 'Token válido' });
};

module.exports = { validateToken, register, login, generate2FA, disable2FA,  updateAddress, getProfile, confirm2FA, verifyOTP, recoveryLogin, regenerateRecoveryCodes };