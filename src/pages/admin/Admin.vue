<script>
  import {
    fetchSuggestions,
    respondSuggestion,
    deleteSuggestion,
    fetchLastPost,
    deletePost
  } from '../../services/blog.js';
  import { subscribeToAuthChanges } from '../../services/auth.js';
  import AppH1 from '../../components/AppH1.vue';
  
  export default {
    name: 'AdminSuggestions',
    components: { AppH1 },
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
        user: { id: null },
        showConfirmModal: false,
        confirmTitle: "",
        confirmMessage: "",
        confirmAction: null
      };
    },
  
    async mounted() {
      subscribeToAuthChanges(user => (this.user = user || { id: null }));
  
      if (!this.user || this.user.role !== 'admin') {
        return this.$router.push('/');
      }
  
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
  
      openConfirm(title, message, action) {
        this.confirmTitle = title;
        this.confirmMessage = message;
        this.confirmAction = action;
        this.showConfirmModal = true;
      },
  
      deleteSuggestionConfirm(id, titulo) {
        this.openConfirm(
          "Eliminar sugerencia",
          `¿Seguro que querés eliminar la sugerencia "${titulo}"?`,
          async () => {
            await deleteSuggestion(id);
            await this.load();
          }
        );
      },
  
      deletePostConfirm(id, titulo) {
        this.openConfirm(
          "Eliminar publicación",
          `¿Seguro que querés eliminar la publicación "${titulo}"?`,
          async () => {
            await deletePost(id);
            await this.load();
          }
        );
      }
    }
  };
  </script>
  
  <template>
    <section
      class="relative min-h-screen bg-[#f6f6eb] text-[#4e0d05] py-10 px-4 sm:py-16 sm:px-8 overflow-hidden"
    >
      <!-- Ocultar decoraciones en mobile -->
      <img src="/icono1.png"  alt="" class="hidden md:block absolute top-10 left-10 w-16 opacity-90 rotate-12" />
      <img src="/icono2.png"  alt="" class="hidden md:block absolute top-16 right-20 w-20 opacity-100 -rotate-6" />
      <img src="/icono3.png"  alt="" class="hidden md:block absolute top-1/3 left-10 w-22 opacity-80 rotate-3" />
      <img src="/icono4.png"  alt="" class="hidden md:block absolute top-[40%] right-10 w-18 opacity-80 rotate-6" />
      <img src="/icono5.png"  alt="" class="hidden md:block absolute bottom-[25%] left-10 w-24 opacity-80 -rotate-6" />
      <img src="/icono6.png"  alt="" class="hidden md:block absolute bottom-[35%] right-20 w-24 opacity-80 rotate-3" />
      <img src="/icono7.png"  alt="" class="hidden md:block absolute top-[20%] left-10 w-18 opacity-90 rotate-12" />
      <img src="/icono2.png"  alt="" class="hidden md:block absolute bottom-16 right-20 w-20 opacity-100 -rotate-6" />
      <img src="/icono6.png"  alt="" class="hidden md:block absolute bottom-22 left-20 w-24 opacity-100 -rotate-6" />
  
      <div class="relative z-10 max-w-5xl mx-auto">
        <AppH1
          class="text-3xl sm:text-4xl font-bold text-[#3c490b] mb-8 sm:mb-10 text-center tracking-wide"
        >
          Panel de administración
        </AppH1>
  
        <!-- sugerencias -->
        <div class="bg-[#ede8d7] rounded-3xl border border-[#4e0d05]/20 shadow-lg p-6 sm:p-8 mb-12">
          <h2 class="text-xl sm:text-2xl font-semibold text-[#3c490b] mb-4 sm:mb-6">Sugerencias del blog</h2>
  
          <div v-if="loading" class="text-[#e099a8] text-center py-4">
            Cargando sugerencias...
          </div>
  
          <div v-else-if="error" class="text-red-600">
            {{ error }}
          </div>
  
          <div v-else>
            <p v-if="suggestions.length === 0" class="text-[#4e0d05]/60 italic">
              No hay sugerencias por ahora
            </p>
  
            <div
              v-for="s in suggestions.filter(s => !s.responded)"
              :key="s.id"
              class="mb-6 p-4 sm:p-6 bg-[#f6f6eb] border border-[#4e0d05]/20 rounded-2xl shadow-sm hover:shadow-md transition-all"
            >
              <div class="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div class="w-full">
                  <h3 class="font-semibold text-lg">{{ s.titulo }}</h3>
                  <p class="text-sm text-[#4e0d05]/80">{{ s.descripcion }}</p>
  
                  <p class="text-xs text-[#4e0d05]/50 mt-2">
                    Enviado por: {{ s.nombre || 'Anónimo' }}
                    <span v-if="s.email">({{ s.email }})</span>
                  </p>
  
                  <p v-if="s.responded" class="text-sm text-[#3c490b] mt-2 font-medium">
                    Respondido ✔
                  </p>
                </div>
  
                <button
                  @click="deleteSuggestionConfirm(s.id, s.titulo)"
                  class="self-end sm:self-start text-[#e099a8] hover:text-[#4e0d05] font-semibold transition-colors"
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
  
                <div class="mt-3 flex flex-col sm:flex-row gap-2">
                  <button
                    @click="reply(s)"
                    :disabled="sendingReply[s.id]"
                    class="px-6 py-2 bg-[#e099a8] text-[#3c490b] rounded-full font-semibold hover:bg-[#3c490b] hover:text-[#f6f6eb] transition-all duration-300 w-full sm:w-auto"
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
        <div class="bg-[#ede8d7] rounded-3xl border border-[#4e0d05]/20 shadow-lg p-6 sm:p-8">
          <h2 class="text-xl sm:text-2xl font-semibold text-[#3c490b] mb-6">
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
              class="mb-4 p-4 sm:p-5 bg-[#f6f6eb] border border-[#4e0d05]/20 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:shadow-md transition-all"
            >
              <div>
                <h3 class="font-semibold text-lg text-[#4e0d05]">{{ p.titulo }}</h3>
                <p class="text-sm text-[#4e0d05]/80">
                  {{ p.sinopsis || p.descripcion }}
                </p>
              </div>
  
              <button
                @click="deletePostConfirm(p.id, p.titulo)"
                class="text-[#e099a8] hover:text-[#4e0d05] font-semibold transition-colors sm:ml-4 self-end sm:self-auto"
              >
                Eliminar ✕
              </button>
            </div>
          </div>
        </div>
      </div>
  
      <!-- confirmación -->
      <div
        v-if="showConfirmModal"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4"
      >
        <div
          class="bg-[#ede8d7] border border-[#4e0d05]/20 rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-xl text-center"
        >
          <h3 class="text-lg sm:text-xl font-bold text-[#3c490b] mb-4">
            {{ confirmTitle }}
          </h3>
  
          <p class="text-[#4e0d05]/80 mb-6">
            {{ confirmMessage }}
          </p>
  
          <div class="flex flex-col sm:flex-row justify-center gap-4">
            <button
              @click="showConfirmModal = false"
              class="px-6 py-2 rounded-full border border-[#4e0d05]/40 text-[#3c490b] hover:bg-[#3c490b] hover:text-[#f6f6eb] transition-all"
            >
              Cancelar
            </button>
  
            <button
              @click="confirmAction(); showConfirmModal = false;"
              class="px-6 py-2 rounded-full bg-[#e099a8] text-[#3c490b] hover:bg-[#3c490b] hover:text-[#f6f6eb] transition-all"
            >
              Sí, eliminar
            </button>
          </div>
        </div>
      </div>
    </section>
  </template>
  