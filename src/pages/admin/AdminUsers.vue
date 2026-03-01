<script>
import AppLoader from "../../components/AppLoader.vue";
import {
  getAllUsers,
  toggleUserActiveStatus,
} from "../../services/user-profiles.js";
import { getAllSubscriptions } from "../../services/subscriptions.js";

export default {
  name: "AdminUsers",
  components: { AppLoader },
  data() {
    return {
      users: [],
      subscriptions: [],
      loading: true,
      error: null,

      currentPage: 1,
      perPage: 8,
    };
  },
  computed: {
    usersWithData() {
      return this.users.map((user) => {
        const activeSub = this.subscriptions.find(
          (sub) => sub.user_id === user.id && sub.status === "active",
        );
        return {
          ...user,
          isSubscribed: !!activeSub,
        };
      });
    },

    // --- Paginación ---
    totalPages() {
      return Math.max(1, Math.ceil(this.usersWithData.length / this.perPage));
    },
    paginatedUsers() {
      const start = (this.currentPage - 1) * this.perPage;
      const end = start + this.perPage;
      return this.usersWithData.slice(start, end);
    },

    // Métricas
    totalUsers() {
      return this.users.filter((u) => u.role !== "admin").length;
    },
    totalSubscribers() {
      return this.usersWithData.filter(
        (u) => u.isSubscribed && u.role !== "admin",
      ).length;
    },
    conversionRate() {
      if (this.totalUsers === 0) return 0;
      return Math.round((this.totalSubscribers / this.totalUsers) * 100);
    },
  },
  watch: {
    totalPages() {
      if (this.currentPage > this.totalPages)
        this.currentPage = this.totalPages;
    },
  },
  async mounted() {
    this.loading = true;
    try {
      const [usersData, subsData] = await Promise.all([
        getAllUsers(),
        getAllSubscriptions(),
      ]);

      this.users = usersData;
      this.subscriptions = subsData;
    } catch (err) {
      console.error(err);
      this.error = "Error al cargar los datos de usuarios.";
    } finally {
      this.loading = false;
    }
  },
  methods: {
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
    async handleToggleStatus(user) {
      try {
        const updated = await toggleUserActiveStatus(user.id, user.is_active);
        // Actualizamos la lista local para que el cambio se vea 
        const index = this.users.findIndex((u) => u.id === user.id);
        if (index !== -1) {
          this.users[index].is_active = updated.is_active;
        }
      } catch (err) {
        alert("Error al cambiar el estado del usuario");
      }
    },
  },
};
</script>

