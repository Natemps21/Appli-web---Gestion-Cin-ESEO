import axios from "axios";
const API_URL = "http://localhost:5091/api/sortiecine";

const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("clubcine_token") || ""}`
  }
});

export const getAllSorties = async () => {
  const res = await axios.get(API_URL, getAuthHeaders());
  return res.data;
};

export const addSortie = async (sortie) => {
  const res = await axios.post(API_URL, sortie, getAuthHeaders());
  return res.data;
};

export const updateSortie = async (id, sortie) => {
  const res = await axios.put(`${API_URL}/${id}`, sortie, getAuthHeaders());
  return res.data;
};

export const deleteSortie = async (id) => {
  await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
};