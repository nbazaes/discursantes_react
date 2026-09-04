import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { DndContext, DragOverlay, PointerSensor, KeyboardSensor, useSensor, useSensors, useDraggable, useDroppable, closestCorners } from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useTranslation } from 'react-i18next';
import { getTareas, createTarea, updateTarea, deleteTarea, getDiscursantes } from '../lib/db';
import { useSupabase } from '../lib/SupabaseProvider';
import { IconPlus, IconClose, IconEdit, IconDelete, IconBoard, IconCalendar, IconChevronLeft, IconChevronRight, IconGrip } from '../components/Icons';

const COLUMNAS = ['pendiente', 'asignado', 'en_progreso', 'completado'];

function KanbanCard({ tarea, onEdit, onDelete, onMove, colIndex, totalCols, asignado, formatFecha, columnLabels }) {
  const { t } = useTranslation();
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: String(tarea.id) });
  const vencida = tarea.fecha_limite && tarea.estado !== 'completado' && new Date(tarea.fecha_limite + 'T00:00:00') < new Date(new Date().toDateString());

  const prevLabel = colIndex > 0 ? columnLabels[colIndex - 1] : '';
  const nextLabel = colIndex < totalCols - 1 ? columnLabels[colIndex + 1] : '';

  return (
    <div ref={setNodeRef} className={`kanban-card ${isDragging ? 'is-dragging' : ''} ${vencida ? 'kanban-card--overdue' : ''}`}>
      <button
        type="button"
        className="kanban-card__handle"
        {...listeners}
        {...attributes}
        aria-label={t('kanban.dragHandle')}
      >
        <IconGrip size={16} />
      </button>

      <div className="kanban-card__title">{tarea.titulo}</div>

      <div className="kanban-card__meta">
        {asignado(tarea) ? (
          <span className="badge badge-info">{asignado(tarea)}</span>
        ) : (
          <span className="badge">{t('kanban.noAssignee')}</span>
        )}
        {tarea.fecha_limite && (
          <span className={`badge ${vencida ? 'badge-danger' : 'badge-success'}`}>
            <IconCalendar size={12} /> {formatFecha(tarea.fecha_limite)}
          </span>
        )}
      </div>

      {tarea.descripcion && (
        <p className="kanban-card__desc">{tarea.descripcion}</p>
      )}

      <div className="kanban-card__actions">
        <div className="btn-group">
          <button
            type="button"
            className="btn btn-secondary btn-sm btn-icon"
            onClick={() => onMove(tarea, 'left')}
            disabled={colIndex === 0}
            aria-label={t('kanban.moveLeft', { column: prevLabel })}
            title={t('kanban.moveLeft', { column: prevLabel })}
          >
            <IconChevronLeft size={14} />
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm btn-icon"
            onClick={() => onMove(tarea, 'right')}
            disabled={colIndex === totalCols - 1}
            aria-label={t('kanban.moveRight', { column: nextLabel })}
            title={t('kanban.moveRight', { column: nextLabel })}
          >
            <IconChevronRight size={14} />
          </button>
        </div>
        <div className="btn-group">
          <button
            type="button"
            className="btn btn-secondary btn-sm btn-icon"
            onClick={() => onEdit(tarea)}
            aria-label={`${t('common.edit')}: ${tarea.titulo}`}
            title={t('common.edit')}
          >
            <IconEdit size={14} />
          </button>
          <button
            type="button"
            className="btn btn-danger btn-sm btn-icon"
            onClick={() => onDelete(tarea)}
            aria-label={`${t('common.delete')}: ${tarea.titulo}`}
            title={t('common.delete')}
          >
            <IconDelete size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

function KanbanColumn({ col, tareas, ...cardProps }) {
  const { t } = useTranslation();
  const { setNodeRef, isOver } = useDroppable({ id: col.id });

  return (
    <div ref={setNodeRef} className={`kanban-col ${isOver ? 'kanban-col--over' : ''}`}>
      <div className="kanban-col__header">
        <span className={`kanban-col__dot kanban-col__dot--${col.id}`} aria-hidden="true" />
        <h3>{col.label}</h3>
        <span className="counter">{tareas.length}</span>
      </div>
      <div className="kanban-col__body">
        {tareas.length === 0 ? (
          <div className="kanban-col__empty">
            <span className="icon" aria-hidden="true"><IconBoard size={22} /></span>
            <p>{t('kanban.emptyColumn')}</p>
          </div>
        ) : (
          tareas.map(tarea => (
            <KanbanCard key={tarea.id} tarea={tarea} colIndex={COLUMNAS.indexOf(col.id)} totalCols={COLUMNAS.length} {...cardProps} />
          ))
        )}
      </div>
    </div>
  );
}

function Kanban() {
  const { t, i18n } = useTranslation();
  const supabase = useSupabase();
  const [tareas, setTareas] = useState([]);
  const [discursantes, setDiscursantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | 'crear' | 'editar'
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ titulo: '', descripcion: '', DiscursanteId: '', estado: 'pendiente', fecha_limite: '' });
  const [activeTarea, setActiveTarea] = useState(null);
  const [mensaje, setMensaje] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const cargar = useCallback(() => {
    setLoading(true);
    Promise.all([getTareas(supabase), getDiscursantes(supabase)])
      .then(([tareasData, discursantesData]) => {
        setTareas(tareasData);
        setDiscursantes(discursantesData);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [supabase]);

  useEffect(() => { cargar(); }, [cargar]);

  const estadoLabels = useMemo(() => ({
    pendiente: t('kanban.colPendiente'),
    asignado: t('kanban.colAsignado'),
    en_progreso: t('kanban.colEnProgreso'),
    completado: t('kanban.colCompletado'),
  }), [t]);

  const columns = useMemo(() => COLUMNAS.map(id => ({ id, label: estadoLabels[id] })), [estadoLabels]);

  const agrupadas = useMemo(() => {
    const grupos = { pendiente: [], asignado: [], en_progreso: [], completado: [] };
    tareas.forEach(tarea => {
      (grupos[tarea.estado] || (grupos[tarea.estado] = [])).push(tarea);
    });
    return grupos;
  }, [tareas]);

  const nombreAsignado = (tarea) => {
    if (!tarea.DiscursanteId) return null;
    const d = discursantes.find(x => String(x.id) === String(tarea.DiscursanteId));
    return d ? `${d.Apellidos}, ${d.Nombres}` : null;
  };

  const formatFecha = (f) => {
    if (!f) return '';
    const d = new Date(f + 'T00:00:00');
    const locale = i18n.resolvedLanguage?.startsWith('en') ? 'en-US' : 'es-ES';
    return d.toLocaleDateString(locale, { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const mover = async (tarea, direccion) => {
    const idx = COLUMNAS.indexOf(tarea.estado);
    const targetIdx = direccion === 'left' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= COLUMNAS.length) return;
    const nuevoEstado = COLUMNAS[targetIdx];
    const colLength = agrupadas[nuevoEstado].length;
    const anterior = tarea;
    const actualizada = { ...tarea, estado: nuevoEstado, posicion: colLength };
    setTareas(prev => prev.map(t => (t.id === tarea.id ? actualizada : t)));
    try {
      await updateTarea(supabase, tarea.id, { estado: nuevoEstado, posicion: colLength });
    } catch (err) {
      setTareas(prev => prev.map(t => (t.id === tarea.id ? anterior : t)));
      alert(t('kanban.saveError', { error: err.message }));
    }
  };

  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;
    setActiveTarea(null);
    if (!over) return;
    const tarea = tareas.find(x => String(x.id) === String(active.id));
    if (!tarea || !COLUMNAS.includes(over.id) || tarea.estado === over.id) return;
    mover(tarea, COLUMNAS.indexOf(over.id) > COLUMNAS.indexOf(tarea.estado) ? 'right' : 'left');
  }, [tareas, mover]);

  const abrirCrear = () => {
    setForm({ titulo: '', descripcion: '', DiscursanteId: '', estado: 'pendiente', fecha_limite: '' });
    setEditId(null);
    setModal('crear');
  };

  const abrirEditar = (tarea) => {
    setForm({
      titulo: tarea.titulo,
      descripcion: tarea.descripcion || '',
      DiscursanteId: tarea.DiscursanteId ? String(tarea.DiscursanteId) : '',
      estado: tarea.estado,
      fecha_limite: tarea.fecha_limite || '',
    });
    setEditId(tarea.id);
    setModal('editar');
  };

  const guardar = async () => {
    if (!form.titulo.trim()) return;
    try {
      const payload = {
        titulo: form.titulo.trim(),
        descripcion: form.descripcion.trim() || null,
        DiscursanteId: form.DiscursanteId ? parseInt(form.DiscursanteId, 10) : null,
        estado: form.estado,
        fecha_limite: form.fecha_limite || null,
      };

      if (modal === 'crear') {
        const colLength = agrupadas[form.estado].length;
        await createTarea(supabase, { ...payload, posicion: colLength });
        setMensaje(t('kanban.created'));
      } else {
        const original = tareas.find(x => x.id === editId);
        if (original && original.estado !== form.estado) {
          const colLength = agrupadas[form.estado].length;
          payload.posicion = colLength;
        }
        await updateTarea(supabase, editId, payload);
        setMensaje(t('kanban.updated'));
      }
      setModal(null);
      cargar();
    } catch (err) {
      alert(t('kanban.saveError', { error: err.message }));
    }
  };

  const eliminar = async (tarea) => {
    if (!window.confirm(t('kanban.deleteConfirm', { title: tarea.titulo }))) return;
    try {
      await deleteTarea(supabase, tarea.id);
      cargar();
    } catch {
      alert(t('kanban.deleteError'));
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>{t('kanban.title')}</h1>
        <p>{t('kanban.subtitle')}</p>
      </div>

      {mensaje && (
        <div className="toast toast--success" role="status" aria-live="polite">
          <span className="toast__content">{mensaje}</span>
          <button
            type="button"
            className="toast__close"
            onClick={() => setMensaje(null)}
            aria-label={t('common.close')}
          >
            <IconClose size={16} />
          </button>
        </div>
      )}

      <div className="card kanban-card--toolbar">
        <div className="card-header">
          <h2>{t('kanban.boardTitle')}</h2>
          <button className="btn btn-primary" onClick={abrirCrear}>
            <IconPlus size={16} /> {t('kanban.newTask')}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading">{t('common.loading')}</div>
      ) : tareas.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <span className="icon" aria-hidden="true"><IconBoard size={40} /></span>
            <p>{t('kanban.noTasks')}</p>
            <button className="btn btn-primary" onClick={abrirCrear} style={{ marginTop: '1rem' }}>
              {t('kanban.addFirst')}
            </button>
          </div>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={(event) => {
            const tarea = tareas.find(x => String(x.id) === String(event.active.id));
            if (tarea) setActiveTarea(tarea);
          }}
          onDragEnd={handleDragEnd}
          onDragCancel={() => setActiveTarea(null)}
        >
          <div className="kanban-board">
            {columns.map(col => (
              <KanbanColumn
                key={col.id}
                col={col}
                tareas={agrupadas[col.id] || []}
                onEdit={abrirEditar}
                onDelete={eliminar}
                onMove={mover}
                asignado={nombreAsignado}
                formatFecha={formatFecha}
                columnLabels={COLUMNAS.map(id => estadoLabels[id])}
              />
            ))}
          </div>
          <DragOverlay>
            {activeTarea ? (
              <div className="kanban-card kanban-card--overlay">
                <div className="kanban-card__title">{activeTarea.titulo}</div>
                {nombreAsignado(activeTarea) && (
                  <div className="kanban-card__meta">
                    <span className="badge badge-info">{nombreAsignado(activeTarea)}</span>
                  </div>
                )}
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}

      {/* Modal Crear/Editar */}
      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>{modal === 'crear' ? t('kanban.newTaskTitle') : t('kanban.editTaskTitle')}</h2>
            <div className="form-group">
              <label>{t('kanban.taskTitle')} <span className="required">*</span></label>
              <input
                className="form-control"
                value={form.titulo}
                onChange={e => setForm({ ...form, titulo: e.target.value })}
                placeholder={t('kanban.taskTitle')}
                autoFocus
              />
            </div>
            <div className="form-group">
              <label>{t('kanban.description')}</label>
              <textarea
                className="form-control"
                rows={3}
                value={form.descripcion}
                onChange={e => setForm({ ...form, descripcion: e.target.value })}
                placeholder={t('kanban.description')}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>{t('kanban.assignee')}</label>
                <select
                  className="form-control"
                  value={form.DiscursanteId}
                  onChange={e => setForm({ ...form, DiscursanteId: e.target.value })}
                >
                  <option value="">{t('kanban.noAssignee')}</option>
                  {discursantes.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.Apellidos}, {d.Nombres}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>{t('kanban.dueDate')}</label>
                <input
                  className="form-control"
                  type="date"
                  value={form.fecha_limite}
                  onChange={e => setForm({ ...form, fecha_limite: e.target.value })}
                />
              </div>
            </div>
            <div className="form-group">
              <label>{t('kanban.status')}</label>
              <select
                className="form-control"
                value={form.estado}
                onChange={e => setForm({ ...form, estado: e.target.value })}
              >
                {columns.map(col => (
                  <option key={col.id} value={col.id}>{col.label}</option>
                ))}
              </select>
            </div>
            <div className="form-actions">
              <button className="btn btn-primary" onClick={guardar}>
                {modal === 'crear' ? t('common.create') : t('common.save')}
              </button>
              <button className="btn btn-secondary" onClick={() => setModal(null)}>{t('common.cancel')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Kanban;