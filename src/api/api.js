import axios from "axios";
import { BASE_URL } from "../utils/config";

export async function chatApi(question, history, mode, userId) {
  const body = { question, history, userId };
  const response = await axios.post(`${BASE_URL}/query${mode}`, body);
  const parsedResponse = await response.data;
  if (response.status > 299) {
    throw Error(parsedResponse.error || "Unknown error");
  }
  return parsedResponse;
}

export async function uploadFilesApi(formData) {
  const response = await axios.post(`${BASE_URL}/upload`, formData);
  return response.status;
}

export function getCitationFilePath(citation) {
  return `/content/${citation}`;
}
