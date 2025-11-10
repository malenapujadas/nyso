<script>
import AppH1 from '../components/AppH1.vue';

import { subscribeToAuthChanges } from '../services/auth.js';
import { getFavorites, removeFavorite } from '../services/favorites.js';
import { getHistory, clearHistory } from '../services/history.js';
import { getPreferencesForUser } from '../services/preferences.js';
import vinos from '../vinos.json';

export default {
  name: 'MyProfile',
  components: { AppH1 },
  data() {
    return {
      user: { 
        id: null, 
        email: null, 
        display_name: null, 
        vino: null 
      },
      favorites: [],
      history: [],
      preferences: null,
    };
  },
  mounted() {
    subscribeToAuthChanges(async (userState) => {
      this.user = userState;
      if (this.user && this.user.id) {
        const favIds = await getFavorites(this.user.id);
        const hisIds = await getHistory(this.user.id);
        this.favorites = vinos.filter(v =>
          favIds.includes(Number(v.id)) || favIds.includes(String(v.id))
        );
        this.history = vinos.filter(v =>
          hisIds.includes(Number(v.id)) || hisIds.includes(String(v.id))
        );
        // cargar preferencias del onboarding
        this.preferences = await getPreferencesForUser(this.user.id);
      }
    });
  },
  methods: {
    async handleRemoveFavorite(id) {
      try {
        await removeFavorite(this.user.id, id);
        this.favorites = this.favorites.filter(f => f.id !== id);
      } catch (e) {
        console.error(e);
        alert('Error al eliminar de favoritos');
      }
    },
    async handleRemoveHistory(id) {
      try {
        await clearHistory(this.user.id, id);
        this.history = this.history.filter(h => h.id !== id);
      } catch (e) {
        console.error(e);
        alert('Error al eliminar del historial');
      }
    },
  },
};
</script>

<template>
  <section class="min-h-screen bg-[#f6f6eb] flex flex-col items-center px-6 py-16">
    
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-[#3c490b] mb-2">Mi perfil</h1>
      <p class="text-[#4e0d05]/70 text-lg">Bienvenido a tu espacio personal.</p>
    </div>

    <div class="w-full max-w-4xl text-left space-y-12">
      <!-- Información de usuario -->
      <div>
        <h2 class="text-2xl font-semibold text-[#3c490b] mb-4 border-b border-[#4e0d05]/20 pb-2">
          Información de usuario
        </h2>
        <div class="text-[#4e0d05] space-y-2">
          <p><strong>Email:</strong> {{ user.email }}</p>
          <p><strong>Nombre de usuario:</strong> {{ user.display_name ?? 'No establecido' }}</p>
        </div>
        <div v-if="preferences" class="mt-6 space-y-2">
          <h3 class="font-semibold text-lg mb-2">Tus preferencias</h3>
          <p><strong>Preferencia de vino:</strong> {{ preferences.gusto || 'No respondido' }}</p>
          <p><strong>¿Cómo preferís tomar vino?</strong> {{ preferences.como || 'No respondido' }}</p>
          <p><strong>Intensidad:</strong> {{ preferences.intensidad || 'No respondido' }}</p>
          <p><strong>Sabores:</strong> {{ Array.isArray(preferences.sabores) && preferences.sabores.length ? preferences.sabores.join(', ') : 'No respondido' }}</p>
          <p><strong>¿Con qué frecuencia tomás vino?</strong> {{ preferences.frecuencia || 'No respondido' }}</p>
          <p><strong>¿Con quién solés tomar vino?</strong> {{ preferences.con_quien || 'No respondido' }}</p>
          <p><strong>¿Qué temas te interesan?</strong> {{ Array.isArray(preferences.temas) && preferences.temas.length ? preferences.temas.join(', ') : 'No respondido' }}</p>
          <p><strong>Otro tema que te gustaría ver:</strong> {{ preferences.temas_libre || 'No respondido' }}</p>
        </div>
        <RouterLink
          to="/mi-perfil/editar"
          class="inline-block mt-4 text-[#e099a8] font-semibold hover:text-[#3c490b] transition-colors"
        >
          Editar perfil ↗
        </RouterLink>
      </div>


      <!-- Favoritos -->
      <div>
        <h2 class="text-2xl font-semibold text-[#3c490b] mb-4 border-b border-[#4e0d05]/20 pb-2">
           Favoritos
        </h2>
        <div v-if="favorites.length">
          <ul class="divide-y divide-[#4e0d05]/10 text-[#4e0d05]">
            <li
              v-for="v in favorites"
              :key="v.id"
              class="flex justify-between items-center py-3 hover:bg-[#e099a8]/10 rounded-lg transition-all"
            >
              <span class="font-medium">{{ v.nombre }}</span>
              <button
                @click="handleRemoveFavorite(v.id)"
                class="text-sm text-[#e099a8] hover:text-[#3c490b] transition-colors px-3"
              >
                Eliminar ✕
              </button>
            </li>
          </ul>
        </div>
        <p v-else class="text-[#4e0d05]/60 italic">No tienes vinos favoritos aún.</p>
      </div>



    <!-- Historial -->
    <div>
      <h2
        class="text-2xl font-semibold text-[#3c490b] mb-4 border-b border-[#4e0d05]/20 pb-2"
      >
        Historial
      </h2>

      <div v-if="history.length">
        <ul class="divide-y divide-[#4e0d05]/10 text-[#4e0d05]">
          <li
            v-for="v in history"
            :key="v.id"
            class="flex justify-between items-center py-3 hover:bg-[#e099a8]/10 rounded-lg transition-all"
          >
            <span class="font-medium">{{ v.nombre }}</span>
            <button
              @click="handleRemoveHistory(v.id)"
              class="text-sm text-[#e099a8] hover:text-[#3c490b] transition-colors px-3"
            >
              Eliminar ✕
            </button>
          </li>
        </ul>
      </div>

      <p v-else class="text-[#4e0d05]/60 italic">
        No tienes vinos en tu historial.
      </p>
    </div>

    </div>
  </section>
</template>