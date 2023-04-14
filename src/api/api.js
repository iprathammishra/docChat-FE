import axios from "axios";

export async function chatApi(question) {
  const response = await axios.get(
    `http://localhost:9000/query?q=${question}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const parsedResponse = await response.data;
  if (response.status > 299 || response.statusText !== "OK") {
    throw Error(parsedResponse.error || "Unknown error");
  }
  return parsedResponse;
}

export async function uploadFilesApi(formData) {
  const data = {
    files: [...formData.getAll("files")],
  };
  console.log(data);
  const response = await axios.post(`http://localhost:9000/upload`, formData);
  return response.statusText;
}

export function getCitationFilePath(citation) {
  return `/content/${citation}`;
}
