import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard"; // AJOUT
import AdminStatsPage from "./pages/AdminStatsPage";
import MembersPage from './pages/MembersPage';



function App() {
  const [token, setToken] = useState(localStorage.getItem("clubcine_token") || "");

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login setToken={setToken} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard token={token} />} /> {/* DÉCOMMENTÉ */}
        <Route path="/admin/stats" element={<AdminStatsPage />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
