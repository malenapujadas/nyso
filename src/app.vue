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
  
    
      <nav class="flex justify-between items-center px-8 py-4 bg-[#f6f6eb] border-b border-[#4e0d05]">

        <RouterLink to="/" class="flex items-center">
        <img src="/logo.png" alt="Logo NYSO" class="h-10 w-auto" />
        </RouterLink>
  
   
        <ul class="flex gap-6 text-sm font-medium">
          <li>
            <RouterLink
              to="/"
              class="hover:text-[#4e0d05] transition-colors"
              :class="{ 'text-[#4e0d05] font-semibold': $route.path === '/' }"
            >
              Home
            </RouterLink>
          </li>
          <li>
            <RouterLink
              to="/social"
              class="hover:text-[#4e0d05] transition-colors"
              :class="{ 'text-[#4e0d05] font-semibold': $route.path === '/social' }"
            >
              Publicaciones
            </RouterLink>
          </li>
        </ul>
      </nav>
  

      <main class="flex-1 p-6">
        <RouterView />
      </main>
  
   
      <footer class="border-t border-[#4e0d05] py-4 text-center font-medium text-[#4e0d05]">
        NYSO — Todos los derechos reservados.
      </footer>
  
    </div>
  </template>