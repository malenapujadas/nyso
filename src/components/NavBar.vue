<script>
import { logout, subscribeToAuthChanges } from "../services/auth.js";
import { RouterLink } from "vue-router";

export default {
  name: "NavBar",
  components: { RouterLink },

  data() {
    return {
      user: null,
      isAuthChecked: false,
      menuOpen: false, // para mobile
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
  },

  methods: {
    async handleLogOut() {
      try {
        await logout();
        this.user = null;
        this.menuOpen = false; // cerrar menú mobile
        this.$router.push("/ingresar");
      } catch (error) {
        console.error("Error al cerrar sesión:", error);
      }
    },
  },

  mounted() {
    subscribeToAuthChanges((userState) => {
      this.user = userState && userState.email ? userState : null;
      this.isAuthChecked = true;
    });
  },
};
</script>

<template>
  <nav
    class="w-full bg-[#f6f6eb] text-[#4e0d05] border-b border-[#4e0d05] py-4 px-8 flex items-center justify-between relative"
  >
    <!-- Logo -->
    <RouterLink to="/" class="flex items-center">
      <img src="/logo.png" alt="NYSO" class="w-22 md:w-26" />
    </RouterLink>

    <!-- Mobile botón menú -->
    <button
      @click="menuOpen = !menuOpen"
      class="text-3xl text-[#4e0d05] md:hidden"
    >
      ☰
    </button>

    <!-- Menu escritorio -->
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

    <!-- Usuario -->
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

        <button
          @click="handleLogOut"
          class="text-sm font-medium border border-[#e099a8] text-[#4e0d05] rounded-full px-4 py-1.5 hover:bg-[#e099a8] hover:text-white"
        >
          Cerrar sesión
        </button>
      </template>

      <template v-else>
        <RouterLink
          to="/ingresar"
          class="text-sm font-medium hover:text-[#e099a8]"
        >
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

  <!-- Menu mobile -->
  <div
    v-if="menuOpen"
    class="md:hidden w-full bg-[#f6f6eb] border-b border-[#4e0d05]/30 px-8 py-6 space-y-5"
  >
    <ul class="flex flex-col gap-4 text-lg font-medium">
      <RouterLink @click="menuOpen = false" to="/">Inicio</RouterLink>
      <RouterLink @click="menuOpen = false" to="/social">Vinos</RouterLink>
      <RouterLink @click="menuOpen = false" to="/blog">Blog</RouterLink>
      <RouterLink @click="menuOpen = false" to="/red-social"
        >Red Social</RouterLink
      >
      <RouterLink
        v-if="user && user.role === 'admin'"
        @click="menuOpen = false"
        to="/admin"
        >Administrador</RouterLink
      >
    </ul>

    <div class="h-px bg-[#4e0d05]/20 my-3"></div>

    <div class="flex flex-col gap-3">
      <template v-if="user">
        <RouterLink @click="menuOpen = false" to="/mi-perfil">
          Mi perfil
        </RouterLink>

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