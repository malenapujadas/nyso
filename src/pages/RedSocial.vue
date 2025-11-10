<script>
import AppH1 from '../components/AppH1.vue';
import { supabase } from '../services/supabase.js';

export default {
  name: 'RedSocial',
  components: { AppH1 },
  data() {
    return {
      users: [],
      loading: true,
    };
  },
  async mounted() {
    // Traer todos los perfiles de usuario
    const { data, error } = await supabase
      .from('user_profiles')
      .select('id, display_name, email');
    if (data) {
      this.users = data;
    }
    this.loading = false;
  },
};
</script>

<template>
  <div class="min-h-screen bg-[#f6f6eb] font-helvetica flex flex-col items-center overflow-hidden">

   <!-- 🌸 Banner superior con Nysito -->
<section
  class="w-full bg-[#e099a8] text-[#f6f6eb] flex flex-col md:flex-row items-center justify-center gap-8 py-10 px-8 md:px-20 relative overflow-hidden"
>
  <!-- Íconos decorativos -->
  <img
    src="/icono3.png"
    alt="Decoración"
    class="absolute top-8 right-16 w-14 opacity-100 rotate-6"
  />
  <img
    src="/icono6.png"
    alt="Decoración"
    class="absolute bottom-8 left-10 w-16 opacity-100 -rotate-6"
  />
  <img
    src="/icono5.png"
    alt="Decoración"
    class="absolute top-40 right-10 w-14 opacity-100 rotate-6"
  />
  <img
    src="/icono1.png"
    alt="Decoración"
    class="absolute top-40 left-10 w-22 opacity-100 rotate-6"
  />

  <!-- Imagen Nysito -->
  <img
    src="/nysito3.png"
    alt="Nysito"
    class="w-36 md:w-52 z-10"
  />

  <!-- Texto -->
  <div class="max-w-lg text-center md:text-left z-10 leading-snug flex flex-col justify-center">
    <h1 class="text-3xl md:text-4xl font-extrabold mb-3">
      Red Social
    </h1>
    <p class="text-base md:text-lg font-medium leading-relaxed">
      Conectá con amigos y enterate cuáles son sus <br />
      <span class="font-bold text-[#3c490b]">preferencias</span>,
      <span class="font-bold text-[#3c490b]">vinos favoritos</span> y mucho más...
    </p>
  </div>
</section>


    <!-- 👥 Usuarios registrados -->
    <section class="w-[90%] max-w-[1000px] py-16 px-6 md:px-10 text-left">
      <h2 class="text-3xl font-bold text-[#3c490b] mb-8 text-center">Usuarios registrados</h2>

      <div v-if="loading" class="text-[#e099a8] text-center text-lg">
        Cargando usuarios...
      </div>

      <ul v-else class="space-y-5">
        <li
          v-for="u in users"
          :key="u.id"
          class="bg-[#ede8d7] border border-[#4e0d05]/20 rounded-3xl p-5 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between hover:shadow-md hover:scale-[1.01] transition-all duration-300"
        >
          <div class="text-[#4e0d05]">
            <p class="font-semibold text-lg">{{ u.display_name || 'Sin nombre' }}</p>
            <p class="text-sm text-[#4e0d05]/70">{{ u.email }}</p>
          </div>

          <router-link
            :to="`/usuario/${u.id}`"
            class="mt-3 md:mt-0 text-[#e099a8] border border-[#e099a8] rounded-full px-5 py-1.5 text-sm font-medium hover:bg-[#e099a8] hover:text-[#f6f6eb] transition-all duration-300"
          >
            Ver perfil ↗
          </router-link>
        </li>
      </ul>

      <p
        v-if="!loading && users.length === 0"
        class="text-[#4e0d05]/60 italic text-center mt-8"
      >
        No hay usuarios registrados todavía.
      </p>
    </section>

    <!-- Línea decorativa final -->
    <div class="w-full mt-16">
      <img
        src="/lineacuadros.png"
        alt="Decoración NYSO"
        class="w-full h-auto object-cover block"
      />
    </div>
  </div>
</template>
