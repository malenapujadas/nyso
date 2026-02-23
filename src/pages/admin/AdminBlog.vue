<script>
import {
  fetchSuggestions,
  respondSuggestion,
  deleteSuggestion,
  fetchLastPost,
  deletePost,
} from "../../services/blog.js";
import { subscribeToAuthChanges } from "../../services/auth.js";
import AppH1 from "../../components/AppH1.vue";

export default {
  name: "AdminBlog",
  components: { AppH1 },
  data() {
    return {
      suggestions: [],
      posts: [],
      loading: true,
      postsLoading: true,
      error: null,
      postsError: null,

      // buscador + paginación
      suggSearchQuery: "",
      postsSearchQuery: "",
      suggCurrentPage: 1,
      suggPerPage: 6,
      postsCurrentPage: 1,
      postsPerPage: 6,

      replyText: {},
      sendingReply: {},
      user: { id: null },
      showConfirmModal: false,
      confirmTitle: "",
      confirmMessage: "",
      confirmAction: null,
    };
  },

  computed: {
    // SUGERENCIAS (solo no respondidas, como ya mostrás)
    filteredSuggestions() {
      const query = this.suggSearchQuery?.toLowerCase() || "";
      return this.suggestions
        .filter((s) => !s.responded)
        .filter((s) => {
          const t = (s.titulo || "").toLowerCase();
          const d = (s.descripcion || "").toLowerCase();
          const n = (s.nombre || "").toLowerCase();
          const e = (s.email || "").toLowerCase();
          return (
            t.includes(query) ||
            d.includes(query) ||
            n.includes(query) ||
            e.includes(query)
          );
        });
    },

    suggTotalPages() {
      return Math.max(
        1,
        Math.ceil(this.filteredSuggestions.length / this.suggPerPage)
      );
    },

    paginatedSuggestions() {
      const start = (this.suggCurrentPage - 1) * this.suggPerPage;
      const end = start + this.suggPerPage;
      return this.filteredSuggestions.slice(start, end);
    },

    // POSTS
    filteredPosts() {
      const query = this.postsSearchQuery?.toLowerCase() || "";
      return this.posts.filter((p) => {
        const t = (p.titulo || "").toLowerCase();
        const s = (p.sinopsis || "").toLowerCase();
        const d = (p.descripcion || "").toLowerCase();
        return t.includes(query) || s.includes(query) || d.includes(query);
      });
    },

    postsTotalPages() {
      return Math.max(
        1,
        Math.ceil(this.filteredPosts.length / this.postsPerPage)
      );
    },

    paginatedPosts() {
      const start = (this.postsCurrentPage - 1) * this.postsPerPage;
      const end = start + this.postsPerPage;
      return this.filteredPosts.slice(start, end);
    },
  },

  watch: {
    // reset a página 1 cuando buscás
    suggSearchQuery() {
      this.suggCurrentPage = 1;
    },
    postsSearchQuery() {
      this.postsCurrentPage = 1;
    },

    // si quedaste en una página que ya no existe
    suggTotalPages() {
      if (this.suggCurrentPage > this.suggTotalPages) {
        this.suggCurrentPage = this.suggTotalPages;
      }
    },
    postsTotalPages() {
      if (this.postsCurrentPage > this.postsTotalPages) {
        this.postsCurrentPage = this.postsTotalPages;
      }
    },
  },

  async mounted() {
    subscribeToAuthChanges((user) => (this.user = user || { id: null }));

    if (!this.user || this.user.role !== "admin") {
      return this.$router.push("/");
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
          fetchLastPost(50),
        ]);
      } catch (err) {
        console.error(err);
        this.error = err.message || "Error al cargar los datos";
      } finally {
        this.loading = false;
        this.postsLoading = false;
      }
    },

    async reply(sugg) {
      if (!this.user || !this.user.id) {
        this.$router.push("/ingresar");
        return;
      }

      const text = (this.replyText[sugg.id] || "").trim();
      if (!text) return;

      this.sendingReply = { ...this.sendingReply, [sugg.id]: true };

      try {
        await respondSuggestion(sugg.id, text);
        await this.load();
        this.replyText = { ...this.replyText, [sugg.id]: "" };
      } catch (err) {
        console.error(err);
        alert(err.message || "Error al responder");
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
    },

    // PAGINACIÓN (misma lógica que Vinos.vue) + scroll arriba
    goToSuggPage(p) {
      const page = Number(p);
      if (!Number.isFinite(page)) return;

      if (page < 1) this.suggCurrentPage = 1;
      else if (page > this.suggTotalPages)
        this.suggCurrentPage = this.suggTotalPages;
      else this.suggCurrentPage = page;

      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    nextSuggPage() {
      this.goToSuggPage(this.suggCurrentPage + 1);
    },
    prevSuggPage() {
      this.goToSuggPage(this.suggCurrentPage - 1);
    },

    goToPostsPage(p) {
      const page = Number(p);
      if (!Number.isFinite(page)) return;

      if (page < 1) this.postsCurrentPage = 1;
      else if (page > this.postsTotalPages)
        this.postsCurrentPage = this.postsTotalPages;
      else this.postsCurrentPage = page;

      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    nextPostsPage() {
      this.goToPostsPage(this.postsCurrentPage + 1);
    },
    prevPostsPage() {
      this.goToPostsPage(this.postsCurrentPage - 1);
    },
  },
};
</script>

<template>
  <section
    class="relative min-h-screen bg-[#f6f6eb] text-[#4e0d05] py-10 px-4 sm:py-16 sm:px-8 overflow-hidden"
  >
    <!-- Ocultar decoraciones en mobile -->
    <img
      src="/icono1.png"
      alt="icono"
      class="hidden md:block absolute top-10 left-10 w-16 opacity-90 rotate-12"
    />
    <img
      src="/icono2.png"
      alt="icono"
      class="hidden md:block absolute top-16 right-20 w-20 opacity-100 -rotate-6"
    />
    <img
      src="/icono3.png"
      alt="icono"
      class="hidden md:block absolute top-1/3 left-10 w-22 opacity-80 rotate-3"
    />
    <img
      src="/icono4.png"
      alt="icono"
      class="hidden md:block absolute top-[40%] right-10 w-18 opacity-80 rotate-6"
    />
    <img
      src="/icono5.png"
      alt="icono"
      class="hidden md:block absolute bottom-[25%] left-10 w-24 opacity-80 -rotate-6"
    />
    <img
      src="/icono6.png"
      alt="icono"
      class="hidden md:block absolute bottom-[35%] right-20 w-24 opacity-80 rotate-3"
    />
    <img
      src="/icono7.png"
      alt="icono"
      class="hidden md:block absolute top-[20%] left-10 w-18 opacity-90 rotate-12"
    />
    <img
      src="/icono2.png"
      alt="icono"
      class="hidden md:block absolute bottom-16 right-20 w-20 opacity-100 -rotate-6"
    />
    <img
      src="/icono6.png"
      alt="icono"
      class="hidden md:block absolute bottom-22 left-20 w-24 opacity-100 -rotate-6"
    />

    <div class="relative z-10 max-w-5xl mx-auto">
      <AppH1
        class="text-3xl sm:text-4xl font-bold text-[#3c490b] mb-8 sm:mb-10 text-center tracking-wide"
      >
        Gestión del Blog
      </AppH1>

      <p class="text-[#4e0d05]/60">
        Administrá las sugerencias y publicaciones activas.
      </p>

      <!-- sugerencias -->
      <div
        class="bg-[#ede8d7] rounded-3xl border border-[#4e0d05]/20 shadow-lg p-6 sm:p-8 mb-12"
      >
        <h2
          class="text-xl sm:text-2xl font-semibold text-[#3c490b] mb-4 sm:mb-6"
        >
          Sugerencias del blog
        </h2>

        <!-- BUSCADOR SUGERENCIAS -->
        <div class="relative w-full max-w-lg mb-6">
          <input
            v-model="suggSearchQuery"
            type="search"
            placeholder="Buscar sugerencias por título, descripción, nombre o email..."
            class="w-full border border-[#e099a8] rounded-full p-3 pl-4 text-[#4e0d05] bg-[#f6f6eb] focus:ring-1 focus:ring-[#e099a8] outline-none placeholder-[#4e0d05]/60"
          />
        </div>

        <div v-if="loading" class="text-[#e099a8] text-center py-4">
          Cargando sugerencias...
        </div>

        <div v-else-if="error" class="text-red-600">
          {{ error }}
        </div>

        <div v-else>
          <p
            v-if="filteredSuggestions.length === 0"
            class="text-[#4e0d05]/60 italic"
          >
            No hay sugerencias por ahora
          </p>

          <div
            v-for="s in paginatedSuggestions"
            :key="s.id"
            class="mb-6 p-4 sm:p-6 bg-[#f6f6eb] border border-[#4e0d05]/20 rounded-2xl shadow-sm hover:shadow-md transition-all"
          >
            <div
              class="flex flex-col sm:flex-row justify-between items-start gap-4"
            >
              <div class="w-full">
                <h3 class="font-semibold text-lg">{{ s.titulo }}</h3>
                <p class="text-sm text-[#4e0d05]/80">{{ s.descripcion }}</p>

                <p class="text-xs text-[#4e0d05]/50 mt-2">
                  Enviado por: {{ s.nombre || "Anónimo" }}
                  <span v-if="s.email">({{ s.email }})</span>
                </p>

                <p
                  v-if="s.responded"
                  class="text-sm text-[#3c490b] mt-2 font-medium"
                >
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

          <!-- PAGINACIÓN SUGERENCIAS -->
          <div
            v-if="filteredSuggestions.length > 0 && suggTotalPages > 1"
            class="w-full flex flex-col items-center lg:items-end mt-10 gap-3"
          >
            <p class="text-xs text-[#4e0d05]/70 text-center lg:text-right">
              Página {{ suggCurrentPage }} de {{ suggTotalPages }}
            </p>

            <div
              class="flex flex-wrap items-center justify-center lg:justify-end gap-2"
            >
              <button
                type="button"
                @click="prevSuggPage"
                :disabled="suggCurrentPage === 1"
                class="px-4 py-2 rounded-full border border-[#4e0d05]/30 bg-white/60 text-[#4e0d05] disabled:opacity-40"
              >
                Anterior
              </button>

              <button
                v-for="p in suggTotalPages"
                :key="p"
                type="button"
                @click="goToSuggPage(p)"
                :class="[
                  'w-10 h-10 rounded-full border text-sm font-semibold transition',
                  p === suggCurrentPage
                    ? 'bg-[#3c490b] text-white border-[#3c490b]'
                    : 'bg-white/60 text-[#4e0d05] border-[#4e0d05]/30 hover:bg-white'
                ]"
              >
                {{ p }}
              </button>

              <button
                type="button"
                @click="nextSuggPage"
                :disabled="suggCurrentPage === suggTotalPages"
                class="px-4 py-2 rounded-full border border-[#4e0d05]/30 bg-white/60 text-[#4e0d05] disabled:opacity-40"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Publicaciones -->
      <div
        class="bg-[#ede8d7] rounded-3xl border border-[#4e0d05]/20 shadow-lg p-6 sm:p-8"
      >
        <h2 class="text-xl sm:text-2xl font-semibold text-[#3c490b] mb-6">
          Publicaciones del blog
        </h2>

        <!-- BUSCADOR POSTS -->
        <div class="relative w-full max-w-lg mb-6">
          <input
            v-model="postsSearchQuery"
            type="search"
            placeholder="Buscar publicaciones por título o sinopsis..."
            class="w-full border border-[#e099a8] rounded-full p-3 pl-4 text-[#4e0d05] bg-[#f6f6eb] focus:ring-1 focus:ring-[#e099a8] outline-none placeholder-[#4e0d05]/60"
          />
        </div>

        <div v-if="postsLoading" class="text-[#e099a8] text-center py-4">
          Cargando publicaciones...
        </div>

        <div v-else-if="postsError" class="text-red-600">
          {{ postsError }}
        </div>

        <div v-else>
          <p
            v-if="filteredPosts.length === 0"
            class="text-[#4e0d05]/60 italic"
          >
            No hay publicaciones aún
          </p>

          <div
            v-for="p in paginatedPosts"
            :key="p.id"
            class="mb-4 p-4 sm:p-5 bg-[#f6f6eb] border border-[#4e0d05]/20 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:shadow-md transition-all"
          >
            <div>
              <h3 class="font-semibold text-lg text-[#4e0d05]">
                {{ p.titulo }}
              </h3>
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

          <!-- PAGINACIÓN POSTS -->
          <div
            v-if="filteredPosts.length > 0 && postsTotalPages > 1"
            class="w-full flex flex-col items-center lg:items-end mt-10 gap-3"
          >
            <p class="text-xs text-[#4e0d05]/70 text-center lg:text-right">
              Página {{ postsCurrentPage }} de {{ postsTotalPages }}
            </p>

            <div
              class="flex flex-wrap items-center justify-center lg:justify-end gap-2"
            >
              <button
                type="button"
                @click="prevPostsPage"
                :disabled="postsCurrentPage === 1"
                class="px-4 py-2 rounded-full border border-[#4e0d05]/30 bg-white/60 text-[#4e0d05] disabled:opacity-40"
              >
                Anterior
              </button>

              <button
                v-for="p in postsTotalPages"
                :key="p"
                type="button"
                @click="goToPostsPage(p)"
                :class="[
                  'w-10 h-10 rounded-full border text-sm font-semibold transition',
                  p === postsCurrentPage
                    ? 'bg-[#3c490b] text-white border-[#3c490b]'
                    : 'bg-white/60 text-[#4e0d05] border-[#4e0d05]/30 hover:bg-white'
                ]"
              >
                {{ p }}
              </button>

              <button
                type="button"
                @click="nextPostsPage"
                :disabled="postsCurrentPage === postsTotalPages"
                class="px-4 py-2 rounded-full border border-[#4e0d05]/30 bg-white/60 text-[#4e0d05] disabled:opacity-40"
              >
                Siguiente
              </button>
            </div>
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
            @click="
              confirmAction();
              showConfirmModal = false;
            "
            class="px-6 py-2 rounded-full bg-[#e099a8] text-[#3c490b] hover:bg-[#3c490b] hover:text-[#f6f6eb] transition-all"
          >
            Sí, eliminar
          </button>
        </div>
      </div>
    </div>
  </section>
</template>