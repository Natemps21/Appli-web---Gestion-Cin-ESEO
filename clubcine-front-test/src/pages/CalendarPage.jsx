import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';

function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [filmsDict, setFilmsDict] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("clubcine_token");
    fetch("/api/film", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(filmsArr => {
        const fd = {};
        filmsArr.forEach(f => fd[f.id] = f.titre);
        setFilmsDict(fd);
      });

    Promise.all([
      fetch("/api/seance/all", { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch("/api/sortiecine", { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json())
    ]).then(async ([seances, sorties]) => {
      const eventsSeance = await Promise.all((seances || []).map(async ev => {
        let d = new Date(ev.date);
        d.setDate(d.getDate() - 1); // Correction : -1 jour

        let titreAffiche = "";
        if (ev.statut && ev.statut.toLowerCase().includes("vote")) {
          titreAffiche = "Vote en cours";
        }
        else if (
          ev.statut &&
          (ev.statut.toLowerCase().includes("inscr") || ev.statut.toLowerCase().includes("termin"))
        ) {
          let maxVotes = -1;
          let maxFilmId = null;
          try {
            const res = await fetch(`/api/vote/stats?seanceId=${ev.id}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
              const stats = await res.json();
              Object.entries(stats).forEach(([fid, nb]) => {
                if (nb > maxVotes) {
                  maxVotes = nb;
                  maxFilmId = fid;
                }
              });
            }
          } catch { /* ignore */ }
          if (maxFilmId && filmsDict[maxFilmId]) {
            titreAffiche = filmsDict[maxFilmId];
          } else if (ev.filmGagnantId && filmsDict[ev.filmGagnantId]) {
            titreAffiche = filmsDict[ev.filmGagnantId];
          } else if (Array.isArray(ev.filmIds) && ev.filmIds.length === 1) {
            titreAffiche = filmsDict[ev.filmIds[0]] || ev.filmIds[0];
          } else {
            titreAffiche = "Film non déterminé";
          }
        } else {
          titreAffiche = "";
        }

        return {
          date: d,
          type: "Séance club",
          status: ev.statut,
          titre: titreAffiche,
          place: ev.lieu || ev.place || "",
          hour: d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
          raw: ev
        };
      }));

      const eventsSortie = (sorties || []).map(ev => {
        let d = new Date(ev.date);
        d.setDate(d.getDate() - 1);     // Correction : -1 jour
        d.setHours(d.getHours() - 1);   // Correction : -1 heure
        return {
          date: d,
          type: "Sortie cinéma",
          titre: filmsDict[ev.filmId] || ev.filmTitre || "Film inconnu",
          place: ev.emplacement || "",
          hour: d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
          raw: ev
        };
      });

      setEvents([...eventsSeance, ...eventsSortie]);
    });
  }, [filmsDict]);

  function iso(d) { return d.toISOString().slice(0, 10); }

  const eventsOfDay = events.filter(ev => iso(ev.date) === iso(selectedDate));

  function tileContent({ date, view }) {
    if (view === "month") {
      const seance = events.some(ev => iso(ev.date) === iso(date) && ev.type === "Séance club");
      const sortie = events.some(ev => iso(ev.date) === iso(date) && ev.type === "Sortie cinéma");
      return (
        <>
          {seance && <span style={{
            display: "block", marginTop: 4,
            width: 12, height: 12,
            background: "#7ad3ff", borderRadius: "50%",
            marginLeft: "auto", marginRight: "auto"
          }} title="Séance Club"></span>}
          {sortie && <span style={{
            display: "block", marginTop: 2,
            width: 12, height: 12,
            background: "#FFD782", borderRadius: "50%",
            marginLeft: "auto", marginRight: "auto"
          }} title="Sortie Ciné"></span>}
        </>
      );
    }
    return null;
  }

  return (
    <div>
      <h2 className="cinema-title mb-3">Calendrier des séances et sorties</h2>
      <div className="calendar-fullwidth d-flex flex-row align-items-start" style={{ gap: 50 }}>
        <div style={{ flex: "1 1 0", width: "100%" }}>
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            tileContent={tileContent}
            locale="fr-FR"
            formatMonthYear={(locale, date) => date.toLocaleString('fr-FR', { month: 'long', year: 'numeric' })}
            next2Label={null}
            prev2Label={null}
          />
        </div>
        <div style={{ minWidth: 250, maxWidth: 500, flex: "1 1 0" }}>
          <h4 className="cinema-title" style={{ marginBottom: 18 }}>
            {selectedDate.toLocaleDateString("fr-FR", { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
          </h4>
          {eventsOfDay.length === 0 && (
            <div style={{ color: "#ffedc3", fontWeight: 600, fontSize: "1.11em" }}>
              Aucune séance ou sortie prévue ce jour.
            </div>
          )}
          {eventsOfDay.map((ev, idx) => (
            <div className="card mb-3" key={ev.type + ev.titre + ev.hour + idx} style={{
              background: ev.type === "Sortie cinéma" ? "#b68c29" : "#167ea8",
              color: "#fff"
            }}>
              <div className="card-body">
                <div className="fw-bold cinema-title">
                  <span style={{
                    background: ev.type === "Sortie cinéma" ? "#ffe080" : "#51e1ff",
                    color: "#2a2121", borderRadius: 7, fontSize: "0.97em",
                    padding: "2px 7px", marginRight: 6
                  }}>{ev.type}</span>
                  <span style={{ marginLeft: 6 }}>{ev.titre}</span>
                </div>
                <div className="event-cinema-name">
                  {ev.place && <>{ev.place} &mdash; </>}
                  <b>{ev.hour}</b>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CalendarPage;
