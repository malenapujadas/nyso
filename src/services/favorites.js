import { supabase } from './supabase.js';

export async function addFavorite(userId, vinoId) {
  const { error } = await supabase.from('favorites').insert([{ user_id: userId, vino_id: vinoId }]);
  if (error) throw error;
}

export async function getFavorites(userId) {
  const { data, error } = await supabase
    .from('favorites')
    .select('vino_id')
    .eq('user_id', userId);
  if (error) throw error;
  return data.map(f => f.vino_id);
}

export async function removeFavorite(userId, vinoId) {
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('vino_id', vinoId);
  if (error) throw error;
}