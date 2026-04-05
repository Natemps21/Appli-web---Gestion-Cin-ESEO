import React, { useEffect, useState } from "react";
import axios from "axios";

function AdminStatsPage() {
  const [seancesByYear, setSeancesByYear] = useState({});
  const [currentSeanceInscrits, setCurrentSeanceInscrits] = useState([]);
  const [nextSortiesInscrits, setNextSortiesInscrits] = useState({});
  const [currentSeanceVotes, setCurrentSeanceVotes] = useState({});
  const [memberCount, setMemberCount] = useState(0);
  const [classCounts, setClassCounts] = useState({});
  const [sorties, setSorties] = useState([]);
  const [films, setFilms] = useState([]);

  useEffect(() => {
    const getToken = () => localStorage.getItem("clubcine_token");
    axios.get("/api/adminstats/seances-per-year", {headers: {Authorization: `Bearer ${getToken()}`}})
      .then(resp => setSeancesByYear(resp.data));
    axios.get("/api/adminstats/current-seance-inscrits", {headers: {Authorization: `Bearer ${getToken()}`}})
      .then(resp => setCurrentSeanceInscrits(resp.data));
    axios.get("/api/adminstats/next-sorties-inscrits", {headers: {Authorization: `Bearer ${getToken()}`}})
      .then(resp => setNextSortiesInscrits(resp.data));
    axios.get("/api/adminstats/current-seance-votes", {headers: {Authorization: `Bearer ${getToken()}`}})
      .then(resp => setCurrentSeanceVotes(resp.data));
    axios.get("/api/adminstats/member-count", {headers: {Authorization: `Bearer ${getToken()}`}})
      .then(resp => setMemberCount(resp.data));
    axios.get("/api/adminstats/class-distribution", {headers: {Authorization: `Bearer ${getToken()}`}})
      .then(resp => setClassCounts(resp.data));
    axios.get("/api/sortiecine")
      .then(resp => setSorties(resp.data || []));
    axios.get("/api/film")
      .then(resp => setFilms(resp.data || []));
  }, []);

  // Fonction de mapping film ID → Titre
  function getFilmTitle(filmId) {
    const film = films.find(f => f.id === filmId);
    return film ? film.titre : filmId;
  }

  // Fonction pour afficher le label d'une sortie : "Lalaland (22/11/2025 18:00)"
  function getSortieLabel(sid) {
  const sortie = sorties.find(s => s.id === sid);
  if (!sortie) return sid;
  const filmName = getFilmTitle(sortie.filmId);

  // Décalage d'une heure en moins en local
  const sortieDate = new Date(sortie.date);
  sortieDate.setHours(sortieDate.getHours() - 1);
  const date = sortieDate.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
  return `${filmName} (${date})`;
}


  return (
    <div>
      <h2 style={{
        color: "#FFD782",
        background: "#6c1022",
        borderRadius: 10,
        padding: "10px 22px",
        letterSpacing: 1,
        fontWeight: 700,
        marginBottom: 34,
        boxShadow: "0 4px 18px 0 #ffdeb387"
      }}>
        Statistiques Club Ciné
      </h2>

      <div className="stats-card">
        <h3>Nombre de séances par an</h3>
        <ul>
          {Object.entries(seancesByYear).map(([year, nb]) =>
            <li key={year}><span className="stats-key-label">{year} :</span> <span className="stats-value-gold">{nb}</span></li>
          )}
        </ul>
      </div>

      <div className="stats-card">
        <h3>Membres inscrits à la séance en cours</h3>
        <table className="table table-dark table-striped" style={{background:"#3a1621", borderRadius:8}}>
          <thead>
            <tr>
              <th>Nom</th><th>Email</th><th>Classe</th>
            </tr>
          </thead>
          <tbody>
            {currentSeanceInscrits.map(u => (
              <tr key={u.id}>
                <td>{u.nom}</td>
                <td>{u.email}</td>
                <td>{u.classe}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="stats-card">
        <h3>Membres inscrits aux prochaines sorties ciné</h3>
        {Object.entries(nextSortiesInscrits).map(([sid, users]) =>
          <div key={sid} style={{marginBottom:20}}>
            <b className="stats-key-label">{getSortieLabel(sid)}</b>
            <ul>
              {users.map(u => (
                <li key={u.id}>
                  <a href={`mailto:${u.email}`} style={{color:"#FFD782", fontWeight:"bold", textDecoration:"underline"}}>{u.nom}</a>
                  <span style={{color:"#fff", marginLeft:4}}>{u.classe ? `(${u.classe})` : ''}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="stats-card">
        <h3>Votes de la séance en cours</h3>
        <ul>
          {Object.entries(currentSeanceVotes).map(([filmId, nb]) =>
            <li key={filmId}>
              <span className="stats-key-label">{getFilmTitle(filmId)} :</span>
              <span className="stats-value-gold">{nb} vote(s)</span>
            </li>
          )}
        </ul>
      </div>

      <div className="stats-card">
        <h3>Nombre total de membres</h3>
        <span className="stats-value-gold" style={{fontSize: "2em"}}>{memberCount}</span>
      </div>

      <div className="stats-card">
        <h3>Répartition des classes</h3>
        <ul>
          {Object.entries(classCounts).map(([classe, nb]) =>
           <li key={classe}><span className="stats-key-label">{classe} :</span> <span className="stats-value-gold">{nb}</span></li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default AdminStatsPage;
