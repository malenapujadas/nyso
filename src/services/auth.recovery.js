import { supabase } from './supabase';
import { getUserProfileByEmail } from './user-profiles';

export async function recoverPassword(email) {

  // verifico si el usuario existe en user_profiles
  const profile = await getUserProfileByEmail(email);

  if (!profile) {
    return {
      ok: false,
      reason: "not_registered"
    };
  }

  // enviar mail de Supabase
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'http://localhost:5173/reset-password' //esto es lo q yo asigne en supabase, tiene que coincidir con la ruta de redireccion den routes
  });

  if (error) {
    return {
      ok: false,
      reason: "supabase_error",
      message: error.message
    };
  }

  return { ok: true };
}

export async function updatePassword(newPassword) {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    return {
      ok: false,
      message: error.message,
    };
  }

  return {
    ok: true,
  };
}
