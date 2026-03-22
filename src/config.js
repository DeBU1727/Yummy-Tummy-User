const getApiBaseUrl = () => {
  const envUrl = process.env.REACT_APP_API_BASE_URL;
  
  if (envUrl && envUrl !== 'REPLACE_WITH_YOUR_BACKEND_URL') {
    return envUrl;
  }
  
  console.warn("WARNING: REACT_APP_API_BASE_URL is not defined in the environment. Falling back to localhost.");
  return 'http://localhost:9090';
};

export const API_BASE_URL = getApiBaseUrl();
console.log("App initialized with API_BASE_URL:", API_BASE_URL);
