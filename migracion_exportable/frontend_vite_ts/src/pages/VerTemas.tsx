import { useEffect, useState } from "react";

import { api } from "../api";
import type { Discurso } from "../types";

export default function VerTemas() {
  const [discursos, setDiscursos] = useState<Discurso[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<Discurso[]>("/discursos/temas")
      .then((res) => {
        setDiscursos(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const formatFecha = (f: string) => {
    const d = new Date(`${f}T00:00:00`);
    return d.toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
  };

  const temasMap: Record<string, Discurso[]> = {};
  discursos.forEach((d) => {
    const tema = d.Tema;
    if (!temasMap[tema]) temasMap[tema] = [];
    temasMap[tema].push(d);
  });

  const temas = Object.keys(temasMap).sort();

  return (
    <div>
      <div className="page-header">
        <h1>Temas</h1>
        <p>Temas tratados en los discursos dominicales</p>
      </div>

      {loading ? (
        <div className="loading">Cargando...</div>
      ) : temas.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <p>No hay temas registrados aun</p>
          </div>
        </div>
      ) : (
        <div className="card">
          <table className="tabla">
            <thead>
              <tr>
                <th>Tema</th>
                <th>Discursante</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {discursos.map((d) => (
                <tr key={d.id}>
                  <td>
                    <strong>{d.Tema}</strong>
                  </td>
                  <td>{d.discursante ? `${d.discursante.Nombres} ${d.discursante.Apellidos}` : "-"}</td>
                  <td>
                    <span className="badge badge-info">{formatFecha(d.Fecha)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
