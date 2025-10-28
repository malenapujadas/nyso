<script>
import AppH1 from '../components/AppH1.vue';
import { supabase } from '../services/supabase.js';
import { getFavorites, removeFavorite } from '../services/favorites.js';
import { getHistory } from '../services/history.js';
import vinos from '../vinos.json';

export default {
    name: 'MyProfile',
    components:{AppH1,},
    data(){
        return{
            user:{ id: null, email: null, display_name: null, vino: null },
            favorites: [],
            history: []
        }
    },
    async mounted(){
        const { data } = await supabase.auth.getUser();
        this.user = data.user;

        if (this.user) {
            const favIds = await getFavorites(this.user.id);
            const hisIds = await getHistory(this.user.id);
            this.favorites = vinos.filter(v => favIds.includes(v.id));
            this.history = vinos.filter(v => hisIds.includes(v.id));
        }
    },
    methods: {
        async handleRemoveFavorite() {
            if (!this.user) return alert('Debes iniciar sesión.');
            try {
                await removeFavorite(this.user.id, this.vino.id);
                this.message = 'Agregado a favoritos 🍷';
            } catch (e) {
                console.error(e);
                this.message = 'Error al agregar a favoritos';
            }
        }
    }
};
</script>

<template>
    <AppH1>Mi perfil</AppH1>
    <div class="px-4 py-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
        <h2 class="text-2xl font-bold mb-4">Información del usuario</h2>
        <p class="mb-2"><strong>Email:</strong> {{ user.email }}</p>
        <p class="mb-2"><strong>Nombre de usuario:</strong> {{ user.display_name ?? 'No establecido' }}</p>
        <p class="mb-2"><strong>Preferencia de vinos:</strong> {{ user.vino ?? 'No establecida' }}</p>
    </div>

    <!-- Favoritos -->
    <div v-if="favorites.length" class="px-4 py-6 max-w-3xl mx-auto">
        <h3 class="text-xl font-semibold mb-2">Mis vinos favoritos 🍷</h3>
        <div v-for="v in favorites" :key="v.id">
            <ul class="list-disc pl-6">
                <li>{{ v.nombre }}</li>
            </ul>
            <div>
                <button @click="handleRemoveFavorite" class="text-sm rounded-lg px-4 py-2 bg-[#e099a8] shadow-lg shadow-[#e099a8]/50 hover:text-white inline-block text-center" type="submit" >
                Eliminar de Favoritos 
                </button>
            </div>
        </div>
        
    </div>
    <div v-else class="px-4 py-6 max-w-3xl mx-auto">
        <h3 class="text-xl font-semibold mb-2">No tienes vinos favoritos aún.</h3>
    </div>

    <!-- Historial -->
    <div v-if="history.length" class="px-4 py-6 max-w-3xl mx-auto">
        <h3 class="text-xl font-semibold mb-2">Mi historial 🕓</h3>
        <ul class="list-disc pl-6">
            <li v-for="v in history" :key="v.id">{{ v.nombre }}</li>
        </ul>
    </div>
    <div v-else class="px-4 py-6 max-w-3xl mx-auto">
        <h3 class="text-xl font-semibold mb-2">No tienes vinos en tu historial.</h3>
    </div>
</template>
