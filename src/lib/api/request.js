/**
 * Utility for performing JSON fetch requests with consistent error handling.
 * Automatically handles content-type headers and parses JSON responses.
 */
export async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });

  // Attempt to parse the response body as JSON
  const payload = await response.json().catch(() => null);

  // If the status is not successful, throw a custom Error with details
  if (!response.ok) {
    const message = payload?.message || "Request failed";
    const error = new Error(message);
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  return payload;
}
