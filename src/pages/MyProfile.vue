<script>
import AppH1 from '../components/AppH1.vue';

import { subscribeToAuthChanges } from '../services/auth.js';
import { getFavorites, removeFavorite } from '../services/favorites.js';
import { getHistory, clearHistory } from '../services/history.js';
import { getPreferencesForUser } from '../services/preferences.js';
import * as opciones from '../data/preferences-options.js';
import { getFriends, getPendingRequests } from '../services/connections.js';
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
      ...opciones,
      friends: [],
      pendingRequests: [],
    };
  },
  mounted() {
    subscribeToAuthChanges(async (userState) => {
      this.user = userState;

      if (this.user && this.user.id) {
        const [favIds, hisIds, friends, pending] = await Promise.all([
          getFavorites(this.user.id),
          getHistory(this.user.id),
          getFriends(this.user.id),
          getPendingRequests(this.user.id),
        ]);

        this.friends = friends;
        this.pendingRequests = pending;

        this.favorites = vinos.filter(v =>
          favIds.includes(Number(v.id)) || favIds.includes(String(v.id))
        );

        this.history = vinos.filter(v =>
          hisIds.includes(Number(v.id)) || hisIds.includes(String(v.id))
        );

        this.preferences = await getPreferencesForUser(this.user.id);
      }
    });
  },

  methods: {
    async handleRemoveFavorite(id) {
      try {
        await removeFavorite(this.user.id, id);
        this.favorites = this.favorites.filter(f => f.id !== id);  
      } catch (error) {
        console.error('[MyProfile.vue handleRemoveFavorite] Error al eliminar vino de favoritos: ', error);
        throw new Error(error.message);
      }
    },
    async handleRemoveHistory(id) {
      try {
        await clearHistory(this.user.id, id);
        this.history = this.history.filter(h => h.id !== id); 
      } catch (error) {
        console.error('[MyProfile.vue handleRemoveHistory] Error al eliminar vino del historial: ', error);
        throw new Error(error.message);
      }
    },
  },
};
</script>

