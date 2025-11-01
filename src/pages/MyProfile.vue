<script>
import AppH1 from '../components/AppH1.vue';
import { supabase } from '../services/supabase.js';
import { getFavorites, removeFavorite } from '../services/favorites.js';
import { getHistory, clearHistory } from '../services/history.js';
import vinos from '../vinos.json';

export default {
  name: 'MyProfile',
  components: { AppH1 },
  data() {
    return {
      user: { id: null, email: null, display_name: null, vino: null },
      favorites: [],
      history: [],
    };
  },
  async mounted() {
    const { data } = await supabase.auth.getUser();
    this.user = data.user;

    if (this.user) {
      const favIds = await getFavorites(this.user.id);
      const hisIds = await getHistory(this.user.id);
      this.favorites = vinos.filter((v) => favIds.includes(v.id));
      this.history = vinos.filter((v) => hisIds.includes(v.id));
    }
  },
  methods: {
    async handleRemoveFavorite(id) {
      try {
        await removeFavorite(this.user.id, id);
        this.favorites = this.favorites.filter((f) => f.id !== id);
      } catch (e) {
        console.error(e);
        alert('Error al eliminar de favoritos');
      }
    },
    async handleClearHistory() {
      try {
        await clearHistory(this.user.id);
        this.history = [];
      } catch (e) {
        console.error(e);
        alert('Error al eliminar del historial');
      }
    },
  },
};
</script>

<template>
  <section
    class="min-h-screen bg-[#f6f6eb] relative overflow-hidden flex flex-col items-center px-8 py-16"
  >
    <!-- 🌿 ICONOS DECORATIVOS -->
    <img src="/icono1.png" class="absolute top-12 left-10 w-14 rotate-12 opacity-100" />
    <img src="/icono6.png" class="absolute bottom-24 right-12 w-16 -rotate-6 opacity-100" />
    <img src="/icono3.png" class="absolute top-1/3 right-[8%] w-12 rotate-3 opacity-100" />
    <img src="/icono7.png" class="absolute bottom-[18%] left-[15%] w-14 opacity-100 -rotate-12" />

    <AppH1 class="text-[#3c490b] mb-10 z-10">Mi perfil</AppH1>

    <!-- 🧾 CONTENEDOR PRINCIPAL: DOS CARDS LADO A LADO -->
    <div
      class="flex flex-col lg:flex-row justify-center items-start gap-10 w-full max-w-6xl z-10"
    >
      <!-- CARD PERFIL -->
      <div
        class="flex-1 bg-[#ede8d7] border border-[#4e0d05]/20 rounded-3xl shadow-md p-8 flex flex-col items-start gap-4"
      >
        <h2 class="text-2xl font-bold text-[#3c490b] mb-4 self-center">Información del usuario</h2>

        <div class="space-y-2 text-[#4e0d05] w-full">
          <p><strong>Email:</strong> {{ user.email }}</p>
          <p><strong>Nombre de usuario:</strong> {{ user.display_name ?? 'No establecido' }}</p>
          <p><strong>Preferencia de vinos:</strong> {{ user.vino ?? 'No establecida' }}</p>
        </div>

        <div class="self-center mt-6">
          <RouterLink
            to="/mi-perfil/editar"
            class="text-[#e099a8] font-semibold hover:text-[#3c490b] transition-colors"
          >
            Editar perfil ↗
          </RouterLink>
        </div>
      </div>

      <!-- CARD REGISTROS -->
      <div
        class="flex-1 bg-[#ede8d7] border border-[#4e0d05]/20 rounded-3xl shadow-md p-8 flex flex-col gap-6"
      >
        <h2 class="text-2xl font-bold text-[#3c490b] text-center mb-2">Mis registros</h2>

        <!-- Favoritos -->
        <div>
          <h3 class="text-xl font-semibold text-[#3c490b] mb-3">Vinos favoritos</h3>

          <div v-if="favorites.length">
            <ul class="space-y-3 text-[#4e0d05]">
              <li
                v-for="v in favorites"
                :key="v.id"
                class="flex justify-between items-center border-b border-[#4e0d05]/20 py-2"
              >
                <span>{{ v.nombre }}</span>
                <button
                  @click="handleRemoveFavorite(v.id)"
                  class="text-sm text-[#e099a8] hover:text-[#3c490b] transition-colors"
                >
                  Eliminar ✕
                </button>
              </li>
            </ul>
          </div>
          <p v-else class="text-[#4e0d05]/60 italic">No tienes vinos favoritos aún.</p>
        </div>

        <hr class="border-[#4e0d05]/20" />

        <!-- Historial -->
        <div>
          <h3 class="text-xl font-semibold text-[#3c490b] mb-3">Historial</h3>

          <div v-if="history.length">
            <ul class="space-y-3 text-[#4e0d05]">
              <li
                v-for="v in history"
                :key="v.id"
                class="flex justify-between items-center border-b border-[#4e0d05]/20 py-2"
              >
                <span>{{ v.nombre }}</span>
              </li>
            </ul>

            <button
              @click="handleClearHistory"
              class="mt-6 w-full rounded-full border border-[#e099a8] text-[#4e0d05] bg-[#e099a8]/20 px-5 py-2 hover:bg-[#e099a8] hover:text-white transition-all duration-300"
            >
              Limpiar historial
            </button>
          </div>

          <p v-else class="text-[#4e0d05]/60 italic">No tienes vinos en tu historial.</p>
        </div>
      </div>
    </div>
  </section>
</template>
