import { supabase } from "./supabase";

export async function getUserProfileById(id) {
    const { data, error } = await supabase
        .from('user_profiles')
        .select('*') 
        .eq('id', id)
        .limit(1)
        .single();

    if (error) {
        console.error('[user-profiles.js getUserProfileById] Error al obtener el perfil del usuario: ', error);
        throw new Error(error.message);
    }

    return data;
}

export async function createUserProfile(data){
    const { error } = await supabase
        .from('user_profiles')
        .insert([data]); 
    if(error){
        console.error('[user-profiles.js createUserProfile] Error al crear el perfil del usuario: ', error);
        throw new Error(error.message);
    }
} 

export async function updateUserProfile(id, newData){
    const {data, error} = await supabase
        .from('user_profiles')
        .update(newData)
        .eq('id', id)
        .select()
        .single(); // <-- esto trae el perfil actualizado

    if(error){
        console.error('[user-profiles.js updateUserProfile] Error al actualizar el perfil del usuario: ', error);
        throw new Error(error.message);
    }
    return data; // <-- retorna el perfil actualizado
}
/* export async function updateUserProfile(id, newData){
    const {data, error} = await supabase
        .from('user_profiles')
        .update(newData)
        .eq('id', id)

    const perfilActualizado = await updateUserProfile(id, newData);
    this.perfil = perfilActualizado;

    if(error){
        console.error('[user-profiles.js updateUserProfile] Error al actualizar el perfil del usuario: ', error);
        throw new Error(error.message);
    }
}  */