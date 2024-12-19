import axios from "../Config/AxiosConfig";

export async function getActiveSessionsRequestAsync() {
  try {
    const response = await axios.get(`/api/sessions`);
    return response.data;
  } catch (error) {
    console.error("Error fetching session IDs:", error);
    throw error;
  }
}

export async function createSessionRequestAsync(request) {
  try {
    const response = await axios.post(`/api/sessions`, request);
    return response.data;
  } catch (error) {
    console.error("Error creating session:", error);
    throw error;
  }
}
