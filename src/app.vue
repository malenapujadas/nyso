<script>
import { logout, subscribeToAuthChanges } from './services/auth.js';

export default {
  name: 'App',

  data() {
    return {
      user: null,
      isAuthChecked: false,
    };
  },

  computed: {
    userName() {
      if (!this.user) return null;
      return this.user.user_metadata?.nombre || this.user.email || null;
    },
  },

  methods: {
    async handleLogOut() {
      try {
        await logout();
        this.user = null;
        this.$router.push('/ingresar');
      } catch (error) {
        console.error('Error al cerrar sesión:', error);
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
    
  <div class="min-h-screen bg-[#f6f6eb] font-helvetica text-[#333333] flex flex-col">
    
    <nav
  class="w-full bg-[#f6f6eb] text-[#4e0d05] border-b border-[#4e0d05] py-4 px-8 flex items-center justify-between relative"
    >
  <div class="w-40"></div>

  <ul
    class="absolute left-1/2 -translate-x-1/2 flex justify-center gap-10 text-base font-medium"
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
        :class="{ 'text-[#4e0d05] font-semibold': $route.path === '/red-social' }"
      >
        Red Social
      </RouterLink>
    </li>
  </ul>

  <div class="flex items-center gap-4 w-40 justify-end">
    <template v-if="!isAuthChecked">
      <span class="text-[#4e0d05]/40 text-sm italic">...</span>
    </template>

    <!-- Usuario logueado -->
    <template v-else-if="user">
      <RouterLink
        to="/mi-perfil"
        class="text-sm font-medium text-[#4e0d05] hover:text-[#e099a8] transition-colors whitespace-nowrap"
      >
        Mi perfil
      </RouterLink>

      <button
        @click="handleLogOut"
        class="text-sm font-medium border border-[#e099a8] text-[#4e0d05] rounded-full px-4 py-1.5 hover:bg-[#e099a8] hover:text-white transition-all whitespace-nowrap"
      >
        Cerrar sesión
      </button>
    </template>

    <!-- Usuario no logueado -->
    <template v-else>
      <RouterLink
        to="/ingresar"
        class="text-sm font-medium hover:text-[#e099a8] transition-colors whitespace-nowrap"
      >
        Login
      </RouterLink>

      <RouterLink
        to="/crear-cuenta"
        class="text-sm font-medium border border-[#e099a8] text-[#4e0d05] rounded-full px-4 py-1.5 bg-[#e099a8]/20 hover:bg-[#e099a8] hover:text-white transition-all duration-300 whitespace-nowrap"
      >
        Registrarme
      </RouterLink>
    </template>
  </div>
</nav>



  

<main class="flex-1">
    <RouterView />
</main>



<footer class="relative bg-[#f6f6eb] pt-20 flex flex-col items-center justify-center">

<!-- Contenido -->
<div class="w-full bg-[#3c490b] text-[#f6f6eb] rounded-t-[40px] px-10 py-16 shadow-inner">
  <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 items-start justify-items-center text-left">

    <!-- sobre nyso-->
    <div class="flex flex-col items-center md:items-start">
      <h3 class="font-bold text-lg mb-3 uppercase tracking-wide text-[#e099a8]">
        Sobre NYSO
      </h3>
      <ul class="space-y-2 text-sm text-[#f6f6eb]">
        <li><RouterLink to="/" class="hover:text-[#e099a8] transition-colors">Inicio</RouterLink></li>
        <li><RouterLink to="/social" class="hover:text-[#e099a8] transition-colors">Vinos</RouterLink></li>
        <li><RouterLink to="/blog" class="hover:text-[#e099a8] transition-colors">Blog</RouterLink></li>
        <li><RouterLink to="/red-social" class="hover:text-[#e099a8] transition-colors">Red social</RouterLink></li>
      </ul>
    </div>

    <!-- info -->
    <div class="flex flex-col items-center text-center">
      <img src="/logo.png" alt="Logo NYSO" class="w-28 mb-4" />
      <p class="text-sm leading-relaxed max-w-xs">
        Descubrí, guardá y compartí tus vinos favoritos.  
        Somos una comunidad donde el vino se disfruta.
      </p>
      <div class="mt-4 bg-[#e099a8] text-[#3c490b] font-semibold text-sm px-6 py-2 rounded-full border border-[#f6f6eb]/40">
        info@nyso.com
      </div>
    </div>

    <!-- redes sociales-->
    <div class="flex flex-col items-center md:items-end text-center md:text-right">
      <h3 class="font-bold text-lg mb-3 uppercase tracking-wide text-[#e099a8]">
        Seguinos
      </h3>
      <div class="flex justify-center md:justify-end gap-5 mb-4">
        <a href="https://www.instagram.com/nyso_vinos/" target="_blank" rel="noopener noreferrer">
          <img src="/ig.png" alt="Instagram" class="w-8 h-8 hover:scale-110 transition-transform duration-300" />
        </a>
        <a href="#">
          <img src="/tiktok.png" alt="TikTok" class="w-8 h-8 hover:scale-110 transition-transform duration-300" />
        </a>
      </div>
      <p class="text-xs text-[#f6f6eb]/80">#DescubríNYSO</p>
    </div>
  </div>
</div>

<!-- derechos reservados-->
<div class="w-full bg-[#2d3707] text-[#f6f6eb]/70 text-sm py-4 flex flex-col md:flex-row items-center justify-center gap-2 md:gap-8">
  <p>© 2025 NYSO. Todos los derechos reservados.</p>
</div>

</footer>

</div>
</template>
