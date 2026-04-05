import React, { useState, useEffect } from "react";
import { getAllFilms, addFilm, updateFilm, deleteFilm } from "../api/filmAPI";
import { getAllSeances, addSeance, updateSeance, deleteSeance } from "../api/seanceAPI";
import { getAllSorties, addSortie, updateSortie, deleteSortie } from "../api/sortieCineAPI";

function AdminPanel({ user }) {
  const [selectedTab, setSelectedTab] = useState("films");

const [filmSearch, setFilmSearch] = useState("");   // Pour films
const [sortieSearch, setSortieSearch] = useState(""); // Pour sorties ciné

const [seanceSortDir, setSeanceSortDir] = useState("asc"); // par défaut croissant


  // Films
  const [films, setFilms] = useState([]);
  // Séances
  const [seances, setSeances] = useState([]);
  const [newSeance, setNewSeance] = useState({
    date: "",
    lieu: "",
    filmIds: [],
    statut: "vote",
    
  });
  const [editingSeanceId, setEditingSeanceId] = useState(null);
  const [editingSeance, setEditingSeance] = useState(null);

  // Films CRUD
  const [newFilm, setNewFilm] = useState({
    titre: "",
    description: "N/A",
    imageUrl: "",
    year: "",
    genre: "",
    rating: ""
  });
  const [editingFilmId, setEditingFilmId] = useState(null);
  const [editingFilm, setEditingFilm] = useState(null);

  // Sorties cinéma
  const [sorties, setSorties] = useState([]);
  const [newSortie, setNewSortie] = useState({
    date: "",
    prix: "",
    emplacement: "",
    filmId: ""
  });
  const [editingSortieId, setEditingSortieId] = useState(null);
  const [editingSortie, setEditingSortie] = useState(null);

  useEffect(() => {
    getAllFilms().then(setFilms).catch(() => setFilms([]));
    getAllSeances().then(setSeances).catch(() => setSeances([]));
    getAllSorties().then(setSorties).catch(() => setSorties([]));
  }, []);

  // Films handlers (inclus contrôle title)
  const handleAddFilm = async () => {
  // Vérif champs essentiels
  if (!newFilm.titre || newFilm.titre.trim() === "") {
    alert("Veuillez saisir un titre pour le film.");
    return;
  }
  if (!newFilm.year || isNaN(parseInt(newFilm.year, 10))) {
    alert("Veuillez saisir une année valide (ex: 2021)");
    return;
  }

  // Note facultative → défaut 0 si vide !
  const ratingValue = (newFilm.rating && !isNaN(parseFloat(newFilm.rating)))
    ? parseFloat(newFilm.rating)
    : 0;
  // Description prérenseignée si vide
  const payload = {
    ...newFilm,
    description: newFilm.description && newFilm.description.trim() !== "" ? newFilm.description : "N/A",
    year: parseInt(newFilm.year, 10),
    rating: ratingValue
  };

  try {
    await addFilm(payload);
    setNewFilm({
      titre: "",
      description: "",
      imageUrl: "",
      year: "",
      genre: "",
      rating: ""
    });
    setFilms(await getAllFilms().catch(() => []));
  } catch (err) {
    if (err.response && err.response.data) {
      const errorsObj = err.response.data.errors || {};
      let allFieldMessages = [];
      Object.keys(errorsObj).forEach(field => {
        errorsObj[field].forEach(msg => {
          allFieldMessages.push(`${field}: ${msg}`);
        });
      });
      const apiMsg = allFieldMessages.length > 0
        ? allFieldMessages.join("\n")
        : (err.response.data?.title || err.response.data?.message || JSON.stringify(err.response.data));
      alert(apiMsg);
    } else {
      alert("Erreur inconnue lors de l'ajout du film.");
    }
  }
};



  const handleDeleteFilm = async (id) => {
    await deleteFilm(id);
    setFilms(await getAllFilms().catch(() => []));
  };
  const handleEditFilmClick = (film) => {
    setEditingFilmId(film.id);
    setEditingFilm({ ...film });
  };
  const handleEditFilmChange = (field, value) => {
    setEditingFilm({ ...editingFilm, [field]: value });
  };
  const handleEditFilmSave = async () => {
  const payload = {
    ...editingFilm,
    description: editingFilm.description && editingFilm.description.trim() !== "" ? editingFilm.description : "N/A",
    year: parseInt(editingFilm.year, 10),
    rating: editingFilm.rating && !isNaN(parseFloat(editingFilm.rating)) ? parseFloat(editingFilm.rating) : 0
  };
  try {
    await updateFilm(editingFilmId, payload);
    setEditingFilmId(null);
    setEditingFilm(null);
    setFilms(await getAllFilms().catch(() => []));
  } catch (err) {
    if (err.response && err.response.data) {
      const errorsObj = err.response.data.errors || {};
      let allFieldMessages = [];
      Object.keys(errorsObj).forEach(field => {
        errorsObj[field].forEach(msg => {
          allFieldMessages.push(`${field}: ${msg}`);
        });
      });
      const apiMsg = allFieldMessages.length > 0
        ? allFieldMessages.join("\n")
        : (err.response.data?.title || err.response.data?.message || JSON.stringify(err.response.data));
      alert(apiMsg);
    } else {
      alert("Erreur inconnue lors de la modification du film.");
    }
  }
};

  const handleEditFilmCancel = () => {
    setEditingFilmId(null);
    setEditingFilm(null);
  };

  const handleAddSeance = async () => {
  const { filmToAdd, ...toSend } = newSeance;
  if (!toSend.filmIds || toSend.filmIds.length === 0) {
    alert("Veuillez ajouter au moins un film à la séance.");
    return;
  }
  if (!toSend.lieu || toSend.lieu.trim() === "") {
    alert("Veuillez renseigner un lieu pour la séance.");
    return;
  }
  if (!toSend.date || isNaN(new Date(toSend.date))) {
    alert("Veuillez renseigner une date valide pour la séance.");
    return;
  }

  // Log du payload envoyé
  const payload = {
    ...toSend,
    date: new Date(toSend.date).toISOString(),
    filmIds: Array.isArray(toSend.filmIds) ? toSend.filmIds : []
  };
  console.log("Payload addSeance:", payload);

  try {
    await addSeance(payload);
    setNewSeance({ date: "", lieu: "", filmIds: [], statut: "vote", helloAssoUrl: "" });
    setSeances(await getAllSeances().catch(() => []));
    
  } catch (err) {
    // Recup erreur .NET très détaillée et affichage lisible
    if (err.response && err.response.data) {
      const errorsObj = err.response.data.errors || {};
      let allFieldMessages = [];
      Object.keys(errorsObj).forEach(field => {
        errorsObj[field].forEach(msg => {
          allFieldMessages.push(`${field}: ${msg}`);
        });
      });

      const apiMsg = allFieldMessages.length > 0
        ? allFieldMessages.join("\n")
        : (err.response.data?.message || err.response.data?.title || JSON.stringify(err.response.data));

      alert(apiMsg);
    } else {
      alert("Erreur inconnue lors de la création de la séance !");
    }
  }
};



  const handleDeleteSeance = async (id) => {
    await deleteSeance(id);
    setSeances(await getAllSeances().catch(() => []));
  };
  const handleEditSeanceClick = (seance) => {
    setEditingSeanceId(seance.id);
    setEditingSeance({
      ...seance,
      date: seance.date ? new Date(seance.date).toISOString().substring(0,16) : "",
      filmIds: Array.isArray(seance.filmIds) ? seance.filmIds : [],
      filmToAdd: ""
    });
  };

  const handleEditSeanceChange = (field, value) => {
    setEditingSeance({ ...editingSeance, [field]: value });
  };
  const handleEditSeanceSave = async () => {
    const { filmToAdd, ...toSend } = editingSeance;
    if (!toSend.filmIds || toSend.filmIds.length === 0) {
      alert("Veuillez ajouter au moins un film à la séance.");
      return;
    }
    if (!toSend.date || isNaN(new Date(toSend.date))) {
      alert("Veuillez renseigner une date valide pour la séance.");
      return;
    }
    try {
      await updateSeance(editingSeanceId, {
        ...toSend,
        date: new Date(toSend.date),
        filmIds: Array.isArray(toSend.filmIds) ? toSend.filmIds : []
      });
      setEditingSeanceId(null);
      setEditingSeance(null);
      setSeances(await getAllSeances().catch(() => []));
    } catch (err) {
      alert("Erreur lors de la modification de la séance.");
      // console.error(err);
    }
  };

  const handleEditSeanceCancel = () => {
    setEditingSeanceId(null);
    setEditingSeance(null);
  };

  // Sortie ciné handlers (ajout contrôles date, prix, filmId)
  const handleAddSortie = async () => {
    if (!newSortie.date || isNaN(new Date(newSortie.date))) {
      alert("Veuillez saisir une date valide pour la sortie cinéma.");
      return;
    }
    if (!newSortie.prix || isNaN(parseFloat(newSortie.prix))) {
      alert("Veuillez saisir un prix valide pour la sortie cinéma.");
      return;
    }
    if (!newSortie.filmId || newSortie.filmId.trim() === "") {
      alert("Veuillez sélectionner un film associé à la sortie cinéma.");
      return;
    }
    await addSortie({
      ...newSortie,
      date: new Date(newSortie.date),
      prix: parseFloat(newSortie.prix),
      filmId: newSortie.filmId
    });
    setNewSortie({ date: "", prix: "", emplacement: "", filmId: "" });
    setSorties(await getAllSorties().catch(() => []));
  };

  const handleDeleteSortie = async (id) => {
    await deleteSortie(id);
    setSorties(await getAllSorties().catch(() => []));
  };
  const handleEditSortieClick = (sortie) => {
    setEditingSortieId(sortie.id);
    setEditingSortie({
      ...sortie,
      date: sortie.date ? new Date(sortie.date).toISOString().substring(0,16) : "",
      prix: sortie.prix ? sortie.prix.toString() : "",
      filmId: sortie.filmId || ""
    });
  };
  const handleEditSortieChange = (field, value) => {
    setEditingSortie({ ...editingSortie, [field]: value });
  };
  const handleEditSortieSave = async () => {
    await updateSortie(editingSortieId, {
      ...editingSortie,
      date: new Date(editingSortie.date),
      prix: parseFloat(editingSortie.prix),
      filmId: editingSortie.filmId
    });
    setEditingSortieId(null);
    setEditingSortie(null);
    setSorties(await getAllSorties().catch(() => []));
  };
  const handleEditSortieCancel = () => {
    setEditingSortieId(null);
    setEditingSortie(null);
  };

  // Guards (correction sécurité mapping et affichages)
  const filmsList = Array.isArray(films) ? films : [];
  const seancesList = Array.isArray(seances) ? seances : [];
  const sortiesList = Array.isArray(sorties) ? sorties : [];

  return (
    <div>
      <div className="mb-4">
        <button
          className={selectedTab === "films" ? "btn btn-primary me-2" : "btn btn-outline-secondary me-2"}
          onClick={() => setSelectedTab("films")}
        >
          Gestion des films
        </button>
        <button
          className={selectedTab === "seances" ? "btn btn-primary me-2" : "btn btn-outline-secondary me-2"}
          onClick={() => setSelectedTab("seances")}
        >
          Gestion des séances
        </button>
        <button
          className={selectedTab === "sorties" ? "btn btn-primary" : "btn btn-outline-secondary"}
          onClick={() => setSelectedTab("sorties")}
        >
          Sorties cinéma
        </button>
      </div>

      {selectedTab === "films" && (
        <div className="card mb-4 p-3">
          <h4 className="cinema-title mb-2">Gestion des films</h4>
          <div className="mt-3 d-flex flex-wrap gap-2 align-items-end">
  <input value={newFilm.titre} onChange={e=>setNewFilm({...newFilm, titre:e.target.value})} placeholder="Titre *" />
  <input value={newFilm.description} onChange={e=>setNewFilm({...newFilm, description:e.target.value})} placeholder="Description" />
  <input value={newFilm.imageUrl} onChange={e=>setNewFilm({...newFilm, imageUrl:e.target.value})} placeholder="Image URL" />
  <input value={newFilm.year} onChange={e=>setNewFilm({...newFilm, year:e.target.value})} placeholder="Année *" />
  <input value={newFilm.genre} onChange={e=>setNewFilm({...newFilm, genre:e.target.value})} placeholder="Genre" />
  <input value={newFilm.rating} onChange={e=>setNewFilm({...newFilm, rating:e.target.value})} placeholder="Note (ex: 9.2)" />
  <button onClick={handleAddFilm} className="btn btn-success btn-sm ms-2">Ajouter</button>
</div>
          <br/>
          <input
  type="text"
  placeholder="Recherche film..."
  value={filmSearch}
  onChange={e => setFilmSearch(e.target.value)}
  style={{width: "250px", marginBottom: "10px"}}
/>

<br/>

          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Titre</th>
                <th>Description</th>
                <th>Image</th>
                <th>Année</th>
                <th>Genre</th>
                <th>Note</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filmsList.length > 0 ? filmsList
      .filter(film => film.titre && film.titre.toLowerCase().includes(filmSearch.toLowerCase()))
      .map(film =>
        editingFilmId === film.id ? (
                  <tr key={film.id} style={{background:"#ffeebb"}}>
                    <td><input value={editingFilm.titre} onChange={e => handleEditFilmChange("titre", e.target.value)} /></td>
                    <td><input value={editingFilm.description} onChange={e => handleEditFilmChange("description", e.target.value)} /></td>
                    <td>
                      <input value={editingFilm.imageUrl} onChange={e => handleEditFilmChange("imageUrl", e.target.value)} />
                      {editingFilm.imageUrl && <img src={editingFilm.imageUrl} alt="" style={{maxWidth:60, maxHeight:80}} />}
                    </td>
                    <td><input value={editingFilm.year} onChange={e => handleEditFilmChange("year", e.target.value)} /></td>
                    <td><input value={editingFilm.genre} onChange={e => handleEditFilmChange("genre", e.target.value)} /></td>
                    <td><input value={editingFilm.rating} onChange={e => handleEditFilmChange("rating", e.target.value)} /></td>
                    <td>
                      <button onClick={handleEditFilmSave} className="btn btn-success btn-sm">Valider</button>
                      <button onClick={handleEditFilmCancel} className="btn btn-secondary btn-sm ms-1">Annuler</button>
                    </td>
                  </tr>
                ) : (
                  <tr key={film.id}>
                    <td>{film.titre}</td>
                    <td>{film.description}</td>
                    <td>{film.imageUrl && <img src={film.imageUrl} alt="" style={{maxWidth:60, maxHeight:80}} />}</td>
                    <td>{film.year}</td>
                    <td>{film.genre}</td>
                    <td>{film.rating}</td>
                    <td>
                      <button onClick={() => handleEditFilmClick(film)} className="btn btn-warning btn-sm me-2">Modifier</button>
                      <button onClick={()=>handleDeleteFilm(film.id)} className="btn btn-danger btn-sm">Supprimer</button>
                    </td>
                  </tr>
                )
              ) : (
                <tr><td colSpan={7} className="text-center text-muted">Aucun film</td></tr>
              )}
            </tbody>
          </table>
          

        </div>
      )}

      {selectedTab === "seances" && (
        <div className="card mb-4 p-3">
          <h4 className="cinema-title mb-2">Gestion des séances</h4>
          <div className="mt-3 d-flex flex-wrap gap-2 align-items-end">
  <input type="datetime-local"
    value={newSeance.date}
    onChange={e => setNewSeance({...newSeance, date: e.target.value})}
    placeholder="Date *" />
  <input value={newSeance.lieu}
    onChange={e => setNewSeance({...newSeance, lieu: e.target.value})}
    placeholder="Lieu *" />

  {/* Nouveau select d'ajout film (1 à la fois) */}
  <select
    value={newSeance.filmToAdd || ""}
    onChange={e => setNewSeance({...newSeance, filmToAdd: e.target.value})}
  >
    <option value="">— Sélectionner un film — *</option>
    {filmsList.filter(f=>!newSeance.filmIds.includes(f.id)).map(film => (
      <option key={film.id} value={film.id}>{film.titre}</option>
    ))}
  </select>
  <button
    type="button"
    disabled={!newSeance.filmToAdd}
    className="btn btn-outline-success btn-sm"
    onClick={() => {
      if (newSeance.filmToAdd && !newSeance.filmIds.includes(newSeance.filmToAdd)) {
        setNewSeance({
          ...newSeance,
          filmIds: [...newSeance.filmIds, newSeance.filmToAdd],
          filmToAdd: "" // reset le select
        });
      }
    }}
    title="Ajouter film au vote"
  >+</button>

  {/* Liste films+affiches sélectionnés */}
  <div className="d-flex flex-wrap align-items-center ms-2">
    {newSeance.filmIds.map(fid => {
      const film = filmsList.find(f=>f.id === fid);
      return (
        <span key={fid} className="badge bg-light border text-dark me-2 mb-1 d-flex align-items-center" style={{fontSize: "1em"}}>
          {film?.imageUrl && <img src={film.imageUrl} alt="" height={40} className="me-2" />}
          {film?.titre || fid}
          <button
            type="button"
            className="btn-close btn-sm ms-1"
            onClick={() =>
              setNewSeance({
                ...newSeance,
                filmIds: newSeance.filmIds.filter(f => f !== fid)
              })
            }
            title="Retirer ce film"
            style={{fontSize: "0.85em"}}
          ></button>
        </span>
      );
    })}
  </div>

  <select value={newSeance.statut}
    onChange={e => setNewSeance({...newSeance, statut: e.target.value})}>
    <option value="vote">vote</option>
    <option value="inscription">inscription</option>
    <option value="terminée">terminée</option>
  </select>
  
  <button onClick={handleAddSeance} className="btn btn-success btn-sm ms-2">Ajouter</button>
</div>

          <br/>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th style={{whiteSpace: "nowrap"}}>
  Date
  <button onClick={() => setSeanceSortDir("asc")}
    style={{marginLeft:4, border:"none", background:"none", cursor:"pointer", color: seanceSortDir==="asc"?"#bb8b00":"#888", fontWeight:"bold"}}
    title="Trier décroissant"
  >▲</button>
  <button onClick={() => setSeanceSortDir("desc")}
    style={{border:"none", background:"none", cursor:"pointer", color: seanceSortDir==="desc"?"#bb8b00":"#888", fontWeight:"bold"}}
    title="Trier croissant"
  >▼</button>
</th>
                <th>Lieu</th>
                <th>Film(s)</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
  {
    seancesList.length > 0 ?
      seancesList.slice().sort((a, b) => {
        if (!a.date || !b.date) return 0;
        const da = new Date(a.date);
        const db = new Date(b.date);
        return seanceSortDir === "asc" ? da - db : db - da;
      }).map(seance => (
        editingSeanceId === seance.id ? (
          <tr key={seance.id} style={{background:"#e8edf9"}}>
            <td><input type="datetime-local" value={editingSeance.date} onChange={e => handleEditSeanceChange("date", e.target.value)} /></td>
            <td><input value={editingSeance.lieu} onChange={e => handleEditSeanceChange("lieu", e.target.value)} /></td>
            <td>
              {/* Select d’ajout + gestion films sélectionnés (ton code habituel ici) */}
              <select
                value={editingSeance.filmToAdd || ""}
                onChange={e => handleEditSeanceChange("filmToAdd", e.target.value)}
              >
                <option value="">— Ajouter un film... —</option>
                {filmsList.filter(f=>!(editingSeance.filmIds || []).includes(f.id)).map(film => (
                  <option key={film.id} value={film.id}>{film.titre}</option>
                ))}
              </select>
              <button type="button"
                disabled={!editingSeance.filmToAdd}
                className="btn btn-outline-success btn-sm"
                onClick={() => {
                  if (editingSeance.filmToAdd && !(editingSeance.filmIds || []).includes(editingSeance.filmToAdd)) {
                    setEditingSeance({
                      ...editingSeance,
                      filmIds: [...editingSeance.filmIds, editingSeance.filmToAdd],
                      filmToAdd: ""
                    });
                  }
                }}
                title="Ajouter film au vote"
              >+</button>
              <div className="d-flex flex-wrap align-items-center ms-2">
                {(editingSeance.filmIds || []).map(fid => {
                  const film = filmsList.find(f=>f.id === fid);
                  return (
                    <span key={fid} className="badge bg-light border text-dark me-2 mb-1 d-flex align-items-center" style={{fontSize: "1em"}}>
                      {film?.imageUrl && <img src={film.imageUrl} alt="" height={40} className="me-2" />}
                      {film?.titre || fid}
                      <button
                        type="button"
                        className="btn-close btn-sm ms-1"
                        onClick={() => handleEditSeanceChange("filmIds", editingSeance.filmIds.filter(f => f !== fid))}
                        title="Retirer ce film"
                        style={{fontSize: "0.85em"}}
                      ></button>
                    </span>
                  );
                })}
              </div>
            </td>
            <td>
              <select value={editingSeance.statut} onChange={e => handleEditSeanceChange("statut", e.target.value)}>
                <option value="vote">vote</option>
                <option value="inscription">inscription</option>
                <option value="terminée">terminée</option>
              </select>
            </td>
            <td>
              <button onClick={handleEditSeanceSave} className="btn btn-success btn-sm">Valider</button>
              <button onClick={handleEditSeanceCancel} className="btn btn-secondary btn-sm ms-1">Annuler</button>
            </td>
          </tr>
        ) : (
          <tr key={seance.id}>
            <td>{seance.date && (typeof seance.date === "string" ? seance.date.substring(0,16) : new Date(seance.date).toLocaleString())}</td>
            <td>{seance.lieu}</td>
            <td>{(seance.filmIds || []).map(fid => (
              <span key={fid} className="badge bg-secondary me-1">
                {filmsList.find(f => f.id === fid)?.titre || fid}
              </span>
            ))}</td>
            <td>{seance.statut}</td>
            <td>
              <button onClick={() => handleEditSeanceClick(seance)} className="btn btn-warning btn-sm me-2">Modifier</button>
              <button onClick={() => handleDeleteSeance(seance.id)} className="btn btn-danger btn-sm">Supprimer</button>
            </td>
          </tr>
        )
      ))
      : <tr><td colSpan={5} className="text-center text-muted">Aucune séance</td></tr>
  }
</tbody>

          </table>
          

        </div>
      )}

      {selectedTab === "sorties" && (
  <div className="card mb-4 p-3">
    <h4 className="cinema-title mb-2">Gestion des sorties cinéma</h4>
    
    <div className="mt-3 d-flex flex-wrap gap-2 align-items-end">
      <input
        type="datetime-local"
        value={newSortie.date}
        onChange={e => setNewSortie({...newSortie, date: e.target.value})}
        placeholder="Date *"
      />
      <input
        type="number"
        min="0"
        step="0.5"
        value={newSortie.prix}
        onChange={e => setNewSortie({...newSortie, prix: e.target.value})}
        placeholder="Prix *"
        style={{width:"90px"}}
      />
      <input
        value={newSortie.emplacement}
        onChange={e => setNewSortie({...newSortie, emplacement: e.target.value})}
        placeholder="Emplacement/Ville/Cinéma *"
      />
      <select
        value={newSortie.filmId}
        onChange={e => setNewSortie({...newSortie, filmId: e.target.value})}
      >
        <option value="">— Sélectionner un film — *</option>
        {filmsList.map(film => (
          <option key={film.id} value={film.id}>{film.titre}</option>
        ))}
      </select>
      {newSortie.filmId && filmsList.find(f => f.id === newSortie.filmId)?.imageUrl && (
        <img
          src={filmsList.find(f => f.id === newSortie.filmId).imageUrl}
          alt="Affiche film"
          style={{ maxWidth: 60, maxHeight: 80, marginLeft: 8 }}
        />
      )}
      <input
        value={newSortie.helloAssoUrl || ""}
        onChange={e => setNewSortie({...newSortie, helloAssoUrl: e.target.value})}
        placeholder="Lien HelloAsso (optionnel)"
        style={{width: 220}}
      />
      <button onClick={handleAddSortie} className="btn btn-success btn-sm ms-2">Ajouter</button>
    </div>
    <br/>
    <input
  type="text"
  placeholder="Recherche film..."
  value={sortieSearch}
  onChange={e => setSortieSearch(e.target.value)}
  style={{width: "250px", marginBottom: "10px"}}
/>

<br/> 
    <table className="table table-bordered">
      <thead>
        <tr>
          <th>Date</th>
          <th>Prix</th>
          <th>Emplacement</th>
          <th>Film associé</th>
          <th>Affiche</th>
          <th>Ticket</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
  {sortiesList
    .filter(sortie => {
      const film = filmsList.find(f => f.id === sortie.filmId);
      return !sortieSearch || (
        film && film.titre && film.titre.toLowerCase().includes(sortieSearch.toLowerCase())
      );
    })
    .map(sortie => (
      editingSortieId === sortie.id ? (
        <tr key={sortie.id} style={{background:'#ffeeb6'}}>
          <td>
            <input type="datetime-local" value={editingSortie.date} onChange={e => handleEditSortieChange('date', e.target.value)} />
          </td>
          <td>
            <input type="number" min="0" step="0.01" value={editingSortie.prix} onChange={e => handleEditSortieChange('prix', e.target.value)} style={{width:'80px'}} /> €
          </td>
          <td>
            <input value={editingSortie.emplacement} onChange={e => handleEditSortieChange('emplacement', e.target.value)} />
          </td>
          <td>
            <select value={editingSortie.filmId} onChange={e => handleEditSortieChange('filmId', e.target.value)}>
              <option value="">Sélectionner un film...</option>
              {filmsList.map(f => <option key={f.id} value={f.id}>{f.titre}</option>)}
            </select>
          </td>
          <td>
            {editingSortie.filmId && filmsList.find(f => f.id === editingSortie.filmId)?.imageUrl &&
              <img src={filmsList.find(f => f.id === editingSortie.filmId).imageUrl} alt="Affiche film" style={{maxWidth:60,maxHeight:80}} />}
          </td>
          <td>
            <input
              value={editingSortie.helloAssoUrl || ''}
              onChange={e => handleEditSortieChange('helloAssoUrl', e.target.value)}
              placeholder="Lien HelloAsso (optionnel)"
              style={{width: 120}}
            />
          </td>
          <td>
            <button onClick={handleEditSortieSave} className="btn btn-success btn-sm">Valider</button>
            <button onClick={handleEditSortieCancel} className="btn btn-secondary btn-sm ms-1">Annuler</button>
          </td>
        </tr>
      ) : (
        <tr key={sortie.id}>
          <td>{sortie.date && (typeof sortie.date === 'string' ? sortie.date.substring(0,16) : new Date(sortie.date).toLocaleString())}</td>
          <td>{sortie.prix} €</td>
          <td>{sortie.emplacement}</td>
          <td>{filmsList.find(f=>f.id === sortie.filmId)?.titre || sortie.filmId}</td>
          <td>
            {sortie.filmId && filmsList.find(f=>f.id === sortie.filmId)?.imageUrl &&
              <img src={filmsList.find(f=>f.id === sortie.filmId).imageUrl} alt="Affiche film" style={{maxWidth:60,maxHeight:80}} />}
          </td>
          <td>
            {sortie.helloAssoUrl ? (
              <a href={sortie.helloAssoUrl} target="_blank" rel="noopener noreferrer" title="Lien HelloAsso 🎟️">
                <span role="img" aria-label="Billet" style={{fontSize:20, color:'#8d5002'}}>🎟️</span>
              </a>
            ) : ''}
          </td>
          <td>
            <button onClick={() => handleEditSortieClick(sortie)} className="btn btn-warning btn-sm me-2">Modifier</button>
            <button onClick={()=>handleDeleteSortie(sortie.id)} className="btn btn-danger btn-sm">Supprimer</button>
          </td>
        </tr>
      )
    ))}
</tbody>

    </table>
  </div>
)}

    </div>
  );
}

export default AdminPanel;
 