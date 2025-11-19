<script>
import AppH1 from '../components/AppH1.vue';
import { getAllUsers } from '../services/user-profiles.js';
import { getCurrentUser, subscribeToAuthChanges } from '../services/auth.js';
import { sendConnectionRequest } from '../services/connections.js';

export default {
  name: 'RedSocial',
  components: { AppH1 },
  data() {
    return {
      users: [],
      loading: true,
      searchQuery: '',
      user: null,
      message: '',
    };
  },
  computed: {
    filteredUsers() {
      const q = this.searchQuery.toLowerCase();
      return this.users.filter(u =>
        (u.display_name || '').toLowerCase().includes(q)
      );
    },
  },
  methods: {
    async handleConnect(receiverId) {
      console.log('Intentando conectar con', receiverId);
      if (!this.user) {
        this.message = 'Debes iniciar sesión para conectar con alguien.';
        setTimeout(() => (this.message = ''), 3000);
        return;
      }
      try {
        await sendConnectionRequest(this.user.id, receiverId);
        this.message = 'Solicitud de amistad enviada!';
        setTimeout(() => (this.message = ''), 3000);
      } catch (err) {
        console.error('Error enviando solicitud de conexión:', err);
      }
    }
  },
  async mounted() {
    try {
      // cargo todos los usuarios
      this.users = await getAllUsers();

      // usuario actual
      this.user = await getCurrentUser();
      console.log('[RedSocial.vue] Usuario inicial:', this.user);

      //por si cambia la sesion 
      subscribeToAuthChanges((userState) => {
        this.user = userState;
        console.log('[AuthChange] Usuario actualizado:', this.user);
      });
    } catch (err) {
      console.error('[RedSocial.vue] Error cargando usuarios:', err);
      this.users = [];
    } finally {
      this.loading = false;
    }
  },
};
</script>

<template>
  <div class="min-h-screen bg-[#f6f6eb] font-helvetica flex flex-col items-center overflow-hidden">

<!-- Banner  -->
<section
  class="w-full bg-[#e099a8] text-[#f6f6eb] 
         flex flex-row items-center justify-center
         gap-6 md:gap-20 py-10 px-6 md:px-20 relative overflow-hidden"
>

<img
    src="/icono3.png"
    class="absolute top-6 right-10 w-10 md:w-16 opacity-80 rotate-6 pointer-events-none"
  />
  <img
    src="/icono6.png"
    class="absolute bottom-6 left-6 w-12 md:w-20 opacity-80 -rotate-6 pointer-events-none"
  />

  <div class="flex justify-center w-[40%] md:w-auto z-10">
    <img
      src="/nysito3.png"
      alt="Nysito"
      class="w-28 sm:w-32 md:w-56"
    />
  </div>

  <div class="max-w-[60%] md:max-w-lg text-left z-10 leading-snug">
    <h1 class="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-3">
      Red Social
    </h1>

    <p class="text-base sm:text-lg font-medium leading-relaxed">
      Conectá con amigos y enterate cuáles son sus <br />
      <span class="font-bold text-[#3c490b]">preferencias</span>,
      <span class="font-bold text-[#3c490b]">vinos favoritos</span>
      y mucho más.
    </p>
  </div>

</section>



    <!-- Buscador  -->
    <div class="relative w-full max-w-lg mb-8 mt-8 md:mt-16 z-10 px-4">
      <svg xmlns="http://www.w3.org/2000/svg"
        class="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-black opacity-70"
        fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z" />
      </svg>

      <input
        v-model="searchQuery"
        type="search"
        placeholder="Buscar usuario por nombre..."
        class="w-full border border-[#e099a8] rounded-full p-3 pl-12 text-[#4e0d05] bg-[#f6f6eb]
               focus:ring-1 focus:ring-[#e099a8] outline-none placeholder-[#4e0d05]/60"
      />
    </div>

    <div v-if="message"
      class="mb-6 px-6 py-3 bg-[#3c490b] text-[#f6f6eb] rounded-full text-center max-w-lg">
      {{ message }}
    </div>

    <!-- Lista de usuarios -->
    <section class="w-[92%] max-w-[1000px] py-10 px-4 md:px-10 text-left">

      <div v-if="loading" class="text-[#e099a8] text-center text-lg">
        Cargando usuarios...
      </div>

      <ul v-else class="space-y-4">

        <li
          v-for="u in filteredUsers"
          :key="u.id"
          class="bg-[#ede8d7] border border-[#4e0d05]/20 rounded-2xl md:rounded-3xl
                 p-4 md:p-5 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between
                 hover:shadow-md hover:scale-[1.01] transition-all duration-300"
        >

          <div class="text-[#4e0d05] mb-2 md:mb-0">
            <p class="font-semibold text-lg md:text-xl">{{ u.display_name || 'Sin nombre' }}</p>
            <p class="text-sm text-[#4e0d05]/70">{{ u.email }}</p>
          </div>

          <div class="flex gap-2 md:gap-3 mt-3 md:mt-0 items-center md:justify-end">

            <router-link
              :to="`/usuario/${u.id}`"
              class="text-[#e099a8] border border-[#e099a8] rounded-full px-4 py-1.5 text-sm
                     font-medium hover:bg-[#e099a8] hover:text-[#f6f6eb] transition-all duration-300"
            >
              Ver perfil 
            </router-link>
            <button
              v-if="user && user.id && user.id !== u.id"
              @click="handleConnect(u.id)"
              class="text-[#3c490b] border border-[#3c490b] rounded-full px-4 py-1.5 text-sm
                    font-medium hover:bg-[#3c490b] hover:text-[#f6f6eb] transition-all duration-300"
            >
              + Conectar
            </button>
          </div>
        </li>
      </ul>
      <p v-if="!loading && users.length === 0"
        class="text-[#4e0d05]/60 italic text-center mt-8">
        No hay usuarios registrados todavía.
      </p>
    </section>

    <div class="w-full mt-10 md:mt-16">
      <img src="/lineacuadros.png" class="w-full h-auto object-cover block" />
    </div>

  </div>
</template>
