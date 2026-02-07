<script>
import { logout } from "../../services/auth.js";

export default {
  name: "AdminLayout",
  methods: {
    async handleLogout() {
      await logout();
      this.$router.push("/ingresar");
    },
  },
};
</script>

<template>
  <div class="flex min-h-screen bg-[#f6f6eb]">
    <aside class="w-64 bg-[#4e0d05] text-[#ede8d7] flex flex-col shadow-2xl z-20 hidden md:flex">
      <div class="p-6 border-b border-[#ede8d7]/10">
        <h1 class="text-xs text-[#ede8d7]/50 block">PANEL ADMINISTRADOR</h1>
      </div>

      <nav class="flex-1 py-6 px-3 space-y-2">
        <router-link 
          to="/admin/blog" 
          active-class="bg-[#ede8d7]/10 text-white font-semibold"
          class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 hover:bg-[#ede8d7]/5 text-[#ede8d7]/80"
        >
          <span></span> Gestión del Blog
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
          class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 hover:bg-[#ede8d7]/5 text-[#ede8d7]/80"
        >
          <span></span> Suscripciones Kits
        </router-link>
      </nav>

      <!-- <div class="p-4 border-t border-[#ede8d7]/10">
        <button 
          @click="handleLogout"
          class="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#3c490b] text-[#f6f6eb] hover:bg-[#e099a8] hover:text-[#4e0d05] transition-all text-sm font-medium"
        >
          Cerrar Sesión
        </button>
      </div> -->
    </aside>

    <main class="flex-1 flex flex-col h-screen overflow-hidden">
        <header class="bg-white/50 backdrop-blur-sm border-b border-[#4e0d05]/10 p-4 flex justify-between items-center md:hidden">
             <span class="font-bold text-[#4e0d05]">NYSO Admin</span>
             <button @click="handleLogout" class="text-xs text-red-500">Salir</button>
        </header>

        <div class="flex-1 overflow-auto p-6 md:p-10 relative">
             <router-view></router-view>
        </div>
    </main>
  </div>
</template>