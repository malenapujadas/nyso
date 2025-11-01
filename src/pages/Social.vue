<script>
import AppH1 from '../components/AppH1.vue';
import vinos from '../vinos.json';

export default {
  name: 'Vinos',
  components: { AppH1 },

  data() {
    return {
      vinosList: [],
      searchQuery: '',
      filters: {
        tipo: '',
        uva: '',
        region: '',
        dulzor: '',
        cuerpo: '',
        año: ''
      },
      selectedMinPrice: null,
      selectedMaxPrice: null,
    };
  },

  computed: {
    tipos() {
      return [...new Set(this.vinosList.map(v => v.tipo))].filter(Boolean);
    },
    uvas() {
      return [...new Set(this.vinosList.map(v => v.uva))].filter(Boolean);
    },
    regiones() {
      return [...new Set(this.vinosList.map(v => v.region))].filter(Boolean);
    },
    dulzores() {
      return [...new Set(this.vinosList.map(v => v.dulzor))].filter(Boolean);
    },
    cuerpos() {
      return [...new Set(this.vinosList.map(v => v.cuerpo))].filter(Boolean);
    },
    años() {
      return [...new Set(this.vinosList.map(v => v["año"]))].filter(Boolean).sort((a, b) => b - a);
    },
    priceMin() {
      if (!this.vinosList.length) return 0;
      return Math.min(...this.vinosList.map(v => v.precio_aproximado || 0));
    },
    priceMax() {
      if (!this.vinosList.length) return 0;
      return Math.max(...this.vinosList.map(v => v.precio_aproximado || 0));
    },
    filteredVinos() {
      const q = this.searchQuery && this.searchQuery.toLowerCase();
      return this.vinosList.filter(v => {
        if (q) {
          const hay = ((v.nombre || '') + ' ' + (v.bodega || '') + ' ' + (v.descripcion || '')).toLowerCase();
          if (!hay.includes(q)) return false;
        }

        if (this.filters.tipo && v.tipo !== this.filters.tipo) return false;
        if (this.filters.uva && v.uva !== this.filters.uva) return false;
        if (this.filters.region && v.region !== this.filters.region) return false;
        if (this.filters.dulzor && v.dulzor !== this.filters.dulzor) return false;
        if (this.filters.cuerpo && v.cuerpo !== this.filters.cuerpo) return false;
        if (this.filters.año && String(v['año']) !== String(this.filters.año)) return false;

        const p = Number(v.precio_aproximado || 0);
        if (this.selectedMinPrice != null && p < Number(this.selectedMinPrice)) return false;
        if (this.selectedMaxPrice != null && p > Number(this.selectedMaxPrice)) return false;

        return true;
      });
    }
  },

  methods: {
    resetFilters() {
      this.searchQuery = '';
      this.filters = { tipo: '', uva: '', region: '', dulzor: '', cuerpo: '', año: '' };
      this.selectedMinPrice = null;
      this.selectedMaxPrice = null;
    }
  },

  mounted() {
    this.vinosList = vinos;
    this.selectedMinPrice = this.priceMin;
    this.selectedMaxPrice = this.priceMax;
  }
};
</script>

