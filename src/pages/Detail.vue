<script>
import AppH1 from "../components/AppH1.vue";
import { getVinoById } from "../services/wines.js";
import { getCurrentUser, getAuthUser } from "../services/auth.js";
import { addFavorite, getFavorites } from "../services/favorites.js";
import { addHistory } from "../services/history.js";
import { addReview, getReviewsByWineId } from "../services/reviews.js";
import AppLoader from "../components/AppLoader.vue";

export default {
  name: "Detail",
  components: { AppH1, AppLoader },

  data() {
    return {
      vino: null,
      id: null,
      user: null,
      message: null,
      messageType: null,
      isFavorite: false,

      loading: true,
      error: null,

      showModal: false,
      noteText: "",

      reviews: [], // lista de reseñas
      newReview: {
        rating: 0,
        comment: "",
      },
      reviewMessage: null, // mensaje de exito/error específico para reseñas
    };
  },

  async mounted() {
    this.loading = true;
    this.error = null;

    try {
      this.id = this.$route.params.id;

      if (this.id) {
        // cargo el vino
        this.vino = await getVinoById(this.id);

        // cargo reseñas de ese vino
        this.reviews = await getReviewsByWineId(this.id);

        if (this.vino && typeof this.vino.maridaje === "string") {
          this.vino.maridaje = this.vino.maridaje
            .split(",")
            .map((item) => item.trim());
        }
      }

      const user = await getCurrentUser();
      this.user = user;

      if (this.user && this.vino) {
        const favIds = await getFavorites(this.user.id);
        this.isFavorite =
          favIds.includes(Number(this.vino.id)) ||
          favIds.includes(String(this.vino.id));
      }
    } catch (error) {
      console.error("[Detail.vue] Error al cargar detalle de vino:", error);
      this.error = "Ocurrió un error al cargar el vino. Intentá nuevamente.";
    }

    this.loading = false;
  },

  methods: {
    // Agregar a Wishlist
    async handleAddFavorite() {
      if (!this.user) {
        this.message = "Debes iniciar sesión para agregar a tu Wishlist";
        this.messageType = "fav";
        setTimeout(() => (this.message = null), 3000);
        return;
      }

      try {
        if (!this.isFavorite) {
          await addFavorite(this.user.id, this.vino.id);
          this.isFavorite = true;
          this.message = "Agregado a tu Wishlist";
          this.messageType = "fav";
        } else {
          this.message = "Este vino ya está en tu Wishlist";
          this.messageType = "fav";
        }
      } catch (e) {
        console.error(e);
        this.message = "Error al agregar a tu Wishlist";
        this.messageType = "fav";
      }
    },

    // Agregar al historial
    async handleAddHistory() {
      if (!this.user) {
        this.message = "Debes iniciar sesión para agregar al Historial";
        this.messageType = "history";
        setTimeout(() => (this.message = null), 3000);
        return;
      }

      this.showModal = true;
    },

    async confirmAddHistory() {
      try {
        await addHistory(this.user.id, this.vino.id, this.noteText);
        this.message = "Agregado a tu Historial";
        this.messageType = "history";
        this.showModal = false;
        this.noteText = "";
      } catch (e) {
        console.error(e);
        this.message = "Error al agregar al Historial";
        this.messageType = "history";
      }
    },

    cancelModal() {
      this.showModal = false;
      this.noteText = "";
    },

    // metodo para estrellas
    setRating(star) {
      this.newReview.rating = star;
    },

    async handleAddReview() {
      if (!this.user) return;

      //validacion
      if (this.newReview.rating === 0) {
        this.reviewMessage = "¡Por favor elegí una puntuación!";
        setTimeout(() => (this.reviewMessage = null), 3000);
        return;
      }

      try {
        // nombre de usuario o uno x default
        const fullProfile = getAuthUser();
        const userName =
          fullProfile.display_name ||
          fullProfile.nombre ||
          this.user.email.split("@")[0] ||
          "Usuario";

        // guardo
        const savedReview = await addReview(
          this.user.id,
          this.vino.id,
          userName,
          this.newReview.rating,
          this.newReview.comment,
        );

        // agrego reseña a la lista local
        this.reviews.unshift(savedReview);

        // limpio
        this.newReview.rating = 0;
        this.newReview.comment = "";
        this.reviewMessage = "¡Gracias por tu reseña!";

        setTimeout(() => (this.reviewMessage = null), 3000);
      } catch (e) {
        console.error(e);
        this.reviewMessage = "Error al guardar la reseña.";
      }
    },
  },
  computed: {
    isAdmin() {
      return this.user && this.user.role === "admin";
    },
  },
};
</script>

