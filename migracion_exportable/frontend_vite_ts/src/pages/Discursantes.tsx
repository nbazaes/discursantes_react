import { useEffect, useState } from "react";

import { api } from "../api";
import type { Discursante } from "../types";

const API = "/discursantes";

type ModalMode = null | "crear" | "editar";

interface DiscursanteForm {
  Nombres: string;
  Apellidos: string;
  Llamamiento: string;
}

export default function Discursantes() {
  const [discursantes, setDiscursantes] = useState<Discursante[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<ModalMode>(null);
  const [form, setForm] = useState<DiscursanteForm>({ Nombres: "", Apellidos: "", Llamamiento: "" });
  const [editId, setEditId] = useState<number | null>(null);

  const cargar = () => {
    setLoading(true);
    api
      .get<Discursante[]>(API)
      .then((res) => {
        setDiscursantes(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    cargar();
  }, []);

  const abrirCrear = () => {
    setForm({ Nombres: "", Apellidos: "", Llamamiento: "" });
    setEditId(null);
    setModal("crear");
  };

  const abrirEditar = (d: Discursante) => {
    setForm({ Nombres: d.Nombres, Apellidos: d.Apellidos, Llamamiento: d.Llamamiento || "" });
    setEditId(d.id);
    setModal("editar");
  };

  const guardar = async () => {
    if (!form.Nombres.trim() || !form.Apellidos.trim()) return;
    try {
      if (modal === "crear") {
        await api.post(API, form);
      } else if (editId) {
        await api.put(`${API}/${editId}`, form);
      }
      setModal(null);
      cargar();
    } catch (err: any) {
      alert(`Error al guardar: ${err.response?.data?.error || err.message}`);
    }
  };

  const eliminar = async (id: number, nombre: string) => {
    if (!window.confirm(`Eliminar a ${nombre}?`)) return;
    try {
      await api.delete(`${API}/${id}`);
      cargar();
    } catch {
      alert("Error al eliminar");
    }
  };

  const ultimaFecha = (disc: Discursante) => {
    if (!disc.discursos || disc.discursos.length === 0) return null;
    const fechas = disc.discursos.map((d) => d.Fecha).sort().reverse();
    return fechas[0];
  };

  const formatFecha = (f: string | null) => {
    if (!f) return "-";
    const d = new Date(`${f}T00:00:00`);
    return d.toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
  };

  return (
    <div>
      <div className="page-header">
        <h1>Discursantes</h1>
        <p>Administra el listado de discursantes del barrio</p>
      </div>

      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h2 style={{ margin: 0, border: "none", padding: 0 }}>Listado</h2>
          <button className="btn btn-primary" onClick={abrirCrear}>
            + Nuevo Discursante
          </button>
        </div>

        {loading ? (
          <div className="loading">Cargando...</div>
        ) : discursantes.length === 0 ? (
          <div className="empty-state">
            <p>No hay discursantes registrados</p>
            <button className="btn btn-primary" onClick={abrirCrear} style={{ marginTop: "1rem" }}>
              Agregar el primero
            </button>
          </div>
        ) : (
          <table className="tabla">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Llamamiento</th>
                <th>Ultimo Discurso</th>
                <th>Total</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {discursantes.map((d) => (
                <tr key={d.id}>
                  <td>
                    <strong>{d.Apellidos}</strong>, {d.Nombres}
                  </td>
                  <td>{d.Llamamiento || <span style={{ color: "#a0aec0" }}>-</span>}</td>
                  <td>
                    {ultimaFecha(d) ? (
                      <span className="badge badge-info">{formatFecha(ultimaFecha(d))}</span>
                    ) : (
                      <span className="badge badge-warning">Nunca</span>
                    )}
                  </td>
                  <td>{d.discursos ? d.discursos.length : 0}</td>
                  <td>
                    <div className="btn-group">
                      <button className="btn btn-secondary btn-sm" onClick={() => abrirEditar(d)}>
                        Editar
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => eliminar(d.id, `${d.Nombres} ${d.Apellidos}`)}>
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{modal === "crear" ? "Nuevo Discursante" : "Editar Discursante"}</h2>
            <div className="form-group">
              <label>Nombres *</label>
              <input
                className="form-control"
                value={form.Nombres}
                onChange={(e) => setForm({ ...form, Nombres: e.target.value })}
                placeholder="Nombres"
                autoFocus
              />
            </div>
            <div className="form-group">
              <label>Apellidos *</label>
              <input
                className="form-control"
                value={form.Apellidos}
                onChange={(e) => setForm({ ...form, Apellidos: e.target.value })}
                placeholder="Apellidos"
              />
            </div>
            <div className="form-group">
              <label>Llamamiento</label>
              <input
                className="form-control"
                value={form.Llamamiento}
                onChange={(e) => setForm({ ...form, Llamamiento: e.target.value })}
                placeholder="Ej: Lider misional, Presidente de EQ..."
              />
            </div>
            <div className="form-actions">
              <button className="btn btn-primary" onClick={guardar}>
                {modal === "crear" ? "Crear" : "Guardar Cambios"}
              </button>
              <button className="btn btn-secondary" onClick={() => setModal(null)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
