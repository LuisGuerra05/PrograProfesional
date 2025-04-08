// backend/helpers/personalInfo.js

function containsPersonalInfo(texto) {
    const emailRegex = /[\w.-]+@[\w.-]+\.\w{2,}/g;
    const phoneRegex = /\b(\+?\d{1,3}[\s.-]?)?(\(?\d{2,4}\)?[\s.-]?)?\d{6,10}\b/g;
  
    const contieneCorreo = emailRegex.test(texto);
    const contieneTelefono = phoneRegex.test(texto);
  
    return contieneCorreo || contieneTelefono;
  }
  
  module.exports = { containsPersonalInfo };
  