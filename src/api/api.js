import { BASE_URL } from "../utils/config";
import { api } from "./interceptor";

export const feedbackApi = async (type, payload) => {
  const { hours, reason, question, answer, activity } = payload;
  let body;
  if (type === "hours") {
    body = { type, hours };
  } else {
    body = { type, hours, reason, question, answer, activity };
  }
  const response = await api.post(`${BASE_URL}/feedback`, body);
  return response;
};

export const researchApi = async (input, id) => {
  const data = { ...input, id };
  const res = await api.post(`${BASE_URL}/research/answer`, data);
  return res.data;
};

export async function chatApi(question, chatId, userId) {
  const body = { question, chatId, userId };
  const response = await api.post(`${BASE_URL}/queryQna`, body);
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
