import { BrowserRouter as Router, Link, Route, Routes, useLocation } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Discursantes from "./pages/Discursantes";
import Historial from "./pages/Historial";
import SeleccionarDomingo from "./pages/SeleccionarDomingo";
import VerTemas from "./pages/VerTemas";

function NavBar() {
  const location = useLocation();

  const links = [
    { to: "/", label: "Inicio" },
    { to: "/seleccionar-domingo", label: "Nuevo Domingo" },
    { to: "/discursantes", label: "Discursantes" },
    { to: "/temas", label: "Temas" },
    { to: "/historial", label: "Historial" },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Discursantes</Link>
      </div>
      <div className="navbar-links">
        {links.map((link) => (
          <Link key={link.to} to={link.to} className={location.pathname === link.to ? "active" : ""}>
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <div className="App">
      <Router>
        <NavBar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/discursantes" element={<Discursantes />} />
            <Route path="/seleccionar-domingo" element={<SeleccionarDomingo />} />
            <Route path="/temas" element={<VerTemas />} />
            <Route path="/historial" element={<Historial />} />
          </Routes>
        </main>
      </Router>
    </div>
  );
}
