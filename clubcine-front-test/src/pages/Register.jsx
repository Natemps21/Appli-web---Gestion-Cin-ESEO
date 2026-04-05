import React, { useState } from "react";
import { registerUser } from "../api/authAPI";
import { useNavigate } from "react-router-dom";
import "../login-register.css";

const Register = () => {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const classes = ["E1", "E2", "E3", "E4", "E5", "Autre"];
  const [classe, setClasse] = useState('');
  const [autreClasse, setAutreClasse] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const classeFinale = classe === "Autre" ? autreClasse : classe;
      await registerUser(nom, prenom, email, classeFinale, password);
      setSuccess("Inscription réussie !");
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      setError("Erreur à l'inscription ou email déjà utilisé.");
    }
  };

  return (
    <section className="login-register-background">
      <main className="login-register-content d-flex justify-content-center align-items-center vh-100">
        <div className="card p-4" style={{ width: 350 }}>
          <h2 className="text-center mb-3">Inscription</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input className="form-control" placeholder="Nom" value={nom} onChange={e => setNom(e.target.value)} required />
            </div>
            <div className="mb-3">
              <input className="form-control" placeholder="Prénom" value={prenom} onChange={e => setPrenom(e.target.value)} required />
            </div>
            <div className="mb-3">
              <input className="form-control" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>

            <div className="mb-3">
              <input className="form-control" type="password" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            
            <div className="mb-3">
              <label className="form-label">Classe</label>
              <select
                className="form-select"
                value={classe}
                onChange={e => setClasse(e.target.value)}
                required
              >
                <option value="">Sélectionnez votre classe</option>
                {classes.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {classe === "Autre" && (
                <input
                  className="form-control mt-2"
                  placeholder="Précisez votre classe"
                  value={autreClasse}
                  onChange={e => setAutreClasse(e.target.value)}
                  required
                />
              )}
            </div>
            
            <button className="btn btn-success w-100" type="submit">S’inscrire</button>
            {success && <p className="text-success mt-2">{success}</p>}
            {error && <p className="text-danger mt-2">{error}</p>}
          </form>
          <div className="text-center mt-3">
            <a href="/">Déjà inscrit ? Connectez-vous</a>
          </div>
        </div>
      </main>
    </section>
  );
};

export default Register;
