import { supabase } from './supabase.js';

export async function fetchLastPost() {
  const { data, error } = await supabase
    .from('blog')
    .select();

  if (error) {
    console.error('[blog.js fetchLastPost] error al traer las ultimas publicaciones: ', error);
    throw new Error(error.message);
  }

  return data;
}

// funcion para las sugerencias de los usuarios
export async function submitSuggestion(suggestion) {
  const { data, error } = await supabase
    .from('blog_suggestions')
    .insert([{
      nombre: suggestion.nombre || null,
      email: suggestion.email || null,
      titulo: suggestion.titulo,
      descripcion: suggestion.descripcion,
      responded: false,
    }]);

  if (error) {
    console.error('[blog.js submitSuggestion] Error al enviar la sugerencia: ', error);
    throw new Error(error.message);
  }

  return data;
}

export async function fetchSuggestions() {
  const { data, error } = await supabase
    .from('blog_suggestions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[blog.js fetchSuggestions] Error al traer sugerencias: ', error);
    throw new Error(error.message);
  }

  return data;
}

export async function getSuggestionById(id) {
  const { data, error } = await supabase
    .from('blog_suggestions')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('[blog.js getSuggestionById] Error:', error);
    throw new Error(error.message);
  }

  return data;
}

export async function createBlogPostFromSuggestion(suggestion, responseText) {
  const titulo = suggestion.titulo || 'Pregunta del lector';
  const descripcion = responseText;
  const sinopsis = (suggestion.descripcion || titulo).substring(0, 100);

  const { data, error } = await supabase
    .from('blog')
    .insert([{ titulo, descripcion, sinopsis }])
    .select()
    .single();

  if (error) {
    console.error('[blog.js createBlogPostFromSuggestion] Error:', error);
    throw new Error(error.message);
  }

  return data;
}

export async function markSuggestionAsResponded(id, responseText) {
  const { data, error } = await supabase
    .from('blog_suggestions')
    .update({
      responded: true,
      response: responseText,
      responded_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('[blog.js markSuggestionAsResponded] Error:', error);
    throw new Error(error.message);
  }

  return data;
}

// funcion que coordina las 3 anteriores (leer sugerencia, crear post, marcar como respondida)
export async function respondSuggestion(suggestionId, responseText) {
  if (!responseText?.trim()) {
    throw new Error('Debe ingresar una respuesta antes de enviar.');
  }

  // obtener la sugerencia
  const suggestion = await getSuggestionById(suggestionId);
  if (suggestion.responded) {
    console.warn('[blog.js respondSuggestion] Sugerencia ya respondida:', suggestionId);
    return suggestion;
  }

  // crear post y actualizar sugerencia
  const createdPost = await createBlogPostFromSuggestion(suggestion, responseText);
  const updatedSuggestion = await markSuggestionAsResponded(suggestionId, responseText);

  return { suggestion: updatedSuggestion, post: createdPost };
}

// eliminar sugerencia
export async function deleteSuggestion(suggestionId) {
  const { error } = await supabase
    .from('blog_suggestions')
    .delete()
    .eq('id', suggestionId);

  if (error) {
    console.error('[blog.js deleteSuggestion] Error al eliminar sugerencia:', error);
    throw new Error(error.message);
  }

  return true;
}

// eliminar publicacion del blog
export async function deletePost(postId) {
  const { error } = await supabase
    .from('blog')
    .delete()
    .eq('id', postId);

  if (error) {
    console.error('[blog.js deletePost] Error al eliminar post:', error);
    throw new Error(error.message);
  }

  return true;
}
