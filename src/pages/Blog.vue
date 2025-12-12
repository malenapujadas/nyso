<script>
import { fetchLastPost, submitSuggestion } from '../services/blog.js';
import { getCurrentUser, subscribeToAuthChanges } from '../services/auth.js';
import AppH1 from '../components/AppH1.vue';
import { RouterLink } from 'vue-router';
import AppLoader from '../components/AppLoader.vue';


export default {
  name: 'Blog',
  components: { AppH1, AppLoader, RouterLink },
  data() {
    return {
      user: null,
      posts: [],
      loading: true,
      error: null,
      openPost: null, //ID del post que está abierto en el acordeón
      //sugerencias de usuarios
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
      this.user = await getCurrentUser();
      subscribeToAuthChanges(u => this.user = u);
      this.posts = await fetchLastPost() || [];
    } catch (err) {
      console.error('Error cargando posts:', err);
      this.error = err.message || 'Error al cargar publicaciones';
    } finally {
      this.loading = false;
    }
  },

  methods: {
    //acordeon
    togglePost(id) {
      this.openPost = this.openPost === id ? null : id;
    },
    //enviar sugerencia
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

        this.sugg = {
          nombre: '',
          email: '',
          titulo: '',
          descripcion: ''
        };
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
  <div class="min-h-screen bg-[#f6f6eb] flex flex-col items-center overflow-visible">

    <!-- Banner -->
    <section
      class="w-full bg-[#e099a8] text-[#f6f6eb]
             flex flex-row items-center justify-center
             gap-4 md:gap-20 py-10 px-6 md:px-20
             relative overflow-hidden"
    >
      <img
        src="/icono3.png"
         alt=""
        class="absolute top-4 md:top-10 right-4 md:right-20 w-10 md:w-14 rotate-6 opacity-100"
      />

      <img
        src="/icono6.png"
         alt=""
        class="absolute bottom-4 md:bottom-10 left-4 md:left-20 w-12 md:w-16 -rotate-6 opacity-100"
      />

      <img src="/nysito2.png"  alt="NYSITO" class="w-28 md:w-56 z-10" />

      <!-- texto -->
      <div class="max-w-xs md:max-w-lg text-left z-10 ml-3 md:ml-0">
        <AppH1 class="text-2xl md:text-4xl font-extrabold mb-2 md:mb-4">
          ¡Hola de nuevo!
        </AppH1>

        <p class="text-sm md:text-lg font-medium leading-snug md:leading-relaxed">
          Acá vas a encontrar notas, tips y curiosidades del mundo del vino.
          Desde nuevas etiquetas hasta consejos para disfrutar cada copa.
          <br /><br />
          <span class="font-semibold text-[#3c490b]">
            Leé, aprendé y compartí con la comunidad NYSO.
          </span>
        </p>
      </div>
    </section>

    <!-- Publicaciones -->
    <section class="relative w-full max-w-[1200px] py-12 px-6 space-y-8 text-left">
      <h2 class="text-2xl md:text-3xl font-bold text-[#3c490b] mb-3">
        Últimas publicaciones
      </h2>

      <!-- Estado de carga -->
      <div
        v-if="loading"
        class="min-h-[120px] flex items-center justify-center"
      >
        <AppLoader />
      </div>

      <!-- error -->
      <div v-else-if="error" class="text-lg text-red-600">
        {{ error }}
      </div>

        <div v-else>
        <div v-if="posts.length === 0" class="text-lg">
          No hay publicaciones.
        </div>

        <div class="space-y-6 relative z-10">
          <div
            v-for="(post, index) in posts"
            :key="post.id"
            class="rounded-xl overflow-hidden cursor-pointer transition-all duration-300 shadow-md border border-[#4e0d05]/20"
            :class="
              index % 2 === 0
                ? 'bg-[#3c490b] text-[#f6f6eb]'
                : 'bg-[#e099a8] text-[#f6f6eb]'
            "
            @click="togglePost(post.id)"
          >
            <!-- Título -->
            <div class="flex justify-between items-center px-5 md:px-8 py-4 md:py-5">
              <h3 class="text-lg md:text-xl font-bold">
                {{ post.titulo }}
              </h3>

              <span
                class="text-xl md:text-2xl transform transition-transform duration-300"
                :class="{ 'rotate-180': openPost === post.id }"
              >
                ▼
              </span>
            </div>

            <!-- Contenido -->
            <transition name="fade">
              <div
                v-if="openPost === post.id"
                class="px-5 md:px-8 pb-5 md:pb-6 text-sm leading-relaxed"
              >
                <p>{{ post.descripcion }}</p>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </section>

    <!-- Form sugerencias -->
    <section
      class="relative w-[92%] sm:w-[90%] md:w-[90%] max-w-[1200px] bg-[#ede8d7]
             border border-[#4e0d05]/20 rounded-3xl shadow-sm mt-16 mb-20
             py-10 md:py-16 px-6 md:px-10 mx-auto overflow-hidden"
    >
      <!-- Mobile -->
      <img
        src="/icono1.png"
        alt=""
        class="hidden md:block absolute top-10 left-20 w-16 opacity-100 rotate-12"
      />

      <img
        src="/icono6.png"
        alt=""
        class="hidden md:block absolute bottom-10 right-20 w-20 opacity-100 -rotate-6"
      />

      <h3 class="text-2xl sm:text-3xl font-bold text-[#3c490b] mb-4 text-center">
        ¿Querés que hablemos de algo?
      </h3>

      <p class="text-[#4e0d05]/80 text-center mb-10 text-base max-w-xl mx-auto px-2">
        Enviá tu pregunta o tema y el equipo lo evaluará.
        Si respondemos, lo publicaremos en el blog.
      </p>

      <p v-if="!user || !user.id" class="text-center text-[#4e0d05]/80 italic mb-6">
        <strong>Recordá:</strong> para enviar sugerencias debés
        <RouterLink
          to="/ingresar"
          class="text-[#e099a8] underline hover:text-[#3c490b]"
        >
          iniciar sesión
        </RouterLink>
      </p>

      <!-- form -->
      <form
        v-else
        @submit.prevent="submitSugg"
        class="flex flex-col gap-5 w-full max-w-lg mx-auto"
      >
      <div class="flex flex-col sm:flex-row gap-4 w-full">
          <div class="flex-1">
            <label for="sugg-nombre" class="block mb-1 text-sm font-medium text-[#4e0d05]">
              Nombre (opcional)
            </label>
            <input
              id="sugg-nombre"
              v-model="sugg.nombre"
              placeholder="Tu nombre (opcional)"
              class="flex-1 p-3 rounded-full border border-[#e099a8]/40 focus:border-[#e099a8]
                     outline-none bg-[#f6f6eb] text-[#4e0d05] w-full"
            />
          </div>

          <div class="flex-1">
            <label for="sugg-email" class="block mb-1 text-sm font-medium text-[#4e0d05]">
              Email (opcional)
            </label>
            <input
              id="sugg-email"
              v-model="sugg.email"
              placeholder="Tu email (opcional)"
              class="flex-1 p-3 rounded-full border border-[#e099a8]/40 focus:border-[#e099a8]
                     outline-none bg-[#f6f6eb] text-[#4e0d05] w-full"
            />
          </div>
        </div>

        <label for="sugg-titulo" class="block mb-1 text-sm font-medium text-[#4e0d05]">
          Título / tema
        </label>
        <input
          id="sugg-titulo"
          v-model="sugg.titulo"
          placeholder="Título / tema"
          class="p-3 rounded-full border border-[#e099a8]/40 focus:border-[#e099a8]
                 outline-none bg-[#f6f6eb] text-[#4e0d05] w-full"
        />

        <label for="sugg-descripcion" class="block mb-1 text-sm font-medium text-[#4e0d05]">
          Descripción / pregunta
        </label>
        <textarea
          id="sugg-descripcion"
          v-model="sugg.descripcion"
          rows="4"
          placeholder="Descripción / pregunta"
          class="p-3 rounded-3xl border border-[#e099a8]/40 focus:border-[#e099a8]
                 outline-none bg-[#f6f6eb] text-[#4e0d05] resize-none w-full"
        ></textarea>


        <div class="flex justify-center mt-4">
          <button
            type="submit"
            :disabled="sendingSuggestion"
            class="px-10 py-3 rounded-full text-lg font-semibold bg-[#e099a8]
                   text-[#3c490b] border border-[#3c490b] hover:bg-[#3c490b]
                   hover:text-[#f6f6eb] transition-all duration-300
                   disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ sendingSuggestion ? 'Enviando...' : 'Enviar sugerencia' }}
          </button>
        </div>

        <p
          v-if="suggestionMessage"
          class="text-center mt-3 font-medium"
          :class="suggestionMessage.includes('Gracias')
            ? 'text-[#3c490b]'
            : 'text-red-600'"
        >
          {{ suggestionMessage }}
        </p>
      </form>
    </section>
  </div>
</template>
