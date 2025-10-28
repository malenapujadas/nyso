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
  <section class="relative flex flex-col justify-center items-center text-center py-20 bg-[#f6f6eb] overflow-hidden">
    <img
      src="/icono1.png"
      alt="Decoración"
      class="absolute top-10 left-12 w-40 opacity-70"
    />
    <img
      src="/icono2.png"
      alt="Decoración"
      class="absolute bottom-4 left-32 w-32 opacity-75"
    />
    <img
      src="/icono3.png"
      alt="Decoración"
      class="absolute top-20 right-24 w-20 opacity-80"
    />


    <img src="/logo.png" alt="Logo NYSO" class="w-55 mb-10 relative z-10" />

    
    <h2
      class="text-[#4e0d05] font-extrabold text-4xl leading-tight max-w-3xl uppercase tracking-tight font-[Poppins] relative z-10"
    >
      DESCUBRIR,
      <span class="text-[#3c490b]">GUARDAR</span>,
      Y COMPARTIR
      <span class="text-[#e099a8]">VINOS</span>
      DE UNA FORMA SIMPLE Y CERCANA, SIN NECESIDAD DE SER UN
      <span class="text-[#e099a8]">EXPERTO.</span>
    </h2>
  </section>


<section class="relative w-full bg-[#e099a8] py-20 mt-16 overflow-hidden">


  <img src="/icono1.png" alt="Decoración" class="absolute top-10 left-10 w-28 opacity-100" />
  <img src="/icono1.png" alt="Decoración" class="absolute bottom-16 right-24 w-40 opacity-100 rotate-12" />
  <img src="/icono1.png" alt="Decoración" class="absolute top-28 right-1/4 w-32 opacity-100 rotate-45" />
  <img src="/icono1.png" alt="Decoración" class="absolute bottom-8 left-1/3 w-24 opacity-100 -rotate-12" />
  <img src="/icono1.png" alt="Decoración" class="absolute top-1/2 right-12 w-28 opacity-100 rotate-6" />


  <div class="mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-center gap-10 px-6 z-10 relative">
  
    <div class="flex justify-center md:justify-start w-full md:w-1/2">
      <img src="/nysito.png" alt="Personaje Nysito" class="w-56 md:w-64" />
    </div>


    <div class="text-[#4e0d05] text-left font-[Poppins] md:w-1/2 leading-snug">
      <h3 class="text-2xl font-extrabold mb-3">¡Hola, soy Nysito!</h3>
      <p class="text-base">
        Voy a ayudarte a moverte por el mundo del vino.  
        Usá el buscador con filtros para encontrar ese vino perfecto,  
        y creá tu perfil para guardar tus favoritos, compartir  
        y conectar con gente como vos.
      </p>
    </div>
  </div>
</section>


<section class="relative bg-[#f6f6eb] w-full h-20">
  <img 
    src="/lineacuadros.png" 
    alt="Divisor decorativo" 
    class="absolute -top-[37px] left-0 w-full h-auto block"
  />
</section>


</template>


<style scoped>

img[alt="Decoración"] {
  pointer-events: none;
  user-select: none;
}
</style>

