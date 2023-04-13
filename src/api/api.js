export async function chatApi(question) {
  const response = await fetch(`http://localhost:9000/query?q=${question}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const parsedResponse = await response.json();
  if (response.status > 299 || !response.ok) {
    throw Error(parsedResponse.error || "Unknown error");
  }

  return parsedResponse;
}

export function getCitationFilePath(citation) {
  return `/content/${citation}`;
}
