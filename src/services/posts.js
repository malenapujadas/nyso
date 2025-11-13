/*----------/  EN REALIDAD ESTE ARCHIVO NO LO ESTOY USANDO XQ ELIMINE LOS POSTS 
 **********/ 
 
 import { supabase } from './supabase.js';

 export async function savePost(data){
    const {error} = await supabase
        .from('social_posts')
        .insert ({
            email: data.email,
            title: `Publicación ${data.title}`,
            content: data.content,
    });

    if(error){
        console.error('[posts.js savePost] error al insertar la publicación: ', error);
        throw new Error(error.message);
    };
 }

 export async function fetchLastpost(){
    const { data, error } = await supabase
            .from('social_posts')
            .select();
        
    if(error){
        console.error('[posts.js fetchLastpost] error al traer las ultimas publicaciones: ', error);
        throw new Error(error.message);
    }  
    return data; 
 }

 export async function subscribeToPosts(callback){
    const postChannel = supabase.channel('social_posts');

    postChannel.on(
        'postgres_changes',
        {
            event: 'INSERT',
            table: 'social_posts',
            schema: 'public',
        },
        payload => {
            callback(payload.new);
        }
    );

    postChannel.subscribe();
 }