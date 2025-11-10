
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
    <div class="page-container">
        <AppH1>Red Social Nyso</AppH1>
        <p>Conectá con amigos y enterate cuales son sus preferencias, vinos favoritos y más cosas!</p>
    </div>
    <!-- TODOS LOS USUARIOS REGISTRADOS -->
    <section>
      <h2 class="text-2xl font-semibold mb-4">Usuarios Registrados</h2>
      <div v-if="loading" class="text-[#e099a8]">Cargando usuarios...</div>
      <ul v-else>
        <li v-for="u in users" :key="u.id" class="mb-4 p-4 bg-white rounded shadow flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <span class="font-semibold text-[#3c490b]">{{ u.display_name || 'Sin nombre' }}</span>
            <span class="block text-[#4e0d05]/70 text-sm">{{ u.email }}</span>
          </div>
          <router-link :to="`/usuario/${u.id}`" class="mt-2 md:mt-0 text-[#e099a8] hover:text-[#3c490b] font-medium">Ver perfil ↗</router-link>
        </li>
      </ul>
      <p v-if="!loading && users.length === 0" class="text-[#4e0d05]/60 italic">No hay usuarios registrados.</p>
    </section>
</template>
