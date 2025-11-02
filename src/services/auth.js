import { supabase } from './supabase.js';
import { createUserProfile, getUserProfileById, updateUserProfile } from './user-profiles.js';

let user = {
    id: null,
    email: null,
}
let observers=[];

loadUserCurrentAuthState();

async function loadUserCurrentAuthState(){
    const { data, error } = await supabase.auth.getUser();

    if(error) {
        console.warn('[auth.js loadUserCurrentAuthState] No hay un usuario autenticado ');
        return;
    }

    setAuthUserState({
        id: data.user.id,
        email: data.user.email,
    });

    loadExtendedProfile();
};

async function loadExtendedProfile(){
    if(user.id === null) return;
    setAuthUserState(await getUserProfileById(user.id));
}


export async function register(email, password, nombre) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { nombre }, 
        },
      });
  
      if (error) {
        console.error('[auth.js register] Error al registrar el usuario: ', error);
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
        nombre: nombre, 
      });
    } catch (error) {
      console.error('[auth.js register] Error al registrar el usuario: ', error);
      throw new Error(error.message);
    }
  }
  

export async function login(email, password){
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })
    
    if(error) {
        console.error('[auth.js login] Error al autenticar  el usuario: ', error );
        throw new Error(error.message);
    }

    setAuthUserState({
        id: data.user.id,
        email: data.user.email,
    });
    

}

export async function logout(){
    supabase.auth.signOut();
    setAuthUserState({
        id: null,
        email: null,
    });

}

export async function updateAuthUserData(data){
    try {
        await updateUserProfile(user.id, data);

        setAuthUserState(data); 
    } catch (error) {
        
    }
}


export function subscribeToAuthChanges(callback){
    observers.push(callback);
    notify(callback);
}

function notify(callback){
    callback({...user});
}

function notifyAll(){
    observers.forEach(obs => notify(obs));
}

function setAuthUserState(newData){
    user = {
        ...user,
        ...newData,
    }
    notifyAll();
}