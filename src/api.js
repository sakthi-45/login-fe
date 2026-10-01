const API_BASE_URL = "https://login-be-ten.vercel.app";

const request = async (path, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    const contentType = response.headers.get("content-type") || "";

    let data;

    if (contentType.includes("application/json")) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = { message: text };
    }

    if (!response.ok) {
      throw new Error(
        data.message || `Request failed with status ${response.status}`
      );
    }

    return data;
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error("Unable to connect to the backend server.", {
        cause: error,
      });
    }

    throw error;
  }
};

// Backend health check
export const getBackendHealth = () => request("/api/auth?action=health");

// Register user
export const registerUser = (payload) =>
  request("/api/auth", {
    method: "POST",
    body: JSON.stringify({ action: "register", ...payload }),
  });

// Login user
export const loginUser = (payload) =>
  request("/api/auth", {
    method: "POST",
    body: JSON.stringify({ action: "login", ...payload }),
  });
