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
            message: null
        };
    },
    async mounted() {
        this.id = this.$route.params.id;
        if (this.id) {
            const found = vinos.find(v => String(v.id) === String(this.id));
            if (found) this.vino = found;
        }

        // obtener usuario actual
        const { data } = await supabase.auth.getUser();
        this.user = data.user;
    },
    methods: {
        async handleAddFavorite() {
            if (!this.user) return alert('Debes iniciar sesión.');
            try {
                await addFavorite(this.user.id, this.vino.id);
                this.message = 'Agregado a favoritos 🍷';
            } catch (e) {
                console.error(e);
                this.message = 'Error al agregar a favoritos';
            }
        },
        async handleAddHistory() {
            if (!this.user) return alert('Debes iniciar sesión.');
            try {
                await addHistory(this.user.id, this.vino.id);
                this.message = 'Agregado al historial 🕓';
            } catch (e) {
                console.error(e);
                this.message = 'Error al agregar al historial';
            }
        }
    }
};
</script>

<template>
    <div>
        <AppH1>Detalle del Vino</AppH1>

        <div v-if="vino" class="px-4 py-6 max-w-3xl mx-auto bg-white rounded-lg shadow-md">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <img :src="vino.imagen" :alt="vino.nombre" class="w-full h-64 object-cover rounded" />
                <div class="md:col-span-2">
                    <h2 class="text-2xl font-bold mb-2">{{ vino.nombre }}</h2>
                    <p class="text-gray-600 mb-1"><strong>Bodega:</strong> {{ vino.bodega }}</p>
                    <p class="text-gray-600 mb-1"><strong>Tipo:</strong> {{ vino.tipo }} — <strong>Uva:</strong> {{ vino.uva }}</p>
                    <p class="text-gray-600 mb-1"><strong>Región:</strong> {{ vino.region }} — <strong>Año:</strong> {{ vino['año'] }}</p>
                    <p class="text-gray-600 mb-1"><strong>Precio aproximado:</strong> ${{ vino.precio_aproximado }}</p>
                    <p class="mt-4">{{ vino.descripcion }}</p>

                    <div class="mt-4">
                        <h3 class="font-semibold">Maridaje</h3>
                        <ul class="list-disc pl-5">
                            <li v-for="(m, i) in vino.maridaje" :key="i">{{ m }}</li>
                        </ul>
                    </div>

                    <div>
                        <RouterLink to="/social" class="text-md rounded-lg px-4 py-2 mt-4 bg-[#e099a8] shadow-lg shadow-[#e099a8]/50 hover:text-white inline-block text-center">
                            Volver al listado
                        </RouterLink>

                        <button @click="handleAddFavorite" class="text-md rounded-lg px-4 py-2 mt-4 bg-[#e099a8] shadow-lg shadow-[#e099a8]/50 hover:text-white inline-block text-center ml-4">
                            Agregar a favoritos
                        </button>

                        <button @click="handleAddHistory" class="text-md rounded-lg px-4 py-2 mt-4 bg-[#e099a8] shadow-lg shadow-[#e099a8]/50 hover:text-white inline-block text-center ml-4">
                            Agregar al historial
                        </button>

                        <p v-if="message" class="mt-2 text-sm text-gray-700">{{ message }}</p>
                    </div>
                </div>
            </div>
        </div>

        <div v-else class="px-4 py-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
            <p>No se encontró el vino solicitado.</p>
        </div>
    </div>
</template>
