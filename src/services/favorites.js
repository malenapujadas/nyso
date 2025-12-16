import { supabase } from "./supabase.js";

//funcion para manejar errores
function handleError(context, error) {
  console.error(`[favorites.js ${context}] Error:`, error);
  throw new Error(error.message);
}

export async function addFavorite(userId, vinoId) {
  const { error } = await supabase
    .from("favorites")
    .insert([{ user_id: userId, vino_id: vinoId }]);
  if (error) handleError("addFavorite", error);
  return true;
}

export async function getFavorites(userId) {
  const { data, error } = await supabase
    .from("favorites")
    .select("vino_id")
    .eq("user_id", userId);
  if (error) handleError("getFavorites", error);
  return data.map((f) => f.vino_id);
}

export async function removeFavorite(userId, vinoId) {
  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("user_id", userId)
    .eq("vino_id", vinoId);
  if (error) handleError("removeFavorite", error);
  return true;
}
