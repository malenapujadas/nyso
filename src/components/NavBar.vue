<script>
import { logout, subscribeToAuthChanges } from "../services/auth.js";
import { RouterLink } from "vue-router";
import { getPendingRequestsReceived } from "../services/connections.js";

export default {
  name: "NavBar",
  components: { RouterLink },

  data() {
    return {
      user: null,
      isAuthChecked: false,
      menuOpen: false, // para mobile

      pendingRequests: [],
      pendingCount: 0,

      notifOpen: false,
    };
  },

  computed: {
    userName() {
      if (!this.user) return null;
      return this.user.user_metadata?.nombre || this.user.email || null;
    },
    isAdmin() {
      return this.user && this.user.role === "admin";
    },

    pendingBadgeText() {
      if (!this.pendingCount) return "";
      return this.pendingCount > 9 ? "9+" : String(this.pendingCount);
    },
  },

  methods: {
    async handleLogOut() {
      try {
        await logout();
        this.user = null;
        this.pendingRequests = [];
        this.pendingCount = 0;
        this.notifOpen = false;
        this.menuOpen = false;
        this.$router.push("/ingresar");
      } catch (error) {
        console.error("Error al cerrar sesión:", error);
      }
    },

    async loadPending() {
      try {
        if (!this.user?.id || this.isAdmin) {
          this.pendingRequests = [];
          this.pendingCount = 0;
          return;
        }

        const pending = await getPendingRequestsReceived(this.user.id);
        this.pendingRequests = Array.isArray(pending) ? pending : [];
        this.pendingCount = this.pendingRequests.length;
      } catch (e) {
        console.error("[NavBar] Error cargando pendingRequests:", e);
        this.pendingRequests = [];
        this.pendingCount = 0;
      }
    },

    // Mobile: toggle con stopPropagation para que no se cierre instantáneo
    toggleNotifications(e) {
      e?.stopPropagation();
      this.notifOpen = !this.notifOpen;
      if (this.notifOpen) this.loadPending();
    },

    closeNotifications() {
      this.notifOpen = false;
    },

    openAndRefreshNotifications() {
      this.notifOpen = true;
      this.loadPending();
    },

    // Ir a solicitudes + scroll suave al #solicitudes
    goToFriendRequests() {
      this.menuOpen = false;
      this.notifOpen = false;

      this.$router.push("/mi-perfil").then(() => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            const el = document.getElementById("solicitudes");
            if (!el) return;

            const yOffset = 90; // ajustá si el navbar tapa (60/80/100)
            const y = el.getBoundingClientRect().top + window.pageYOffset - yOffset;

            window.scrollTo({ top: y, behavior: "smooth" });
          });
        });
      });
    },

    // cerrar dropdown clic afuera
    onDocClick(e) {
      if (!this.notifOpen) return;
      const root = this.$refs?.notifRoot;
      if (root && !root.contains(e.target)) {
        this.notifOpen = false;
      }
    },
  },

  mounted() {
    subscribeToAuthChanges(async (userState) => {
      this.user = userState && userState.email ? userState : null;
      this.isAuthChecked = true;
      this.notifOpen = false;
      await this.loadPending();
    });

    document.addEventListener("click", this.onDocClick);
  },

  beforeUnmount() {
    document.removeEventListener("click", this.onDocClick);
  },
};
</script>

