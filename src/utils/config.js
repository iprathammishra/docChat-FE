// Constants.js
const productionUrl =
  process.env.PRODUCTION_URL ||
  "https://docchat-be-production-bb97.up.railway.app";
const developmentUrl = "http://localhost:9000";
export const BASE_URL =
  process.env.NODE_ENV === "development" ? developmentUrl : productionUrl;

export const REACT_APP_BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://rfp-qna.vercel.app";
