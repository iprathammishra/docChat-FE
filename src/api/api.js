import axios from "axios";
import { BASE_URL } from "../utils/config";

export async function chatApi(question, chatId, mode, userId, company) {
  const body = { question, chatId, userId, company };
  const response = await axios.post(`${BASE_URL}/query${mode}`, body);
  const parsedResponse = await response.data;
  if (response.status > 299) {
    throw Error(parsedResponse.error || "Unknown error");
  }
  return parsedResponse;
}

export async function fetchPromptsApi() {
  const response = await axios.get(`${BASE_URL}/prompt/getAll`);
  const parsedResponse = await response.data;
  if (response.status > 299) {
    throw Error(parsedResponse.error || "Unknown error");
  }
  return parsedResponse;
}

export async function addPromptApi(body) {
  const response = await axios.post(`${BASE_URL}/prompt/add`, body);
  const parsedResponse = await response.data;
  if (response.status > 299) {
    throw Error(parsedResponse.error || "Unknown error");
  }
  return parsedResponse;
}

export async function deletePromptApi(id) {
  const response = await axios.delete(`${BASE_URL}/prompt/delete/${id}`);
  const parsedResponse = await response.data;
  if (response.status > 299) {
    throw Error(parsedResponse.error || "Unknown error");
  }
  return parsedResponse;
}

export async function uploadFilesApi(formData, company, userId) {
  const response = await axios.post(`${BASE_URL}/upload/${userId}`, formData, {
    data: { company },
  });
  return response.status;
}

export function getCitationFilePath(citation) {
  return `/content/${citation}`;
}
