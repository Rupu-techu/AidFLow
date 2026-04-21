import axios from "axios";

const API = axios.create({
  baseURL: "https://aidflow-backend-26890977649.us-central1.run.app/",
});

export const processDisaster = async (text) => {
  try {
    const response = await API.post("/process", { text });
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};