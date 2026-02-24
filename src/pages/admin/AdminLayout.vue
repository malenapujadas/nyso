<script>
import { logout } from "../../services/auth.js";
import { getPendingSubscriptionsCount } from "../../services/subscriptions.js"; //funcion p contar las suscripciones pend
import { getPendingSuggestionsCount } from "../../services/blog.js";

export default {
  name: "AdminLayout",
  data() {
    return {
      mobileMenuOpen: false,
      pendingKitsCount: 0,
      pendingBlogCount: 0,
    };
  },
  async mounted() {
    // Cuando el panel carga por primera vez, buscamos el número
    await this.updateBadgeCount();
  },
  watch: {
    // Si el usuario cambia de página (ej. de Kits a Blog), volvemos a contar
    // para mantener el numerito actualizado.
    $route() {
      this.updateBadgeCount();
    },
  },
  methods: {
    async updateBadgeCount() {
      this.pendingKitsCount = await getPendingSubscriptionsCount();
      this.pendingBlogCount = await getPendingSuggestionsCount();
    },
    async handleLogout() {
      await logout();
      this.$router.push("/ingresar");
    },
    closeMobileMenu() {
      this.mobileMenuOpen = false;
    },
  },
};
</script>

<template>
  <div class="flex min-h-screen bg-[#f6f6eb]">
    <!--  escriotrio -->
    <aside
      class="w-64 bg-[#4e0d05] text-[#ede8d7] flex flex-col shadow-2xl z-20 hidden md:flex"
    >
      <div class="p-6 border-b border-[#ede8d7]/10">
        <h1 class="text-xs text-[#ede8d7]/50 block">PANEL ADMINISTRADOR</h1>
      </div>

      <nav class="flex-1 py-6 px-3 space-y-2">
        <router-link
          to="/admin/blog"
          active-class="bg-[#ede8d7]/10 text-white font-semibold"
          class="flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 hover:bg-[#ede8d7]/5 text-[#ede8d7]/80"
          @click="closeMobileMenu"
        >
          <div class="flex items-center gap-3">
            <span></span> Gestión del Blog
          </div>

          <span
            v-if="pendingBlogCount > 0"
            class="flex items-center justify-center min-w-[20px] h-[20px] px-1.5 rounded-full bg-red-500 text-white text-[10px] font-bold shadow-md"
          >
            {{ pendingBlogCount }}
          </span>
        </router-link>

        <router-link
          to="/admin/usuarios"
          active-class="bg-[#ede8d7]/10 text-white font-semibold"
          class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 hover:bg-[#ede8d7]/5 text-[#ede8d7]/80"
        >
          <span></span> Usuarios
        </router-link>

        <router-link
          to="/admin/kits"
          active-class="bg-[#ede8d7]/10 text-white font-semibold"
          class="flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 hover:bg-[#ede8d7]/5 text-[#ede8d7]/80"
        >
          <div class="flex items-center gap-3">
            <span></span> Suscripciones Kits
          </div>

          <span
            v-if="pendingKitsCount > 0"
            class="flex items-center justify-center min-w-[20px] h-[20px] px-1.5 rounded-full bg-red-500 text-white text-[10px] font-bold shadow-md"
          >
            {{ pendingKitsCount }}
          </span>
        </router-link>
      </nav>

      <div class="p-4 border-t border-[#ede8d7]/10"></div>
    </aside>

    <main class="flex-1 flex flex-col min-h-screen">
      <!-- HEADER MOBILE -->
      <header
        class="md:hidden sticky top-0 z-30 bg-white/60 backdrop-blur-sm border-b border-[#4e0d05]/10 px-4 py-3 flex items-center justify-between"
      >
        <button
          @click="mobileMenuOpen = true"
          class="inline-flex items-center justify-center px-3 py-2 rounded-xl border border-[#4e0d05]/20 text-[#4e0d05] bg-[#ede8d7]/40 hover:bg-[#ede8d7]/70 transition text-sm font-semibold"
        >
          Menú
        </button>

        <span class="font-extrabold text-[#4e0d05] tracking-tight"
          >NYSO Admin</span
        >

        <button
          @click="handleLogout"
          class="inline-flex items-center justify-center px-3 py-2 rounded-xl bg-[#4e0d05] text-[#f6f6eb] hover:bg-[#3c490b] transition text-sm font-semibold"
        >
          Salir
        </button>
      </header>

      <div v-if="mobileMenuOpen" class="md:hidden fixed inset-0 z-40">
        <!-- overlay -->
        <button
          class="absolute inset-0 bg-black/40"
          @click="closeMobileMenu"
          aria-label="Cerrar menú"
        ></button>

        <!-- drawer -->
        <aside
          class="absolute left-0 top-0 h-full w-80 max-w-[85%] bg-[#4e0d05] text-[#ede8d7] shadow-2xl flex flex-col"
        >
          <div
            class="p-5 border-b border-[#ede8d7]/10 flex items-center justify-between"
          >
            <div>
              <p class="text-xs text-[#ede8d7]/60">PANEL ADMINISTRADOR</p>
              <p class="text-lg font-extrabold">Menú</p>
            </div>

            <button
              @click="closeMobileMenu"
              class="px-3 py-2 rounded-xl bg-[#ede8d7]/10 hover:bg-[#ede8d7]/20 transition text-sm font-semibold"
            >
              ✕
            </button>
          </div>

          <nav class="flex-1 py-4 px-3 space-y-2">
            <router-link
              to="/admin/blog"
              active-class="bg-[#ede8d7]/10 text-white font-semibold"
              class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 hover:bg-[#ede8d7]/5 text-[#ede8d7]/80"
              @click="closeMobileMenu"
            >
              <span></span> Gestión del Blog
            </router-link>

            <router-link
              to="/admin/usuarios"
              active-class="bg-[#ede8d7]/10 text-white font-semibold"
              class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 hover:bg-[#ede8d7]/5 text-[#ede8d7]/80"
              @click="closeMobileMenu"
            >
              <span></span> Usuarios
            </router-link>

            <router-link
              to="/admin/kits"
              active-class="bg-[#ede8d7]/10 text-white font-semibold"
              class="flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 hover:bg-[#ede8d7]/5 text-[#ede8d7]/80"
              @click="closeMobileMenu"
            >
              <div class="flex items-center gap-3">
                <span></span> Suscripciones Kits
              </div>

              <span
                v-if="pendingKitsCount > 0 || pendingBlogCount > 0" class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-[#f6f6eb]"
              >
                {{ pendingKitsCount }}
              </span>
            </router-link>
          </nav>

          <div class="p-4 border-t border-[#ede8d7]/10">
            <button
              @click="handleLogout"
              class="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#ede8d7]/10 text-[#ede8d7] hover:bg-[#ede8d7]/20 transition-all text-sm font-semibold"
            >
              Cerrar sesión
            </button>
          </div>
        </aside>
      </div>

      <!-- CONTENIDO -->
      <div class="flex-1 overflow-auto p-5 md:p-10 relative">
        <router-view></router-view>
      </div>
    </main>
  </div>
</template>
