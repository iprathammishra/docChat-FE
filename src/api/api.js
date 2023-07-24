import { BASE_URL } from "../utils/config";
import { api } from "./interceptor";

export const hoursSavedApi = async (type, hours) => {
  const body = { type, hours };
  const response = await api.post(`${BASE_URL}/feedback/${type}`, body);
  return response;
};

export async function chatApi(question, chatId, mode, userId) {
  const body = { question, chatId, userId };
  const response = await api.post(`${BASE_URL}/query${mode}`, body);
  const parsedResponse = await response.data;
  if (response.status > 299) {
    throw Error(parsedResponse.error || "Unknown error");
  }
  return parsedResponse;
}

export async function fetchPromptsApi() {
  const response = await api.get(`${BASE_URL}/prompt/getAll`);
  const parsedResponse = await response.data;
  if (response.status > 299) {
    throw Error(parsedResponse.error || "Unknown error");
  }
  return parsedResponse;
}

export async function addPromptApi(body) {
  const response = await api.post(`${BASE_URL}/prompt/add`, body);
  const parsedResponse = await response.data;
  if (response.status > 299) {
    throw Error(parsedResponse.error || "Unknown error");
  }
  return parsedResponse;
}

export async function deletePromptApi(id) {
  const response = await api.delete(`${BASE_URL}/prompt/delete/${id}`);
  const parsedResponse = await response.data;
  if (response.status > 299) {
    throw Error(parsedResponse.error || "Unknown error");
  }
  return parsedResponse;
}

export async function uploadFilesApi(formData, userId) {
  const response = await api.post(`${BASE_URL}/upload/${userId}`, formData);
  return response.status;
}

export function getCitationFilePath(citation) {
  return `/content/${citation}`;
}
