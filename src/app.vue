<script>
import Home from './pages/Home.vue';
import { logout, subscribeToAuthChanges } from './services/auth.js';


export default {
    name: 'App',
    components: { Home },
    data(){
        return{
            user: {
                id: null,
                email: null,
            }
        }
    },
    methods:{
        handleLogOut(){
            logout();
            this.$router.push('/ingresar');
        }
    },
    mounted(){
        subscribeToAuthChanges(userState => this.user = userState);
    }
}
</script>


<template>
    
    <div class="min-h-screen bg-[#f6f6eb] font-helvetica text-[#333333] flex flex-col">
  
    
<nav class="w-full bg-[#f6f6eb] text-[#4e0d05] border-b border-[#4e0d05] py-4 px-8 flex items-center justify-between">

  <div class="w-32"></div>


  <ul class="flex justify-center gap-8 text-base font-medium">
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
  </ul>


  <div class="flex gap-3 items-center w-32 justify-end">
    <RouterLink
      to="/ingresar"
      class="text-sm font-medium hover:text-[#e099a8] transition-colors"
    >
      Login
    </RouterLink>

    <RouterLink
      to="/crear-cuenta"
      class="text-sm font-medium border border-[#e099a8] text-[#4e0d05] rounded-full px-4 py-1 bg-[#e099a8]/20 hover:bg-[#e099a8] hover:text-white transition-all duration-300"
    >
      Registrarme
    </RouterLink>
  </div>
</nav>


  

<main class="flex-1">
    <RouterView />
</main>

<footer class="relative bg-[#f6f6eb] pt-20 flex flex-col items-center justify-center">


<div class="w-full bg-[#3c490b] text-[#f6f6eb] rounded-t-3xl px-10 py-20 text-center shadow-inner">


  <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 items-center justify-items-center text-left">


    <div class="flex flex-col items-center md:items-start">
      <h3 class="font-bold text-lg mb-3 text-[#f6f6eb] uppercase tracking-wide">Sobre NYSO</h3>
      <ul class="space-y-2 text-sm text-[#f6f6eb]">
        <li>
          <RouterLink to="/" class="hover:text-[#e099a8] transition-colors">Inicio</RouterLink>
        </li>
        <li>
          <RouterLink to="/social" class="hover:text-[#e099a8] transition-colors">Vinos</RouterLink>
        </li>
        <li>
          <RouterLink to="/blog" class="hover:text-[#e099a8] transition-colors">Blog</RouterLink>
        </li>
      </ul>
    </div>

 
    <div class="flex justify-center items-center">
      <div class="bg-[#e099a8]/100 border border-[#f6f6eb] rounded-full px-10 py-4 text-xl md:text-2xl font-bold text-[#3c490b] text-center">
        info@nyso.com
      </div>
    </div>


    <div class="flex flex-col items-center md:items-end">
      <h3 class="font-bold text-lg mb-4 text-[#f6f6eb] uppercase tracking-wide">Seguinos</h3>
      <div class="flex justify-center md:justify-end gap-6 items-center">
        <a href="https://www.instagram.com/nyso_vinos/" target="_blank" rel="noopener noreferrer">
          <img src="/ig.png" alt="Instagram" class="w-8 h-8 hover:scale-110 transition-transform duration-300" />
        </a>
        <img src="/tiktok.png" alt="TikTok" class="w-8 h-8 hover:scale-110 transition-transform duration-300" />
      </div>
    </div>

  </div>
</div>


</footer>


</div>
</template>
