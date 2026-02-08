import { supabase } from "./supabase";

export async function getUserProfileById(id) {
  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", id)
    .limit(1)
    .single();

  if (error) {
    console.error(
      "[user-profiles.js getUserProfileById] Error al obtener el perfil del usuario: ",
      error
    );
    throw new Error(error.message);
  }

  return data;
}

export async function getUserProfileByEmail(email) {
  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("email", email)
    .limit(1)
    .single();

  if (error && error.code !== "PGRST116") {
    // PGRST116 --> no hay filas encontradas
    console.error("[getUserProfileByEmail] Error al obtener perfil:", error);
    return null;
  }

  return data;
}

export async function createUserProfile(data) {
  const { error } = await supabase.from("user_profiles").insert([data]);

  if (error) {
    console.error(
      "[user-profiles.js createUserProfile] Error al crear el perfil del usuario: ",
      error
    );
    throw new Error(error.message);
  }
}

export async function updateUserProfile(id, newData) {
  const { data, error } = await supabase
    .from("user_profiles")
    .update(newData)
    .eq("id", id)
    .select()
    .single(); // trae el perfil actualizado

  if (error) {
    console.error(
      "[user-profiles.js updateUserProfile] Error al actualizar el perfil del usuario: ",
      error
    );
    throw new Error(error.message);
  }

  return data;
}

export async function getAllUsers() {
  const { data, error } = await supabase
    .from("user_profiles")
    .select("id, display_name, email, role");

  if (error) {
    console.error("[users.js getAllUsers] Error al obtener usuarios:", error);
    throw new Error(error.message);
  }

  return data || [];
}
