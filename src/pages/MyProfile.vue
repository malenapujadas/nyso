<script>
import AppH1 from '../components/AppH1.vue';

import { subscribeToAuthChanges } from '../services/auth.js';
import { getFavorites, removeFavorite } from '../services/favorites.js';
import { getHistory, clearHistory } from '../services/history.js';
import { getPreferencesForUser } from '../services/preferences.js';
import * as opciones from '../data/preferences-options.js';
import { getFriends, getPendingRequests, updateConnectionStatus } from '../services/connections.js';
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
    async handleResponse(connectionId, status) {
      try {
        await updateConnectionStatus(connectionId, status);
        // recargar pendientes y amigos
        if (this.user && this.user.id) {
          const friends = await getFriends(this.user.id);
          const pending = await getPendingRequests(this.user.id);
          this.friends = friends;
          this.pendingRequests = pending;
        }
      } catch (error) {
        console.error('[MyProfile.vue handleResponse] Error actualizando solicitud: ', error);
      /*alert('No se pudo procesar la solicitud'); */
      }
    },
  },
};
</script>

<template>
  <section class="min-h-screen bg-[#f6f6eb] flex flex-col items-center px-6 py-16">

  <!-- Iconos mobile  -->
  <div class="relative w-full h-0 lg:hidden">
    <img src="/icono1.png" class="absolute top-[-40px] left-8 w-12 opacity-100 rotate-12" />

    <img src="/icono3.png" class="absolute top-[-10px] right-3 w-10 opacity-100 rotate-3" />

    <img src="/icono7.png" class="absolute top-[30px] left-16 w-6 opacity-100 -rotate-12" />
  </div>

  <!-- Iconos escritorio  -->
  <img src="/icono1.png" class="hidden lg:block absolute top-30 left-98 w-14 opacity-100 rotate-12" />
  <img src="/icono6.png" class="hidden lg:block absolute bottom-20 right-12 w-22 opacity-100 -rotate-6" />
  <img src="/icono1.png" class="hidden lg:block absolute top-1/5 right-20 w-14 opacity-100 rotate-12" />
  <img src="/icono3.png" class="hidden lg:block absolute top-1/3 right-[8%] w-20 opacity-100 rotate-3" />
  <img src="/icono7.png" class="hidden lg:block absolute bottom-[18%] left-[4%] w-25 opacity-100 -rotate-12" />
  <img src="/icono6.png" class="hidden lg:block absolute bottom-40 right-12 w-22 opacity-100 -rotate-6" />
  <img src="/icono1.png" class="hidden lg:block absolute bottom-[60%] left-20 w-14 opacity-100 rotate-12" />
  <img src="/icono7.png" class="hidden lg:block absolute bottom-[40%] left-[4%] w-14 opacity-100 -rotate-12" />

    
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-[#3c490b] mb-2">Mi perfil</h1>
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

          </div>
        </div>
        <RouterLink
          to="/mi-perfil/editar"
          class="inline-block mt-4 text-[#e099a8] font-semibold hover:text-[#3c490b] transition-colors"
        >
          Editar perfil 
        </RouterLink>
      </div>


      <!-- Favoritos -->
       <div class="bg-[#ede8d7] rounded-xl p-6 border border-[#4e0d05]/20 shadow-sm w-full">
        <h2 class="text-xl font-bold text-[#3c490b] mb-4">Favoritos</h2>

        <div v-if="favorites.length" class="grid grid-cols-1 gap-6">
          <div
            v-for="v in favorites"
            :key="v.id"
            class="bg-[#f6f6eb] rounded-xl p-4 border border-[#4e0d05]/20 shadow-sm text-center"
          >
            <img :src="v.imagen" class="w-24 h-36 object-contain mx-auto mb-3" />

            <h3 class="text-lg font-semibold text-[#3c490b]">{{ v.nombre }}</h3>
            <p class="text-sm text-[#4e0d05]/70">{{ v.bodega }} — {{ v.tipo }}</p>

            <div class="flex justify-center gap-3 mt-4">
              <RouterLink
                :to="{ name: 'detalle', params: { id: v.id } }"
                class="px-3 py-1 border border-[#3c490b] text-[#3c490b] rounded-full text-sm hover:bg-[#3c490b] hover:text-white transition"
              >
                Ver detalle
              </RouterLink>

              <button
                @click="handleRemoveFavorite(v.id)"
                class="px-3 py-1 bg-[#e099a8] text-[#3c490b] rounded-full text-sm hover:bg-[#3c490b] hover:text-white transition"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>

        <p v-else class="text-[#4e0d05]/60 italic">Aún no tenés vinos favoritos.</p>
      </div>

    <!-- Historial -->
           <div class="bg-[#ede8d7] rounded-xl p-6 border border-[#4e0d05]/20 shadow-sm w-full">
        <h2 class="text-xl font-bold text-[#3c490b] mb-4">Historial</h2>

        <div v-if="history.length" class="grid grid-cols-1 gap-6">
          <div
            v-for="v in history"
            :key="v.id"
            class="bg-[#f6f6eb] rounded-xl p-4 border border-[#4e0d05]/20 shadow-sm text-center"
          >
            <img :src="v.imagen" class="w-24 h-36 object-contain mx-auto mb-3" />

            <h3 class="text-lg font-semibold text-[#3c490b]">{{ v.nombre }}</h3>
            <p class="text-sm text-[#4e0d05]/70">{{ v.bodega }} — {{ v.tipo }}</p>

            <div class="flex justify-center gap-3 mt-4">
              <RouterLink
                :to="{ name: 'detalle', params: { id: v.id } }"
                class="px-3 py-1 border border-[#3c490b] text-[#3c490b] rounded-full text-sm hover:bg-[#3c490b] hover:text-white transition"
              >
                Ver detalle
              </RouterLink>

              <button
                @click="handleRemoveHistory(v.id)"
                class="px-3 py-1 bg-[#e099a8] text-[#3c490b] rounded-full text-sm hover:bg-[#3c490b] hover:text-white transition"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>

        <p v-else class="text-[#4e0d05]/60 italic">No hay vinos en tu historial.</p>
      </div>
<!--     <div>
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
              class="px-3 py-1 bg-[#e099a8] text-[#3c490b] rounded-full text-sm"
            >
              Eliminar ✕
            </button>
          </li>
        </ul>
      </div>

      <p v-else class="text-[#4e0d05]/60 italic">
        No tienes vinos en tu historial.
      </p>
    </div> -->

    <!-- Amigos -->
    <div class="bg-[#ede8d7] rounded-xl p-6 border border-[#4e0d05]/20 shadow-sm w-full">
      <h2 class="text-2xl font-bold text-[#3c490b] mb-4">Mis amigos</h2>

      <div v-if="friends.length === 0" class="text-[#4e0d05]/60 italic mb-4">No tienes amigos aún.</div>

      <div v-for="f in friends" :key="f.id" class="bg-[#f6f6eb] rounded-xl p-4 border border-[#4e0d05]/20 shadow-sm mb-4 flex justify-between items-center">
        <span class="font-semibold text-[#3c490b]">
          {{ f.display_name || f.email || f.id }}
        </span>
      </div>
    </div>

    <!-- Solicitudes -->
    <div class="bg-[#ede8d7] rounded-xl p-6 border border-[#4e0d05]/20 shadow-sm w-full">
      <h2 class="text-xl font-bold text-[#3c490b] mb-4">Solicitudes pendientes</h2>

      <div v-if="pendingRequests.length === 0" class="text-[#4e0d05]/60 italic mb-4">No hay solicitudes pendientes.</div>

      <div v-for="r in pendingRequests" :key="r.id" class="bg-[#f6f6eb] rounded-xl p-4 border border-[#4e0d05]/20 shadow-sm mb-4 flex justify-between items-center">
        <span class="font-semibold text-[#3c490b]">
          {{ r?.requester?.display_name || r?.requester?.email || r.requester_id }}
        </span>

        <div class="flex gap-2">
          <button
            @click="handleResponse(r.id, 'accepted')"
            class="px-3 py-1 bg-[#3c490b] text-white rounded-full text-sm"
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
      </div>
    </div>
    </div>
  </section>
</template>
