import React from 'react';
import { Link } from 'react-router-dom';

function Dashboard() {
  return (
    <div>
      <div className="page-header">
        <h1>Panel Principal</h1>
        <p>Gestión de discursantes y discursos dominicales</p>
      </div>

      <div className="dashboard-cards">
        <Link to="/seleccionar-domingo" className="dash-card">
          <div className="card-icon">🗓️</div>
          <h3>Seleccionar Discursantes para el Domingo</h3>
          <p>Asignar discursantes y temas para el próximo domingo</p>
        </Link>

        <Link to="/discursantes" className="dash-card">
          <div className="card-icon">👥</div>
          <h3>Ver Discursantes</h3>
          <p>Administrar el listado de discursantes del barrio</p>
        </Link>

        <Link to="/temas" className="dash-card">
          <div className="card-icon">📖</div>
          <h3>Ver Temas</h3>
          <p>Consultar los temas que se han tratado en los discursos</p>
        </Link>

        <Link to="/historial" className="dash-card">
          <div className="card-icon">📅</div>
          <h3>Historial de Domingos</h3>
          <p>Ver el registro completo de discursos por fecha</p>
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;
