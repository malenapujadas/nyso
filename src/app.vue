<script>
import { logout, subscribeToAuthChanges } from './services/auth.js';

export default {
  name: 'App',

  data() {
    return {
      user: null,
      isAuthChecked: false,
      menuOpen: false, //  para mobile
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
        this.menuOpen = false; // cerrar menú mobile
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
  <div class="min-h-screen bg-[#f6f6eb] flex flex-col">

    <nav
      class="w-full bg-[#f6f6eb] text-[#4e0d05] border-b border-[#4e0d05] py-4 px-8 flex items-center justify-between relative"
    >

      <!-- Mobile-->
      <div class="flex md:hidden w-full items-center justify-between">
        <RouterLink to="/" @click="menuOpen = false">
          <img src="/logo.png" class="w-24" />
        </RouterLink>

        <button @click="menuOpen = !menuOpen" class="text-3xl text-[#4e0d05]">
          ☰
        </button>
      </div>


      
      <div class="hidden md:block w-40"></div>

      <!-- Menu desktop -->
      <ul
        class="hidden md:flex absolute left-1/2 -translate-x-1/2 flex justify-center gap-10 text-base font-medium"
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

      <!--  usuario desktop -->
      <div class="hidden md:flex items-center gap-4 w-56 justify-end">

        <template v-if="!isAuthChecked">
          <span class="text-[#4e0d05]/40 text-sm italic">...</span>
        </template>

        <template v-else-if="user">
          <RouterLink
            to="/mi-perfil"
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

    <!-- menu mobile-->
    <div
      v-if="menuOpen"
      class="md:hidden w-full bg-[#f6f6eb] border-b border-[#4e0d05]/30 px-8 py-6 space-y-5"
    >
      <ul class="flex flex-col gap-4 text-lg font-medium">
        <RouterLink @click="menuOpen=false" to="/">Inicio</RouterLink>
        <RouterLink @click="menuOpen=false" to="/social">Vinos</RouterLink>
        <RouterLink @click="menuOpen=false" to="/blog">Blog</RouterLink>
        <RouterLink @click="menuOpen=false" to="/red-social">Red Social</RouterLink>
      </ul>

      <div class="h-px bg-[#4e0d05]/20 my-3"></div>

      <div class="flex flex-col gap-3">
        <template v-if="user">
          <RouterLink @click="menuOpen=false" to="/mi-perfil">
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
            @click="menuOpen=false"
            to="/ingresar"
            class="text-lg text-[#4e0d05] font-medium hover:text-[#e099a8] transition-colors"
          >
            Login
          </RouterLink>

          <RouterLink
            @click="menuOpen=false"
            to="/crear-cuenta"
            class="text-lg text-[#4e0d05] font-medium hover:text-[#e099a8] transition-colors"
          >
            Registrarme
          </RouterLink>

        </template>
      </div>
    </div>

    <main class="flex-1">
      <RouterView />
    </main>


    <footer class="relative bg-[#f6f6eb] pt-16 flex flex-col items-center justify-center">

<!-- Contenido principal -->
<div class="w-full bg-[#3c490b] text-[#f6f6eb] rounded-t-[40px] px-8 py-14 md:px-10 md:py-16 shadow-inner">
  <div
    class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 items-start 
           justify-items-center text-center md:text-left"
  >

    <!-- Sobre nyso -->
    <div class="flex flex-col items-center md:items-start">
      <h3 class="font-bold text-base md:text-lg mb-3 uppercase tracking-wide text-[#e099a8]">
        Sobre NYSO
      </h3>
      <ul class="space-y-2 text-sm md:text-base text-[#f6f6eb]">
        <li><RouterLink to="/" class="hover:text-[#e099a8] transition-colors">Inicio</RouterLink></li>
        <li><RouterLink to="/social" class="hover:text-[#e099a8] transition-colors">Vinos</RouterLink></li>
        <li><RouterLink to="/blog" class="hover:text-[#e099a8] transition-colors">Blog</RouterLink></li>
        <li><RouterLink to="/red-social" class="hover:text-[#e099a8] transition-colors">Red social</RouterLink></li>
      </ul>
    </div>

    <div class="flex flex-col items-center text-center">
      <img src="/logo.png" alt="Logo NYSO" class="w-20 md:w-28 mb-4" />
      <p class="text-xs md:text-sm leading-relaxed max-w-[220px] md:max-w-xs">
        Descubrí, guardá y compartí tus vinos favoritos. <br />
        Somos una comunidad donde el vino se disfruta.
      </p>
      <div
        class="mt-4 bg-[#e099a8] text-[#3c490b] font-semibold text-xs md:text-sm 
               px-5 py-2 rounded-full border border-[#f6f6eb]/40"
      >
        info@nyso.com
      </div>
    </div>

    <!-- Redes -->
    <div class="flex flex-col items-center md:items-end text-center md:text-right">
      <h3 class="font-bold text-base md:text-lg mb-3 uppercase tracking-wide text-[#e099a8]">
        Seguinos
      </h3>

      <div class="flex justify-center md:justify-end gap-6 mb-4">
        <a href="https://www.instagram.com/nyso_vinos/" target="_blank">
          <img src="/ig.png" alt="Instagram"
               class="w-7 h-7 md:w-8 md:h-8 hover:scale-110 transition-transform duration-300" />
        </a>

        <a href="#">
          <img src="/tiktok.png" alt="TikTok"
               class="w-7 h-7 md:w-8 md:h-8 hover:scale-110 transition-transform duration-300" />
        </a>
      </div>

      <p class="text-[10px] md:text-xs text-[#f6f6eb]/80">#DescubríNYSO</p>
    </div>
  </div>
</div>

<div
  class="w-full bg-[#2d3707] text-[#f6f6eb]/70 text-xs md:text-sm 
         py-3 md:py-4 flex flex-col md:flex-row items-center justify-center gap-2 md:gap-8"
>
  <p>© 2025 NYSO. Todos los derechos reservados.</p>
</div>
</footer>


  </div>
</template>
