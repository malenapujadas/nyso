<script>
import AppH1 from '../components/AppH1.vue';
import vinos from '../vinos.json';
import { supabase } from '../services/supabase.js';
import { addFavorite } from '../services/favorites.js';
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
    };
  },
  async mounted() {
    this.id = this.$route.params.id;
    if (this.id) {
      const found = vinos.find((v) => String(v.id) === String(this.id));
      if (found) this.vino = found;
    }

    const { data } = await supabase.auth.getUser();
    this.user = data.user;
  },
  methods: {
    async handleAddFavorite() {
      if (!this.user) return alert('Debes iniciar sesión.');
      try {
        await addFavorite(this.user.id, this.vino.id);
        this.message = 'Agregado a favoritos';
      } catch (e) {
        console.error(e);
        this.message = 'Error al agregar a favoritos';
      }
    },
    async handleAddHistory() {
      if (!this.user) return alert('Debes iniciar sesión.');
      try {
        await addHistory(this.user.id, this.vino.id);
        this.message = 'Agregado al historial';
      } catch (e) {
        console.error(e);
        this.message = 'Error al agregar al historial';
      }
    },
  },
};
</script>

<template>
  <section class="min-h-screen bg-[#f6f6eb] relative overflow-hidden flex flex-col items-center py-16">

    <div class="absolute top-0 left-0 right-0 h-[60%] pointer-events-none overflow-hidden">
      <img src="/icono1.png" class="absolute top-16 left-12 w-14 rotate-12 opacity-100" />
      <img src="/icono6.png" class="absolute top-[50%] right-10 w-16 -rotate-6 opacity-100" />
      <img src="/icono7.png" class="absolute top-[55%] left-[15%] w-14 opacity-100 -rotate-12" />
    </div>

    <div class="relative z-10 w-full px-10">
      <div
        v-if="vino"
        class="w-full max-w-7xl flex flex-col md:flex-row gap-10 mx-auto"
      >
     
        <div class="flex-1 flex justify-center items-start">
          <img
            :src="vino.imagen"
            :alt="vino.nombre"
            class="w-80 md:w-[420px] object-contain rounded-lg border border-[#4e0d05]/20 bg-[#f6f6eb]"
          />
        </div>

  
        <div class="flex-1 text-left space-y-6">
          
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h2 class="text-3xl font-bold text-[#4e0d05] leading-tight">
              {{ vino.nombre }}
            </h2>
            <div class="flex gap-3">
              <button
                @click="handleAddFavorite"
                class="text-sm font-medium rounded-full px-5 py-2 bg-[#e099a8] text-[#3c490b] border border-[#f6f6eb]/60 hover:bg-[#3c490b] hover:text-[#f6f6eb] transition-all duration-300"
              >
                + Favoritos
              </button>
              <button
                @click="handleAddHistory"
                class="text-sm font-medium rounded-full px-5 py-2 bg-[#e099a8] text-[#3c490b] border border-[#f6f6eb]/60 hover:bg-[#3c490b] hover:text-[#f6f6eb] transition-all duration-300"
              >
                + Historial
              </button>
            </div>
          </div>

      
          <p class="text-[#4e0d05]/90 max-w-2xl">{{ vino.descripcion }}</p>

          <hr class="border-t border-[#4e0d05]/30" />

       
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-2 text-[#4e0d05]">
            <p><strong>Bodega:</strong> {{ vino.bodega }}</p>
            <p><strong>Tipo:</strong> {{ vino.tipo }}</p>
            <p><strong>Región:</strong> {{ vino.region }}</p>
            <p><strong>Uva:</strong> {{ vino.uva }}</p>
            <p><strong>Año:</strong> {{ vino['año'] }}</p>
            <p><strong>Precio aprox.:</strong> ${{ vino.precio_aproximado }}</p>
          </div>

          <hr class="border-t border-[#4e0d05]/30" />

   
          <div>
            <h3 class="text-xl font-semibold text-[#3c490b] mb-3">Maridajes</h3>
            <div class="flex flex-wrap gap-3">
              <span
                v-for="(m, i) in vino.maridaje"
                :key="i"
                class="px-4 py-1 rounded-full bg-[#e099a8]/25 border border-[#e099a8]/40 text-[#4e0d05] text-sm"
              >
                {{ m }}
              </span>
            </div>
          </div>

          <!-- Mensaje -->
          <p v-if="message" class="text-[#3c490b] font-medium mt-3">{{ message }}</p>

          <!-- Volver -->
          <div class="flex justify-end pt-6">
            <RouterLink
              to="/social"
              class="text-[#e099a8] font-medium text-base hover:text-[#3c490b] transition-colors"
            >
              Volver al listado ↗
            </RouterLink>
          </div>
        </div>
      </div>

     
      <div
        v-else
        class="px-6 py-10 max-w-lg mx-auto bg-[#ede8d7] border border-[#4e0d05]/20 rounded-3xl text-center text-[#4e0d05]"
      >
        <p>No se encontró el vino solicitado.</p>
      </div>
    </div>


    <div class="w-full mt-24">
      <img
        src="/lineacuadros.png"
        alt="Decoración NYSO"
        class="w-full h-auto object-cover block"
      />
    </div>
  </section>
</template>
