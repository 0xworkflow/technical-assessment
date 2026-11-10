export const API_ORIGIN = "http://localhost:5001";

export async function api(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  const isForm = typeof FormData !== "undefined" && options.body instanceof FormData;
  if (options.body && !isForm && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${API_ORIGIN}${path}`, {
    credentials: "include",
    ...options,
    headers,
  });

  if (response.status === 204) return null;

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await response.json() : null;
  if (!response.ok) {
    const error = new Error(data?.message || "Request failed.");
    error.status = response.status;
    throw error;
  }
  return data;
}
