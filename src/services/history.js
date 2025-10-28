import { supabase } from './supabase.js';

export async function addHistory(userId, vinoId) {
  const { error } = await supabase
  .from('history')
  .insert([{ user_id: userId, vino_id: vinoId }]);
  if (error) throw error;
}

export async function getHistory(userId) {
  const { data, error } = await supabase
    .from('history')
    .select('vino_id')
    .eq('user_id', userId);
  if (error) throw error;
  return data.map(h => h.vino_id);
}