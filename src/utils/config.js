// Constants.js
const productionUrl = "https://widgetsy-backend.onrender.com";
const developmentUrl = "http://localhost:9000";
export const BASE_URL =
  process.env.NODE_ENV === "development" ? developmentUrl : productionUrl;
