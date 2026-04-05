import React, { useState, useEffect, useMemo } from "react";

function formatDate(isoString) {
  const d = new Date(isoString);
  return d.toLocaleString("fr-FR", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit"
  });
}

function UpcomingScreenings({ screenings, user }) {
  const data = Array.isArray(screenings) && screenings.length ? screenings : [];
  const [films, setFilms] = useState([]);
  const [inscriptions, setInscriptions] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/film").then(res => res.json()).then(setFilms);
  }, []);

  const displayList = useMemo(() => {
    return data.map(ev => {
      const film = films.find(f => f.id === ev.filmId);
      return {
        ...ev,
        titre: film?.titre || "Film inconnu",
        imageUrl: film?.imageUrl || "/img/default-affiche.jpg",
        formattedDate: formatDate(ev.date)
      };
    });
  }, [data, films]);

  // Fonction de synchronisation dynamique
  const syncInscriptions = async () => {
    if (!user || !displayList.length) return;
    setLoading(true);
    const promises = displayList.map(ev => {
      const url = `/api/inscription/is-inscribed?userId=${user.id}&sortieCineId=${ev.id}`;
      return fetch(url)
        .then(r => r.json())
        .then(val => [ev.id, val === true])
        .catch(() => [ev.id, false]);
    });
    const pairs = await Promise.all(promises);
    const state = {};
    pairs.forEach(([id, inscrit]) => {
      state[id] = inscrit;
    });
    setInscriptions(state);
    setLoading(false);
  };

  useEffect(() => {
    syncInscriptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayList, user]);

  // Inscriptions et désinscriptions toujours suivies d'un sync
  const handleTicketClick = async (ev) => {
    if (!ev.helloAssoUrl) return;
    const payload = {
      userId: user.id,
      SeanceId: "",
      SortieCineId: ev.id,
      DateInscription: new Date().toISOString()
    };
    const response = await fetch("/api/inscription/inscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    await syncInscriptions();
    if (response.ok) {
      window.open(ev.helloAssoUrl, "_blank", "noopener,noreferrer");
    } else if (response.status === 409) {
      alert("Vous êtes déjà inscrit à cette sortie !");
    } else {
      let error = await response.text();
      try { error = JSON.parse(error); } catch {}
      alert(`[Erreur inscription HelloAsso] ${typeof error === "object" ? JSON.stringify(error) : error}`);
    }
  };

  const handleInscription = async (ev) => {
    const payload = {
      userId: user.id,
      SeanceId: "",
      SortieCineId: ev.id,
      DateInscription: new Date().toISOString()
    };
    const response = await fetch("/api/inscription/inscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    await syncInscriptions();
    if (response.ok) {
      // Rien, synchro faite
    } else if (response.status === 409) {
      alert("Vous êtes déjà inscrit à cette sortie !");
    } else {
      let error = await response.text();
      try { error = JSON.parse(error); } catch {}
      alert(`[Erreur API] ${typeof error === "object" ? JSON.stringify(error) : error}`);
    }
  };

  const handleDesinscription = async (ev) => {
    const payload = {
      userId: user.id,
      SeanceId: "",
      SortieCineId: ev.id,
      DateInscription: new Date().toISOString()
    };
    const response = await fetch("/api/inscription/unsubscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    await syncInscriptions();
    if (response.ok) {
    } else {
      let error = await response.text();
      try { error = JSON.parse(error); } catch {}
      alert(`[Erreur désinscription] ${typeof error === "object" ? JSON.stringify(error) : error}`);
    }
  };

  const sortieTitle = (
    <div className="panel-title" style={{
      color: "#FFD782",
      fontSize: "2.05em",
      lineHeight: 1.22,
      fontWeight: 750,
      letterSpacing: ".07em",
      textShadow: "0 3px 10px #3023201c",
      marginLeft: 13,
      marginTop: 8,
      marginBottom: 32,
      paddingLeft: 8,
      textAlign: "left"
    }}>Prochaines sorties cinéma</div>
  );

  if (!displayList.length) {
    return (
      <div>
        {sortieTitle}
        <div style={{
          color: "#ffeed1",
          fontWeight: 650,
          fontSize: "1.28em",
          lineHeight: 1.36,
          letterSpacing: ".05em",
          textShadow: "0 2px 9px #31210088",
          width: "100%",
          textAlign: "left",
          marginLeft: 100,
          paddingLeft: 2
        }}>
          Pas de sortie ciné prévue
        </div>
      </div>
    );
  }

  return (
    <div>
      {sortieTitle}
      <div className="d-flex flex-wrap">
        {displayList.map(ev => (
          <div className="card shadow-sm me-3 mb-3" key={ev.id} style={{ minWidth: 260, maxWidth: 300 }}>
            <img
              src={ev.imageUrl}
              alt={ev.titre}
              className="card-img-top"
              style={{height: 140, objectFit: "cover", borderRadius: "5px 5px 0 0"}}
            />
            <div className="card-body">
              <h5 className="cinema-title card-title">{ev.titre}</h5>
              <div className="mb-2 event-cinema-name" style={{fontSize:"0.95em"}}>
                {ev.emplacement} <br/>
                <span className="badge bg-info me-2">{ev.formattedDate}</span>
                {typeof ev.prix !== "undefined" && !isNaN(ev.prix) ? (
                  <span className="badge bg-warning text-dark ms-1">{ev.prix}&nbsp;€</span>
                ) : null}
              </div>
              <div className="d-flex align-items-center">
                {inscriptions[ev.id] ? (
                  <button
                    className="btn btn-sm btn-outline-danger me-2"
                    onClick={() => handleDesinscription(ev)}
                  >Se désinscrire</button>
                ) : (
                  <>
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => handleInscription(ev)}
                    >S'inscrire</button>
                    {ev.helloAssoUrl && (
                      <button
                        onClick={() => handleTicketClick(ev)}
                        className="btn btn-sm btn-light p-1 d-flex align-items-center"
                        style={{marginLeft: 3, border: "1.5px solid #ffe082"}}
                        title="Acheter sur HelloAsso et m'inscrire"
                      >
                        <span role="img" aria-label="Billet" style={{fontSize: 20, color: "#8d5002", marginRight: 2}}>🎟️</span>
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UpcomingScreenings; 
