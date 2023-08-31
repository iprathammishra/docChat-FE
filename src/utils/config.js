// Constants.js
const productionUrl =
  process.env.REACT_PRODUCTION_URL || "http://4.224.85.87:9090";
const developmentUrl = "http://localhost:9000";
export const BASE_URL =
  process.env.NODE_ENV === "development" ? developmentUrl : productionUrl;

export const REACT_APP_BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://rfp-qna.vercel.app/";
