import React, { useEffect, useState } from "react";

function SidePanelVote({ voteSession, user }) {
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [myVoteId, setMyVoteId] = useState(null); // id du film voté, ou 'voted'
  const [stats, setStats] = useState(null);
  const [seanceStatus, setSeanceStatus] = useState(null);
  const [alreadyVoted, setAlreadyVoted] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("clubcine_token");
    // Charge séance + films
    if (voteSession?.seanceId) {
      fetch(`/api/seance/${voteSession.seanceId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(seance => {
          setSeanceStatus(seance.statut);
          fetch("/api/film")
            .then(res => res.json())
            .then(allFilms => {
              const candidates = allFilms.filter(f => seance.filmIds?.includes(f.id));
              setFilms(candidates);
            });
        });
      // Vérifie si déjà voté (afin d'afficher stats/désactiver bouton)
      if (user && voteSession.seanceId) {
        fetch(`/api/vote/has-voted?userId=${user.id}&seanceId=${voteSession.seanceId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
          .then(r => r.json())
          .then(isVoted => {
            setAlreadyVoted(!!isVoted);
            if (!!isVoted) {
              setMyVoteId("voted");
              fetch(`/api/vote/stats?seanceId=${voteSession.seanceId}`, {
                headers: { Authorization: `Bearer ${token}` }
              })
                .then(res => res.json())
                .then(stats => setStats(stats));
            }
          });
      }
    }
  }, [voteSession, user]);

  const handleVote = filmId => {
    const token = localStorage.getItem("clubcine_token");
    setLoading(true);
    fetch("/api/vote/vote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        userId: user.id,
        seanceId: voteSession.seanceId,
        filmId
      })
    })
      .then(res => {
        setLoading(false);
        if (res.ok) {
          setMyVoteId(filmId);
          setAlreadyVoted(true);
          fetch(`/api/vote/stats?seanceId=${voteSession.seanceId}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
            .then(r => r.json())
            .then(stats => setStats(stats));
        } else {
          alert("Vote déjà effectué ou erreur !");
        }
      });
  };

  const totalVotes = stats ? Object.values(stats).reduce((a, b) => a + b, 0) : 0;

  if (!seanceStatus || seanceStatus.toLowerCase().trim() !== "vote") {
    return null;
  }
  if (!films.length) {
    return <div className="panel-vote text-warning">Chargement panel vote…</div>;
  }

  return (
    <div className="panel-vote mt-2 mb-3">
      <div className="panel-title" style={{marginBottom:"0.35em", fontSize:"2.1em"}}>Vote pour la prochaine séance</div>
      <div style={{height: "26px"}}></div>
      {alreadyVoted && (
        <strong>Tu as déjà voté, merci !</strong>
      )}
      <div>
        {films.map(film => (
          <div key={film.id} className="vote-block">
            <img src={film.imageUrl || "/img/default-affiche.jpg"} alt={film.titre} style={{ width: 36, height: 50 }} />
            <span className="film-title me-3">{film.titre}</span>
            {alreadyVoted ? null : (
              <button
                className="btn btn-sm btn-info"
                disabled={!!myVoteId || loading}
                onClick={() => handleVote(film.id)}
              >
                {myVoteId === film.id ? "Voté !" : "Voter"}
              </button>
            )}
            {stats ? (
              <span className="ms-2 badge bg-secondary">
                {stats[film.id] || 0} vote{(stats[film.id]||0) > 1 ? "s" : ""} {totalVotes > 0 ? (
                  <>({Math.round(100 * (stats[film.id] || 0) / totalVotes)}%)</>
                ) : null}
              </span>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SidePanelVote;
