<script>
import { fetchLastPost, submitSuggestion } from '../services/blog.js';

export default {
  name: 'Blog',
  data() {
    return {
      posts: [],
      loading: true,
      error: null,
      openPost: null,
      sugg: {
        nombre: '',
        email: '',
        titulo: '',
        descripcion: ''
      },
      sendingSuggestion: false,
      suggestionMessage: ''
    };
  },
  async mounted() {
    try {
      this.posts = await fetchLastPost() || [];
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
    },
    async submitSugg() {
      this.suggestionMessage = '';
      if (!this.sugg.titulo || !this.sugg.descripcion) {
        this.suggestionMessage = 'Por favor completá título y descripción.';
        return;
      }

      this.sendingSuggestion = true;
      try {
        await submitSuggestion(this.sugg);
        this.suggestionMessage = '¡Gracias! Tu tema fue enviado al equipo ';
        setTimeout(() => (this.suggestionMessage = ''), 4000);
        this.sugg = { nombre: '', email: '', titulo: '', descripcion: '' };
      } catch (err) {
        console.error(err);
        this.suggestionMessage = err.message || 'Error al enviar la sugerencia.';
      } finally {
        this.sendingSuggestion = false;
      }
    }
  }
};
</script>

<template>
  <div class="min-h-screen bg-[#f6f6eb] font-helvetica flex flex-col items-center overflow-visible">
    <!-- banner-->
<section
  class="w-full bg-[#e099a8] text-[#f6f6eb] flex flex-col md:flex-row items-center justify-center gap-10 md:gap-20 py-12 px-10 md:px-20 relative overflow-hidden"
>
  <!-- Íconos  -->
  <img
    src="/icono3.png"
    alt="Decoración"
    class="absolute top-10 right-20 w-14 opacity-100 rotate-6"
  />
  <img
    src="/icono6.png"
    alt="Decoración"
    class="absolute bottom-10 left-20 w-16 opacity-100 -rotate-6"
  />
  <img
    src="/nysito2.png"
    alt="Personaje Nysito"
    class="w-44 md:w-56 z-10"
  />
  <!-- Texto -->
  <div class="max-w-lg text-center md:text-left z-10 leading-snug flex flex-col justify-center">
    <h1 class="text-4xl font-extrabold mb-4">
      ¡Hola de nuevo! 
    </h1>
    <p class="text-lg font-medium leading-relaxed">
      Acá vas a encontrar notas, tips y curiosidades del mundo del vino.  
      Desde maridajes y nuevas etiquetas hasta consejos para disfrutar cada copa.  
      <br /><br />
      <span class="font-semibold text-[#3c490b]">
        Leé, aprendé y compartí con la comunidad NYSO.
      </span>
    </p>
  </div>
</section>
<!-- form-->
<section
  class="relative w-[95%] md:w-[90%] max-w-[1200px] py-16 px-8 bg-[#ede8d7] border border-[#4e0d05]/20 rounded-3xl shadow-sm mt-16 mb-20 text-left flex flex-col items-center mx-auto"
>
  <div class="w-full max-w-4xl">
    <h2 class="text-3xl font-bold text-[#3c490b] mb-4 text-center">
      ¿Querés que hablemos de algo?
    </h2>
    <p class="text-[#4e0d05]/80 text-center mb-10 text-base max-w-2xl mx-auto">
      Enviá tu pregunta o tema y el equipo lo evaluará.  
      Si respondemos, lo publicaremos en el blog.
    </p>

    <form @submit.prevent="submitSugg" class="flex flex-col gap-5 max-w-3xl mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          v-model="sugg.nombre"
          placeholder="Tu nombre (opcional)"
          class="p-3 rounded-full border border-[#e099a8]/40 focus:border-[#e099a8] outline-none bg-[#f6f6eb] text-[#4e0d05] w-full"
        />
        <input
          v-model="sugg.email"
          placeholder="Tu email (opcional)"
          class="p-3 rounded-full border border-[#e099a8]/40 focus:border-[#e099a8] outline-none bg-[#f6f6eb] text-[#4e0d05] w-full"
        />
      </div>

      <input
        v-model="sugg.titulo"
        placeholder="Título / tema"
        class="p-3 rounded-full border border-[#e099a8]/40 focus:border-[#e099a8] outline-none bg-[#f6f6eb] text-[#4e0d05] w-full"
      />

      <textarea
        v-model="sugg.descripcion"
        rows="4"
        placeholder="Descripción / pregunta"
        class="p-3 rounded-3xl border border-[#e099a8]/40 focus:border-[#e099a8] outline-none bg-[#f6f6eb] text-[#4e0d05] resize-none w-full"
      ></textarea>

      <div class="flex justify-center mt-4">
        <button
          type="submit"
          :disabled="sendingSuggestion"
          class="px-10 py-3 rounded-full text-lg font-semibold bg-[#e099a8] text-[#3c490b] border border-[#3c490b] hover:bg-[#3c490b] hover:text-[#f6f6eb] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ sendingSuggestion ? 'Enviando...' : 'Enviar sugerencia' }}
        </button>
      </div>

      <p
        v-if="suggestionMessage"
        class="text-center mt-3 font-medium"
        :class="suggestionMessage.includes('Gracias') ? 'text-[#3c490b]' : 'text-red-600'"
      >
        {{ suggestionMessage }}
      </p>
    </form>
  </div>

  <!-- Iconos  -->
  <img src="/icono1.png" alt="Decoración" class="absolute top-10 left-20 w-16 opacity-100 rotate-12" />
  <img src="/icono6.png" alt="Decoración" class="absolute bottom-10 right-20 w-20 opacity-100 -rotate-6" />
</section>

    <!-- publicaciones -->
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
