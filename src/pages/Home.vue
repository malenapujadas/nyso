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
  <section class="relative flex flex-col justify-center items-center text-center py-37 bg-[#f6f6eb] overflow-hidden">
    <img
      src="/icono1.png"
      alt="Decoración"
      class="absolute top-10 left-12 w-40 opacity-100"
    />
    <img
      src="/icono2.png"
      alt="Decoración"
      class="absolute bottom-4 left-32 w-32 opacity-100"
    />
    <img
      src="/icono3.png"
      alt="Decoración"
      class="absolute top-20 right-24 w-20 opacity-100"
    />


    <img src="/logo.png" alt="Logo NYSO" class="w-75 mb-10 center relative z-10" />

    
    <h2
      class="text-[#4e0d05] font-extrabold text-3xl leading-tight max-w-3xl uppercase tracking-tight font-[Poppins] relative z-10"
    >
      DESCUBRIR,
      <span class="text-[#3c490b]">GUARDAR</span>,
      Y COMPARTIR
      <span class="text-[#e099a8]">VINOS</span>
      DE UNA FORMA SIMPLE Y CERCANA, SIN NECESIDAD DE SER UN
      <span class="text-[#e099a8]">EXPERTO.</span>
    </h2>
  </section>


<section class="relative bg-[#f6f6eb] w-full h-20">
  <img 
    src="/lineacuadros.png" 
    alt="Divisor decorativo" 
    class="absolute -top-[1px] left-0 w-full h-auto block"
  />
</section>

<!-- SNysito -->
<section class="relative w-full bg-[#e099a8] text-[#4e0d05] py-15 px-8 flex flex-col md:flex-row items-center justify-center gap-10 overflow-hidden rounded-b-4xl">
  <img src="/icono1.png" alt="Decoración" class="absolute top-10 left-12 w-28 opacity-100" />
  <img src="/icono2.png" alt="Decoración" class="absolute bottom-12 right-16 w-32 opacity-100 rotate-12" />
  <img src="/icono4.png" alt="Decoración" class="absolute top-20 right-1/3 w-28 opacity-100" />
  <img src="/icono7.png" alt="Decoración" class="absolute bottom-1 left-1/2 w-28 opacity-100 rotate-12" />

  <img src="/nysito.png" alt="Personaje Nysito" class="w-44 md:w-56 z-10" />
  <div class="text-left max-w-md z-10">
    <h2 class="text-3xl font-extrabold mb-3">¡Hola, soy Nysito!</h2>
    <p class="text-lg font-medium leading-snug">
      Voy a ayudarte a moverte por el mundo del vino.
    </p>
    <p class="text-lg font-light py-2 leading-snug">
      En Nyso vas a poder encontrar nuevos vinos, aprender de la comunidad, y compartir tus propias experiencias.
      Mi misión es hacer que aprender y hablar de vino sea fácil, divertido y sin vueltas.</p>
  </div>
</section>



<!-- Sección 2 -->
<section
  class="relative w-full bg-[#3c490b] text-[#f6f6eb] py-10 px-8 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 overflow-hidden"
>
  <div class="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
    <img src="/icono2.png" alt="Decoración" class="absolute right-40 w-32 opacity-100 rotate-12" />
  <img src="/icono4.png" alt="Decoración" class="absolute top-10 right-1/1 w-28 opacity-100" />
  <img src="/icono1.png" alt="Decoración" class="absolute top-12 left-20 w-32 opacity-100 rotate-12" />
  <img src="/icono2.png" alt="Decoración" class="absolute bottom-8 right-20 w-36 opacity-100" />
  <img src="/icono5.png" alt="Decoración" class="absolute top-1/8 left-1/3 w-23 opacity-100 rotate-6" />
  <img src="/icono6.png" alt="Decoración" class="absolute bottom-16 left-1/4 w-32 opacity-100 -rotate-6" />
  <img src="/icono7.png" alt="Decoración" class="absolute bottom-1 left-1/3 w-28 opacity-100 rotate-12" />
    <!-- TEXTO -->
    <div class="text-right max-w-md z-10">
      <p class="text-3xl font-extrabold leading-tight mb-3">
        Usá el buscador con filtros <br />para encontrar ese vino perfecto.
      </p>

      <RouterLink
        to="/social"
        class="inline-block px-7 py-2 text-lg font-semibold bg-[#e099a8] text-[#3c490b] border border-[#f6f6eb] rounded-full hover:bg-[#f6f6eb] hover:text-[#3c490b] transition-all duration-300"
      >
        Ver vinos
      </RouterLink>
    </div>

    <!-- IMAGEN -->
    <img
      src="/foto1.png"
      alt="Buscador de vinos"
      class="w-64 md:w-[340px] z-10 bg-transparent"
    />
  </div>
</section>



<!-- Sección 3 -->
<section
  class="relative w-full bg-[#f6f6eb] text-[#e099a8] py-12 px-8 flex flex-col md:flex-row items-center justify-center md:justify-between gap-10 md:gap-20 overflow-hidden"
>
  <!-- Iconos decorativos -->
  <img src="/icono1.png" alt="Decoración" class="absolute top-12 left-20 w-32 opacity-100 rotate-12" />
  <img src="/icono2.png" alt="Decoración" class="absolute bottom-8 right-20 w-36 opacity-100" />
  <img src="/icono3.png" alt="Decoración" class="absolute top-1/3 left-1/3 w-28 opacity-100 rotate-6" />
  <img src="/icono6.png" alt="Decoración" class="absolute bottom-16 left-1/4 w-32 opacity-100 -rotate-6" />

  <!-- Imagen -->
  <img
    src="/foto2.png"
    alt="Perfil de usuario NYSO"
    class="w-72 md:w-[420px] z-10 md:ml-20"
  />

  <!-- Texto -->
  <div class="text-left max-w-md z-10 md:mr-20">
    <p class="text-3xl font-extrabold leading-tight mb-4">
      Creá tu perfil para guardar tus favoritos, compartir y conectar con gente como vos.
    </p>

    <RouterLink
      to="/crear-cuenta"
      class="inline-block mt-2 px-7 py-3 text-lg font-semibold bg-[#e099a8] text-[#3c490b] border border-[#4e0d05] rounded-full hover:bg-[#3c490b] hover:text-[#f6f6eb] transition-all duration-300"
    >
      Crear cuenta
    </RouterLink>
  </div>
</section>


<!-- Banner  -->
<section class="w-full mb-0 pb-0">
  <img
    src="/KITMENS.png"
    alt="Banner KITMENS"
    class="w-full h-auto block object-cover mb-0 pb-0"
  />
</section>

<!-- Línea  -->
<section class="relative w-full h-20 bg-[#f6f6eb] mt-[-12px] overflow-hidden">
  <img 
    src="/lineacuadros.png" 
    alt="Divisor decorativo" 
    class="absolute top-0 left-0 w-full h-auto block"
  />
</section>
</template>



