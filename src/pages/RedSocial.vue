<script>
import AppH1 from "../components/AppH1.vue";
import { getAllUsers } from "../services/user-profiles.js";
import { getCurrentUser, subscribeToAuthChanges } from "../services/auth.js";
import {
  sendConnectionRequest,
  getPendingRequestsSent,
} from "../services/connections.js";
import AppLoader from "../components/AppLoader.vue";

export default {
  name: "RedSocial",
  components: { AppH1, AppLoader },

  data() {
    return {
      allUsers: [], // Guardamos todos aquí, pero no los mostramos directo
      suggestedUsers: [], // Para las sugerencias iniciales
      loading: true,
      searchQuery: "",
      user: null,
      message: "",
      sentRequests: [],

      // paginacion (Solo aplica a los resultados de búsqueda)
      currentPage: 1,
      perPage: 6, // Bajé un poco el número para que se vea mejor la búsqueda
    };
  },

  computed: {
    // ESTA ES LA CLAVE: Si no hay búsqueda, devolvemos vacío.
    filteredUsers() {
      const q = this.searchQuery.trim().toLowerCase();

      // Si el buscador está vacío o tiene menos de 2 letras, no mostramos la lista general
      if (q.length < 1) return [];

      return this.allUsers.filter((u) =>
        (u.display_name || "").toLowerCase().includes(q),
      );
    },

    // paginacion
    totalPages() {
      return Math.max(1, Math.ceil(this.filteredUsers.length / this.perPage));
    },
    paginatedUsers() {
      const start = (this.currentPage - 1) * this.perPage;
      const end = start + this.perPage;
      return this.filteredUsers.slice(start, end);
    },

    isAdmin() {
      return this.user && this.user.role === "admin";
    },
  },

  watch: {
    searchQuery() {
      this.currentPage = 1;
    },
    totalPages() {
      if (this.currentPage > this.totalPages)
        this.currentPage = this.totalPages;
    },
  },

  methods: {
    async handleConnect(receiverId) {
      if (!this.user) {
        this.message = "Debes iniciar sesión para conectar.";
        setTimeout(() => (this.message = ""), 3000);
        return;
      }

      try {
        await sendConnectionRequest(this.user.id, receiverId);
        this.sentRequests.push(receiverId);
        this.message = "¡Solicitud enviada!";
        setTimeout(() => (this.message = ""), 3000);
      } catch (err) {
        console.error("Error enviando solicitud:", err);
      }
    },

    // Lógica para mezclar y obtener sugerencias aleatorias
    generateSuggestions() {
      // Filtramos para no sugerir al admin ni al usuario mismo
      let candidates = this.allUsers.filter(
        (u) => u.id !== this.user?.id && u.role !== "admin",
      );

      // Algoritmo simple para desordenar el array (Fisher-Yates simplificado)
      candidates = candidates.sort(() => 0.5 - Math.random());

      // Tomamos los primeros 3
      this.suggestedUsers = candidates.slice(0, 3);
    },

    goToPage(p) {
      const page = Number(p);
      if (!Number.isFinite(page)) return;
      if (page < 1) this.currentPage = 1;
      else if (page > this.totalPages) this.currentPage = this.totalPages;
      else this.currentPage = page;
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    nextPage() {
      this.goToPage(this.currentPage + 1);
    },
    prevPage() {
      this.goToPage(this.currentPage - 1);
    },
  },

  async mounted() {
    this.loading = true;
    this.error = null;

    try {
      this.user = await getCurrentUser();

      // 1. Traemos TODOS los usuarios
      const usersFromDB = await getAllUsers();

      // 2. FILTRO DE SEGURIDAD:
      // Guardamos en 'allUsers' solamente los que NO son admin.
      // También podés filtrar por email si preferís: u.email !== 'admin@admin.com'
      this.allUsers = usersFromDB.filter((u) => u.role !== "admin");

      if (this.user) {
        this.sentRequests = await getPendingRequestsSent(this.user.id);
      }

      // 3. Generamos sugerencias (ya sin el admin en la lista)
      this.generateSuggestions();

      subscribeToAuthChanges((userState) => {
        this.user = userState;
        this.generateSuggestions();
      });
    } catch (err) {
      console.error("[RedSocial] Error:", err);
      this.error = "Ocurrió un error al cargar la red social.";
    }

    this.loading = false;
  },
};
</script>

<template>
  <div
    class="min-h-screen bg-[#f6f6eb] font-helvetica flex flex-col items-center overflow-hidden pb-20"
  >
    <section
      class="w-full bg-[#e099a8] text-[#f6f6eb] flex flex-row items-center justify-center gap-6 md:gap-20 py-10 px-6 md:px-20 relative overflow-hidden"
    >
      <img
        src="/icono3.png"
        alt="icono"
        class="absolute top-6 right-10 w-10 md:w-16 opacity-80 rotate-6 pointer-events-none"
      />
      <img
        src="/icono6.png"
        alt="icono"
        class="absolute bottom-6 left-6 w-12 md:w-20 opacity-80 -rotate-6 pointer-events-none"
      />
      <div class="flex justify-center w-[40%] md:w-auto z-10">
        <img src="/nysito3.png" alt="Nysito" class="w-28 sm:w-32 md:w-56" />
      </div>
      <div class="max-w-[60%] md:max-w-lg text-left z-10 leading-snug">
        <h1 class="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-3">
          Red Social
        </h1>
        <p class="text-base sm:text-lg font-medium leading-relaxed">
          Conectá con amigos y enterate cuáles son sus <br />
          <span class="font-bold text-[#3c490b]">preferencias</span> y
          <span class="font-bold text-[#3c490b]">vinos favoritos</span>.
        </p>
      </div>
    </section>

    <div class="relative w-full max-w-lg mt-8 md:mt-12 z-10 px-4">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="absolute left-7 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4e0d05] opacity-50"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z"
        />
      </svg>
      <input
        v-model="searchQuery"
        type="search"
        placeholder="Buscar amigos por nombre..."
        class="w-full border border-[#4e0d05]/20 rounded-full p-3 pl-12 text-[#4e0d05] bg-white shadow-sm focus:ring-2 focus:ring-[#e099a8] outline-none placeholder-[#4e0d05]/50 transition-all"
      />
    </div>

    <transition name="fade">
      <div
        v-if="message"
        class="mt-4 px-6 py-2 bg-[#3c490b] text-[#f6f6eb] rounded-full text-sm font-medium shadow-lg"
      >
        {{ message }}
      </div>
    </transition>

    <section class="w-full max-w-5xl px-4 mt-8">
      <div v-if="loading" class="flex justify-center py-10">
        <AppLoader />
      </div>

      <div v-else-if="!searchQuery" class="flex flex-col items-center">
        <div class="text-center mb-12 opacity-60">
          <p class="text-[#4e0d05] text-lg">
            ¡Empezá a buscar para encontrar a tus amigos!
          </p>
        </div>

        <div v-if="suggestedUsers.length > 0" class="w-full">
          <div class="flex items-center gap-4 mb-6 w-full max-w-4xl mx-auto">
            <h3 class="text-xl font-bold text-[#3c490b]">
              Sugerencias para vos
            </h3>
            <div class="h-[1px] bg-[#4e0d05]/10 flex-1"></div>
          </div>

          <div
            class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          >
            <div
              v-for="u in suggestedUsers"
              :key="u.id"
              class="bg-white border border-[#4e0d05]/10 rounded-2xl p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-all group"
            >
              <div
                class="w-20 h-20 rounded-full bg-[#ede8d7] flex items-center justify-center text-2xl font-bold text-[#4e0d05] mb-4 group-hover:scale-110 transition-transform duration-300"
              >
                {{
                  u.display_name ? u.display_name.charAt(0).toUpperCase() : "?"
                }}
              </div>

              <h4 class="font-bold text-[#4e0d05] mb-1">
                {{ u.display_name }}
              </h4>
              <p class="text-xs text-[#4e0d05]/60 mb-4">{{ u.email }}</p>

              <div class="flex flex-col w-full gap-2">
                <router-link
                  :to="`/usuario/${u.id}`"
                  class="text-xs text-[#4e0d05] font-semibold hover:underline"
                >
                  Ver perfil
                </router-link>

                <button
                  v-if="!sentRequests.includes(u.id)"
                  @click="handleConnect(u.id)"
                  class="w-full py-2 rounded-full bg-[#e099a8]/20 text-[#4e0d05] text-sm font-semibold hover:bg-[#e099a8] hover:text-white transition-colors"
                >
                  Conectar
                </button>
                <span v-else class="text-xs text-[#3c490b] font-medium py-2"
                  >Solicitud enviada</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="w-full max-w-3xl mx-auto">
        <h3 class="text-lg font-medium text-[#4e0d05]/50 mb-4 ml-2">
          Resultados de búsqueda:
        </h3>

        <ul v-if="paginatedUsers.length > 0" class="space-y-3">
          <li
            v-for="u in paginatedUsers"
            :key="u.id"
            class="bg-white border border-[#4e0d05]/10 rounded-2xl p-4 flex items-center justify-between shadow-sm hover:border-[#e099a8]/50 transition-all"
          >
            <div class="flex items-center gap-4">
              <div
                class="w-12 h-12 rounded-full bg-[#ede8d7] flex items-center justify-center text-lg font-bold text-[#4e0d05]"
              >
                {{
                  u.display_name ? u.display_name.charAt(0).toUpperCase() : "?"
                }}
              </div>

              <div>
                <p class="font-bold text-[#4e0d05]">
                  {{ u.display_name || "Sin nombre" }}
                </p>
                <p class="text-xs text-[#4e0d05]/60">{{ u.email }}</p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <router-link
                :to="`/usuario/${u.id}`"
                class="px-4 py-1.5 text-sm font-medium text-[#4e0d05]/70 hover:text-[#e099a8] transition-colors"
              >
                Ver
              </router-link>

              <button
                v-if="
                  user &&
                  user.id !== u.id &&
                  !sentRequests.includes(u.id) &&
                  !isAdmin
                "
                @click="handleConnect(u.id)"
                class="px-5 py-1.5 rounded-full bg-[#3c490b] text-white text-sm font-medium hover:bg-[#4e0d05] transition-colors shadow-md shadow-[#3c490b]/20"
              >
                Conectar
              </button>

              <span
                v-else-if="sentRequests.includes(u.id)"
                class="text-xs text-[#3c490b] font-bold border border-[#3c490b]/20 px-3 py-1 rounded-full bg-[#3c490b]/5"
              >
                Enviada
              </span>
            </div>
          </li>
        </ul>

        <div
          v-else
          class="text-center py-12 bg-[#ede8d7]/50 rounded-3xl border border-[#4e0d05]/10"
        >
          <p class="text-[#4e0d05] font-medium">
            No encontramos usuarios con ese nombre.
          </p>
          <p class="text-sm text-[#4e0d05]/60 mt-1">
            Intentá buscar de otra forma.
          </p>
        </div>

        <div
          v-if="filteredUsers.length > 0 && totalPages > 1"
          class="flex justify-center mt-8 gap-2"
        >
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            class="px-3 py-1 rounded-md text-sm disabled:opacity-30 hover:bg-[#e099a8]/20"
          >
            Ant
          </button>
          <span class="px-3 py-1 font-bold text-[#4e0d05]">{{
            currentPage
          }}</span>
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="px-3 py-1 rounded-md text-sm disabled:opacity-30 hover:bg-[#e099a8]/20"
          >
            Sig
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Animación suave para el mensaje */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
