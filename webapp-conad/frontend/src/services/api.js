import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const fetchDeliveries = async (filters = {}) => {
  const params = new URLSearchParams(filters);
  const response = await axios.get(\`\${API_BASE_URL}/deliveries?\${params.toString()}\`);
  return response.data;
};

export const fetchAlerts = async () => {
  const response = await axios.get(\`\${API_BASE_URL}/alerts\`);
  return response.data;
};
