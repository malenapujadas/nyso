<script>
import { fetchLastpost } from '../services/blog.js';

export default {
  name: 'Blog',
  data() {
    return {
      posts: [],
      loading: true,
      error: null,
      openPost: null
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
  },
  methods: {
    togglePost(id) {
      this.openPost = this.openPost === id ? null : id;
    }
  }
};
</script>

<template>
  <div class="min-h-screen bg-[#f6f6eb] font-helvetica flex flex-col items-center overflow-visible">

    <!-- INTRO -->
    <section class="w-full bg-[#e099a8] text-[#f6f6eb] flex flex-col md:flex-row items-center justify-center gap-8 py-20 px-8 md:pl-24 relative">
      <img
        src="/nysito2.png"
        alt="Personaje Nysito"
        class="w-44 md:w-60 absolute left-16 md:left-28 top-1/2 -translate-y-1/2"
      />
      <div class="max-w-lg ml-[200px] md:ml-[300px] text-center md:text-left leading-tight">
        <p class="text-lg md:text-xl font-medium leading-snug">
          <span class="font-bold">¡Hola de nuevo!</span> Acá vas a encontrar notas, tips y curiosidades del mundo del vino.  
          Desde maridajes y nuevas etiquetas hasta consejos para disfrutar cada copa.  
          <br /><br />
          Leé, aprendé y compartí.
        </p>
      </div>
    </section>

    <!-- PUBLICACIONES -->
    <section class="relative w-[95%] max-w-[1200px] py-20 px-6 space-y-10 text-left overflow-visible">

      <img src="/icono1.png" class="absolute top-8 left-[-60px] w-14 opacity-100 rotate-12" />
      <img src="/icono2.png" class="absolute top-1/4 right-[-70px] w-10 opacity-100 -rotate-6" />
      <img src="/icono3.png" class="absolute top-1/2 left-[-80px] w-20 opacity-100 rotate-3" />
      <img src="/icono6.png" class="absolute top-[70%] right-[-90px] w-18 opacity-100 rotate-6" />

      <img src="/icono1.png" class="absolute bottom-[10%] right-[-80px] w-14 opacity-100 rotate-12" />
      <img src="/icono2.png" class="absolute top-[60%] left-[-70px] w-10 opacity-100 rotate-6" />
      <img src="/icono6.png" class="absolute bottom-[40%] right-[-60px] w-20 opacity-100 rotate-6" />
      <img src="/icono7.png" class="absolute top-[85%] left-[-80px] w-18 opacity-100 rotate-3" />

      <h1 class="text-3xl font-bold text-[#3c490b] mb-6">Últimas Publicaciones</h1>

      <div v-if="loading" class="text-lg">Cargando publicaciones...</div>
      <div v-else-if="error" class="text-lg text-red-600">{{ error }}</div>

      <div v-else>
        <div v-if="posts.length === 0" class="text-lg">No hay publicaciones disponibles.</div>

        <div v-else class="space-y-8 relative z-10">
          <div
            v-for="(post, index) in posts"
            :key="post.id"
            :class="[
              'rounded-xl overflow-hidden cursor-pointer transition-all duration-300 shadow-md text-left border border-[#4e0d05]/20',
              index % 2 === 0 ? 'bg-[#3c490b] text-[#f6f6eb]' : 'bg-[#e099a8] text-[#f6f6eb]'
            ]"
            @click="togglePost(post.id)"
          >
            <div class="flex justify-between items-center px-8 py-5">
              <h2 class="text-xl font-bold">{{ post.titulo }}</h2>
              <span
                class="text-2xl transform transition-transform duration-300"
                :class="{ 'rotate-180': openPost === post.id }"
              >▼</span>
            </div>

            <transition name="fade">
              <div
                v-if="openPost === post.id"
                class="px-8 pb-6 text-sm leading-relaxed"
              >
                <p>{{ post.descripcion }}</p>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: all 0.4s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
