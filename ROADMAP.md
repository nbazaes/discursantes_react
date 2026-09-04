# Roadmap

Próximas mejoras para Discursantes, ordenadas por prioridad. Todo trabajo futuro debe
respetar la tenencia por `ward_id` (RLS) y el flujo i18n es/en.

## Tablero de Coordinación (Kanban) — mejoras v2

Ideas fuera de alcance de la primera versión del tablero de tareas:

- **Reordenar dentro de una columna**: arrastrar para priorizar tarjetas dentro de la
  misma columna (persistir `posicion`).
- **Archivar completadas**: botón de archivar en la columna "Completado" para que no
  se acumulen; vista de archivadas con restaurar.
- **Filtros y búsqueda**: filtrar por asignado, fecha límite o texto, y vista por
  responsable.
- **Notificaciones WhatsApp por tarea**: botón para notificar a la persona asignada
  cuando se le asigna una tarea o cambia de estado (reusar infraestructura de
  `send-notifications`).
- **Etiquetas / categorías**: tipos de tarea (discurso, oración, visita, coordinación)
  con colores en las tarjetas.
- **Historial de cambios**: auditar quién movió una tarjeta y cuándo.

## Otras ideas para el obispado

- **Agenda de entrevistas**: calendario de entrevistas del obispo con confirmación.
- **Seguimiento de llamamientos**: registro de llamamientos extendidos, aceptados y
  sostenidos.
- **Asistencia y estadísticas**: métricas de rotación, promedio de discursos por
  miembro, participación por mes.
- **Ministerio / visitas**: asignaciones de miembros a familias con seguimiento.