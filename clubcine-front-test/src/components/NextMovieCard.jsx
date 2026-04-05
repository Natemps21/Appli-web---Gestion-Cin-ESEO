import React, { useState, useEffect } from "react";

function NextMovieCard({ film, user }) {
  const [inscrit, setInscrit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [topFilm, setTopFilm] = useState(null);
  const [display, setDisplay] = useState(false);
  const [noVote, setNoVote] = useState(false);

  // Synchronise l'état inscription via API à chaque nouveau film/user
  useEffect(() => {
    if (film && film.seanceId && user && user.id) {
      fetch(`/api/inscription/is-inscribed?userId=${user.id}&seanceId=${film.seanceId}`)
        .then(r => r.json())
        .then(isOk => setInscrit(!!isOk));
    } else {
      setInscrit(false);
    }
  }, [film, user]);

  useEffect(() => {
    if (!film) {
      setDisplay(false);
      setTopFilm(null);
      setNoVote(false);
      return;
    }
    if (!film.statut || film.statut.toLowerCase().trim() !== "inscription") {
      setDisplay(false);
      setTopFilm(null);
      setNoVote(false);
      return;
    }
    fetch(`/api/vote/stats?seanceId=${film.seanceId}`)
      .then(r => r.json())
      .then(stats => {
        if (stats && Object.keys(stats).length > 0) {
          let maxVotes = -1;
          let maxFilmId = null;
          Object.entries(stats).forEach(([fid, nb]) => {
            if (nb > maxVotes) {
              maxVotes = nb;
              maxFilmId = fid;
            }
          });
          fetch(`/api/film`)
            .then(res => res.json())
            .then(allFilms => {
              let found = allFilms.find(f => f.id === maxFilmId);
              if (!found && film && film.id) {
                found = { ...film };
              }
              if (found) {
                setTopFilm({
                  ...found,
                  date: film.date,
                  isInscribed: film.isInscribed,
                  seanceId: film.seanceId
                });
                setDisplay(true);
                setNoVote(false);
              } else {
                setDisplay(false);
                setTopFilm(null);
                setNoVote(true);
              }
            });
        } else {
          setDisplay(false);
          setTopFilm(null);
          setNoVote(true);
        }
      });
  }, [film]);

  const handleInscription = () => {
    setLoading(true);
    fetch("/api/inscription/inscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.id,
        SeanceId: film.seanceId,
        SortieCineId: "",
        DateInscription: new Date().toISOString(),
      })
    }).then(res => {
      setLoading(false);
      if (res.ok) setInscrit(true);
      else alert("Déjà inscrit ou problème serveur !");
    });
  };

  const handleDesinscription = () => {
    setLoading(true);
    fetch("/api/inscription/unsubscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.id,
        SeanceId: film.seanceId,
        SortieCineId: "",
      })
    }).then(res => {
      setLoading(false);
      if (res.ok) setInscrit(false);
      else alert("Erreur lors de la désinscription !");
    });
  };

  const inscriptionTitle = (
    <div className="panel-title" style={{
      color: "#FFD782",
      fontSize: "2.43em",
      lineHeight: 1.19,
      fontWeight: 750,
      letterSpacing: ".07em",
      textShadow: "0 3px 10px #3023201c",
      marginLeft: 13,
      marginTop: 8,
      marginBottom: 22,
      paddingLeft: 8,
      textAlign: "left"
    }}>Inscriptions séances</div>
  );

  if (!film || !film.statut || film.statut.toLowerCase().trim() !== "inscription") {
    return (
      <div className="card shadow-sm mb-4" style={{ minHeight: 190, paddingTop: 13 }}>
        {inscriptionTitle}
        <div style={{
          color: "#ffeed1",
          fontWeight: 650,
          fontSize: "1.25em",
          lineHeight: 1.36,
          letterSpacing: ".05em",
          textShadow: "0 2px 9px #31210088",
          width: "100%",
          textAlign: "center",
          marginTop: "1em"
        }}>
          Le vote pour la séance du {film && film.date ? film.date : "?"} n&apos;est pas encore terminé.<br /><br />
          Patience jeune padawan...<br /><br />
        </div>
      </div>
    );
  }

  if (noVote && film?.date) {
    return (
      <div className="card shadow-sm mb-4" style={{ minHeight: 190, paddingTop: 13 }}>
        {inscriptionTitle}
        <div style={{
          color: "#ffeed1",
          fontWeight: 650,
          fontSize: "1.44em",
          lineHeight: 1.36,
          letterSpacing: ".05em",
          textShadow: "0 2px 9px #31210088",
          width: "100%",
          textAlign: "center",
          marginTop: "1em"
        }}>
          Pas de vote sur la séance du {film.date}<br /><br />
          Patience jeune padawan...
        </div>
      </div>
    );
  }

  if (!display || !topFilm) return null;

  return (
    <div className="card shadow-sm mb-4" style={{ minHeight: 220 }}>
      {inscriptionTitle}
      <div className="card-body d-flex align-items-center" style={{paddingTop:0}}>
        <img
          src={topFilm?.imageUrl || "/img/default-affiche.jpg"}
          alt={topFilm?.titre || "Film inconnu"}
          style={{
            width: 110,
            height: 145,
            objectFit: "cover",
            borderRadius: 10,
            boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
            marginRight: 32,
            marginLeft: 8
          }}
        />
        <div style={{width:"100%"}}>
          <h4 className="cinema-title">{topFilm?.titre}</h4>
          <div className="mb-3">
            <span className="badge bg-info me-2">{topFilm?.date}</span>
          </div>
          {inscrit ? (
            <button
              className="btn btn-outline-danger"
              disabled={loading}
              onClick={handleDesinscription}
            >
              Se désinscrire
            </button>
          ) : (
            <button
              className="btn btn-warning"
              disabled={loading}
              onClick={handleInscription}
            >
              {loading ? "Enregistrement..." : "S'inscrire"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default NextMovieCard;
