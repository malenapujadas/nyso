// src/services/preferences.js
import { supabase } from './supabase.js';

export async function savePreferencesForUser(userId, answers) {
  // asegúrate que preferences sea POJO, no Proxy (Vue reactive)
  /* const plainPrefs = JSON.parse(JSON.stringify(preferences || {}));  */ 

  const payload = {
    user_id: userId,
    ...answers,
    // Convertir arrays a texto JSON antes de guardar
    sabores: JSON.stringify(answers.sabores || []),
    temas: JSON.stringify(answers.temas || []),
  };

  // upsert: user_id debe ser PK o unique
  const { data, error } = await supabase
    .from('user_preferences')
    .upsert(payload, { returning: 'representation' });

  if (error) {
    console.error('[preferences.js savePreferencesForUser] Error al guardar:', error);
    throw new Error(error.message);
  }

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

  if (error) {
    console.warn('[preferences.js getPreferencesForUser] No se pudieron cargar preferencias:', error);
    return null;
  }

  if (data) {
    // convertir de texto JSON a arrays reales
    data.sabores = typeof data.sabores === 'string' ? JSON.parse(data.sabores) : data.sabores || [];
    data.temas = typeof data.temas === 'string' ? JSON.parse(data.temas) : data.temas || [];
  }

  return data;
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
