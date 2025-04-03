import React, { useState } from 'react';
import { useTranslation } from 'react-i18next'; // Importa el hook de i18next para cambiar el idioma

const LanguageSwitcher = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [hoveredLanguage, setHoveredLanguage] = useState(null); // Para manejar el estado de hover
  const { i18n } = useTranslation(); // Desestructurar i18n del hook

  // Obtenemos el idioma seleccionado actualmente desde i18n
  const selectedLanguage = i18n.language.startsWith('es') ? 'Español' : 'English';

  const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);

  const selectLanguage = (language) => {
    const lngCode = language === 'Español' ? 'es' : 'en'; // Definimos el código de idioma
    i18n.changeLanguage(lngCode); // Cambiamos el idioma con i18n
    setDropdownOpen(false);
    setHoveredLanguage(null); // Limpiamos el estado de hover
  };

  const handleMouseEnter = (language) => {
    setHoveredLanguage(language); // Manejamos el hover
  };

  const handleMouseLeave = () => {
    setHoveredLanguage(null); // Limpiamos el hover cuando se sale
  };

  return (
    <div className={`language-selector-container ${isDropdownOpen ? 'active' : ''}`}>
      <div className="language-selector-button" onClick={toggleDropdown}>
        {selectedLanguage}
      </div>
      {isDropdownOpen && (
        <div className="language-selector-options">
          <div
            className={
              (hoveredLanguage === 'Español' || (selectedLanguage === 'Español' && !hoveredLanguage))
                ? 'selected'
                : ''
            }
            onClick={() => selectLanguage('Español')}
            onMouseEnter={() => handleMouseEnter('Español')}
            onMouseLeave={handleMouseLeave}
          >
            Español
          </div>
          <div
            className={
              (hoveredLanguage === 'English' || (selectedLanguage === 'English' && !hoveredLanguage))
                ? 'selected'
                : ''
            }
            onClick={() => selectLanguage('English')}
            onMouseEnter={() => handleMouseEnter('English')}
            onMouseLeave={handleMouseLeave}
          >
            English
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
