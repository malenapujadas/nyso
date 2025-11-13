import { supabase } from './supabase.js';

//funcion para manejar errores
function handleError(context, error) {
  console.error(`[history.js ${context}] Error:`, error);
  throw new Error(error.message);
}

export async function addHistory(userId, vinoId) {
  const { error } = await supabase
  .from('history')
  .insert([{ user_id: userId, vino_id: vinoId }]);
  
  if (error) handleError('addHistory', error);
  return true;
}

export async function getHistory(userId) {
  const { data, error } = await supabase
    .from('history')
    .select('vino_id')
    .eq('user_id', userId);
  
  if (error) handleError('getHistory', error);
  return data.map(h => h.vino_id);
}

export async function clearHistory(userId) {
  const { error } = await supabase
    .from('history')
    .delete()
    .eq('user_id', userId);

  if (error) handleError('clearHistory', error);
  return true;
}