<template>
  <nav
    class="relative z-50 w-full bg-[#f6f6eb] text-[#4e0d05] border-b border-[#4e0d05] py-4 px-8 flex items-center justify-between"
  >
    <!-- ✅ DESKTOP: Logo como siempre (izquierda) -->
    <RouterLink to="/" class="hidden md:flex items-center">
      <img src="/logo.png" alt="NYSO" class="w-22 md:w-26" />
    </RouterLink>

    <!-- ✅ MOBILE: izq notis / centro logo / der menú -->
    <div class="flex md:hidden items-center justify-between w-full">
      <!-- Izq: Notificaciones -->
      <div class="w-12 flex justify-start">
        <div v-if="user && !isAdmin" ref="notifRoot" class="relative">
          <button
            type="button"
            @click="toggleNotifications"
            class="relative inline-flex items-center justify-center w-10 h-10 rounded-full border border-[#4e0d05]/20 bg-white/40 hover:bg-white/70 transition"
            aria-label="Notificaciones"
            title="Notificaciones"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5 text-[#4e0d05]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M18 8a6 6 0 10-12 0c0 7-3 7-3 7h18s-3 0-3-7" />
              <path d="M13.73 21a2 2 0 01-3.46 0" />
            </svg>

            <span
              v-if="pendingCount > 0"
              class="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#e099a8] text-white text-[10px] font-bold flex items-center justify-center border border-[#f6f6eb]"
            >
              {{ pendingBadgeText }}
            </span>
          </button>

          <!-- Dropdown MOBILE -->
          <div
            v-if="notifOpen"
            class="fixed left-4 right-4 top-[64px] z-[9999] rounded-2xl border border-[#4e0d05]/20 bg-[#ede8d7] shadow-lg overflow-hidden"
          >
            <div class="px-4 py-3 border-b border-[#4e0d05]/10">
              <p class="font-semibold text-sm text-[#4e0d05]">Notificaciones</p>
              <p class="text-xs text-[#4e0d05]/60">Solicitudes de amistad</p>
            </div>

            <div v-if="pendingCount === 0" class="px-4 py-4">
              <p class="text-sm text-[#4e0d05]/70">No tenés notificaciones.</p>
            </div>

            <div v-else class="max-h-72 overflow-auto">
              <button
                v-for="r in pendingRequests"
                :key="r.id"
                type="button"
                @click="goToFriendRequests"
                class="w-full text-left px-4 py-3 hover:bg-white/60 transition border-b border-[#4e0d05]/5"
              >
                <p class="text-sm text-[#4e0d05] font-semibold truncate">
                  {{
                    r?.requester?.display_name ||
                    (r?.requester?.email ? r.requester.email.split('@')[0] : null) ||
                    r.requester_id ||
                    "Alguien"
                  }}
                </p>
                <p class="text-xs text-[#4e0d05]/70">
                  te envió una solicitud de amistad.
                </p>
              </button>
            </div>

            <div class="px-4 py-3 bg-white/40">
              <button
                type="button"
                @click="goToFriendRequests"
                class="text-xs font-semibold text-[#3c490b] hover:underline"
              >
                Ver solicitudes
              </button>
            </div>
          </div>
        </div>

        <!-- si no hay user, dejamos el espacio -->
        <div v-else class="w-10 h-10"></div>
      </div>

      <!-- Centro: Logo -->
      <RouterLink to="/" class="flex justify-center flex-1">
        <img src="/logo.png" alt="NYSO" class="w-22" />
      </RouterLink>

      <!-- Derecha: menú -->
      <div class="w-12 flex justify-end">
        <button
          @click="menuOpen = !menuOpen"
          class="text-3xl text-[#4e0d05]"
          aria-label="Abrir menú"
        >
          ☰
        </button>
      </div>
    </div>

    <!-- ✅ DESKTOP: Menú como lo tenías -->
    <ul
      class="hidden md:flex absolute left-1/2 -translate-x-1/2 justify-center gap-10 text-base font-medium"
    >
      <li>
        <RouterLink
          to="/"
          class="hover:text-[#e099a8] transition-colors"
          :class="{ 'text-[#4e0d05] font-semibold': $route.path === '/' }"
        >
          Inicio
        </RouterLink>
      </li>
      <li>
        <RouterLink
          to="/social"
          class="hover:text-[#e099a8] transition-colors"
          :class="{ 'text-[#4e0d05] font-semibold': $route.path === '/social' }"
        >
          Vinos
        </RouterLink>
      </li>
      <li>
        <RouterLink
          to="/blog"
          class="hover:text-[#e099a8] transition-colors"
          :class="{ 'text-[#4e0d05] font-semibold': $route.path === '/blog' }"
        >
          Blog
        </RouterLink>
      </li>
      <li>
        <RouterLink
          to="/red-social"
          class="hover:text-[#e099a8] transition-colors"
          :class="{
            'text-[#4e0d05] font-semibold': $route.path === '/red-social',
          }"
        >
          Red Social
        </RouterLink>
      </li>
      <li>
        <RouterLink
          to="/box"
          class="hover:text-[#e099a8] transition-colors"
          :class="{
            'text-[#4e0d05] font-semibold': $route.path === '/box',
          }"
        >
          Box NYSO
        </RouterLink>
      </li>
      <li v-if="user && user.role === 'admin'">
        <RouterLink
          to="/admin"
          class="hover:text-[#e099a8] transition-colors"
          :class="{ 'text-[#4e0d05] font-semibold': $route.path === '/admin' }"
        >
          Panel Admin
        </RouterLink>
      </li>
    </ul>

    <!-- ✅ DESKTOP: Usuario como lo tenías (derecha) -->
    <div class="hidden md:flex items-center gap-4">
      <template v-if="!isAuthChecked">
        <span class="text-[#4e0d05]/40 text-sm italic">...</span>
      </template>

      <template v-else-if="user">
        <RouterLink
          :to="isAdmin ? '/admin/perfil' : '/mi-perfil'"
          class="text-sm font-medium text-[#4e0d05] hover:text-[#e099a8]"
        >
          Mi perfil
        </RouterLink>

        <!-- Campanita desktop + dropdown -->
        <div v-if="!isAdmin" ref="notifRoot" class="relative">
          <button
            type="button"
            @click="notifOpen ? closeNotifications() : openAndRefreshNotifications()"
            class="relative inline-flex items-center justify-center w-10 h-10 rounded-full border border-[#4e0d05]/20 bg-white/40 hover:bg-white/70 transition"
            aria-label="Notificaciones"
            title="Notificaciones"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5 text-[#4e0d05]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M18 8a6 6 0 10-12 0c0 7-3 7-3 7h18s-3 0-3-7" />
              <path d="M13.73 21a2 2 0 01-3.46 0" />
            </svg>

            <span
              v-if="pendingCount > 0"
              class="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#e099a8] text-white text-[10px] font-bold flex items-center justify-center border border-[#f6f6eb]"
            >
              {{ pendingBadgeText }}
            </span>
          </button>

          <!-- Dropdown desktop -->
          <div
            v-if="notifOpen"
            class="fixed left-4 right-4 md:left-auto md:right-8 top-[64px] md:top-[72px] z-[9999] md:w-[320px] rounded-2xl border border-[#4e0d05]/20 bg-[#ede8d7] shadow-lg p-4"
          >
            <div class="px-4 py-3 border-b border-[#4e0d05]/10">
              <p class="font-semibold text-sm text-[#4e0d05]">Notificaciones</p>
              <p class="text-xs text-[#4e0d05]/60">Solicitudes de amistad</p>
            </div>

            <div v-if="pendingCount === 0" class="px-4 py-4">
              <p class="text-sm text-[#4e0d05]/70">No tenés notificaciones.</p>
            </div>

            <div v-else class="max-h-72 overflow-auto">
              <button
                v-for="r in pendingRequests"
                :key="r.id"
                type="button"
                @click="goToFriendRequests"
                class="w-full text-left px-4 py-3 hover:bg-white/60 transition border-b border-[#4e0d05]/5"
              >
                <p class="text-sm text-[#4e0d05] font-semibold truncate">
                  {{
                    r?.requester?.display_name ||
                    (r?.requester?.email ? r.requester.email.split('@')[0] : null) ||
                    r.requester_id ||
                    "Alguien"
                  }}
                </p>
                <p class="text-xs text-[#4e0d05]/70">
                  te envió una solicitud de amistad.
                </p>
              </button>
            </div>

            <div class="px-4 py-3 bg-white/40">
              <button
                type="button"
                @click="goToFriendRequests"
                class="text-xs font-semibold text-[#3c490b] hover:underline"
              >
                Ver solicitudes
              </button>
            </div>
          </div>
        </div>

        <button
          @click="handleLogOut"
          class="text-sm font-medium border border-[#e099a8] text-[#4e0d05] rounded-full px-4 py-1.5 hover:bg-[#e099a8] hover:text-white"
        >
          Cerrar sesión
        </button>
      </template>

      <template v-else>
        <RouterLink to="/ingresar" class="text-sm font-medium hover:text-[#e099a8]">
          Login
        </RouterLink>

        <RouterLink
          to="/crear-cuenta"
          class="text-sm font-medium border border-[#e099a8] text-[#4e0d05] rounded-full px-4 py-1.5 bg-[#e099a8]/20 hover:bg-[#e099a8] hover:text-white transition-all whitespace-nowrap"
        >
          Registrarme
        </RouterLink>
      </template>
    </div>
  </nav>

  <!-- Menu mobile (igual que antes, pero SIN notificaciones adentro) -->
  <div
    v-if="menuOpen"
    class="md:hidden w-full bg-[#f6f6eb] border-b border-[#4e0d05]/30 px-8 py-6 space-y-5"
  >
    <ul class="flex flex-col gap-4 text-lg font-medium">
      <RouterLink @click="menuOpen = false" to="/">Inicio</RouterLink>
      <RouterLink @click="menuOpen = false" to="/social">Vinos</RouterLink>
      <RouterLink @click="menuOpen = false" to="/blog">Blog</RouterLink>
      <RouterLink @click="menuOpen = false" to="/BOX">Box</RouterLink>
      <RouterLink @click="menuOpen = false" to="/red-social">Red Social</RouterLink>
      <RouterLink
        v-if="user && user.role === 'admin'"
        @click="menuOpen = false"
        to="/admin"
      >
        Administrador
      </RouterLink>
    </ul>

    <div class="h-px bg-[#4e0d05]/20 my-3"></div>

    <div class="flex flex-col gap-3">
      <template v-if="user">
        <RouterLink @click="menuOpen = false" to="/mi-perfil">Mi perfil</RouterLink>

        <button
          @click="handleLogOut"
          class="inline-block px-3 py-1 border border-[#e099a8]/60 text-[#4e0d05] rounded-full text-sm hover:bg-[#e099a8] hover:text-white transition-all"
        >
          Cerrar sesión
        </button>
      </template>

      <template v-else>
        <RouterLink
          @click="menuOpen = false"
          to="/ingresar"
          class="text-lg text-[#4e0d05] font-medium hover:text-[#e099a8] transition-colors"
        >
          Login
        </RouterLink>

        <RouterLink
          @click="menuOpen = false"
          to="/crear-cuenta"
          class="text-lg text-[#4e0d05] font-medium hover:text-[#e099a8] transition-colors"
        >
          Registrarme
        </RouterLink>
      </template>
    </div>
  </div>
</template>