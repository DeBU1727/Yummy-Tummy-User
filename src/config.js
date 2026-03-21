const getApiBaseUrl = () => {
  // Use the environment variable if available (Netlify build-time)
  if (process.env.REACT_APP_API_BASE_URL) {
    return process.env.REACT_APP_API_BASE_URL;
  }
  
  // Safe fallback for local development if .env is missing
  return 'http://localhost:9090';
};

export const API_BASE_URL = getApiBaseUrl();
