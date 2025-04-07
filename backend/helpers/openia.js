// backend/helpers/openai.js
require('dotenv').config();
const axios = require('axios');

const openaiModerationEndpoint = 'https://api.openai.com/v1/moderations';

async function moderateComment(text) {
  try {
    const response = await axios.post(
      openaiModerationEndpoint,
      { input: text },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const results = response.data.results[0];
    return {
      flagged: results.flagged,
      categories: results.categories,
      category_scores: results.category_scores,
    };
  } catch (error) {
    console.error('Error moderando comentario:', error.response?.data || error.message);
    throw new Error('Error al procesar el contenido con OpenAI');
  }
}

module.exports = { moderateComment };
