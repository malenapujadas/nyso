 import { supabase } from './supabase.js';

/*  export async function savePost(data){
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
    }
 } */

 export async function fetchLastpost(){
    const { data, error } = await supabase
            .from('blog')
            .select();
        
    if(error){
        console.error('[posts.js fetchLastpost] error al traer las ultimas publicaciones: ', error);
        throw new Error(error.message);
    }  
    return data; 
 }

// SUGERENCIAS: los usuarios pueden enviar preguntas/temas para el blog
export async function submitSuggestion(suggestion){
   // suggestion: { nombre, email, titulo, descripcion }
   const { data, error } = await supabase
       .from('blog_suggestions')
       .insert([{
           nombre: suggestion.nombre || null,
           email: suggestion.email || null,
           titulo: suggestion.titulo,
           descripcion: suggestion.descripcion,
           responded: false,
       }]);

   if(error){
       console.error('[blog.js submitSuggestion] Error al enviar la sugerencia: ', error);
       throw new Error(error.message);
   }

   return data && data[0];
}

export async function fetchSuggestions(){
   const { data, error } = await supabase
       .from('blog_suggestions')
       .select('*')
       .order('created_at', { ascending: false });

   if(error){
       console.error('[blog.js fetchSuggestions] Error al traer sugerencias: ', error);
       throw new Error(error.message);
   }

   return data;
}

// Responder una sugerencia: actualiza la sugerencia y crea una entrada en la tabla `blog`
export async function respondSuggestion(suggestionId, responseText){
   // obtener la sugerencia
   const { data: suggs, error: getErr } = await supabase
       .from('blog_suggestions')
       .select('*')
       .eq('id', suggestionId)
       .limit(1)
       .single();

   if(getErr){
       console.error('[blog.js respondSuggestion] Error al leer sugerencia: ', getErr);
       throw new Error(getErr.message);
   }

   const suggestion = suggs;

   // crear post en la tabla blog combinando pregunta y respuesta
   const titulo = suggestion.titulo || 'Pregunta del lector';
   const descripcion = `${suggestion.descripcion}\n\nRespuesta del equipo:\n${responseText}`;
   // sinopsis: primeros 100 caracteres de la pregunta o el título
   const sinopsis = (suggestion.descripcion || titulo).substring(0, 100);

   // NO enviar campo id, solo los campos de contenido
   const { data: createdPost, error: createErr } = await supabase
       .from('blog')
       .insert([{ titulo, descripcion, sinopsis }]);

   if(createErr){
       console.error('[blog.js respondSuggestion] Error al crear post: ', createErr);
       throw new Error(createErr.message);
   }

   // actualizar la sugerencia para marcarla como respondida
   const { data: updated, error: updErr } = await supabase
       .from('blog_suggestions')
       .update({ responded: true, response: responseText, responded_at: new Date().toISOString() })
       .eq('id', suggestionId);

   if(updErr){
       console.error('[blog.js respondSuggestion] Error al actualizar sugerencia: ', updErr);
       throw new Error(updErr.message);
   }

   return { suggestion: updated && updated[0], post: createdPost && createdPost[0] };
}

/*  export async function suscribeToPosts(callback){
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
 } */