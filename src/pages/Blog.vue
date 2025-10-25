<script>
import { fetchLastpost } from '../services/blog.js';

export default {
    name: 'Blog',
    data() {
        return {
            posts: [],
            loading: true,
            error: null,
        };
    },
    async mounted() {
        try {
            this.posts = await fetchLastpost() || [];
        } catch (err) {
            console.error('Error cargando posts:', err);
            this.error = err.message || 'Error al cargar publicaciones';
        } finally {
            this.loading = false;
        }
    }
};
</script>

<template>
    <div class="min-h-screen bg-[#f6f6eb] font-helvetica text-[#333333] flex flex-col items-center px-8 py-6">
        <h1 class="text-3xl font-bold mb-6">Últimas Publicaciones del Blog</h1>

        <div v-if="loading" class="text-lg">Cargando publicaciones...</div>
        <div v-else-if="error" class="text-lg text-red-600">{{ error }}</div>

        <div v-else>
            <div v-if="posts.length === 0" class="text-lg">No hay publicaciones disponibles.</div>

            <div v-else class="w-full max-w-3xl space-y-6">
                <div v-for="post in posts" :key="post.id" class="bg-white p-6 rounded-lg shadow-md">
                    <h2 class="text-2xl font-semibold mb-2">{{ post.titulo }}</h2>
                    <p class="text-gray-700 mb-4">{{ post.descripcion }}</p>
                    <!-- AGREGAR LOS OTROS DATOS -->
                </div>
            </div>
        </div>
    </div>
</template>