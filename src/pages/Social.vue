<script>
import AppH1 from '../components/AppH1.vue';
import vinos from '../vinos.json';

export default {
    name: 'Vinos',
    components: { AppH1 },

    //data() devuelve un objeto con el estado del componente. Cada propiedad aquí es reactiva: si cambia, Vue automáticamente actualiza la vista.
    data() {
        return {
            vinosList: [], // todos los vinos cargados
            searchQuery: '', //texto que escribe el usuario en el buscador
            filters: {
                tipo: '',
                uva: '',
                region: '',
                dulzor: '',
                cuerpo: '',
                año: ''
            },
            // números para filtrar por precio
            selectedMinPrice: null,
            selectedMaxPrice: null,
        };
    },
    //Los computed son funciones que devuelven algo calculado a partir del estado; Vue los cachea hasta que los datos usados cambian
    computed: {
        // listas únicas para poblar selects
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
        //Se ordena con .sort((a,b)=>b-a) para mostrar años de mayor a menor.
        años() {
            return [...new Set(this.vinosList.map(v => v["año"]))].filter(Boolean).sort((a,b)=>b-a);
        },
        // bounds de precio a partir del dataset
        priceMin() {
            if (!this.vinosList.length) return 0;
            return Math.min(...this.vinosList.map(v => v.precio_aproximado || 0));
        },
        priceMax() {
            if (!this.vinosList.length) return 0;
            return Math.max(...this.vinosList.map(v => v.precio_aproximado || 0));
        },
        // lista filtrada combinando búsqueda y filtros
        filteredVinos() {
            const q = this.searchQuery && this.searchQuery.toLowerCase();
            return this.vinosList.filter(v => {
                // búsqueda por nombre, bodega o descripción
                if (q) {
                    const hay = (
                        (v.nombre || '') + ' ' + (v.bodega || '') + ' ' + (v.descripcion || '')
                    ).toLowerCase();
                    if (!hay.includes(q)) return false;
                }

                // filtros específicos
                if (this.filters.tipo && v.tipo !== this.filters.tipo) return false;
                if (this.filters.uva && v.uva !== this.filters.uva) return false;
                if (this.filters.region && v.region !== this.filters.region) return false;
                if (this.filters.dulzor && v.dulzor !== this.filters.dulzor) return false;
                if (this.filters.cuerpo && v.cuerpo !== this.filters.cuerpo) return false;
                if (this.filters.año && String(v['año']) !== String(this.filters.año)) return false;

                // filtro por precio
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
        // Cargamos los vinos del JSON al montar el componente
        this.vinosList = vinos;
        // inicializamos valores de precio por defecto
        this.selectedMinPrice = this.priceMin;
        this.selectedMaxPrice = this.priceMax;
    }
};
</script>

<template>
    <div class="flex flex-col lg:flex-row gap-8">
        <section ref="postsContainer" class="overflow-y-auto ml-8 mr-8 w-full">
            <AppH1 class="pb-2 pt-2">Descubre los vinos de Nyso</AppH1>

            <!-- Controles de búsqueda y filtrado -->
            <div class="mb-4 p-4 bg-white rounded shadow">
                <div class="flex flex-col md:flex-row md:items-end gap-4">
                    <div class="flex-1">
                        <label class="block text-sm font-medium text-gray-700">Buscar</label>
                        <input
                            v-model="searchQuery"
                            type="search"
                            placeholder="Nombre, bodega o descripción..."
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                        />
                    </div>

                    <div class="grid grid-cols-2 md:grid-cols-6 gap-2 flex-1">
                        <div>
                            <label class="block text-sm">Tipo</label>
                            <select v-model="filters.tipo" class="mt-1 block w-full rounded-md border-gray-300 p-2">
                                <option value="">Todos</option>
                                <option v-for="t in tipos" :key="t" :value="t">{{ t }}</option>
                            </select>
                        </div>

                        <div>
                            <label class="block text-sm">Uva</label>
                            <select v-model="filters.uva" class="mt-1 block w-full rounded-md border-gray-300 p-2">
                                <option value="">Todos</option>
                                <option v-for="u in uvas" :key="u" :value="u">{{ u }}</option>
                            </select>
                        </div>

                        <div>
                            <label class="block text-sm">Región</label>
                            <select v-model="filters.region" class="mt-1 block w-full rounded-md border-gray-300 p-2">
                                <option value="">Todas</option>
                                <option v-for="r in regiones" :key="r" :value="r">{{ r }}</option>
                            </select>
                        </div>

                        <div>
                            <label class="block text-sm">Dulzor</label>
                            <select v-model="filters.dulzor" class="mt-1 block w-full rounded-md border-gray-300 p-2">
                                <option value="">Todos</option>
                                <option v-for="d in dulzores" :key="d" :value="d">{{ d }}</option>
                            </select>
                        </div>

                        <div>
                            <label class="block text-sm">Cuerpo</label>
                            <select v-model="filters.cuerpo" class="mt-1 block w-full rounded-md border-gray-300 p-2">
                                <option value="">Todos</option>
                                <option v-for="c in cuerpos" :key="c" :value="c">{{ c }}</option>
                            </select>
                        </div>

                        <div>
                            <label class="block text-sm">Año</label>
                            <select v-model="filters.año" class="mt-1 block w-full rounded-md border-gray-300 p-2">
                                <option value="">Todos</option>
                                <option v-for="a in años" :key="a" :value="a">{{ a }}</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div class="mt-4 flex gap-2 items-end">
                    <div class="flex items-center gap-2">
                        <label class="text-sm">Precio min</label>
                        <input v-model.number="selectedMinPrice" type="number" :min="priceMin" :max="priceMax" class="w-32 p-2 rounded-md border" />
                    </div>
                    <div class="flex items-center gap-2">
                        <label class="text-sm">Precio max</label>
                        <input v-model.number="selectedMaxPrice" type="number" :min="priceMin" :max="priceMax" class="w-32 p-2 rounded-md border" />
                    </div>

                    <div class="ml-auto">
                        <button @click="resetFilters" class="text-sm rounded-lg px-4 py-2 bg-gray-200 hover:bg-gray-300">Limpiar filtros</button>
                    </div>
                </div>
            </div>

            <!-- Lista de vinos filtrada -->
            <p class="mb-2 text-sm text-gray-600">Mostrando {{ filteredVinos.length }} / {{ vinosList.length }} vinos</p>

            <ol class="grid grid-cols-1 gap-4 background-white p-4 rounded shadow-md md:grid-cols-2 lg:grid-cols-3">
                <li
                    v-for="vino in filteredVinos"
                    :key="vino.id"
                    class="border rounded-xl shadow p-4 bg-white hover:shadow-lg transition"
                >
                    <img
                        :src="vino.imagen"
                        :alt="vino.nombre"
                        class="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    <h2 class="text-xl font-bold mb-2">{{ vino.nombre }}</h2>
                    <p class="text-gray-600 mb-1"><strong>Bodega:</strong> {{ vino.bodega }}</p>
                    <p class="text-gray-600 mb-1"><strong>Tipo:</strong> {{ vino.tipo }}</p>
                    <p class="text-gray-600 mb-1"><strong>Uva:</strong> {{ vino.uva }}</p>
                    <p class="text-gray-600 mb-1"><strong>Región:</strong> {{ vino.region }}</p>
                    <p class="text-gray-600 mb-1"><strong>Precio aprox.:</strong> ${{ vino.precio_aproximado }}</p>
                    <RouterLink @click="$router.push({ name: 'detalle', params: { id: vino.id } })" class="text-md rounded-lg px-4 py-2 mt-4 bg-[#e099a8] shadow-lg shadow-[#e099a8]/50 hover:text-white inline-block text-center" :to="{ name: 'detalle', params: { id: vino.id } }">Ver detalle</RouterLink>
                </li>
            </ol>

            <p v-if="filteredVinos.length === 0" class="mt-4 text-center text-gray-600">No se encontraron vinos con esos criterios.</p>
        </section>
    </div>
</template>