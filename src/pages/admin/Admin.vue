
<script>
import { fetchSuggestions, respondSuggestion } from '../../services/blog.js';
import { subscribeToAuthChanges } from '../../services/auth.js';

export default {
  name: 'AdminSuggestions',
  data() {
    return {
      suggestions: [],
      loading: true,
      error: null,
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
    async load(){
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
    },
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
    }
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
    </div>
  </div>
</template>
