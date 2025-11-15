<script>
import AppH1 from '../components/AppH1.vue';
import { getVinoById } from '../services/wines.js';
import { getCurrentUser } from '../services/auth.js';
import { addFavorite, getFavorites } from '../services/favorites.js';
import { addHistory } from '../services/history.js';

export default {
  name: 'Detail',
  components: { AppH1 },
  data() {
    return {
      vino: null,
      id: null,
      user: null,
      message: null,
      messageType: null,  
      isFavorite: false, 
    };
  },
  async mounted() {
  this.id = this.$route.params.id;

  if (this.id) {
    try {
      this.vino = await getVinoById(this.id);

      if (this.vino && typeof this.vino.maridaje === "string") {
        this.vino.maridaje = this.vino.maridaje
          .split(",")
          .map(item => item.trim());
      }

    } catch (error) {
      console.error('[Detail.vue] Error al cargar detalle de vino:', error);
    }
  }

    const user = await getCurrentUser();
    this.user = user;

    if (this.user && this.vino) {
      const favIds = await getFavorites(this.user.id);
      this.isFavorite =
        favIds.includes(Number(this.vino.id)) ||
        favIds.includes(String(this.vino.id));
    }
  },
  methods: {
    // Agregar a favoritos
    async handleAddFavorite() {
      if (!this.user) {
        this.message = 'Debes iniciar sesión para agregar a favoritos';
        this.messageType = 'fav';   
        setTimeout(() => (this.message = null), 3000); 
        return;
}
      try {
        if (!this.isFavorite) {
          await addFavorite(this.user.id, this.vino.id);
          this.isFavorite = true;
          this.message = 'Agregado a favoritos ';
          this.messageType = 'fav';   
        } else {
          this.message = 'Ya está en favoritos';
          this.messageType = 'fav';  
        }
      } catch (e) {
        console.error(e);
        this.message = 'Error al agregar a favoritos';
        this.messageType = 'fav';  

      }
    },

    async handleAddHistory() {
      if (!this.user) {
        this.message = 'Debes iniciar sesión para agregar al historial';
        this.messageType = 'history'; 
        setTimeout(() => (this.message = null), 3000);
        return;
      }
      try {
        await addHistory(this.user.id, this.vino.id);
        this.message = 'Agregado al historial';
        this.messageType = 'history';   
      } catch (e) {
        console.error(e);
        this.message = 'Error al agregar al historial';
        this.messageType = 'history';  

      }
    },
    
  },
};
</script>

<template>
  <section
    class="min-h-screen bg-[#f6f6eb] relative overflow-hidden flex flex-col items-center 
           md:py-16 pt-10 pb-20"
  >
    <div class="absolute top-0 left-0 right-0 h-[60%] pointer-events-none overflow-hidden">
      <img src="/icono1.png" class="hidden md:block absolute top-16 left-12 w-14 rotate-12 opacity-100" />
      <img src="/icono6.png" class="hidden md:block absolute top-[50%] right-10 w-16 -rotate-6 opacity-100" />
      <img src="/icono7.png" class="hidden md:block absolute top-[55%] left-[15%] w-14 opacity-100 -rotate-12" />
    </div>

    <div class="relative z-10 w-full px-5 md:px-10">
      <div
        v-if="vino"
        class="w-full max-w-7xl flex flex-col md:flex-row gap-8 md:gap-10 mx-auto"
      >
        <div class="flex justify-center md:items-start">
          <img
            :src="vino.imagen"
            :alt="vino.nombre"
            class="w-60 sm:w-72 md:w-[420px] object-contain rounded-lg 
                   border border-[#4e0d05]/20 bg-[#f6f6eb]"
          />
        </div>

        <div class="flex-1 text-left space-y-6 mt-6 md:mt-0">

          <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h2 class="text-2xl sm:text-3xl md:text-3xl font-bold text-[#4e0d05] leading-tight">
              {{ vino.nombre }}
            </h2>

            <div class="flex gap-3 items-center">

              <!-- FAVORITO -->
              <button
                @click="handleAddFavorite"
                class="text-3xl transition-transform transform hover:scale-125 duration-200"
                :class="isFavorite ? 'text-[#4e0d05]' : 'text-[#4e0d05]/40'"
              >
                ♥
              </button>

              <!-- HISTORIAL -->
              <button
                @click="handleAddHistory"
                class="text-xs sm:text-sm md:text-sm font-medium rounded-full 
                       px-4 py-2 bg-[#e099a8] text-[#3c490b] border border-[#f6f6eb]/60 
                       hover:bg-[#3c490b] hover:text-[#f6f6eb] transition-all duration-300"
              >
                + Historial
              </button>

            </div>
          </div>

          <p class="text-[#4e0d05]/90 leading-relaxed text-sm sm:text-base md:text-base">
            {{ vino.descripcion }}
          </p>

          <hr class="border-t border-[#4e0d05]/30" />

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-1 text-[#4e0d05] text-sm sm:text-base md:text-base">
            <p><strong>Bodega:</strong> {{ vino.bodega }}</p>
            <p><strong>Tipo:</strong> {{ vino.tipo }}</p>
            <p><strong>Región:</strong> {{ vino.region }}</p>
            <p><strong>Uva:</strong> {{ vino.uva }}</p>
            <p><strong>Año:</strong> {{ vino['año'] }}</p>
            <p><strong>Precio aprox.:</strong> ${{ vino.precio_aproximado }}</p>
          </div>

          <hr class="border-t border-[#4e0d05]/30" />

          <div>
            <h3 class="text-lg sm:text-xl md:text-xl font-semibold text-[#3c490b] mb-3">
              Maridajes
            </h3>

            <div class="flex flex-wrap gap-2 sm:gap-3">
              <span
                v-for="(m, i) in vino.maridaje"
                :key="i"
                class="px-3 py-1 rounded-full bg-[#e099a8]/25 border border-[#e099a8]/40 
                       text-[#4e0d05] text-xs sm:text-sm md:text-sm"
              >
                {{ m }}
              </span>
            </div>
          </div>

          <p
            v-if="message"
            class="mt-3 rounded-full px-4 py-2 text-xs sm:text-sm md:text-sm text-center border transition-all duration-300"
            :class="messageType === 'history'
              ? 'bg-[#3c490b10] border-[#3c490b40] text-[#3c490b]'
              : 'bg-[#e099a8]/20 border-[#e099a8]/50 text-[#4e0d05]'"
          >
            {{ message }}
          </p>

          <div class="flex justify-center md:justify-end pt-4">
            <RouterLink
              to="/social"
              class="text-[#e099a8] font-medium text-sm sm:text-base hover:text-[#3c490b] transition-colors"
            >
              Volver al listado ↗
            </RouterLink>
          </div>

        </div>
      </div>

      <div
        v-else
        class="px-6 py-10 max-w-lg mx-auto bg-[#ede8d7] border border-[#4e0d05]/20 
               rounded-3xl text-center text-[#4e0d05]"
      >
        <p>No se encontró el vino solicitado.</p>
      </div>
    </div>

    <div class="w-full mt-16 md:mt-24">
      <img
        src="/lineacuadros.png"
        alt="Decoración NYSO"
        class="w-full h-auto object-cover block"
      />
    </div>
  </section>
</template>
