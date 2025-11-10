// src/services/preferences.js
import { supabase } from './supabase.js';

/**
 * Guarda / actualiza las preferencias del usuario en user_preferences
 * @param {string} userId
 * @param {string|null} email
 * @param {Object} preferences  // POJO (no proxy)
 * @returns {Array} data (representation) or throws error
 */
export async function savePreferencesForUser(userId, email = null, preferences = {}) {
  // asegúrate que preferences sea POJO, no Proxy (Vue reactive)
  const plainPrefs = JSON.parse(JSON.stringify(preferences || {}));

  const payload = {
    user_id: userId,
    gusto: plainPrefs.gusto ?? null,
    como: plainPrefs.como ?? null,
    intensidad: plainPrefs.intensidad ?? null,
    sabores: Array.isArray(plainPrefs.sabores) ? plainPrefs.sabores : (plainPrefs.sabores ? [plainPrefs.sabores] : []),
    frecuencia: plainPrefs.frecuencia ?? null,
    con_quien: plainPrefs.conQuien ?? plainPrefs.con_quien ?? null,
    temas: Array.isArray(plainPrefs.temas) ? plainPrefs.temas : (plainPrefs.temas ? [plainPrefs.temas] : []),
    temas_libre: plainPrefs.temas_libre ?? null,
    updated_at: new Date().toISOString(),
  };

  // upsert: user_id debe ser PK o unique
  const { data, error } = await supabase
    .from('user_preferences')
    .upsert([payload], { returning: 'representation' });

  if (error) throw error;
  return data;
}

/**
 * Obtiene las preferencias (si existen) desde user_preferences
 */
export async function getPreferencesForUser(userId) {
  const { data, error } = await supabase
    .from('user_preferences')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  return data; // puede ser null si no existe
}

// Trae user_preferences y los datos de auth.user
export async function getUserProfileAndPreferences(userId) {
  const { data: userPrefs, error: prefsError } = await supabase
    .from('user_preferences')
    .select('*')
    .eq('user_id', userId)
    .single();

  /* if (prefsError && prefsError.code !== 'PGRST116') throw prefsError;  */

  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;

  return {
    user: user.user,
    preferences: userPrefs || {},
  };
}
