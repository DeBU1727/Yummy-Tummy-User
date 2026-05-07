export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

if (!API_BASE_URL) {
  console.error("CRITICAL: REACT_APP_API_BASE_URL is not defined in your .env file.");
} else {
  console.log("App initialized with API_BASE_URL:", API_BASE_URL);
}
