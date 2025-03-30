import { CLOUDINARY_BASE_URL } from './config';

export const teamFolderMap = {
  'FC Barcelona': 'Barca',
  'Atlético de Madrid': 'Atletico',
  'Real Madrid': 'Madrid',
  'Athletic Club': 'Bilbao',
  'Celta de Vigo': 'Calta',
  'Espanyol': 'Espanyol',
  'Getafe': 'Getafe',
  'Girona': 'Girona',
  'Leganés': 'Leganes',
  'Deportivo Alavés': 'Alaves',
  'Osasuna': 'Osasuna',
  'RCD Mallorca': 'Mallorca',
  'Rayo Vallecano': 'Rayo',
  'Real Betis': 'Betis',
  'Real Sociedad': 'Sociedad',
  'Sevilla FC': 'Sevilla',
  'U.D. Las Palmas': 'Palmas',
  'Valencia': 'Valencia',
  'Valladolid': 'Valladolid',
  'Villarreal': 'Villarreal'
};

export const teams = [
    { name: 'FC Barcelona', logo: `${CLOUDINARY_BASE_URL}/images/Barca/Barca_Escudo.png` },
    { name: 'Real Madrid', logo: `${CLOUDINARY_BASE_URL}/images/Madrid/Madrid_Escudo.png` },
    { name: 'Atlético de Madrid', logo: `${CLOUDINARY_BASE_URL}/images/Atletico/Atletico_Escudo.png` },
    { name: 'Athletic Club', logo: `${CLOUDINARY_BASE_URL}/images/Bilbao/Bilbao_Escudo.png` },
    { name: 'Celta de Vigo', logo: `${CLOUDINARY_BASE_URL}/images/Calta/Celta_Escudo.png` },
    { name: 'Deportivo Alavés', logo: `${CLOUDINARY_BASE_URL}/images/Alaves/Alaves_Escudo.png` },
    { name: 'Espanyol', logo: `${CLOUDINARY_BASE_URL}/images/Espanyol/Espanyol_Escudo.png` },
    { name: 'Getafe', logo: `${CLOUDINARY_BASE_URL}/images/Getafe/Getafe_Escudo.png` },
    { name: 'Girona', logo: `${CLOUDINARY_BASE_URL}/images/Girona/Girona_Escudo.png` },
    { name: 'Leganés', logo: `${CLOUDINARY_BASE_URL}/images/Leganes/Leganes_Escudo.png` },
    { name: 'Osasuna', logo: `${CLOUDINARY_BASE_URL}/images/Osasuna/Osasuna_Escudo.png` },
    { name: 'RCD Mallorca', logo: `${CLOUDINARY_BASE_URL}/images/Mallorca/Mallorca_Escudo.png` },
    { name: 'Rayo Vallecano', logo: `${CLOUDINARY_BASE_URL}/images/Rayo/Rayo_Escudo.png` },
    { name: 'Real Betis', logo: `${CLOUDINARY_BASE_URL}/images/Betis/Betis_Escudo.png` },
    { name: 'Real Sociedad', logo: `${CLOUDINARY_BASE_URL}/images/Sociedad/Sociedad_Escudo.png` },
    { name: 'Sevilla FC', logo: `${CLOUDINARY_BASE_URL}/images/Sevilla/Sevilla_Escudo.png` },
    { name: 'U.D. Las Palmas', logo: `${CLOUDINARY_BASE_URL}/images/Palmas/Palmas_Escudo.png` },
    { name: 'Valencia', logo: `${CLOUDINARY_BASE_URL}/images/Valencia/Valencia_Escudo.png` },
    { name: 'Valladolid', logo: `${CLOUDINARY_BASE_URL}/images/Valladolid/Valladolid_Escudo.png` },
    { name: 'Villarreal', logo: `${CLOUDINARY_BASE_URL}/images/Villarreal/Villarreal_Escudo.png` }
  ];

  
// Función para generar la URL de la imagen desde Cloudinary
export const getImageUrl = (team, name) => {
  const basePath = `${CLOUDINARY_BASE_URL}/images`;
  const teamFolder = teamFolderMap[team] || team.replace(/\s+/g, '').toLowerCase();
  const productType = name.includes('Local') ? 'Local' :
                      name.includes('Visita') ? 'Visita' :
                      name.includes('Tercera') ? 'Tercera' :
                      name.includes('Cuarta') ? 'Cuarta' : 'Portero';
  const fileName = `${teamFolder}_${productType}_24_1.jpg`;
  return `${basePath}/${teamFolder}/${productType}/${fileName}`;
};

// Función para traducir el nombre del producto
export const getProductTranslationKey = (name) => {
  if (!name) return 'Unknown Jersey';

  if (name.includes('Local')) return 'Home Jersey';
  if (name.includes('Visita')) return 'Away Jersey';
  if (name.includes('Tercera')) return 'Third Jersey';
  if (name.includes('Cuarta')) return 'Fourth Jersey';
  return 'Goalkeeper Jersey';
};
