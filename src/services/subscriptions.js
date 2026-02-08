import { supabase } from "./supabase.js";

export async function createSubscription(subscriptionData) {
  const { data, error } = await supabase
    .from("subscriptions")
    .insert([subscriptionData])
    .select()
    .single();

  if (error) {
    console.error("Error creando suscripción:", error);
    throw error;
  }
  return data;
}

// Para validar si ya tiene una activa (opcional, para que no se suscriba 2 veces)
export async function getUserSubscription(userId) {
  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .in("status", ["pending", "active"]) // Solo buscamos las vigentes
    .maybeSingle();

  if (error) console.error(error);
  return data;
}

// 3. Traer TODAS las suscripciones para el Admin
export async function getAllSubscriptions() {
  const { data, error } = await supabase
    .from("subscriptions")
    .select(`
      *,
      user_profiles ( email ) 
    `)
    .order("created_at", { ascending: false }); // Las más nuevas primero

  if (error) {
    console.error("Error al traer suscripciones:", error);
    return [];
  }
  
  // Aplanamos un poco el objeto para que sea más fácil usar el email
  return data.map(sub => ({
    ...sub,
    email: sub.user_profiles?.email || 'No disponible'
  }));
}

// 4. Actualizar estado (Ej: de 'pending' a 'active')
export async function updateSubscriptionStatus(id, newStatus) {
  const { data, error } = await supabase
    .from("subscriptions")
    .update({ status: newStatus })
    .eq("id", id)
    .select();

  if (error) {
    console.error("Error actualizando estado:", error);
    throw error;
  }
  return data;
}