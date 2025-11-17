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
  <section
    class="relative flex flex-col justify-center items-center text-center py-32 bg-[#f6f6eb] overflow-hidden"
  >
    <!-- iconos mobile-->
    <img
      src="/icono1.png"
      class="absolute top-6 left-4 w-20 md:w-40 opacity-100"
    />
    <img
      src="/icono2.png"
      class="absolute bottom-2 left-10 w-16 md:w-32 opacity-100"
    />
    <img
      src="/icono3.png"
      class="absolute top-10 right-10 w-14 md:w-20 opacity-100"
    />

    <img
      src="/logo.png"
      alt="Logo NYSO"
      class="w-40 md:w-72 mb-8 relative z-10"
    />

    <h2
      class="text-[#4e0d05] font-extrabold text-2xl md:text-3xl leading-tight max-w-md md:max-w-3xl uppercase tracking-tight font-[Poppins] relative z-10 px-4"
    >
      DESCUBRIR,
      <span class="text-[#3c490b]">GUARDAR</span>,
      Y COMPARTIR
      <span class="text-[#e099a8]">VINOS</span>
      DE UNA FORMA SIMPLE Y CERCANA, SIN NECESIDAD DE SER UN
      <span class="text-[#e099a8]">EXPERTO.</span>
    </h2>
  </section>

  <section class="relative bg-[#f6f6eb] w-full h-16 md:h-20">
    <img
      src="/lineacuadros.png"
      class="absolute -top-[1px] left-0 w-full block"
    />
  </section>

<!-- Nysito -->
<section
  class="relative w-full bg-[#e099a8] text-[#4e0d05] 
         py-12 md:py-20 px-6 md:px-8 
         flex flex-row items-center justify-center 
         gap-6 md:gap-10 overflow-hidden rounded-b-4xl"
>

  <img src="/icono1.png" class="absolute top-4 left-3 w-10 md:w-28 opacity-100" />
  <img src="/icono2.png" class="absolute bottom-2 right-4 w-12 md:w-32 opacity-100 rotate-12" />
  <img src="/icono4.png" class="absolute top-5 right-6 w-12 md:w-16 rotate-12 opacity-100" />
  <img src="/icono7.png" class="absolute bottom-2 left-1/2 w-10 md:w-28 opacity-100 rotate-12" />

  <img
    src="/nysito.png"
    class="w-28 md:w-56 z-10 flex-shrink-0"
  />

  <div class="text-left max-w-xs md:max-w-md z-10">
    <h2 class="text-2xl md:text-3xl font-extrabold mb-2 md:mb-3">
      ¡Hola, soy Nysito!
    </h2>

    <p class="text-base md:text-lg font-medium leading-snug">
      Voy a ayudarte a moverte por el mundo del vino.
    </p>

    <p class="text-base md:text-lg font-light py-2 leading-snug">
      En Nyso vas a poder encontrar nuevos vinos, aprender de la comunidad y compartir tus experiencias.
    </p>
  </div>

</section>


<!-- Sección 2 -->
<section
  class="relative w-full bg-[#3c490b] text-[#f6f6f6] py-12 px-6 md:py-14 md:px-10 
         flex flex-col md:flex-row items-center justify-center gap-10 overflow-hidden rounded-4xl"
>

  <img src="/icono4.png" class="absolute top-2 right-6 w-10 md:w-16 rotate-12 opacity-100" />
  <img src="/icono4.png" class="absolute bottom-6 right-6 w-16 md:w-24 opacity-100" />
  <img src="/icono6.png" class="absolute bottom-10 left-1/4 w-16 md:w-28 opacity-100 -rotate-6" />
  <img src="/icono7.png" class="absolute bottom-2 left-1/3 w-16 md:w-28 opacity-100 rotate-12" />

  <div class="w-full max-w-md z-10 text-center md:text-right">
    <p class="text-2xl md:text-3xl font-extrabold leading-tight mb-6">
      Usá el buscador con filtros <br class="hidden md:block" />
      para encontrar ese vino perfecto.
    </p>

    <RouterLink
      to="/social"
      class="inline-block px-6 md:px-8 py-2 md:py-3 text-base md:text-lg 
             font-semibold bg-[#e099a8] text-[#3c490b] border border-[#f6f6f6]
             rounded-full hover:bg-[#f6f6f6] hover:text-[#3c490b] transition-all"
    >
      Ver vinos
    </RouterLink>
  </div>

  <img
    src="/foto1.png"
    alt="Buscador de vinos"
    class="w-52 md:w-[380px] z-10 bg-transparent"
  />
</section>


<!-- Sección 3 -->
<section
  class="relative w-full bg-[#f6f6eb] text-[#e099a8] py-12 px-6 md:py-14 md:px-10 
         flex flex-col md:flex-row items-center justify-center gap-10 overflow-hidden"
>

  <img src="/icono1.png" class="absolute top-8 left-6 w-14 md:w-32 rotate-12 opacity-100" />
  <img src="/icono2.png" class="absolute bottom-6 right-6 w-20 md:w-36 opacity-100" />
  <img src="/icono3.png" class="absolute top-1/3 left-1/3 w-16 md:w-28 opacity-100 rotate-6" />
  <img src="/icono6.png" class="absolute bottom-10 left-1/4 w-20 md:w-32 opacity-100 -rotate-6" />


  <img
    src="/foto2.png"
    alt="Perfil de usuario NYSO"
    class="w-52 md:w-[380px] z-10"
  />

  <div class="w-full max-w-md z-10 text-center md:text-left">
    <p class="text-2xl md:text-3xl font-extrabold leading-tight mb-6">
      Creá tu perfil para guardar tus favoritos,<br class="hidden md:block" />
      compartir y conectar con gente como vos.
    </p>

    <RouterLink
      to="/crear-cuenta"
      class="inline-block px-6 md:px-8 py-2 md:py-3 text-base md:text-lg font-semibold 
             bg-[#e099a8] text-[#3c490b] border border-[#4e0d05] rounded-full 
             hover:bg-[#3c490b] hover:text-white transition-all duration-300"
    >
      Crear cuenta
    </RouterLink>
  </div>
</section>

  <!-- Banner -->
  <section class="w-full mb-0 pb-0">
    <!-- desktop -->
    <img
      src="/KITMENS.png"
      class="hidden md:block w-full h-auto object-cover"
    />
    <!-- mobile -->
    <img
      src="/KITMENS-mobile.png"
      class="block md:hidden w-full h-auto object-cover"
    />
  </section>

  <section class="relative w-full h-16 md:h-20 bg-[#f6f6eb] mt-[-12px] overflow-hidden">
    <img
      src="/lineacuadros.png"
      class="absolute top-0 left-0 w-full block"
    />
  </section>
</template>
