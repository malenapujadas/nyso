<script>
import AppH1 from "../components/AppH1.vue";
import { getVinos } from "../services/wines.js";
import {
  matchesSearch,
  matchesFilters,
  matchesPrice,
} from "../utils/wineFilters.js";
import WineCard from "../components/WineCard.vue";
import AppLoader from "../components/AppLoader.vue";

import { getAllReviewsLight } from "../services/reviews.js"; // ✅ NUEVO

export default {
  name: "Vinos",
  components: { AppH1, WineCard, AppLoader },

  data() {
    return {
      vinosList: [],
      searchQuery: "",
      filters: {
        tipo: "",
        uva: "",
        region: "",
        dulzor: "",
        cuerpo: "",
        año: "",
      },
      selectedMinPrice: null,
      selectedMaxPrice: null,
      showMobileFilters: false,

      // PAGINACIÓN
      currentPage: 1,
      perPage: 12,

      loading: true,
      error: null,

      // ✅ NUEVO: promedios por vino
      ratingsMap: {}, // { [wineId]: { avg, count } }
    };
  },

  computed: {
    // opciones únicas para cada campo
    tipos() {
      return this.uniqueValues("tipo");
    },
    uvas() {
      return this.uniqueValues("uva");
    },
    regiones() {
      return this.uniqueValues("region");
    },
    dulzores() {
      return this.uniqueValues("dulzor");
    },
    cuerpos() {
      return this.uniqueValues("cuerpo");
    },
    años() {
      return this.uniqueValues("año").sort((a, b) => b - a);
    },

    // precios mínimos y máximos
    priceMin() {
      if (!this.vinosList.length) return 0;
      return Math.min(...this.vinosList.map((v) => v.precio_aproximado || 0));
    },
    priceMax() {
      if (!this.vinosList.length) return 0;
      return Math.max(...this.vinosList.map((v) => v.precio_aproximado || 0));
    },

    // ✅ filtrado + ORDEN por rating (mejor -> peor) y sin reseñas al final
    filteredVinos() {
      const query = this.searchQuery?.toLowerCase() || "";

      const base = this.vinosList.filter(
        (vino) =>
          matchesSearch(vino, query) &&
          matchesFilters(vino, this.filters) &&
          matchesPrice(vino, this.selectedMinPrice, this.selectedMaxPrice)
      );

      return base.slice().sort((a, b) => {
        const aId = Number(a.id);
        const bId = Number(b.id);

        const aData = this.ratingsMap[aId] || { avg: 0, count: 0 };
        const bData = this.ratingsMap[bId] || { avg: 0, count: 0 };

        const aHas = aData.count > 0;
        const bHas = bData.count > 0;

        // con reseñas primero
        if (aHas !== bHas) return aHas ? -1 : 1;

        // ambos con reseñas: avg desc
        if (aHas && bHas) {
          if (bData.avg !== aData.avg) return bData.avg - aData.avg;
          // empate: más cantidad de reseñas primero
          if (bData.count !== aData.count) return bData.count - aData.count;
        }

        // fallback
        return (a.nombre || "").localeCompare(b.nombre || "");
      });
    },

    // paginacion
    totalPages() {
      return Math.max(1, Math.ceil(this.filteredVinos.length / this.perPage));
    },
    paginatedVinos() {
      const start = (this.currentPage - 1) * this.perPage;
      const end = start + this.perPage;
      return this.filteredVinos.slice(start, end);
    },
  },

  watch: {
    searchQuery() {
      this.currentPage = 1;
    },
    filters: {
      deep: true,
      handler() {
        this.currentPage = 1;
      },
    },
    selectedMinPrice() {
      this.currentPage = 1;
    },
    selectedMaxPrice() {
      this.currentPage = 1;
    },

    totalPages() {
      if (this.currentPage > this.totalPages) {
        this.currentPage = this.totalPages;
      }
    },
  },

  methods: {
    uniqueValues(key) {
      if (!Array.isArray(this.vinosList)) return [];
      return [...new Set(this.vinosList.map((v) => v[key]))].filter(Boolean);
    },

    resetFilters() {
      this.searchQuery = "";
      this.filters = {
        tipo: "",
        uva: "",
        region: "",
        dulzor: "",
        cuerpo: "",
        año: "",
      };
      this.selectedMinPrice = null;
      this.selectedMaxPrice = null;
      this.currentPage = 1;
    },

    getOptions(key) {
      const map = {
        tipo: this.tipos,
        uva: this.uvas,
        region: this.regiones,
        cuerpo: this.cuerpos,
        año: this.años,
      };
      return map[key] || [];
    },

    goToPage(p) {
      const page = Number(p);
      if (!Number.isFinite(page)) return;

      if (page < 1) this.currentPage = 1;
      else if (page > this.totalPages) this.currentPage = this.totalPages;
      else this.currentPage = page;

      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    nextPage() {
      this.goToPage(this.currentPage + 1);
    },
    prevPage() {
      this.goToPage(this.currentPage - 1);
    },

    // construir ratingsMap
    buildRatingsMap(reviews) {
      const acc = {}; 

      for (const r of reviews || []) {
        const id = Number(r.wine_id);
        const rating = Number(r.rating || 0);
        if (!Number.isFinite(id)) continue;

        if (!acc[id]) acc[id] = { sum: 0, count: 0 };
        acc[id].sum += rating;
        acc[id].count += 1;
      }

      const map = {};
      for (const key of Object.keys(acc)) {
        const id = Number(key);
        const { sum, count } = acc[id];
        map[id] = { avg: count ? sum / count : 0, count };
      }

      this.ratingsMap = map;
    },
  },

  async mounted() {
    this.loading = true;
    this.error = null;

    try {
      const data = await getVinos();
      this.vinosList = data || [];
      this.selectedMinPrice = this.priceMin;
      this.selectedMaxPrice = this.priceMax;

      // ✅ 1 sola query para ratings
      const reviews = await getAllReviewsLight();
      this.buildRatingsMap(reviews);
    } catch (error) {
      console.error("[Vinos.vue] Error al cargar vinos:", error);
      this.error = "Ocurrió un error al cargar los vinos.";
    } finally {
      this.loading = false;
    }
  },
};
</script>

<template>
  <section
    class="relative w-full min-h-screen bg-[#f6f6eb] flex flex-col lg:flex-row gap-10 px-8 py-12 overflow-visible"
  >
    <div
      class="w-full lg:w-3/4 flex flex-col items-center text-center z-10 relative order-1 lg:order-2"
    >
      <img
        src="/icono1.png"
        alt="icono"
        class="absolute top-[-50px] left-[60%] w-10 opacity-100 rotate-12"
      />
      <img
        src="/icono2.png"
        alt="icono"
        class="absolute top-[-40px] right-[80%] w-10 opacity-100 -rotate-6"
      />
      <img
        src="/icono6.png"
        alt="icono"
        class="absolute top-[120px] right-[20%] w-20 opacity-100 rotate-6"
      />

      <!-- Estado de carga -->
      <div
        v-if="loading"
        class="w-full flex items-center justify-center min-h-[200px]"
      >
        <AppLoader />
      </div>

      <div v-else-if="error" class="w-full text-center text-red-600 mt-6">
        {{ error }}
      </div>

      <template v-else>
        <AppH1 class="pb-3 text-[#3c490b] relative z-10">
          Descubrí los vinos de NYSO
        </AppH1>

        <!-- buscador -->
        <div class="relative w-full max-w-lg mb-6 z-10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black opacity-70"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z"
            />
          </svg>

          <input
            v-model="searchQuery"
            type="search"
            placeholder="Buscar por nombre, bodega o descripción..."
            class="w-full border border-[#e099a8] rounded-full p-3 pl-10 text-[#4e0d05] bg-[#f6f6eb] focus:ring-1 focus:ring-[#e099a8] outline-none placeholder-[#4e0d05]/60"
          />
        </div>

        <!-- Filtros -->
        <button
          class="w-full bg-[#e099a8] text-[#3c490b] font-semibold py-2 rounded-full mb-6 lg:hidden"
          @click="showMobileFilters = !showMobileFilters"
        >
          Filtros ▼
        </button>

        <div
          v-if="showMobileFilters"
          class="w-full bg-white/70 border border-[#4e0d05]/20 p-4 rounded-2xl space-y-4 lg:hidden"
        >
          <details
            v-for="(label, key) in {
              tipo: 'Tipo',
              uva: 'Uva',
              region: 'Región',
              cuerpo: 'Cuerpo',
              año: 'Año',
            }"
            :key="key"
            class="border border-[#4e0d05]/20 bg-white/60 p-3"
          >
            <summary
              class="flex justify-between items-center cursor-pointer select-none text-[#4e0d05] font-medium"
            >
              {{ label }}
              <span class="text-[#4e0d05] text-lg leading-none font-normal"
                >+</span
              >
            </summary>

            <select
              v-model="filters[key]"
              class="mt-3 block w-full border border-[#4e0d05]/40 text-[#4e0d05] bg-transparent p-2 focus:ring-1 focus:ring-[#e099a8] outline-none"
            >
              <option value="">Todos</option>
              <option
                v-for="valor in getOptions(key)"
                :key="valor"
                :value="valor"
              >
                {{ valor }}
              </option>
            </select>
          </details>

          <!-- Dulzor -->
          <details class="border border-[#4e0d05]/20 bg-white/60 p-3">
            <summary
              class="flex justify-between items-center cursor-pointer select-none text-[#4e0d05] font-medium"
            >
              Dulzor
              <span class="text-[#4e0d05] text-lg leading-none font-normal"
                >+</span
              >
            </summary>

            <div class="flex flex-col gap-2 mt-3">
              <label
                v-for="d in dulzores"
                :key="d"
                class="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  :value="d"
                  v-model="filters.dulzor"
                  class="accent-[#3c490b] w-3 h-3"
                />
                <span>{{ d }}</span>
              </label>
            </div>
          </details>

          <!-- Precio -->
          <details class="border border-[#4e0d05]/20 bg-white/60 p-3">
            <summary
              class="flex justify-between items-center cursor-pointer select-none text-[#4e0d05] font-medium"
            >
              Precio
              <span class="text-[#4e0d05] text-lg leading-none font-normal"
                >+</span
              >
            </summary>

            <div class="flex flex-col gap-3 mt-3">
              <label for="precio-min-mobile" class="text-sm font-medium"
                >Mínimo</label
              >
              <input
                id="precio-min-mobile"
                v-model.number="selectedMinPrice"
                type="number"
                :min="priceMin"
                :max="priceMax"
                class="border border-[#4e0d05]/40 text-[#4e0d05] bg-transparent p-2"
              />

              <label for="precio-max-mobile" class="text-sm font-medium"
                >Máximo</label
              >
              <input
                id="precio-max-mobile"
                v-model.number="selectedMaxPrice"
                type="number"
                :min="priceMin"
                :max="priceMax"
                class="border border-[#4e0d05]/40 text-[#4e0d05] bg-transparent p-2"
              />
            </div>
          </details>

          <button
            @click="resetFilters"
            class="w-full border border-[#e099a8] text-[#4e0d05] bg-[#e099a8]/20 rounded-full px-5 py-2 mt-4 hover:bg-[#e099a8] hover:text-white transition-all duration-300"
          >
            Limpiar filtros
          </button>
        </div>

        <!-- Contador -->
        <p class="mb-6 text-sm text-[#4e0d05]/70">
          Mostrando {{ paginatedVinos.length }} de {{ filteredVinos.length }} vinos
        </p>

        <!-- Vinos -->
        <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
          <WineCard
            v-for="vino in paginatedVinos"
            :key="vino.id"
            :vino="vino"
            :average-rating="ratingsMap[Number(vino.id)]?.avg || 0"
            :review-count="ratingsMap[Number(vino.id)]?.count || 0"
          />
        </div>

        <!--  Paginación  -->
        <div
        v-if="filteredVinos.length > 0 && totalPages > 1"
        class="w-full flex flex-col items-center lg:items-end mt-10 gap-3"
      >

      <p class="text-xs text-[#4e0d05]/70 text-center lg:text-right">
        Página {{ currentPage }} de {{ totalPages }}
      </p>

          <div class="flex flex-wrap items-center justify-center lg:justify-end gap-2">
            <button
              type="button"
              @click="prevPage"
              :disabled="currentPage === 1"
              class="px-4 py-2 rounded-full border border-[#4e0d05]/30 bg-white/60 text-[#4e0d05] disabled:opacity-40"
            >
              Anterior
            </button>

            <button
              v-for="p in totalPages"
              :key="p"
              type="button"
              @click="goToPage(p)"
              :class="[
                'w-10 h-10 rounded-full border text-sm font-semibold transition',
                p === currentPage
                  ? 'bg-[#3c490b] text-white border-[#3c490b]'
                  : 'bg-white/60 text-[#4e0d05] border-[#4e0d05]/30 hover:bg-white'
              ]"
            >
              {{ p }}
            </button>

            <button
              type="button"
              @click="nextPage"
              :disabled="currentPage === totalPages"
              class="px-4 py-2 rounded-full border border-[#4e0d05]/30 bg-white/60 text-[#4e0d05] disabled:opacity-40"
            >
              Siguiente
            </button>
          </div>
        </div>

        <p
          v-if="filteredVinos.length === 0"
          class="mt-10 text-center text-[#4e0d05]/70"
        >
          No se encontraron vinos con esos criterios.
        </p>
      </template>
    </div>

    <!-- filtros desktop -->
    <aside
      class="hidden lg:block w-1/4 text-[#4e0d05] space-y-4 lg:sticky lg:top-10 h-fit order-2 lg:order-1"
    >
      <h2 class="text-xl font-extrabold mb-4 text-[#3c490b]">Filtros</h2>

      <details
        v-for="(label, key) in {
          tipo: 'Tipo',
          uva: 'Uva',
          region: 'Región',
          cuerpo: 'Cuerpo',
          año: 'Año',
        }"
        :key="key"
        class="border border-[#4e0d05]/20 bg-white/60 p-3"
      >
        <summary
          class="flex justify-between items-center cursor-pointer select-none text-[#4e0d05] font-medium"
        >
          {{ label }}
          <span class="text-[#4e0d05] text-lg leading-none font-normal">+</span>
        </summary>

        <select
          v-model="filters[key]"
          class="mt-3 block w-full border border-[#4e0d05]/40 text-[#4e0d05] bg-transparent p-2 focus:ring-1 focus:ring-[#e099a8] outline-none"
        >
          <option value="">Todos</option>
          <option v-for="valor in getOptions(key)" :key="valor" :value="valor">
            {{ valor }}
          </option>
        </select>
      </details>

      <details class="border border-[#4e0d05]/20 bg-white/60 p-3">
        <summary
          class="flex justify-between items-center cursor-pointer select-none text-[#4e0d05] font-medium"
        >
          Dulzor
          <span class="text-[#4e0d05] text-lg leading-none font-normal">+</span>
        </summary>

        <div class="flex flex-col gap-2 mt-3">
          <label
            v-for="d in dulzores"
            :key="d"
            class="flex items-center gap-2 cursor-pointer"
          >
            <input
              type="radio"
              :value="d"
              v-model="filters.dulzor"
              class="accent-[#3c490b] w-3 h-3"
            />
            <span>{{ d }}</span>
          </label>
        </div>
      </details>

      <details class="border border-[#4e0d05]/20 bg-white/60 p-3">
        <summary
          class="flex justify-between items-center cursor-pointer select-none text-[#4e0d05] font-medium"
        >
          Precio
          <span class="text-[#4e0d05] text-lg leading-none font-normal">+</span>
        </summary>

        <div class="flex flex-col gap-3 mt-3">
          <label for="precio-min-desktop" class="text-sm font-medium"
            >Mínimo</label
          >
          <input
            id="precio-min-desktop"
            v-model.number="selectedMinPrice"
            type="number"
            class="border border-[#4e0d05]/40 text-[#4e0d05] p-2 bg-transparent"
          />

          <label for="precio-max-desktop" class="text-sm font-medium"
            >Máximo</label
          >
          <input
            id="precio-max-desktop"
            v-model.number="selectedMaxPrice"
            type="number"
            class="border border-[#4e0d05]/40 text-[#4e0d05] p-2 bg-transparent"
          />
        </div>
      </details>

      <button
        @click="resetFilters"
        class="w-full border border-[#e099a8] text-[#4e0d05] bg-[#e099a8]/20 rounded-full px-5 py-2 mt-4 hover:bg-[#e099a8] hover:text-white transition-all"
      >
        Limpiar filtros
      </button>
    </aside>
  </section>
</template>