<template>
  <section class="min-h-screen bg-[#f6f6eb] flex flex-col items-center px-6 py-16 relative overflow-hidden">

    <img src="/icono1.png" class="absolute top-12 left-12 w-16 rotate-12 opacity-100" />
    <img src="/icono2.png" class="absolute bottom-50 right-20 w-20 opacity-80 -rotate-6" />
    <img src="/icono6.png" class="absolute top-40 right-10 w-30 opacity-80 rotate-3" />
    <img src="/icono3.png" class="absolute top-60 left-10 w-30 opacity-80 rotate-3" />
    <img src="/icono7.png" class="absolute bottom-[25%] left-[10%] w-23 opacity-100 -rotate-12" />
    <img src="/icono3.png" class="absolute top-[55%] left-4 w-20 opacity-100 rotate-6" />
    <img src="/icono5.png" class="absolute top-[72%] right-6 w-20 opacity-100 -rotate-3" />
    <img src="/icono4.png" class="absolute top-[90%] left-[85%] w-22 opacity-100 rotate-12" />

    <div class="text-center mb-14 relative z-10">
      <h1 class="text-5xl font-extrabold text-[#3c490b] mb-2">Mi perfil</h1>
      <p class="text-[#4e0d05]/70 text-lg">Bienvenido a tu espacio personal.</p>
    </div>

    <div class="w-full max-w-4xl space-y-10 relative z-10">

      <div class="bg-[#ede8d7]/70 backdrop-blur-sm shadow-sm rounded-xl p-6 border border-[#4e0d05]/10">

        <h2 class="text-2xl font-semibold text-[#3c490b] mb-4 border-b border-[#4e0d05]/20 pb-2">
          Información de usuario
        </h2>

        <div class="text-[#4e0d05] space-y-2">
          <p><strong>Email:</strong> {{ user.email }}</p>
          <p><strong>Nombre de usuario:</strong> {{ user.display_name ?? 'No establecido' }}</p>
        </div>

        <div class="w-full border-t border-[#3c490b]/20 my-6"></div>

        <!-- preferencias -->
        <div v-if="preferences" class="mt-6">
          <h3 class="font-semibold text-xl text-[#3c490b] mb-3">Tus preferencias</h3>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div class="p-4 rounded-xl bg-[#f0eadb] border border-[#4e0d05]/10 shadow-sm">
              <p class="text-sm text-[#4e0d05]/70">Preferencia de vino</p>
              <p class="font-semibold">
                {{ gustoOpc.find(opt => opt.value === preferences.gusto)?.label || 'No respondido' }}
              </p>
            </div>

            <div class="p-4 rounded-xl bg-[#f0eadb] border border-[#4e0d05]/10 shadow-sm">
              <p class="text-sm text-[#4e0d05]/70">¿Cómo lo tomás?</p>
              <p class="font-semibold">
                {{ comoOpc.find(opt => opt.value === preferences.como)?.label || 'No respondido' }}
              </p>
            </div>

            <div class="p-4 rounded-xl bg-[#f0eadb] border border-[#4e0d05]/10 shadow-sm">
              <p class="text-sm text-[#4e0d05]/70">Intensidad</p>
              <p class="font-semibold">
                {{ intensidadOpc.find(opt => opt.value === preferences.intensidad)?.label || 'No respondido' }}
              </p>
            </div>

            <div class="p-4 rounded-xl bg-[#f0eadb] border border-[#4e0d05]/10 shadow-sm">
              <p class="text-sm text-[#4e0d05]/70">Sabores preferidos</p>
              <p class="font-semibold">
                {{
                  Array.isArray(preferences.sabores) && preferences.sabores.length
                    ? preferences.sabores
                        .map(s => saboresOpc.find(opt => opt.value === s)?.label || s)
                        .join(', ')
                    : 'No respondido'
                }}
              </p>
            </div>

            <div class="p-4 rounded-xl bg-[#f0eadb] border border-[#4e0d05]/10 shadow-sm">
              <p class="text-sm text-[#4e0d05]/70">Frecuencia</p>
              <p class="font-semibold">
                {{ frecuenciaOpc.find(opt => opt.value === preferences.frecuencia)?.label || 'No respondido' }}
              </p>
            </div>

            <div class="p-4 rounded-xl bg-[#f0eadb] border border-[#4e0d05]/10 shadow-sm">
              <p class="text-sm text-[#4e0d05]/70">Con quién</p>
              <p class="font-semibold">
                {{ conQuienOpc.find(opt => opt.value === preferences.con_quien)?.label || 'No respondido' }}
              </p>
            </div>

            <div class="p-4 rounded-xl bg-[#f0eadb] border border-[#4e0d05]/10 shadow-sm col-span-full">
              <p class="text-sm text-[#4e0d05]/70">Temas que te interesan</p>
              <p class="font-semibold">
                {{
                  Array.isArray(preferences.temas) && preferences.temas.length
                    ? preferences.temas
                        .map(t => temasOpc.find(opt => opt.value === t)?.label || t)
                        .join(', ')
                    : 'No respondido'
                }}
              </p>
            </div>

            <div class="p-4 rounded-xl bg-[#f0eadb] border border-[#4e0d05]/10 shadow-sm col-span-full">
              <p class="text-sm text-[#4e0d05]/70">Otro tema</p>
              <p class="font-semibold">
                {{ preferences.temas_libre || 'No respondido' }}
              </p>
            </div>

          </div>
        </div>

        <RouterLink
          to="/mi-perfil/editar"
          class="inline-block mt-5 text-[#e099a8] font-semibold hover:text-[#3c490b] transition-colors"
        >
          Editar perfil ↗
        </RouterLink>
      </div>



      <!-- FAVORITOS -->
      <div class="bg-[#ede8d7]/70 backdrop-blur-sm shadow-sm rounded-xl p-6 border border-[#4e0d05]/10">
        <h2 class="text-2xl font-semibold text-[#3c490b] mb-4 border-b border-[#4e0d05]/20 pb-2">
          Favoritos
        </h2>

        <div v-if="favorites.length">
          <ul class="space-y-2">
            <li
              v-for="v in favorites"
              :key="v.id"
              class="flex justify-between items-center bg-[#f0eadb] p-3 rounded-xl hover:bg-[#e099a8]/10 transition"
            >
              <span class="font-medium text-[#4e0d05]">{{ v.nombre }}</span>
              <button
                @click="handleRemoveFavorite(v.id)"
                class="text-sm text-[#e099a8] hover:text-[#3c490b]"
              >
                Eliminar ✕
              </button>
            </li>
          </ul>
        </div>

        <p v-else class="text-[#4e0d05]/60 italic">No tienes vinos favoritos aún.</p>
      </div>



      <!-- HISTORIAL -->
      <div class="bg-[#ede8d7]/70 backdrop-blur-sm shadow-sm rounded-xl p-6 border border-[#4e0d05]/10">
        <h2 class="text-2xl font-semibold text-[#3c490b] mb-4 border-b border-[#4e0d05]/20 pb-2">
          Historial
        </h2>

        <div v-if="history.length">
          <ul class="space-y-2">
            <li
              v-for="v in history"
              :key="v.id"
              class="flex justify-between items-center bg-[#f0eadb] p-3 rounded-xl hover:bg-[#e099a8]/10 transition"
            >
              <span class="font-medium text-[#4e0d05]">{{ v.nombre }}</span>
              <button
                @click="handleRemoveHistory(v.id)"
                class="text-sm text-[#e099a8] hover:text-[#3c490b]"
              >
                Eliminar ✕
              </button>
            </li>
          </ul>
        </div>

        <p v-else class="text-[#4e0d05]/60 italic">No tienes vinos en tu historial.</p>
      </div>



      <!-- AMIGOS -->
      <div class="bg-[#ede8d7]/70 backdrop-blur-sm shadow-sm rounded-xl p-6 border border-[#4e0d05]/10">
        <h2 class="text-2xl font-semibold text-[#3c490b] mb-4 border-b border-[#4e0d05]/20 pb-2">
          Amigos
        </h2>

        <div v-if="friends.length">
          <ul class="space-y-2">
            <li
              v-for="f in friends"
              :key="f.id"
              class="p-3 bg-[#f0eadb] rounded-xl border border-[#4e0d05]/10"
            >
              {{ f.requester_id === user.id ? f.receiver_id : f.requester_id }}
            </li>
          </ul>
        </div>

        <p v-else class="text-[#4e0d05]/60 italic">No tienes amigos conectados aún.</p>
      </div>



      <!-- SOLICITUDES -->
      <div
        v-if="pendingRequests.length"
        class="bg-[#ede8d7]/70 backdrop-blur-sm shadow-sm rounded-xl p-6 border border-[#4e0d05]/10"
      >
        <h3 class="text-xl font-semibold text-[#3c490b] mb-4">Solicitudes pendientes 🍇</h3>

        <ul class="space-y-3">
          <li
            v-for="r in pendingRequests"
            :key="r.id"
            class="p-4 bg-[#f0eadb] rounded-xl border border-[#4e0d05]/10 flex justify-between items-center"
          >
            <span>{{ r.requester.display_name || 'Usuario' }}</span>

            <div class="flex gap-2">
              <button
                @click="handleResponse(r.id, 'accepted')"
                class="px-3 py-1 bg-[#3c490b] text-[#f6f6eb] rounded-full text-sm"
              >
                Aceptar
              </button>

              <button
                @click="handleResponse(r.id, 'rejected')"
                class="px-3 py-1 bg-[#e099a8] text-[#3c490b] rounded-full text-sm"
              >
                Rechazar
              </button>
            </div>
          </li>
        </ul>
      </div>

    </div>

    <!-- decoración inferior -->
    <div class="relative -mx-6 mt-24">
      <img
        src="/lineacuadros.png"
        alt="Decoración NYSO"
        class="w-full h-auto object-cover block opacity-90"
      />
    </div>

  </section>
</template>
