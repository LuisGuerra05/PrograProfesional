const isLocal = window.location.hostname === 'localhost';

export const API_URL = process.env.REACT_APP_API_URL || (isLocal
  ? 'http://localhost:5000'
  : 'https://epic-kick-api.azurewebsites.net');

export const CLOUDINARY_BASE_URL = 'https://res.cloudinary.com/ds0zs3wub/image/upload';
