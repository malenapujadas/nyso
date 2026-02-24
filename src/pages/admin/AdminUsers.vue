<script>
import AppLoader from "../../components/AppLoader.vue";
import { getAllUsers } from "../../services/user-profiles.js";
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

      // --- DATOS DE PAGINACIÓN ---
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

    // --- COMPUTADAS DE PAGINACIÓN ---
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
    // Si cambia el total de páginas (ej. borramos un usuario), ajustamos la página actual
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
    // --- MÉTODOS DE PAGINACIÓN ---
    goToPage(p) {
      const page = Number(p);
      if (!Number.isFinite(page)) return;

      if (page < 1) this.currentPage = 1;
      else if (page > this.totalPages) this.currentPage = this.totalPages;
      else this.currentPage = page;

      // Scroll arriba de la tabla (opcional)
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    nextPage() {
      this.goToPage(this.currentPage + 1);
    },
    prevPage() {
      this.goToPage(this.currentPage - 1);
    },
  },
};
</script>

<template>
  <div class="max-w-7xl mx-auto pb-20">
    <div class="mb-8">
      <h2 class="text-3xl font-bold text-[#4e0d05]">Comunidad NYSO</h2>
      <p class="text-[#4e0d05]/60">
        Métricas y gestión de usuarios registrados.
      </p>
    </div>

    <div v-if="loading" class="flex justify-center py-10">
      <AppLoader />
    </div>

    <div v-else>
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
          <div class="absolute -bottom-4 -right-4 text-7xl opacity-5">👥</div>
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
          <div class="absolute -bottom-4 -right-4 text-7xl opacity-10">🍷</div>
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
          <div class="absolute -bottom-4 -right-4 text-7xl opacity-5">📈</div>
        </div>
      </div>

      <div
        class="bg-[#ede8d7] rounded-3xl border border-[#4e0d05]/20 shadow-sm overflow-hidden"
      >
        <div
          class="p-6 border-b border-[#4e0d05]/10 flex justify-between items-center bg-white/40"
        >
          <h3 class="text-lg font-bold text-[#4e0d05]">Listado de Usuarios</h3>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr
                class="bg-[#4e0d05]/5 text-[#4e0d05] text-xs uppercase tracking-wider border-b border-[#4e0d05]/10"
              >
                <th class="p-4 font-bold">Usuario</th>
                <th class="p-4 font-bold">Email</th>
                <th class="p-4 font-bold">Rol</th>
                <th class="p-4 font-bold">Box Mensual</th>
                <th class="p-4 font-bold text-right">Perfil</th>
              </tr>
            </thead>
            <tbody class="text-sm text-[#4e0d05]">
              <tr
                v-for="u in paginatedUsers"
                :key="u.id"
                class="border-b border-[#4e0d05]/5 hover:bg-[#4e0d05]/5 transition-colors"
              >
                <td class="p-4">
                  <div class="flex items-center gap-3">
                    <img
                      v-if="u.avatar_url"
                      :src="u.avatar_url"
                      alt="Avatar"
                      class="w-12 h-12 rounded-full object-cover border border-[#4e0d05]/20 shadow-sm"
                    />

                    <div
                      v-else
                      class="w-12 h-12 rounded-full bg-[#ede8d7] flex items-center justify-center text-lg font-bold text-[#4e0d05] border border-[#4e0d05]/10"
                    >
                      {{
                        u.display_name
                          ? u.display_name.charAt(0).toUpperCase()
                          : "?"
                      }}
                    </div>
                    <span class="font-bold">{{
                      u.display_name || "Sin nombre"
                    }}</span>
                  </div>
                </td>

                <td class="p-4 opacity-70">
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
                    Suscrito ✨
                  </span>
                  <span v-else class="text-xs opacity-40"> No suscrito </span>
                </td>

                <td class="p-4 text-right">
                  <router-link
                    v-if="u.role !== 'admin'"
                    :to="`/usuario/${u.id}`"
                    target="_blank"
                    class="text-[#e099a8] font-semibold hover:text-[#4e0d05] transition-colors text-sm"
                  >
                    Ver perfil ↗
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          v-if="usersWithData.length > 0 && totalPages > 1"
          class="w-full flex flex-col sm:flex-row items-center justify-between p-6 gap-3 bg-white/40 border-t border-[#4e0d05]/10"
        >
          <p class="text-xs text-[#4e0d05]/70">
            Página {{ currentPage }} de {{ totalPages }}
          </p>

          <div class="flex flex-nowrap items-center gap-2">
            <button
              type="button"
              @click="prevPage"
              :disabled="currentPage === 1"
              class="px-4 py-2 rounded-full border border-[#4e0d05]/30 bg-white/60 text-[#4e0d05] disabled:opacity-40 hover:bg-white transition"
            >
              Anterior
            </button>

            <button
              v-for="p in totalPages"
              :key="p"
              type="button"
              @click="goToPage(p)"
              :class="[
                'w-10 h-10 rounded-full border text-sm font-semibold transition flex items-center justify-center',
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
              class="px-4 py-2 rounded-full border border-[#4e0d05]/30 bg-white/60 text-[#4e0d05] disabled:opacity-40 hover:bg-white transition"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
