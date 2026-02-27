import { supabase } from "./supabase.js";

//funcion para manejar errores 
function handleError(context, error) {
  console.error(`[reviews.js ${context}] Error:`, error);
  throw new Error(error.message);
}

//agregar una reseña
export async function addReview(userId, wineId, userName, rating, comment) {
  const { data, error } = await supabase
    .from("reviews")
    .insert([
      {
        user_id: userId,
        wine_id: wineId,
        user_name: userName, 
        rating: rating,
        comment: comment,
      },
    ])
    .select();

  if (error) handleError("addReview", error);
  return data[0];
}
//traer todas las reseñas (para promedios en listado)
export async function getAllReviewsLight() {
  const { data, error } = await supabase
    .from("reviews")
    .select("wine_id, rating");

  if (error) handleError("getAllReviewsLight", error);
  return data || [];
}

//obtener reseñas de un vino
export async function getReviewsByWineId(wineId) {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("wine_id", wineId)
    .order("created_at", { ascending: false }); // las mas nuevas primero

  if (error) handleError("getReviewsByWineId", error);
  return data || [];
  
}