<template>
  <section
    class="min-h-screen bg-[#f6f6eb] relative overflow-hidden flex flex-col items-center md:py-16 pt-10 pb-20"
  >
    <!-- decorativos -->
    <div
      class="absolute top-0 left-0 right-0 h-[60%] pointer-events-none overflow-hidden"
    >
      <img
        src="/icono1.png"
        alt="icono"
        class="hidden md:block absolute top-16 left-12 w-14 rotate-12 opacity-100"
      />
      <img
        src="/icono6.png"
        alt="icono"
        class="hidden md:block absolute top-[50%] right-10 w-16 -rotate-6 opacity-100"
      />
      <img
        src="/icono7.png"
        alt="icono"
        class="hidden md:block absolute top-[55%] left-[15%] w-14 opacity-100 -rotate-12"
      />
    </div>

    <div class="relative z-10 w-full px-5 md:px-10">
      <!-- loader -->
      <div
        v-if="loading"
        class="w-full flex items-center justify-center min-h-[200px]"
      >
        <AppLoader />
      </div>

      <!-- error -->
      <div v-else-if="error" class="w-full text-center text-red-600 mt-6">
        {{ error }}
      </div>

      <!-- contenido -->
      <div
        v-if="vino"
        class="w-full max-w-7xl flex flex-col md:flex-row gap-8 md:gap-10 mx-auto"
      >
        <!-- imagen -->
        <div class="flex justify-center md:items-start">
          <img
            :src="vino.imagen"
            :alt="vino.nombre"
            class="w-60 sm:w-72 md:w-[420px] object-contain rounded-lg border border-[#4e0d05]/20 bg-[#f6f6eb]"
          />
        </div>

        <!-- info -->
        <div class="flex-1 text-left space-y-6 mt-6 md:mt-0">
          <!-- titulo + wishlist -->
          <div
            class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
          >
            <h2
              class="text-2xl sm:text-3xl md:text-3xl font-bold text-[#4e0d05] leading-tight"
            >
              {{ vino.nombre }}
            </h2>

            <div class="flex gap-3 items-center">
              <button
                v-if="!isAdmin"
                @click="handleAddFavorite"
                class="text-xs sm:text-sm md:text-sm font-medium rounded-full px-4 py-2 border border-[#e099a8] text-[#4e0d05] hover:bg-[#e099a8] hover:text-white transition-all duration-300"
                :class="{ 'bg-[#e099a8] text-white': isFavorite }"
              >
                +Wishlist
              </button>
            </div>
          </div>

          <!-- descripcion -->
          <p
            class="text-[#4e0d05]/90 leading-relaxed text-sm sm:text-base md:text-base"
          >
            {{ vino.descripcion }}
          </p>

          <hr class="border-t border-[#4e0d05]/30" />

          <!-- datos -->
          <div
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-1 text-[#4e0d05] text-sm sm:text-base md:text-base"
          >
            <p><strong>Bodega:</strong> {{ vino.bodega }}</p>
            <p><strong>Tipo:</strong> {{ vino.tipo }}</p>
            <p><strong>Región:</strong> {{ vino.region }}</p>
            <p><strong>Uva:</strong> {{ vino.uva }}</p>
            <p><strong>Año:</strong> {{ vino["año"] }}</p>
            <p><strong>Precio aprox.:</strong> ${{ vino.precio_aproximado }}</p>
          </div>

          <hr class="border-t border-[#4e0d05]/30" />

          <!-- maridajes -->
          <div>
            <h3
              class="text-lg sm:text-xl md:text-xl font-semibold text-[#3c490b] mb-3"
            >
              Maridajes
            </h3>

            <div class="flex flex-wrap gap-2 sm:gap-3">
              <span
                v-for="(m, i) in vino.maridaje"
                :key="i"
                class="px-3 py-1 rounded-full bg-[#e099a8]/25 border border-[#e099a8]/40 text-[#4e0d05] text-xs sm:text-sm md:text-sm"
              >
                {{ m }}
              </span>
            </div>

            <!-- registrar consumo -->
            <div class="mt-6">
              <button
                v-if="!isAdmin"
                @click="handleAddHistory"
                class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-[#3c490b]/40 bg-[#3c490b]/5 text-[#3c490b] font-semibold text-sm sm:text-base hover:bg-[#3c490b]/10 hover:border-[#3c490b] transition-all duration-300"
              >
                Registrar consumo
                <span aria-hidden="true">↗</span>
              </button>

              <p
                class="text-xs sm:text-sm text-[#4e0d05]/60 mt-2 text-center sm:text-left"
              >
                Agregá una nota para recordar cuándo y cómo lo tomaste.
              </p>
            </div>
          </div>

          <!-- mensaje -->
          <p
            v-if="message"
            class="mt-3 rounded-full px-4 py-2 text-xs sm:text-sm md:text-sm text-center border transition-all duration-300"
            :class="
              messageType === 'history'
                ? 'bg-[#3c490b10] border-[#3c490b40] text-[#3c490b]'
                : 'bg-[#e099a8]/20 border-[#e099a8]/50 text-[#4e0d05]'
            "
          >
            {{ message }}
          </p>

          <!-- volver -->
          <div class="flex justify-center md:justify-end pt-4">
            <RouterLink
              to="/social"
              class="text-[#e099a8] font-medium text-sm sm:text-base hover:text-[#3c490b] transition-colors"
            >
              Volver al listado
            </RouterLink>
          </div>
        </div>
      </div>

      <!-- no encontrado -->
      <div
        v-else
        class="px-6 py-10 max-w-lg mx-auto bg-[#ede8d7] border border-[#4e0d05]/20 rounded-3xl text-center text-[#4e0d05]"
      >
        <p>No se encontró el vino solicitado.</p>
      </div>

      <!-- reseñas -->
      <div class="w-full">
        <h3
          class="text-lg sm:text-xl md:text-xl font-semibold text-[#3c490b] mb-6"
        >
          Reseñas de la comunidad
        </h3>

        <div
          v-if="user"
          class="bg-[#e099a8]/10 p-5 rounded-xl border border-[#e099a8]/30 mb-8"
        >
          <p class="text-[#4e0d05] font-medium mb-3">Dejá tu opinión:</p>

          <div class="flex gap-2 mb-3">
            <button
              v-for="star in 5"
              :key="star"
              @click="setRating(star)"
              type="button"
              class="text-2xl transition-transform hover:scale-110 focus:outline-none"
              :class="
                star <= newReview.rating
                  ? 'text-[#e099a8]'
                  : 'text-[#4e0d05]/20'
              "
            >
              ★
            </button>
          </div>

          <textarea
            v-model="newReview.comment"
            rows="2"
            placeholder="¿Qué te pareció este vino?"
            class="w-full border border-[#e099a8]/50 rounded-lg p-3 text-[#4e0d05] bg-[#f6f6eb] focus:ring-1 focus:ring-[#e099a8] outline-none text-sm"
          ></textarea>

          <div class="flex items-center justify-between mt-3">
            <span
              v-if="reviewMessage"
              class="text-xs text-[#3c490b] font-medium"
              >{{ reviewMessage }}</span
            >
            <span v-else></span>
            <button
              @click="handleAddReview"
              class="px-4 py-2 rounded-full bg-[#4e0d05] text-[#f6f6eb] text-sm font-medium hover:bg-[#3c490b] transition-colors"
            >
              Publicar reseña
            </button>
          </div>
        </div>

        <div v-else class="text-center py-4 bg-[#e099a8]/10 rounded-xl mb-8">
          <p class="text-[#4e0d05] text-sm">
            Iniciá sesión para dejar tu reseña.
          </p>
        </div>

        <div v-if="reviews.length > 0" class="space-y-4">
          <div
            v-for="review in reviews"
            :key="review.id"
            class="border-b border-[#4e0d05]/10 pb-4 last:border-0"
          >
            <div class="flex justify-between items-start">
              <div>
                <h4 class="font-bold text-[#4e0d05] text-sm">
                  {{ review.user_name }}
                </h4>
                <div class="flex text-[#e099a8] text-sm my-1">
                  <span v-for="n in 5" :key="n">
                    {{ n <= review.rating ? "★" : "☆" }}
                  </span>
                </div>
              </div>
              <span class="text-xs text-[#4e0d05]/50">
                {{ new Date(review.created_at).toLocaleDateString() }}
              </span>
            </div>
            <p class="text-[#4e0d05]/80 text-sm mt-1 leading-snug">
              {{ review.comment }}
            </p>
          </div>
        </div>

        <div v-else class="text-center text-[#4e0d05]/50 py-4 text-sm">
          Todavía no hay reseñas. ¡Sé el primero!
        </div>
      </div>
    </div>

    <!-- modal historial (sin cambios) -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4"
    >
      <div
        class="bg-[#ede8d7] p-6 rounded-2xl shadow-xl w-[90%] max-w-md border border-[#4e0d05]/20"
      >
        <h3 class="text-xl font-semibold text-[#3c490b] mb-3">
          Agregá una nota
        </h3>

        <p class="text-sm text-[#4e0d05]/70 mb-4">
          ¡Escribí un recuerdo o comentario sobre este vino!
        </p>

        <textarea
          v-model="noteText"
          rows="4"
          placeholder="Por ejemplo: lo tomé con una pasta en Mendoza y me pareció súper dulce..."
          class="w-full border border-[#e099a8] rounded-lg p-3 text-[#4e0d05] bg-[#f6f6eb] focus:ring-1 focus:ring-[#e099a8] outline-none"
        ></textarea>

        <div class="flex justify-end gap-3 mt-4">
          <button
            @click="cancelModal"
            class="px-4 py-2 rounded-full border border-[#4e0d05]/50 text-[#4e0d05] hover:bg-[#4e0d05]/10 transition"
          >
            Cancelar
          </button>
          <button
            @click="confirmAddHistory"
            class="px-4 py-2 rounded-full bg-[#e099a8] text-[#3c490b] font-semibold hover:bg-[#3c490b] hover:text-[#f6f6eb] transition"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
