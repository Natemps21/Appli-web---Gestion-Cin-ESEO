import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/authAPI";
import "../login-register.css";

const Login = ({ setToken }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    try {
      // loginUser va retourner { token, user }
      const { token, user } = await loginUser(email, password);
      


      // Debug : voir la réponse
      console.log("Login API ->", {token, user});

      setToken(token);
      localStorage.setItem("clubcine_token", token);
      localStorage.setItem("clubcine_user", JSON.stringify(user));
      navigate("/dashboard");
    } catch (err) {
      setError("Identifiants invalides ou erreur serveur");
      localStorage.removeItem("clubcine_token");
      localStorage.removeItem("clubcine_user");
    }
  };

  return (
    <section className="login-register-background">
      <main className="login-register-content d-flex justify-content-center align-items-center vh-100">
        <div className="card p-4" style={{ width: 350 }}>
          <h2 className="text-center mb-3">Connexion</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="Mot de passe"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Se connecter
            </button>
            {error && <p className="text-danger mt-2">{error}</p>}
          </form>
          <div className="text-center mt-3">
            <a href="/register">Pas encore de compte ? Inscrivez-vous</a>
          </div>
        </div>
      </main>
    </section>
  );
};

export default Login;
