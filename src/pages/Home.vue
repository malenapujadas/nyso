<script>

import AppH1 from '../components/AppH1.vue';
import { subscribeToAuthChanges, logout } from '../services/auth.js';
import {RouterLink} from 'vue-router';
import logo from '../assets/logo.png';

export default {
    name: 'Home',  
    components: { AppH1 }, 
    data() {
        return {
            logo,
            user: {
                id: null,
                email: null,
            }
        };
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
  <section class="flex flex-col justify-center items-center text-center py-20">
    <!-- Personaje Nysito -->
    <img
      src="/nysito.png"
      alt="Personaje Nysito"
      class="w-28 mb-6"
    />

    <!-- Frase principal -->
    <p class="max-w-md mb-10 text-[#4e0d05] leading-tight">

      Tu red social de confianza para subir o mirar reseñas de todos los vinos de Argentina.
    </p>

    <ul class="flex gap-4 justify-center">
  <template v-if="user.id === null">
    <li>
      <RouterLink
        to="/ingresar"
        class="text-base font-medium rounded-full px-6 py-2 bg-[#3c490b] text-[#f6f6eb] hover:bg-[#e099a8] hover:text-[#4e0d05] transition-colors duration-300"
      >
        Login
      </RouterLink>
    </li>
    <li>
      <RouterLink
        to="/crear-cuenta"
        class="text-base font-medium rounded-full px-6 py-2 bg-[#3c490b] text-[#f6f6eb] hover:bg-[#e099a8] hover:text-[#4e0d05] transition-colors duration-300"
      >
        Registrarme
      </RouterLink>
    </li>
  </template>

  <template v-else>
    <li>
      <RouterLink
        to="/mi-perfil"
        class="text-base font-medium rounded-full px-6 py-2 bg-[#3c490b] text-[#f6f6eb] hover:bg-[#e099a8] hover:text-[#4e0d05] transition-colors duration-300"
      >
        Mi perfil
      </RouterLink>
    </li>
    <li>
      <button
        @click="handleLogOut"
        class="text-base font-medium rounded-full px-6 py-2 bg-[#3c490b] text-[#f6f6eb] hover:bg-[#e099a8] hover:text-[#4e0d05] transition-colors duration-300"
      >
        Cerrar sesión
      </button>
    </li>
  </template>
</ul>


  </section>
</template>
