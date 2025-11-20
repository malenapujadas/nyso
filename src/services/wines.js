import { supabase } from './supabase.js';

// trae todos los vinos
export async function getVinos() {
  const { data, error } = await supabase
    .from('wines')
    .select('*')
    .order('nombre', { ascending: true });

  if (error) {
    console.error('[vinos.js getVinos] Error al cargar vinos:', error);
    throw new Error('No se pudieron cargar los vinos');
  }

  return data;
}

// trae un vino por ID
export async function getVinoById(id) {
  const { data, error } = await supabase
    .from('wines')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('[vinos.js getVinoById] Error al cargar vino:', error);
    throw new Error('No se pudo cargar el vino solicitado');
  }

  return data;
}
