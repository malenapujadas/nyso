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
    <img class="w-48 mb-6" :src="logo" alt="Logo de Nyso social" />
    <p class="max-w-md mb-8">
      Tu red social de confianza para subir o mirar reseñas de todos los vinos de Argentina.
    </p>

    <ul class="flex gap-4 justify-center">
      <template v-if="user.id === null">
        <li>
          <RouterLink
            class="text-lg rounded-lg px-4 py-2 bg-[#e099a8] shadow-lg shadow-[#e099a8]/50 hover:text-white inline-block text-center"
            to="/ingresar"
          >
            Login
          </RouterLink>
        </li>
        <li>
          <RouterLink
            class="text-lg rounded-lg px-4 py-2 bg-[#e099a8] shadow-lg shadow-[#e099a8]/50 hover:text-white inline-block text-center"
            to="/crear-cuenta"
          >
            Registrarme
          </RouterLink>
        </li>
      </template>

      <template v-else>
        <li>
          <RouterLink
            class="text-lg rounded-lg px-4 py-2 bg-[#e099a8] shadow-lg shadow-[#e099a8]/50 hover:text-white inline-block text-center"
            to="/mi-perfil"
          >
            Mi perfil
          </RouterLink>
        </li>
        <li>
          <button
            @click="handleLogOut"
            class="text-lg rounded-lg px-4 py-2 bg-[#e099a8] shadow-lg shadow-[#e099a8]/50 hover:text-white inline-block text-center"
          >
            Cerrar sesión
          </button>
        </li>
      </template>
    </ul>
  </section>
</template>

