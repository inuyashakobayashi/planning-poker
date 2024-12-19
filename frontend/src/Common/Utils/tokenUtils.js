import { jwtDecode } from "jwt-decode";

export const generateToken = (data) => {
  const header = { alg: "none", typ: "JWT" }; // JWT header (no signature)

  const base64Encode = (obj) => {
    return btoa(JSON.stringify(obj));
  };

  const { sessionId, scrumMasterId, memberId } = data;

  const payload = {
    sessionId,
    scrumMasterId,
    memberId,
    exp: Math.floor(Date.now() / 1000) + 2 * 60 * 60,
  };

  const encodedHeader = base64Encode(header);
  const encodedPayload = base64Encode(payload);

  return `${encodedHeader}.${encodedPayload}.`;
};

export function getValidSessionFromToken() {
  const token = localStorage.getItem("sessionToken");

  if (!token) {
    return null;
  }

  try {
    const decodedToken = jwtDecode(token);
    const { sessionId, exp } = decodedToken;

    // Check if the token is expired
    if (Date.now() >= exp * 1000) {
      removeToken();
      return null;
    }

    return { sessionId, token };
  } catch (error) {
    console.error("Failed to decode session token:", error);
    removeToken();
    return null;
  }
}

export function getTokenData() {
  const token = localStorage.getItem("sessionToken");

  if (!token) {
    return null;
  }

  try {
    const decodedToken = jwtDecode(token);
    const { sessionId, scrumMasterId, memberId, exp } = decodedToken;
    return { sessionId, scrumMasterId, memberId, exp };
  } catch (error) {
    console.error("Failed to decode session token:", error);
    removeToken();
    return null;
  }
}

export function getToken() {
  const token = localStorage.getItem("sessionToken");

  if (!token) {
    return null;
  }

  try {
    return token;
  } catch (error) {
    console.error("Failed to decode session token:", error);
    removeToken();
    return null;
  }
}

export function setToken(token) {
  if (!token && token !== "") {
    return null;
  }

  localStorage.setItem("sessionToken", token);
}

export function removeToken() {
  localStorage.removeItem("sessionToken");
}
