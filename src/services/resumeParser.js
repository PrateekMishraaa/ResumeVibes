// services/resumeParser.js
import axios from 'axios';

const RESUME_PARSER_API_KEY = 'YOUR_API_KEY'; // https://www.apilayer.com/marketplace/resume_parser-api
const RESUME_PARSER_URL = 'https://api.apilayer.com/resume_parser/upload';

export const parseResume = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post(RESUME_PARSER_URL, formData, {
      headers: {
        'apikey': RESUME_PARSER_API_KEY,
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Resume parsing error:', error);
    throw error;
  }
};