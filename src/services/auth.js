import { supabase } from "./supabase.js";
import {
  createUserProfile,
  getUserProfileById,
  updateUserProfile,
} from "./user-profiles.js";

let user = {
  id: null,
  email: null,
};

let observers = []; // funciones que quieren enterarse si el usuario cambia

loadUserCurrentAuthState();

// ver si hay sesión activa
async function loadUserCurrentAuthState() {
  const { data, error } = await supabase.auth.getUser();

  if (error) return console.warn("[auth.js] No hay usuario autenticado");

  setAuthUserState({
    id: data.user.id,
    email: data.user.email,
  });

  // para completar el perfil
  loadExtendedProfile();
}

// si hay usuario, carga datos completos desde la tabla
async function loadExtendedProfile() {
  if (!user.id) return;

  const profile = await getUserProfileById(user.id);

  // Si el perfil no existe, lo crea
  if (!profile) {
    console.log("[auth] No existe perfil → Creándolo…");

    await createUserProfile({
      id: user.id,
      email: user.email,
      display_name: profile?.display_name || user?.display_name || null,
      role: "user", // default,
      avatar_url: null,
    });

    // volver a cargar el perfil recién creado
    const newProfile = await getUserProfileById(user.id);
    setAuthUserState(newProfile);
    return;
  }

  // Si el perfil existe, lo carga
  setAuthUserState(profile);
}

export async function register(email, password, nombre) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: nombre },
      },
    });

    if (error) {
      console.error(
        "[auth.js register] Error al registrar el usuario: ",
        error
      );
      throw new Error(error.message);
    }

    setAuthUserState({
      id: data.user.id,
      email: data.user.email,
      nombre: nombre,
    });

    await createUserProfile({
      id: data.user.id,
      email: data.user.email,
      display_name: nombre,
    });

    await loadExtendedProfile();
  } catch (error) {
    console.error("[auth.js register] Error al registrar el usuario: ", error);
    throw new Error(error.message);
  }
}

export async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("[auth.js login] Error al autenticar  el usuario: ", error);
    throw new Error(error.message);
  }

  const profile = await getUserProfileById(data.user.id);

  if (profile && profile.is_active === false) {
    // Si está pausado, lo sacamos inmediatamente
    await supabase.auth.signOut();
    throw new Error("SUSPENDED_ACCOUNT");
  }

  setAuthUserState({
    id: data.user.id,
    email: data.user.email,
  });

  await loadExtendedProfile();
}

export async function logout() {
  supabase.auth.signOut();
  setAuthUserState({
    id: null,
    email: null,
  });
}

export async function updateAuthUserData(data) {
  try {
    await updateUserProfile(user.id, data);
    setAuthUserState(data);
  } catch (error) {
    console.error(
      "[auth.js updateAuthUserData] Error al actualizar usuario:",
      error
    );
    throw new Error(error.message);
  }
}

export function subscribeToAuthChanges(callback) {
  observers.push(callback);
  notify(callback);
}

export async function getCurrentUser() {
  // 1. Buscamos el usuario de Auth (email, id)
  const { data: authData } = await supabase.auth.getUser();
  if (!authData?.user) return null;

  // 2. Buscamos tu perfil extendido (avatar, rol, preferencias)
  const profile = await getUserProfileById(authData.user.id);

  // 3. Juntamos todo en un solo objeto y lo devolvemos
  return {
    ...authData.user,
    ...profile
  };
}

function notify(callback) {
  callback({ ...user });
}

function notifyAll() {
  observers.forEach((obs) => notify(obs));
}

function setAuthUserState(newData) {
  user = {
    ...user,
    ...newData,
  };
  notifyAll();
}

export function getAuthUser() {
  return { ...user };
}
