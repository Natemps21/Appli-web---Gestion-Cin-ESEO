import axios from "axios";
const API_URL = "http://localhost:5091/api/seance";

const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("clubcine_token") || ""}`
  }
});


export const getAllSeances = async () => {
  const res = await axios.get(`${API_URL}/all`, getAuthHeaders());
  return res.data;
};

export const addSeance = async (seance) => {
  const res = await axios.post(API_URL, seance, getAuthHeaders());
  return res.data;
};

export const updateSeance = async (id, seance) => {
  const res = await axios.put(`${API_URL}/${id}`, seance, getAuthHeaders());
  return res.data;
};

export const deleteSeance = async (id) => {
  await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
};
