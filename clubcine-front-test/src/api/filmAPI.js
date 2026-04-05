import axios from "axios";
const FILM_API = "http://localhost:5091/api/film";

const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("clubcine_token") || ""}`
  }
});

export const getAllFilms = async () => {
  const res = await axios.get(FILM_API);
  return res.data;
};

export const addFilm = async (film) => {
  const res = await axios.post(FILM_API, film, getAuthHeaders());
  return res.data;
};

export const updateFilm = async (id, film) => {
  const res = await axios.put(`${FILM_API}/${id}`, film, getAuthHeaders());
  return res.data;
};

export const deleteFilm = async (id) => {
  await axios.delete(`${FILM_API}/${id}`, getAuthHeaders());
};
