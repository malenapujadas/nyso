<script>
import { fetchLastpost, submitSuggestion } from '../services/blog.js';

export default {
  name: 'Blog',
  data() {
    return {
      posts: [],
      loading: true,
      error: null,
      openPost: null,
      // suggestion form state
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
    ,
    async submitSugg(){
      this.suggestionMessage = '';
      if(!this.sugg.titulo || !this.sugg.descripcion){
        this.suggestionMessage = 'Por favor completa título y descripción.';
        return;
      }

      this.sendingSuggestion = true;
      try{
        await submitSuggestion(this.sugg);
        this.suggestionMessage = 'Gracias — tu tema fue enviado al equipo.';
        this.sugg = { nombre: '', email: '', titulo: '', descripcion: '' };
      } catch(err){
        console.error(err);
        this.suggestionMessage = err.message || 'Error al enviar la sugerencia.';
      } finally{
        this.sendingSuggestion = false;
      }
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
          <span class="font-bold">¡Hola de nuevo!</span> <br />Acá vas a encontrar notas, tips y curiosidades del mundo del vino.  
          Desde maridajes y nuevas etiquetas hasta consejos para disfrutar cada copa.  
          <br /><br />
          Leé, aprendé y compartí.
        </p>
      </div>
    </section>

    <!-- FORMULARIO PARA SUGERENCIAS -->
    <section class="w-[95%] max-w-[800px] py-8 px-6 bg-white rounded-lg shadow-md mb-20">
      <h2 class="text-2xl font-bold mb-4">¿Querés que hablemos de algo?</h2>
      <p class="mb-4 text-sm text-gray-600">Enviá tu pregunta o tema y el equipo lo evaluará. Si respondemos, lo publicaremos en el blog.</p>

      <div class="grid grid-cols-1 gap-3">
        <input v-model="sugg.nombre" placeholder="Tu nombre (opcional)" class="p-2 border rounded" />
        <input v-model="sugg.email" placeholder="Tu email (opcional)" class="p-2 border rounded" />
        <input v-model="sugg.titulo" placeholder="Título / tema" class="p-2 border rounded" />
        <textarea v-model="sugg.descripcion" rows="4" placeholder="Descripción / pregunta" class="p-2 border rounded"></textarea>

        <div class="flex items-center gap-3">
          <button @click="submitSugg" :disabled="sendingSuggestion" class="px-4 py-2 bg-[#e099a8] rounded text-white">
            <span v-if="sendingSuggestion">Enviando...</span>
            <span v-else>Enviar sugerencia</span>
          </button>
          <div class="text-sm text-green-600">{{ suggestionMessage }}</div>
        </div>
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
