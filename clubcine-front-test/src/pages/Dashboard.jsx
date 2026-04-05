import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import NextMovieCard from "../components/NextMovieCard";
import SidePanelVote from "../components/SidePanelVote";
import UpcomingScreenings from "../components/UpcomingScreenings";
import CalendarPage from "./CalendarPage";
import AdminPanel from "./AdminPanel";
import AdminStatsPage from "./AdminStatsPage";
import MembersPage from "./MembersPage";
import "../style.css";

function EditProfilePage() { return (<div className="cinema-title" style={{fontSize:"1.3em"}}>Modifier mon profil</div>); }

function formatDate(isoString) {
  const d = new Date(isoString);
  return d.toLocaleString("fr-FR", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit"
  });
}

function Dashboard({ token }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState("dashboard");
  const [user, setUser] = useState(null);
  const [films, setFilms] = useState([]);
  const [upcomingScreenings, setUpcomingScreenings] = useState([]);
  const [allSeances, setAllSeances] = useState([]);

  useEffect(() => {
    fetch("/api/film").then(res => res.json()).then(setFilms);
    fetch("/api/seance/all").then(r => r.json()).then(setAllSeances); // <-- ROUTE "all" obligatoire !
    fetch("/api/sortiecine/prochaines")
      .then(res => res.json())
      .then(data => setUpcomingScreenings(data))
      .catch(() => setUpcomingScreenings([]));
    const userStr = localStorage.getItem("clubcine_user");
    if (userStr && userStr !== "undefined" && userStr !== "") {
      try {
        setUser(JSON.parse(userStr));
      } catch (e) {
        setUser(null);
        window.location.href = "/";
      }
    } else {
      setUser(null);
      window.location.href = "/";
    }
  }, []);

  const now = new Date();
  const seancesFutures = allSeances.filter(s => s.date && new Date(s.date) > now);
  // Filtre debug
  // console.log("Séances FUTURES:", seancesFutures);

  // Prochaine séance "inscription"
  const inscriptionSeance = seancesFutures
    .filter(s => s.statut === "inscription")
    .sort((a, b) => new Date(a.date) - new Date(b.date))[0] || null;
  // Prochaine séance "vote"
  const voteSeance = seancesFutures
    .filter(s => s.statut === "vote")
    .sort((a, b) => new Date(a.date) - new Date(b.date))[0] || null;

  function formatInscriptionPanel(seance) {
    if (!seance || !seance.filmIds || !films.length) return null;
    // On prend le premier film de la séance :
    const film = films.find(f => f.id === seance.filmIds[0]);
    if (!film) return null;
    return {
      ...film,
      date: formatDate(seance.date),
      isInscribed: seance.isInscribed,
      seanceId: seance.id,
      statut: seance.statut
    };
  }
  function formatVoteSession(seance) {
    if (!seance) return { hasVoted: false, seanceId: null };
    return {
      hasVoted: false, // Géré dans SidePanelVote
      seanceId: seance.id
    };
  }

  const handleLogout = () => {
    localStorage.removeItem("clubcine_token");
    localStorage.removeItem("clubcine_user");
    window.location.href = "/";
  };
  const handleNavClick = nav => {
    setActivePage(nav);
    setSidebarOpen(false);
  };

  function renderMainPage() {
    switch (activePage) {
      case "calendar": return <CalendarPage />;
      case "members": return <MembersPage />;
      case "edit": return <EditProfilePage />;
      case "admin": return <AdminPanel user={user} />;
      case "admin-stats": return <AdminStatsPage />;
      case "dashboard":
      default:
        return (
          <>
            <div className="row m-0 pt-3 pb-2">
              {/* Inscription panel */}
              <div className="col-lg-7 col-12 mb-3">
                <NextMovieCard film={formatInscriptionPanel(inscriptionSeance)} user={user} />
              </div>
              {/* Vote panel */}
              <div className="col-lg-5 col-12">
                <div className="d-flex flex-column align-items-lg-end align-items-start">
                  <div>
                    <span className="badge bg-secondary me-2">
                      {user ? user.role : ""}
                    </span>
                    <span className="fw-bold">
                      {user ? user.prenom + " " + user.nom : ""}
                    </span>
                  </div>
                  <SidePanelVote voteSession={formatVoteSession(voteSeance)} user={user} />
                </div>
              </div>
            </div>
            {/* Panel sorties cinéma */}
            <div className="row m-0 pt-2">
              <div className="col-12">
                <UpcomingScreenings screenings={upcomingScreenings} user={user} />
              </div>
            </div>
          </>
        );
    }
  }

  return (
    <div className="dashboard-wrapper d-flex" style={{ minHeight: "100vh" }}>
      <Sidebar
        open={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onLogout={handleLogout}
        user={user}
        onNavClick={handleNavClick}
      />
      <div
        className={`dashboard-main flex-grow-1 d-flex flex-column`}
        style={{
          marginLeft: sidebarOpen ? 220 : 60,
          transition: "margin 0.3s",
          background: "#1d0a0d",
          minHeight: "100vh"
        }}
      >
        {renderMainPage()}
      </div>
    </div>
  );
}

export default Dashboard;
