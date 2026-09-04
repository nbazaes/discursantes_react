export async function getDiscursantes(supabase) {
  const { data, error } = await supabase
    .from('discursantes')
    .select('*, discursos(id, Fecha, Tema)')
    .order('Apellidos')
    .order('Nombres');
  if (error) throw error;
  return data;
}

export async function createDiscursante(supabase, data) {
  const { data: created, error } = await supabase
    .from('discursantes')
    .insert(data)
    .select()
    .single();
  if (error) throw error;
  return created;
}

export async function updateDiscursante(supabase, id, data) {
  const { data: updated, error } = await supabase
    .from('discursantes')
    .update(data)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return updated;
}

export async function deleteDiscursante(supabase, id) {
  const { error } = await supabase
    .from('discursantes')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

export async function getSugerencias(supabase) {
  const { data, error } = await supabase
    .from('discursantes')
    .select('*, discursos(Fecha)')
    .order('Apellidos');
  if (error) throw error;

  const conFecha = data.map(d => {
    const fechas = (d.discursos || []).map(disc => disc.Fecha);
    const ultima = fechas.length > 0 ? fechas.sort().reverse()[0] : null;
    return { ...d, ultimaFecha: ultima };
  });

  conFecha.sort((a, b) => {
    if (!a.ultimaFecha && !b.ultimaFecha) return 0;
    if (!a.ultimaFecha) return -1;
    if (!b.ultimaFecha) return 1;
    return new Date(a.ultimaFecha) - new Date(b.ultimaFecha);
  });

  return conFecha;
}

export async function getDiscursosPorFecha(supabase, fecha) {
  const { data, error } = await supabase
    .from('discursos')
    .select('*, discursante:discursantes(id, Nombres, Apellidos, Llamamiento)')
    .eq('Fecha', fecha)
    .order('id');
  if (error) throw error;
  return data;
}

export async function replaceDiscursosFecha(supabase, fecha, discursos) {
  const rows = discursos.map(d => ({ ...d, Fecha: fecha }));
  const { data, error } = await supabase.rpc('replace_discursos_fecha', {
    p_fecha: fecha,
    p_rows: rows,
  });
  if (error) throw error;
  return data ?? [];
}

export async function createDiscursos(supabase, discursos) {
  const { data, error } = await supabase
    .from('discursos')
    .insert(discursos)
    .select();
  if (error) throw error;
  return data;
}

export async function getTemas(supabase) {
  const { data, error } = await supabase
    .from('discursos')
    .select('*, discursante:discursantes(Nombres, Apellidos)')
    .order('Fecha', { ascending: false });
  if (error) throw error;
  return data;
}

export async function getDomingos(supabase) {
  const { data, error } = await supabase
    .from('discursos')
    .select('*, discursante:discursantes(id, Nombres, Apellidos, Llamamiento)')
    .order('Fecha', { ascending: false });
  if (error) throw error;

  const agrupado = {};
  data.forEach(d => {
    const fecha = d.Fecha;
    if (!agrupado[fecha]) agrupado[fecha] = [];
    agrupado[fecha].push(d);
  });

  return Object.keys(agrupado)
    .sort((a, b) => new Date(b) - new Date(a))
    .map(fecha => ({
      fecha,
      discursos: agrupado[fecha]
    }));
}

export async function deleteDiscurso(supabase, id) {
  const { error } = await supabase
    .from('discursos')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

export async function getTareas(supabase) {
  const { data, error } = await supabase
    .from('tareas')
    .select('*, discursante:discursantes(id, Nombres, Apellidos, Llamamiento)')
    .order('posicion')
    .order('id');
  if (error) throw error;
  return data;
}

export async function createTarea(supabase, data) {
  const { data: created, error } = await supabase
    .from('tareas')
    .insert(data)
    .select('*, discursante:discursantes(id, Nombres, Apellidos, Llamamiento)')
    .single();
  if (error) throw error;
  return created;
}

export async function updateTarea(supabase, id, data) {
  const { data: updated, error } = await supabase
    .from('tareas')
    .update(data)
    .eq('id', id)
    .select('*, discursante:discursantes(id, Nombres, Apellidos, Llamamiento)')
    .single();
  if (error) throw error;
  return updated;
}

export async function deleteTarea(supabase, id) {
  const { error } = await supabase
    .from('tareas')
    .delete()
    .eq('id', id);
  if (error) throw error;
}
