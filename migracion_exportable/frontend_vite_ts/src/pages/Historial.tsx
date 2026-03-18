import { useEffect, useState } from "react";

import { api } from "../api";
import type { DomingoAgrupado } from "../types";

export default function Historial() {
  const [domingos, setDomingos] = useState<DomingoAgrupado[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<DomingoAgrupado[]>("/discursos/domingos")
      .then((res) => {
        setDomingos(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const formatFecha = (f: string) => {
    const d = new Date(`${f}T00:00:00`);
    return d.toLocaleDateString("es-ES", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const eliminarDiscurso = async (id: number) => {
    if (!window.confirm("Eliminar este discurso?")) return;
    try {
      await api.delete(`/discursos/${id}`);
      const res = await api.get<DomingoAgrupado[]>("/discursos/domingos");
      setDomingos(res.data);
    } catch {
      alert("Error al eliminar");
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Historial de Domingos</h1>
        <p>Registro completo de discursos pasados</p>
      </div>

      {loading ? (
        <div className="loading">Cargando...</div>
      ) : domingos.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <p>No hay domingos registrados aun</p>
          </div>
        </div>
      ) : (
        domingos.map((domingo) => (
          <div key={domingo.fecha} className="card domingo-group">
            <div className="domingo-fecha">{formatFecha(domingo.fecha)}</div>
            <table className="tabla">
              <thead>
                <tr>
                  <th>Discursante</th>
                  <th>Llamamiento</th>
                  <th>Tema</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {domingo.discursos.map((d) => (
                  <tr key={d.id}>
                    <td>
                      <strong>{d.discursante ? `${d.discursante.Nombres} ${d.discursante.Apellidos}` : "Desconocido"}</strong>
                    </td>
                    <td>{d.discursante?.Llamamiento || "-"}</td>
                    <td>{d.Tema}</td>
                    <td>
                      <button className="btn btn-danger btn-sm" onClick={() => eliminarDiscurso(d.id)}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>
  );
}
