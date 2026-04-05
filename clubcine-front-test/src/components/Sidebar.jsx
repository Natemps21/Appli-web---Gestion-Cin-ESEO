import React from "react";
import "../style.css";

function Sidebar({ open, onToggle, onLogout, user, onNavClick }) {
  return (
    <div
      className="sidebar position-fixed top-0 start-0 d-flex flex-column align-items-center"
      style={{
        width: open ? 220 : 60,
        height: "100vh",
        background: "#6c1022", // Rouge très sombre cinéma
        zIndex: 1030,
        transition: "width 0.3s",
        boxShadow: "2px 0 9px rgba(70,20,30,0.13)"
      }}
    >
      {/* Bouton burger + logo */}
      <div
        className="w-100 d-flex align-items-center justify-content-between p-2"
        style={{ cursor: "pointer", minHeight: 54 }}
        onClick={onToggle}
      >
        <span>
          {/* Icone burger doré */}
          <svg width="28" height="28" style={{display:"block"}}>
            <rect y="4" width="28" height="3" rx="2" fill="#FFD782" />
            <rect y="12" width="28" height="3" rx="2" fill="#FFD782" />
            <rect y="20" width="28" height="3" rx="2" fill="#FFD782" />
          </svg>
        </span>
        {open && (
          // Cube doré (logo placeholder)
          <div
            style={{
              width: 32,
              height: 32,
              background: "linear-gradient(120deg, #FFD782 60%, #ffedc3 100%)",
              borderRadius: 8,
              marginLeft: 10,
              boxShadow: "0 3px 16px 0 #b2223470, 0 1px 3px #fff2ab88 inset"
            }}
          />
        )}
      </div>
      {/* Menu (si ouvert) */}
      {open && (
        <div className="sidebar-menu w-100 mt-4">

          <ul className="list-unstyled px-1">
  <li className="py-2 sidebar-link" style={{cursor:"pointer"}} onClick={()=>onNavClick("dashboard")}>
    {/* Maison dorée SVG */}
    <svg viewBox="0 0 24 24" width="20" height="20" style={{marginRight:9,verticalAlign:"middle"}} fill="#FFD782">
      <path d="M12 3L2 12h3v7h6V16h2v3h6v-7h3L12 3z"/>
    </svg>
    Tableau de bord
  </li>
  <li className="py-2 sidebar-link" style={{cursor:"pointer"}} onClick={()=>onNavClick("calendar")}>
    <svg viewBox="0 0 24 24" width="20" height="20" style={{marginRight:9,verticalAlign:"middle"}} fill="#FFD782">
  <rect x="3" y="5" width="18" height="16" rx="3" />
  <rect x="7" y="9" width="10" height="2" rx="1" />
  <rect x="7" y="13" width="6" height="2" rx="1" />
  <rect x="15" y="13" width="2" height="2" rx="1" />
</svg>

    Calendrier
  </li>
  <li className="py-2 sidebar-link" style={{cursor:"pointer"}} onClick={()=>onNavClick("members")}>
    <svg viewBox="0 0 24 24" width="20" height="20" style={{marginRight:9,verticalAlign:"middle"}} fill="#FFD782">
  <circle cx="7" cy="10" r="3"/>
  <circle cx="17" cy="10" r="3"/>
  <rect x="2" y="16" width="8" height="3" rx="1.5"/>
  <rect x="14" y="16" width="8" height="3" rx="1.5"/>
</svg>

    Membres
  </li>
  
  <hr className="text-light"/>
  
  {user && user.role === "admin" && (
  <li className="py-2 sidebar-link" style={{cursor:"pointer"}} onClick={()=>onNavClick("admin-stats")}>
    {/* Icone graphique/statistiques doré */}
    <svg viewBox="0 0 24 24" width="20" height="20" style={{marginRight:9,verticalAlign:"middle"}} fill="#FFD782">
      <rect x="4" y="14" width="3" height="6" rx="1"/>
      <rect x="10" y="10" width="3" height="10" rx="1"/>
      <rect x="16" y="7" width="3" height="13" rx="1"/>
    </svg>
    Statistiques
  </li>
)}

  {user && user.role === "admin" && (
  <li className="py-2 sidebar-link" style={{cursor:"pointer"}} onClick={()=>onNavClick("admin")}>
    {/* Engrenage doré */}
    <svg viewBox="0 0 24 24" width="20" height="20" style={{marginRight:9,verticalAlign:"middle"}} fill="#FFD782">
      <path d="M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7zm7.44-1.44l1.39-1.4-2.06-2.06a7.49 7.49 0 0 0 0-2.2l2.06-2.06-1.4-1.39-2.06 2.06a7.495 7.495 0 0 0-2.2 0l-2.06-2.06-1.39 1.4 2.06 2.06a7.49 7.49 0 0 0 0 2.2l-2.06 2.06 1.4 1.39 2.06-2.06a7.495 7.495 0 0 0 2.2 0l2.06 2.06z"/>
    </svg>
    Administration
  </li>
)}
  <li
    className="py-2 text-danger sidebar-link"
    style={{cursor:"pointer"}}
    onClick={onLogout}
  >
    <i className="bi bi-box-arrow-right me-2"/> Se déconnecter
  </li>
</ul>




        </div>
      )}
    </div>
  );
}

export default Sidebar;