<template>
  <section
    class="relative min-h-screen bg-[#f6f6eb] text-[#4e0d05] py-10 px-4 sm:py-16 sm:px-8"
  >
    <img
      src="/icono1.png"
      alt="icono"
      class="hidden md:block absolute top-10 left-10 w-16 opacity-90 rotate-12 pointer-events-none"
    />
    <img
      src="/icono2.png"
      alt="icono"
      class="hidden md:block absolute top-16 right-20 w-20 opacity-100 -rotate-6 pointer-events-none"
    />
    <img
      src="/icono3.png"
      alt="icono"
      class="hidden md:block absolute top-1/3 left-10 w-22 opacity-80 rotate-3 pointer-events-none"
    />
    <img
      src="/icono4.png"
      alt="icono"
      class="hidden md:block absolute top-[40%] right-10 w-18 opacity-80 rotate-6 pointer-events-none"
    />
    <img
      src="/icono5.png"
      alt="icono"
      class="hidden md:block absolute bottom-[25%] left-10 w-24 opacity-80 -rotate-6 pointer-events-none"
    />
    <img
      src="/icono6.png"
      alt="icono"
      class="hidden md:block absolute bottom-[35%] right-20 w-24 opacity-80 rotate-3 pointer-events-none"
    />
    <img
      src="/icono7.png"
      alt="icono"
      class="hidden md:block absolute top-[20%] left-10 w-18 opacity-90 rotate-12 pointer-events-none"
    />
    <img
      src="/icono2.png"
      alt="icono"
      class="hidden md:block absolute bottom-16 right-20 w-20 opacity-100 -rotate-6 pointer-events-none"
    />
    <img
      src="/icono6.png"
      alt="icono"
      class="hidden md:block absolute bottom-22 left-20 w-24 opacity-100 -rotate-6 pointer-events-none"
    />

    <div class="relative z-10 max-w-7xl mx-auto pb-20 px-0 md:px-0">
      <!-- Header centrado -->
      <div class="mb-10 text-center">
        <h1
          class="text-3xl sm:text-4xl font-bold text-[#3c490b] mb-4 tracking-wide"
        >
          Comunidad NYSO
        </h1>
        <p class="text-[#4e0d05]/60">
          Métricas y gestión de usuarios registrados.
        </p>
      </div>

      <div v-if="loading" class="flex justify-center py-10">
        <AppLoader />
      </div>

      <div v-else-if="error" class="text-center text-red-600">
        {{ error }}
      </div>

      <div v-else>
        <!-- Métricas -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div
            class="bg-[#ede8d7] rounded-3xl border border-[#4e0d05]/20 p-6 shadow-sm flex flex-col justify-between relative overflow-hidden"
          >
            <div class="relative z-10">
              <p
                class="text-sm font-bold text-[#4e0d05]/60 uppercase tracking-wider mb-1"
              >
                Total Usuarios
              </p>
              <p class="text-4xl font-extrabold text-[#4e0d05]">
                {{ totalUsers }}
              </p>
            </div>
            <div class="absolute -bottom-4 -right-4 text-7xl opacity-5"></div>
          </div>

          <div
            class="bg-[#e099a8]/20 rounded-3xl border border-[#e099a8]/40 p-6 shadow-sm flex flex-col justify-between relative overflow-hidden"
          >
            <div class="relative z-10">
              <p
                class="text-sm font-bold text-[#4e0d05]/60 uppercase tracking-wider mb-1"
              >
                Suscriptos al Box
              </p>
              <p class="text-4xl font-extrabold text-[#4e0d05]">
                {{ totalSubscribers }}
              </p>
            </div>
            <div class="absolute -bottom-4 -right-4 text-7xl opacity-10"></div>
          </div>

          <div
            class="bg-[#3c490b]/10 rounded-3xl border border-[#3c490b]/20 p-6 shadow-sm flex flex-col justify-between relative overflow-hidden"
          >
            <div class="relative z-10">
              <p
                class="text-sm font-bold text-[#3c490b]/70 uppercase tracking-wider mb-1"
              >
                Tasa de Conversión
              </p>
              <p class="text-4xl font-extrabold text-[#3c490b]">
                {{ conversionRate }}%
              </p>
            </div>
            <div class="absolute -bottom-4 -right-4 text-7xl opacity-5"></div>
          </div>
        </div>

        <div
          class="bg-[#ede8d7] rounded-3xl border border-[#4e0d05]/20 shadow-sm overflow-hidden"
        >
          <div
            class="p-6 border-b border-[#4e0d05]/10 flex justify-between items-center bg-white/40"
          >
            <h3 class="text-lg font-bold text-[#4e0d05]">
              Listado de Usuarios
            </h3>
          </div>

          <!-- Mobile cards -->
          <div class="md:hidden p-4 space-y-4">
            <div
              v-for="u in paginatedUsers"
              :key="u.id"
              class="bg-[#f6f6eb] border border-[#4e0d05]/15 rounded-2xl p-4 shadow-sm"
            >
              <div class="flex items-start justify-between gap-3">
                <div class="flex items-center gap-3 min-w-0">
                  <img
                    v-if="u.avatar_url"
                    :src="u.avatar_url"
                    alt="Avatar"
                    class="w-12 h-12 rounded-full object-cover border border-[#4e0d05]/20 shadow-sm shrink-0"
                  />

                  <div
                    v-else
                    class="w-12 h-12 rounded-full bg-[#ede8d7] flex items-center justify-center text-lg font-bold text-[#4e0d05] border border-[#4e0d05]/10 shrink-0"
                  >
                    {{
                      u.display_name
                        ? u.display_name.charAt(0).toUpperCase()
                        : "?"
                    }}
                  </div>

                  <div class="min-w-0">
                    <p class="font-bold text-[#4e0d05] truncate">
                      {{ u.display_name || "Sin nombre" }}
                    </p>
                    <p class="text-xs text-[#4e0d05]/60 break-all">
                      {{ u.email }}
                    </p>
                  </div>
                </div>

                <span
                  v-if="u.role === 'admin'"
                  class="px-2 py-1 bg-[#4e0d05] text-[#ede8d7] rounded text-xs font-semibold shrink-0"
                >
                  Admin
                </span>
                <span v-else class="text-xs opacity-60 shrink-0">Usuario</span>
              </div>

              <div class="mt-3 flex items-center justify-between gap-3">
                <div>
                  <span
                    v-if="u.isSubscribed"
                    class="inline-flex px-3 py-1 rounded-full bg-[#3c490b]/15 text-[#3c490b] text-xs font-bold border border-[#3c490b]/20"
                  >
                    Suscrito
                  </span>
                  <span v-else class="text-xs opacity-50"> No suscrito </span>
                </div>

                <router-link
                  v-if="u.role !== 'admin'"
                  :to="`/usuario/${u.id}`"
                  target="_blank"
                  class="text-[#e099a8] font-semibold hover:text-[#4e0d05] transition-colors text-sm"
                >
                  Ver perfil ↗
                </router-link>
              </div>
            </div>
          </div>

          <!-- Desktop tabla-->
          <div class="hidden md:block overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr
                  class="bg-[#4e0d05]/5 text-[#4e0d05] text-xs uppercase tracking-wider border-b border-[#4e0d05]/10"
                >
                  <th class="p-4 font-bold">Usuario</th>
                  <th class="p-4 font-bold">Email</th>
                  <th class="p-4 font-bold">Rol</th>
                  <th class="p-4 font-bold">Box Mensual</th>
                  <th class="p-4 font-bold">Perfil</th>
                  <th class="p-4 font-bold">Estado</th>
                </tr>
              </thead>
              <tbody class="text-sm text-[#4e0d05]">
                <tr
                  v-for="u in paginatedUsers"
                  :key="u.id"
                  class="border-b border-[#4e0d05]/5 hover:bg-[#4e0d05]/5 transition-colors"
                >
                  <td class="p-4">
                    <div class="flex items-center gap-3 min-w-0">
                      <img
                        v-if="u.avatar_url"
                        :src="u.avatar_url"
                        alt="Avatar"
                        class="w-12 h-12 rounded-full object-cover border border-[#4e0d05]/20 shadow-sm shrink-0"
                      />

                      <div
                        v-else
                        class="w-12 h-12 rounded-full bg-[#ede8d7] flex items-center justify-center text-lg font-bold text-[#4e0d05] border border-[#4e0d05]/10 shrink-0"
                      >
                        {{
                          u.display_name
                            ? u.display_name.charAt(0).toUpperCase()
                            : "?"
                        }}
                      </div>

                      <span class="font-bold truncate">
                        {{ u.display_name || "Sin nombre" }}
                      </span>
                    </div>
                  </td>

                  <td class="p-4 opacity-70 break-all">
                    {{ u.email }}
                  </td>

                  <td class="p-4">
                    <span
                      v-if="u.role === 'admin'"
                      class="px-2 py-1 bg-[#4e0d05] text-[#ede8d7] rounded text-xs font-semibold"
                    >
                      Admin
                    </span>
                    <span v-else class="text-xs opacity-60">Usuario</span>
                  </td>

                  <td class="p-4">
                    <span
                      v-if="u.isSubscribed"
                      class="px-3 py-1 rounded-full bg-[#3c490b]/15 text-[#3c490b] text-xs font-bold border border-[#3c490b]/20"
                    >
                      Suscrito
                    </span>
                    <span v-else class="text-xs opacity-40"> No suscrito </span>
                  </td>

                  <td class="p-4">
                    <router-link
                      v-if="u.role !== 'admin'"
                      :to="`/usuario/${u.id}`"
                      target="_blank"
                      class="text-[#e099a8] font-semibold hover:text-[#4e0d05] transition-colors text-sm"
                    >
                      Ver perfil ↗
                    </router-link>
                  </td>
                  <td class="p-4 text-center">
                    <button
                      v-if="u.role !== 'admin'"
                      @click="handleToggleStatus(u)"
                      class="px-3 py-1 rounded-full text-xs font-bold transition-all border"
                      :class="
                        u.is_active !== false
                          ? 'bg-green-100 text-green-700 border-green-200 hover:bg-red-100 hover:text-red-700 hover:border-red-200'
                          : 'bg-red-600 text-white border-red-700 hover:bg-green-600'
                      "
                    >
                      {{ u.is_active !== false ? "Activo" : "Pausado" }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Paginación -->
          <div
            v-if="usersWithData.length > 0 && totalPages > 1"
            class="w-full flex flex-col items-center p-4 gap-2 bg-white/40 border-t border-[#4e0d05]/10"
          >
            <p class="text-[11px] text-[#4e0d05]/70">
              Página {{ currentPage }} de {{ totalPages }}
            </p>

            <!-- Mobile -->
            <div class="flex sm:hidden items-center justify-center gap-4 w-full">
              <button
                type="button"
                @click="prevPage"
                :disabled="currentPage === 1"
                class="px-4 py-2 rounded-full border border-[#4e0d05]/30 bg-white/60 text-[#4e0d05] text-xs disabled:opacity-40"
              >
                Anterior
              </button>

              <span class="text-sm font-semibold text-[#3c490b]">
                {{ currentPage }} / {{ totalPages }}
              </span>

              <button
                type="button"
                @click="nextPage"
                :disabled="currentPage === totalPages"
                class="px-4 py-2 rounded-full border border-[#4e0d05]/30 bg-white/60 text-[#4e0d05] text-xs disabled:opacity-40"
              >
                Siguiente
              </button>
            </div>

            <!-- Desktop -->
            <div class="hidden sm:flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                @click="prevPage"
                :disabled="currentPage === 1"
                class="px-3 py-1.5 rounded-full border border-[#4e0d05]/30 bg-white/60 text-[#4e0d05] text-xs disabled:opacity-40"
              >
                Anterior
              </button>

              <button
                v-for="p in totalPages"
                :key="p"
                type="button"
                @click="goToPage(p)"
                :class="[
                  'w-8 h-8 rounded-full border text-xs font-semibold transition flex items-center justify-center',
                  p === currentPage
                    ? 'bg-[#3c490b] text-white border-[#3c490b]'
                    : 'bg-white/60 text-[#4e0d05] border-[#4e0d05]/30 hover:bg-white',
                ]"
              >
                {{ p }}
              </button>

              <button
                type="button"
                @click="nextPage"
                :disabled="currentPage === totalPages"
                class="px-3 py-1.5 rounded-full border border-[#4e0d05]/30 bg-white/60 text-[#4e0d05] text-xs disabled:opacity-40"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>