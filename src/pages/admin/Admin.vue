
<script>
import { fetchSuggestions, respondSuggestion, deleteSuggestion, fetchLastPost, deletePost } from '../../services/blog.js';
import { subscribeToAuthChanges } from '../../services/auth.js';

export default {
  name: 'AdminSuggestions',
  data() {
    return {
      suggestions: [],
      posts: [],
      loading: true,
      postsLoading: true,
      error: null,
      postsError: null,
      replyText: {},
      sendingReply: {},
      user: { id: null }
    };
  },
  async mounted(){
    subscribeToAuthChanges(user => this.user = user || { id: null });
    await this.load();
  },
  methods: {
    async load() {
      this.loading = true;
      this.postsLoading = true;
      try {
        [this.suggestions, this.posts] = await Promise.all([
          fetchSuggestions(),
          fetchLastPost(50)
        ]);
      } catch (err) {
        console.error(err);
        this.error = err.message || 'Error al cargar los datos';
      } finally {
        this.loading = false;
        this.postsLoading = false;
      }
    },
    /* async load(){
      this.loading = true;
      this.error = null;
      try{
        this.suggestions = await fetchSuggestions();
      } catch(err){
        console.error(err);
        this.error = err.message || 'Error al cargar sugerencias';
      } finally{
        this.loading = false;
      }
    }, */
    async reply(sugg){
      if(!this.user || !this.user.id){
        this.$router.push('/ingresar');
        return;
      }

      const text = (this.replyText[sugg.id] || '').trim();
      if(!text) return;

      this.sendingReply = { ...this.sendingReply, [sugg.id]: true };
      try{
        await respondSuggestion(sugg.id, text);
        // recargar lista
        await this.load();
        this.replyText = { ...this.replyText, [sugg.id]: '' };
      } catch(err){
        console.error(err);
        alert(err.message || 'Error al responder');
      } finally{
        this.sendingReply = { ...this.sendingReply, [sugg.id]: false };
      }
    },
    async deleteSuggestionConfirm(id) {
      const confirmed = confirm('¿Seguro que querés eliminar esta sugerencia?');
      if (!confirmed) return;
      try {
        await deleteSuggestion(id);
        await this.load();
        alert('Sugerencia eliminada con éxito');
      } catch (err) {
        console.error(err);
        alert(err.message || 'Error al eliminar la sugerencia.');
      }
    },
    async deletePostConfirm(id) {
      const confirmed = confirm('¿Seguro que querés eliminar esta publicación?');
      if (!confirmed) return;
      try {
        await deletePost(id);
        await this.load();
        alert('Publicación eliminada con éxito');
      } catch (err) {
        console.error(err);
        alert(err.message || 'Error al eliminar la publicación.');
      }
    },
  }
}
</script>

<template>
  <div class="p-6 max-w-4xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">Sugerencias del blog</h1>

    <div v-if="loading">Cargando...</div>
    <div v-else-if="error" class="text-red-600">{{ error }}</div>
    <div v-else>
      <div v-if="suggestions.length === 0">No hay sugerencias.</div>

      <div v-for="s in suggestions" :key="s.id" class="mb-4 p-4 border rounded">
        <div class="flex justify-between items-start">
          <div>
            <h3 class="font-semibold">{{ s.titulo }}</h3>
            <p class="text-sm text-gray-600">{{ s.descripcion }}</p>
            <p class="text-xs text-gray-500 mt-2">Enviado por: {{ s.nombre || 'Anónimo' }} {{ s.email ? ('(' + s.email + ')') : '' }}</p>
            <p v-if="s.responded" class="text-sm text-green-600 mt-2">Respondido</p>
          </div>
          <button
            @click="deleteSuggestionConfirm(s.id)"
            class="text-red-600 hover:text-red-800 font-semibold ml-4"
            >
              Eliminar ✕
          </button>
        </div>

        <div class="mt-3">
          <textarea v-model="replyText[s.id]" rows="3" class="w-full border p-2 rounded" placeholder="Escribir respuesta..."></textarea>
          <div class="mt-2 flex gap-2">
            <button @click="reply(s)" :disabled="sendingReply[s.id]" class="px-4 py-2 bg-[#e099a8] rounded text-white">
              <span v-if="sendingReply[s.id]">Enviando...</span>
              <span v-else>Responder y publicar</span>
            </button>
          </div>
        </div>
      </div>
      <hr class="my-10 border-gray-300" />

      <h2 class="text-2xl font-bold mb-4">Publicaciones del blog</h2>

      <div v-if="postsLoading">Cargando publicaciones...</div>
      <div v-else-if="postsError" class="text-red-600">{{ postsError }}</div>
      <div v-else>
        <div v-for="p in posts" :key="p.id" class="mb-3 p-4 border rounded flex justify-between items-center">
          <div>
            <h3 class="font-semibold">{{ p.titulo }}</h3>
            <p class="text-sm text-gray-600 line-clamp-2">{{ p.sinopsis }}</p>
          </div>
          <button @click="deletePostConfirm(p.id)" class="text-red-600 hover:text-red-800 font-semibold">
            Eliminar ✕
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
