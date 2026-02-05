<script>
import AppH1 from "../components/AppH1.vue";
import { getAllUsers } from "../services/user-profiles.js";
import { getCurrentUser, subscribeToAuthChanges } from "../services/auth.js";
import { sendConnectionRequest } from "../services/connections.js";
import AppLoader from "../components/AppLoader.vue";

export default {
  name: "RedSocial",
  components: { AppH1, AppLoader },

  data() {
    return {
      users: [],
      loading: true,
      searchQuery: "",
      user: null,
      message: "",
      sentRequests: [],

      // paginacion
      currentPage: 1,
      perPage: 12,
    };
  },

  computed: {
    filteredUsers() {
      const q = this.searchQuery.toLowerCase();
      return this.users.filter((u) =>
        (u.display_name || "").toLowerCase().includes(q)
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
  },

  watch: {
    //paginacion
    searchQuery() {
      this.currentPage = 1;
    },

    // paginacion
    totalPages() {
      if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;
    },
  },

  methods: {
    async handleConnect(receiverId) {
      console.log("Intentando conectar con", receiverId);

      if (!this.user) {
        this.message = "Debes iniciar sesión para conectar con alguien.";
        setTimeout(() => (this.message = ""), 3000);
        return;
      }

      try {
        await sendConnectionRequest(this.user.id, receiverId);

        // marcar localmente para ocultar el botón
        this.sentRequests.push(receiverId);

        this.message = "Solicitud de amistad enviada!";
        setTimeout(() => (this.message = ""), 3000);
      } catch (err) {
        console.error("Error enviando solicitud de conexión:", err);
      }
    },

    // paginacion
    goToPage(p) {
      const page = Number(p);
      if (!Number.isFinite(page)) return;

      if (page < 1) this.currentPage = 1;
      else if (page > this.totalPages) this.currentPage = this.totalPages;
      else this.currentPage = page;

      // subir al inicio cuando cambio de página
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
      this.users = await getAllUsers();
      this.user = await getCurrentUser();
      console.log("[RedSocial.vue] Usuario inicial:", this.user);

      subscribeToAuthChanges((userState) => {
        this.user = userState;
        console.log("[AuthChange] Usuario actualizado:", this.user);
      });
    } catch (err) {
      console.error("[RedSocial.vue] Error cargando usuarios:", err);
      this.users = [];
      this.error = "Ocurrió un error al cargar los usuarios.";
    }

    this.loading = false;
  },
};
</script>

<template>
  <div
    class="min-h-screen bg-[#f6f6eb] font-helvetica flex flex-col items-center overflow-hidden"
  >
    <!-- Banner -->
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
          <span class="font-bold text-[#3c490b]">preferencias</span>,
          <span class="font-bold text-[#3c490b]">vinos favoritos</span>
          y mucho más.
        </p>
      </div>
    </section>

    <!-- Buscador -->
    <div class="relative w-full max-w-lg mb-8 mt-8 md:mt-16 z-10 px-4">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-black opacity-70"
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
        placeholder="Buscar usuario por nombre..."
        class="w-full border border-[#e099a8] rounded-full p-3 pl-12 text-[#4e0d05] bg-[#f6f6eb] focus:ring-1 focus:ring-[#e099a8] outline-none placeholder-[#4e0d05]/60"
      />
    </div>

    <div
      v-if="message"
      class="mb-6 px-6 py-3 bg-[#3c490b] text-[#f6f6eb] rounded-full text-center max-w-lg"
    >
      {{ message }}
    </div>

    <!-- Lista de usuarios -->
    <section class="w-[92%] max-w-[1000px] py-10 px-4 md:px-10 text-left">
      <!-- estado de carga-->
      <div
        v-if="loading"
        class="w-full flex items-center justify-center min-h-[200px]"
      >
        <AppLoader />
      </div>

      <div v-else-if="error" class="w-full text-center text-red-600 mt-6">
        {{ error }}
      </div>

      <ul v-else class="space-y-4">
        <li
          v-for="u in paginatedUsers"
          :key="u.id"
          class="bg-[#ede8d7] border border-[#4e0d05]/20 rounded-2xl md:rounded-3xl p-4 md:p-5 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between hover:shadow-md hover:scale-[1.01] transition-all duration-300"
        >
          <div class="text-[#4e0d05] mb-2 md:mb-0">
            <p class="font-semibold text-lg md:text-xl">
              {{ u.display_name || "Sin nombre" }}
            </p>

            <p class="text-sm text-[#4e0d05]/70">
              {{ u.email }}
            </p>
          </div>

          <div
            class="flex gap-2 md:gap-3 mt-3 md:mt-0 items-center md:justify-end"
          >
            <router-link
              :to="`/usuario/${u.id}`"
              class="text-[#e099a8] border border-[#e099a8] rounded-full px-4 py-1.5 text-sm font-medium hover:bg-[#e099a8] hover:text-[#f6f6eb] transition-all duration-300"
            >
              Ver perfil
            </router-link>

            <button
              v-if="
                user &&
                user.id &&
                user.id !== u.id &&
                !sentRequests.includes(u.id)
              "
              @click="handleConnect(u.id)"
              class="text-[#3c490b] border border-[#3c490b] rounded-full px-4 py-1.5 text-sm font-medium hover:bg-[#3c490b] hover:text-[#f6f6eb] transition-all duration-300"
            >
              + Conectar
            </button>

            <span
              v-else-if="sentRequests.includes(u.id)"
              class="text-[#3c490b] border border-[#3c490b] rounded-full px-4 py-1.5 text-sm font-medium"
            >
              Solicitud enviada
            </span>
          </div>
        </li>
      </ul>

      <!-- paginacion mobile -->
      <div
        v-if="!loading && !error && filteredUsers.length > 0 && totalPages > 1"
        class="w-full flex flex-col items-center lg:items-end mt-10 gap-3"
      >
        <p class="text-xs text-[#4e0d05]/70 text-center lg:text-right">
          Página {{ currentPage }} de {{ totalPages }}
        </p>

        <div
        class="flex flex-nowrap items-center justify-center lg:justify-end gap-2"
        >
          <button
            type="button"
            @click="prevPage"
            :disabled="currentPage === 1"
            class="px-4 py-2 rounded-full border border-[#4e0d05]/30 bg-white/60 text-[#4e0d05] disabled:opacity-40"
          >
            Anterior
          </button>

          <button
            v-for="p in totalPages"
            :key="p"
            type="button"
            @click="goToPage(p)"
            :class="[
              'w-10 h-10 rounded-full border text-sm font-semibold transition',
              p === currentPage
                ? 'bg-[#3c490b] text-white border-[#3c490b]'
                : 'bg-white/60 text-[#4e0d05] border-[#4e0d05]/30 hover:bg-white'
            ]"
          >
            {{ p }}
          </button>

          <button
            type="button"
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="px-4 py-2 rounded-full border border-[#4e0d05]/30 bg-white/60 text-[#4e0d05] disabled:opacity-40"
          >
            Siguiente
          </button>
        </div>
      </div>

      <p
        v-if="!loading && users.length === 0"
        class="text-[#4e0d05]/60 italic text-center mt-8"
      >
        No hay usuarios registrados todavía.
      </p>
    </section>
  </div>
</template>

