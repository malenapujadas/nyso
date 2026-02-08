<script>
import { getAuthUser, subscribeToAuthChanges } from "../../services/auth.js";
import AppH1 from "../../components/AppH1.vue";

export default {
  name: "AdminProfile",
  components: { AppH1 },
  data() {
    return {
      user: {},
    };
  },
  mounted() {
    this.user = getAuthUser();
    // Nos suscribimos por si edita sus datos y vuelven actualizados
    subscribeToAuthChanges((newUser) => (this.user = newUser));
  },
};
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <div class="mb-8">
      <h2 class="text-3xl font-bold text-[#4e0d05]">Perfil de Administrador</h2>
      <p class="text-[#4e0d05]/60">Gestioná tus datos de acceso.</p>
    </div>

    <div class="bg-[#ede8d7] rounded-3xl border border-[#4e0d05]/20 shadow-sm p-8 flex flex-col md:flex-row gap-8 items-start">
      
      <div class="w-24 h-24 rounded-full bg-[#4e0d05] flex items-center justify-center text-[#ede8d7] text-4xl font-bold shadow-inner">
        {{ user.nombre ? user.nombre.charAt(0).toUpperCase() : "A" }}
      </div>

      <div class="flex-1 space-y-4">
        <div>
          <label class="text-xs font-bold text-[#4e0d05]/50 uppercase tracking-wider">Nombre</label>
          <p class="text-xl text-[#4e0d05] font-medium">{{ user.nombre || user.display_name || 'Admin' }}</p>
        </div>

        <div>
          <label class="text-xs font-bold text-[#4e0d05]/50 uppercase tracking-wider">Email</label>
          <p class="text-lg text-[#4e0d05]">{{ user.email }}</p>
        </div>

        <div>
          <label class="text-xs font-bold text-[#4e0d05]/50 uppercase tracking-wider">Rol</label>
          <span class="inline-block px-3 py-1 rounded-full bg-[#e099a8]/20 text-[#4e0d05] text-xs font-bold border border-[#e099a8]/50 mt-1">
            Administrador del Sistema
          </span>
        </div>
      </div>

      <!-- <router-link 
        to="/mi-perfil/editar"
        class="px-6 py-2 rounded-full border border-[#4e0d05]/30 text-[#4e0d05] hover:bg-[#4e0d05] hover:text-[#ede8d7] transition-all font-medium"
      >
        Editar mis datos
      </router-link> -->
    </div>
  </div>
</template>