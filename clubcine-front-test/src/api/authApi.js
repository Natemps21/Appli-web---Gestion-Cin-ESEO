import axios from "axios";
const API_URL = "http://localhost:5091/api/user"; // adapte selon ton back

export const loginUser = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  // Suppose que la réponse contient { token, user }
  const { token, user } = response.data;
  if (!token || !user) throw new Error("Login: user/token manquant");
  return { token, user };
};

export const registerUser = async (nom, prenom, email, classe, password) => {
  const response = await axios.post(`${API_URL}/register`, {
    nom,
    prenom,
    email,
    classe,
    passwordHash: password
  });
  return response.data;
};