<template>
  <section class="relative w-full min-h-screen bg-[#f6f6eb] flex flex-col lg:flex-row gap-10 px-8 py-12 overflow-visible">
    
    <!--  FILTROS -->
    <aside class="w-full lg:w-1/4 text-[#4e0d05] space-y-6 lg:sticky lg:top-10 h-fit">
      <h2 class="text-2xl font-extrabold mb-4 text-[#3c490b]">Filtros</h2>

      <!-- Filtro genérico -->
      <details
        v-for="(label, key) in { tipo: 'Tipo', uva: 'Uva', region: 'Región', cuerpo: 'Cuerpo', año: 'Año' }"
        :key="key"
        class="border border-[#4e0d05]/20 bg-white/60 p-3"
      >
        <summary class="flex justify-between items-center cursor-pointer select-none text-[#4e0d05] font-medium">
          {{ label }}
          <span class="text-[#4e0d05] text-lg leading-none font-normal">+</span>
        </summary>
        <select
          v-model="filters[key]"
          class="mt-3 block w-full border border-[#4e0d05]/40 text-[#4e0d05] bg-transparent p-2 focus:ring-1 focus:ring-[#e099a8] outline-none"
        >
          <option value="">Todos</option>
          <option v-for="valor in this[`${key}s`]" :key="valor" :value="valor">{{ valor }}</option>
        </select>
      </details>

      <!-- Dulzor -->
      <details class="border border-[#4e0d05]/20 bg-white/60 p-3">
        <summary class="flex justify-between items-center cursor-pointer select-none text-[#4e0d05] font-medium">
          Dulzor
          <span class="text-[#4e0d05] text-lg leading-none font-normal">+</span>
        </summary>
        <div class="flex flex-col gap-2 mt-3">
          <label v-for="d in dulzores" :key="d" class="flex items-center gap-2 cursor-pointer">
            <input type="radio" :value="d" v-model="filters.dulzor" class="accent-[#3c490b] w-3 h-3" />
            <span>{{ d }}</span>
          </label>
        </div>
      </details>

      <!-- Precio -->
      <details class="border border-[#4e0d05]/20 bg-white/60 p-3">
        <summary class="flex justify-between items-center cursor-pointer select-none text-[#4e0d05] font-medium">
          Precio
          <span class="text-[#4e0d05] text-lg leading-none font-normal">+</span>
        </summary>
        <div class="flex flex-col gap-3 mt-3">
          <label class="text-sm font-medium">Mínimo</label>
          <input v-model.number="selectedMinPrice" type="number" :min="priceMin" :max="priceMax" class="border border-[#4e0d05]/40 text-[#4e0d05] bg-transparent p-2" />
          <label class="text-sm font-medium">Máximo</label>
          <input v-model.number="selectedMaxPrice" type="number" :min="priceMin" :max="priceMax" class="border border-[#4e0d05]/40 text-[#4e0d05] bg-transparent p-2" />
        </div>
      </details>

      <!-- Botón limpiar -->
      <button
        @click="resetFilters"
        class="w-full border border-[#e099a8] text-[#4e0d05] bg-[#e099a8]/20 rounded-full px-5 py-2 mt-4 hover:bg-[#e099a8] hover:text-white transition-all duration-300"
      >
        Limpiar filtros
      </button>
    </aside>

   
    <div class="w-full lg:w-3/4 flex flex-col items-center text-center z-10 relative">

      <img src="/icono1.png" class="absolute top-[-50px] left-[60%] w-10 opacity-100 rotate-12" />
      <img src="/icono2.png" class="absolute top-[-40px] right-[80%] w-10 opacity-100 -rotate-6" />
      <img src="/icono3.png" class="absolute top-[80px] left-[10%] w-18 opacity-100 rotate-3" />
      <img src="/icono6.png" class="absolute top-[120px] right-[20%] w-20 opacity-100 rotate-6" />
      <img src="/icono7.png" class="absolute top-[120px] right-[70%] w-10 opacity-100 rotate-6" />

      <!-- Título -->
      <AppH1 class="pb-3 text-[#3c490b] relative z-10">Descubrí los vinos de NYSO</AppH1>

      <!-- Buscador -->
      <div class="relative w-full max-w-lg mb-10 z-10">
        <svg xmlns="http://www.w3.org/2000/svg" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z" />
        </svg>
        <input
          v-model="searchQuery"
          type="search"
          placeholder="Buscar por nombre, bodega o descripción..."
          class="w-full border border-[#e099a8] rounded-full p-3 pl-10 text-[#4e0d05] bg-[#f6f6eb] focus:ring-1 focus:ring-[#e099a8] outline-none placeholder-[#4e0d05]/60"
        />
      </div>

      <p class="mb-6 text-sm text-[#4e0d05]/70">Mostrando {{ filteredVinos.length }} de {{ vinosList.length }} vinos</p>

      <!-- Lista de vinos -->
      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
        <div
          v-for="vino in filteredVinos"
          :key="vino.id"
          class="border border-[#4e0d05]/60 bg-[#f6f6eb] p-4 flex flex-col items-center text-center hover:shadow-lg transition-all duration-300"
        >
          <img :src="vino.imagen" :alt="vino.nombre" class="w-full h-60 object-contain mb-4" />
          <h2 class="text-xl font-bold text-[#4e0d05] mb-1">{{ vino.nombre }}</h2>
          <p class="text-[#4e0d05]/80 mb-1"><strong>Bodega:</strong> {{ vino.bodega }}</p>
          <p class="text-[#4e0d05]/80 mb-1"><strong>Tipo:</strong> {{ vino.tipo }}</p>
          <p class="text-[#4e0d05]/80 mb-1"><strong>Uva:</strong> {{ vino.uva }}</p>
          <p class="text-[#4e0d05]/80 mb-1"><strong>Región:</strong> {{ vino.region }}</p>
          <p class="text-[#3c490b] font-semibold mt-2">${{ vino.precio_aproximado }}</p>

          <!--  Ver detalle -->
          <RouterLink
            :to="{ name: 'detalle', params: { id: vino.id } }"
            class="mt-4 inline-block text-[#e099a8] text-sm font-semibold hover:text-[#3c490b] transition-all duration-300"
          >
            Ver detalle ↗
          </RouterLink>
        </div>
      </div>

      <p v-if="filteredVinos.length === 0" class="mt-10 text-center text-[#4e0d05]/70">
        No se encontraron vinos con esos criterios.
      </p>
    </div>
  </section>
</template>
