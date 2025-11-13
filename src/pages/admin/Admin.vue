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
  async mounted() {
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
    async reply(sugg) {
      if (!this.user || !this.user.id) {
        this.$router.push('/ingresar');
        return;
      }

      const text = (this.replyText[sugg.id] || '').trim();
      if (!text) return;

      this.sendingReply = { ...this.sendingReply, [sugg.id]: true };
      try {
        await respondSuggestion(sugg.id, text);
        await this.load();
        this.replyText = { ...this.replyText, [sugg.id]: '' };
      } catch (err) {
        console.error(err);
        alert(err.message || 'Error al responder');
      } finally {
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
};
</script>

<template>
  <section class="relative min-h-screen bg-[#f6f6eb] text-[#4e0d05] py-16 px-8 overflow-hidden">

    <img src="/icono1.png" class="absolute top-10 left-10 w-16 opacity-90 rotate-12" />
    <img src="/icono2.png" class="absolute top-16 right-20 w-20 opacity-100 -rotate-6" />
    <img src="/icono3.png" class="absolute top-1/3 left-10 w-22 opacity-80 rotate-3" />
    <img src="/icono4.png" class="absolute top-[40%] right-10 w-18 opacity-80 rotate-6" />
    <img src="/icono5.png" class="absolute bottom-[25%] left-10 w-24 opacity-80 -rotate-6" />
    <img src="/icono6.png" class="absolute bottom-[35%] right-20 w-24 opacity-80 rotate-3" />
    <img src="/icono7.png" class="absolute top-[20%] left-10 w-18 opacity-90 rotate-12" />
    <img src="/icono2.png" class="absolute bottom-16 right-20 w-20 opacity-100 -rotate-6" />
    <img src="/icono6.png" class="absolute bottom-22 left-20 w-24 opacity-100 -rotate-6" />





    <div class="relative z-10 max-w-5xl mx-auto">

      <h1 class="text-4xl font-bold text-[#3c490b] mb-10 text-center  tracking-wide">
        Panel de administración
      </h1>

      <!-- sugerencias -->
      <div class="bg-[#ede8d7] rounded-3xl border border-[#4e0d05]/20 shadow-lg p-8 mb-12">
        <h2 class="text-2xl font-semibold text-[#3c490b] mb-6">
          Sugerencias del blog
        </h2>

        <div v-if="loading" class="text-[#e099a8] text-center py-4">Cargando sugerencias...</div>
        <div v-else-if="error" class="text-red-600">{{ error }}</div>

        <div v-else>
          <p v-if="suggestions.length === 0" class="text-[#4e0d05]/60 italic">
            No hay sugerencias por ahora 
          </p>

          <div
            v-for="s in suggestions"
            :key="s.id"
            class="mb-6 p-6 bg-[#f6f6eb] border border-[#4e0d05]/20 rounded-2xl shadow-sm hover:shadow-md transition-all"
          >
            <div class="flex justify-between items-start">
              <div>
                <h3 class="font-semibold text-lg">{{ s.titulo }}</h3>
                <p class="text-sm text-[#4e0d05]/80">{{ s.descripcion }}</p>
                <p class="text-xs text-[#4e0d05]/50 mt-2">
                  Enviado por: {{ s.nombre || 'Anónimo' }}
                  <span v-if="s.email">({{ s.email }})</span>
                </p>
                <p v-if="s.responded" class="text-sm text-[#3c490b] mt-2 font-medium">Respondido ✔</p>
              </div>

              <button
                @click="deleteSuggestionConfirm(s.id)"
                class="text-[#e099a8] hover:text-[#4e0d05] font-semibold transition-colors"
              >
                Eliminar ✕
              </button>
            </div>

            <!-- Responder -->
            <div class="mt-4">
              <textarea
                v-model="replyText[s.id]"
                rows="3"
                class="w-full border border-[#e099a8]/50 rounded-lg p-3 text-sm text-[#4e0d05] focus:ring-2 focus:ring-[#e099a8] focus:outline-none"
                placeholder="Escribir respuesta..."
              ></textarea>
              <div class="mt-3 flex gap-2">
                <button
                  @click="reply(s)"
                  :disabled="sendingReply[s.id]"
                  class="px-6 py-2 bg-[#e099a8] text-[#3c490b] rounded-full font-semibold hover:bg-[#3c490b] hover:text-[#f6f6eb] transition-all duration-300"
                >
                  <span v-if="sendingReply[s.id]">Enviando...</span>
                  <span v-else>Responder y publicar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Publicaciones -->
      <div class="bg-[#ede8d7] rounded-3xl border border-[#4e0d05]/20 shadow-lg p-8">
        <h2 class="text-2xl font-semibold text-[#3c490b] mb-6">
          Publicaciones del blog
        </h2>

        <div v-if="postsLoading" class="text-[#e099a8] text-center py-4">
          Cargando publicaciones...
        </div>
        <div v-else-if="postsError" class="text-red-600">
          {{ postsError }}
        </div>
        <div v-else>
          <p v-if="posts.length === 0" class="text-[#4e0d05]/60 italic">
            No hay publicaciones aún 
          </p>

          <div
            v-for="p in posts"
            :key="p.id"
            class="mb-4 p-5 bg-[#f6f6eb] border border-[#4e0d05]/20 rounded-2xl flex justify-between items-start hover:shadow-md transition-all"
          >
            <div>
              <h3 class="font-semibold text-lg text-[#4e0d05]">{{ p.titulo }}</h3>
              <p class="text-sm text-[#4e0d05]/80">{{ p.sinopsis || p.descripcion }}</p>
            </div>
            <button
              @click="deletePostConfirm(p.id)"
              class="text-[#e099a8] hover:text-[#4e0d05] font-semibold transition-colors ml-4"
            >
              Eliminar ✕
            </button>
          </div>
        </div>
      </div>

    </div>

   
  </section>
</template>
