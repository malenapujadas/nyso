<script>
import AppH1 from "../components/AppH1.vue";
import { getVinoById } from "../services/wines.js";
import { getCurrentUser, getAuthUser } from "../services/auth.js";
import { addFavorite, getFavorites } from "../services/favorites.js";
import { addHistory, getHistory } from "../services/history.js";
import { addReview, getReviewsByWineId } from "../services/reviews.js";
import AppLoader from "../components/AppLoader.vue";
import { toast } from "vue3-toastify";

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
      isInHistory: false,

      loading: true,
      error: null,

      showModal: false,
      modalError: null,
      noteText: "",

      selectedNote: "",
      customNote: "", 

      noteOptions: [
        "Me encantó",
        "Muy rico y fácil de tomar",
        "Lo volvería a comprar",
        "Esta bien, pero no me sorprendió",
        "No me gustó",
      ],

      reviews: [], // lista de reseñas
      newReview: {
        rating: 0,
        comment: "",
      },
      reviewMessage: null, 

      // PAGINACIÓN RESEÑAS
      reviewsCurrentPage: 1,
      reviewsPerPage: 3,
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

        // Verificar Historial 
        const historyData = await getHistory(this.user.id);
        // getHistory devuelve objetos tipo { vino_id: 123, note: "..." }
        this.isInHistory = historyData.some(
          (h) => String(h.vino_id) === String(this.vino.id)
        );
      }
    } catch (error) {
      console.error("[Detail.vue] Error al cargar detalle de vino:", error);
      this.error = "Ocurrió un error al cargar el vino. Intentá nuevamente.";
    }

    this.loading = false;
  },

  watch: {
    // PAGINACIÓN RESEÑAS (NUEVO) - si quedaste en una página que ya no existe
    totalReviewPages() {
      if (this.reviewsCurrentPage > this.totalReviewPages) {
        this.reviewsCurrentPage = this.totalReviewPages;
      }
    },
  },

  methods: {
    // Agregar a Wishlist
    async handleAddFavorite() {
      if (!this.user) {
        toast.info("Iniciá sesión para agregar a tu Wishlist");
        return;
      }

      try {
        if (!this.isFavorite) {
          await addFavorite(this.user.id, this.vino.id);
          this.isFavorite = true;
          toast.success("Agregado a tu Wishlist");
        } else {
          toast.info("Este vino ya está en tu Wishlist");
        }
      } catch (e) {
        console.error(e);
        toast.error("Error al agregar a tu Wishlist");
      }
    },

    // Agregar al historial
    async handleAddHistory() {
      if (!this.user) {
        toast.info("Iniciá sesión para agregar al Historial");
        return;
      }

      this.modalError = null;
      this.showModal = true;
    },

      async confirmAddHistory() {
    this.modalError = null;

    try {
      const extra = (this.customNote || "").trim();

      if (this.selectedNote && extra) {
        this.modalError =
          "Por favor, elegí una opción predeterminada O escribí una nota, pero no ambas.";
        return;
      }

      if (!this.selectedNote && !extra) {
        this.modalError = "Elegí una opción o escribí una nota antes de guardar.";
        return;
      }

      if (extra && extra.length < 10) {
        this.modalError = "La nota extra debe tener al menos 10 caracteres.";
        return;
      }

      let noteToSave = "";
      if (this.selectedNote && extra) {
        noteToSave = `${this.selectedNote} — Nota: ${extra}`;
      } else if (this.selectedNote) {
        noteToSave = this.selectedNote;
      } else {
        noteToSave = extra;
      }

      await addHistory(this.user.id, this.vino.id, noteToSave);

      this.isInHistory = true;
      this.showModal = false;

      this.selectedNote = "";
      this.customNote = "";

      toast.success("Agregado a tu Historial");
    } catch (e) {
      console.error(e);
      toast.error("Error al agregar al Historial");
    }
  },

    cancelModal() {
    this.showModal = false;
    this.selectedNote = "";
    this.customNote = "";
    this.modalError = null;
  },

    // metodo para estrellas
    setRating(star) {
      this.newReview.rating = star;
    },

    async handleAddReview() {
  if (!this.user) {
    toast.info("Iniciá sesión para dejar tu reseña");
    return;
  }

  if (this.newReview.rating === 0) {
    toast.info("Elegí una puntuación (estrellas)");
    return;
  }

  const comentarioLimpiado = this.newReview.comment.trim();

  if (!comentarioLimpiado) {
    toast.info("Escribí un comentario");
    return;
  }

  if (comentarioLimpiado.length < 10) {
    toast.info("El comentario debe tener al menos 10 caracteres");
    return;
  }

  try {
    const fullProfile = getAuthUser();
    const userName =
      fullProfile.display_name ||
      fullProfile.nombre ||
      this.user.email.split("@")[0] ||
      "Usuario";

    const savedReview = await addReview(
      this.user.id,
      this.vino.id,
      userName,
      this.newReview.rating,
      comentarioLimpiado
    );

    this.reviews.unshift(savedReview);
    this.reviewsCurrentPage = 1;

    this.newReview.rating = 0;
    this.newReview.comment = "";

    toast.success("¡Gracias por tu reseña!");
  } catch (e) {
    console.error(e);
    toast.error("Error al guardar la reseña");
  }
},

    // PAGINACIÓN RESEÑAS
    goToReviewPage(p) {
      const page = Number(p);
      if (!Number.isFinite(page)) return;

      if (page < 1) this.reviewsCurrentPage = 1;
      else if (page > this.totalReviewPages) this.reviewsCurrentPage = this.totalReviewPages;
      else this.reviewsCurrentPage = page;
    },
    nextReviewPage() {
      this.goToReviewPage(this.reviewsCurrentPage + 1);
    },
    prevReviewPage() {
      this.goToReviewPage(this.reviewsCurrentPage - 1);
    },
  },

  computed: {
    isAdmin() {
      return this.user && this.user.role === "admin";
    },

    averageRating() {
      if (!this.reviews || this.reviews.length === 0) return 0;

      const sum = this.reviews.reduce((acc, r) => acc + Number(r.rating || 0), 0);
      return sum / this.reviews.length;
    },

    averageRatingText() {
      if (!this.reviews || this.reviews.length === 0) return null;
      return this.averageRating.toFixed(1);
    },

    // PAGINACIÓN RESEÑAS (NUEVO)
    totalReviewPages() {
      return Math.max(1, Math.ceil(this.reviews.length / this.reviewsPerPage));
    },
    paginatedReviews() {
      const start = (this.reviewsCurrentPage - 1) * this.reviewsPerPage;
      const end = start + this.reviewsPerPage;
      return this.reviews.slice(start, end);
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
        <!-- imagen vino -->
        <div class="flex justify-center md:items-start">
          <img
            :src="vino.imagen"
            :alt="vino.nombre"
            class="w-60 sm:w-72 md:w-[420px] object-contain rounded-lg border border-[#4e0d05]/20 bg-[#f6f6eb]"
          />
        </div>

        <!-- info -->
        <div class="flex-1 text-left space-y-6 mt-6 md:mt-0">
          <!-- titulo y promedio + wishlist  -->
          <div
            class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
          >
            <div class="flex items-center gap-3">
              <h2 class="text-2xl sm:text-3xl md:text-3xl font-bold text-[#4e0d05]">
                {{ vino.nombre }}
              </h2>

              <div
                v-if="averageRatingText"
                class="flex items-center gap-1 text-sm sm:text-base font-semibold text-[#4e0d05]"
              >
                <span class="text-[#e099a8] text-lg leading-none">★</span>
                <span>{{ averageRatingText }}</span>
                <span class="text-xs text-[#4e0d05]/60 font-normal">
                  ({{ reviews.length }})
                </span>
              </div>

              <div v-else class="text-xs sm:text-sm text-[#4e0d05]/60">
                Sin calificaciones
              </div>
            </div>

            <button
              v-if="!isAdmin"
              @click="handleAddFavorite"
              class="text-xs sm:text-sm font-medium rounded-full px-4 py-2 border border-[#e099a8] text-[#4e0d05] hover:bg-[#e099a8] hover:text-white transition"
              :class="{ 'bg-[#e099a8] text-white': isFavorite }"
            >
              +Wishlist
            </button>
          </div>

          <!-- descripcion -->
          <p class="text-[#4e0d05]/90">
            {{ vino.descripcion }}
          </p>

          <hr class="border-t border-[#4e0d05]/30" />

          <div class="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-2 text-[#4e0d05] max-w-2xl">

          <!-- Columna 1 -->
          <div class="space-y-1">
            <p><strong>Bodega:</strong> {{ vino.bodega }}</p>
            <p><strong>Uva:</strong> {{ vino.uva }}</p>
          </div>

          <!-- Columna 2 -->
          <div class="space-y-1">
            <p><strong>Tipo:</strong> {{ vino.tipo }}</p>
            <p><strong>Año:</strong> {{ vino["año"] }}</p>
          </div>

          <!-- Columna 3 -->
          <div class="space-y-1">
            <p><strong>Región:</strong> {{ vino.region }}</p>
            <p><strong>Precio aprox.:</strong> ${{ vino.precio_aproximado }}</p>
          </div>

          </div>

          <hr class="border-t border-[#4e0d05]/30" />

          <!-- maridajes -->
          <div>
            <h3 class="text-lg font-semibold text-[#3c490b] mb-3">Maridajes</h3>

            <div class="flex flex-wrap gap-2">
              <span
                v-for="(m, i) in vino.maridaje"
                :key="i"
                class="px-3 py-1 rounded-full bg-[#e099a8]/25 border border-[#e099a8]/40 text-xs"
              >
                {{ m }}
              </span>
            </div>

            <!-- registrar consumo -->
            <div class="mt-6">
              <button
                v-if="!isAdmin && !isInHistory"
                @click="handleAddHistory"
                class="w-full sm:w-auto px-5 py-3 rounded-xl border border-[#3c490b]/40 bg-[#3c490b]/5 text-[#3c490b] font-semibold hover:bg-[#3c490b]/10 transition"
              >
                Registrar consumo ↗
              </button>

              <div 
                v-else-if="!isAdmin && isInHistory" 
                class="inline-block w-full sm:w-auto px-5 py-3 rounded-xl border border-[#4e0d05]/20 bg-white/60 text-[#4e0d05] font-semibold opacity-70 cursor-not-allowed text-center"
              >
                ✓ Vino registrado
              </div>

              <p class="text-xs text-[#4e0d05]/60 mt-2">
                Agregá una nota para recordar cuándo y cómo lo tomaste.
              </p>
            </div>
          </div>

          <!-- mensaje -->
          <p
            v-if="message"
            class="mt-3 rounded-full px-4 py-2 text-xs text-center border"
            :class="
              messageType === 'history'
                ? 'bg-[#3c490b10] border-[#3c490b40] text-[#3c490b]'
                : 'bg-[#e099a8]/20 border-[#e099a8]/50 text-[#4e0d05]'
            "
          >
            {{ message }}
          </p>

          <!-- volver -->
          <div class="flex justify-end pt-4">
            <RouterLink
              to="/social"
              class="text-[#e099a8] font-medium hover:text-[#3c490b]"
            >
              Volver al listado
            </RouterLink>
          </div>
        </div>
      </div>

      <!-- RESEÑAS -->
      <div class="w-full mt-14">
        <h3 class="text-2xl sm:text-3xl font-bold text-[#3c490b] mb-8">
          Reseñas de la comunidad
        </h3>

        <!-- formulario reseña -->
        <div
          v-if="user"
          class="bg-[#e099a8]/10 p-6 rounded-xl border border-[#e099a8]/30 mb-8"
        >
          <div class="flex flex-col md:flex-row gap-4 items-start">
            <!-- Nysito  -->
            <div class="w-full md:w-1/4">
              <img
                src="/nysito-estrella.png"
                alt="Nysito con estrella"
                class="w-full max-h-60 object-contain"
              />
            </div>

            <!-- formulario -->
            <div class="w-full md:w-3/4">
              <p class="font-medium mb-3 text-[#4e0d05]">Dejá tu opinión:</p>

              <div class="flex gap-2 mb-3">
                <button
                  v-for="star in 5"
                  :key="star"
                  @click="setRating(star)"
                  class="text-2xl"
                  :class="
                    star <= newReview.rating
                      ? 'text-[#e099a8]'
                      : 'text-[#4e0d05]/20'
                  "
                >
                  ★
                </button>
              </div>

              <div
                v-if="reviewMessage"
                class="text-center font-semibold rounded-xl py-2 px-4 text-sm mb-3 border"
                :class="
                  reviewMessage.includes('Gracias')
                    ? 'bg-[#3c490b]/10 text-[#3c490b] border-[#3c490b]/30'
                    : 'bg-[#e099a8]/20 text-[#4e0d05] border-[#e099a8]/50'
                "
              >
                {{ reviewMessage }}
              </div>

              <textarea
                v-model="newReview.comment"
                rows="2"
                placeholder="¿Qué te pareció este vino?"
                class="w-full border border-[#e099a8]/50 rounded-lg p-3 bg-[#f6f6eb]"
              ></textarea>

              <div class="flex justify-end mt-3">
                <button
                  @click="handleAddReview"
                  class="px-4 py-2 rounded-full bg-[#4e0d05] text-[#f6f6eb] text-sm font-medium hover:bg-[#3c490b]"
                >
                  Publicar reseña
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-4 bg-[#e099a8]/10 rounded-xl">
          <p class="text-sm text-[#4e0d05]">Iniciá sesión para dejar tu reseña.</p>
        </div>

        <!-- listado reseñas-->
        <div v-if="reviews.length" class="mt-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="review in paginatedReviews"
              :key="review.id"
              class="rounded-xl border border-[#4e0d05]/10 bg-[#f6f6eb] p-4 shadow-sm h-[190px] flex flex-col justify-between"
            >
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                  <p class="font-bold text-sm text-[#4e0d05] truncate">
                    {{ review.user_name }}
                  </p>

                  <div class="text-[#e099a8] leading-none">
                    {{ "★".repeat(review.rating) }}
                    <span class="text-[#4e0d05]/40 text-xs ml-1">
                      ({{ review.rating }}/5)
                    </span>
                  </div>
                </div>

                <span class="text-[11px] text-[#4e0d05]/50 whitespace-nowrap">
                  {{ new Date(review.created_at).toLocaleDateString() }}
                </span>
              </div>

              <p class="text-sm mt-3 text-[#4e0d05]/80 overflow-hidden text-ellipsis">
                {{ review.comment }}
              </p>
            </div>
          </div>

          <!--  Paginación reseñas (NUEVO)  -->
          <div
            v-if="reviews.length > 0 && totalReviewPages > 1"
            class="w-full flex flex-col items-center lg:items-end mt-10 gap-3"
          >
            <p class="text-xs text-[#4e0d05]/70 text-center lg:text-right">
              Página {{ reviewsCurrentPage }} de {{ totalReviewPages }}
            </p>

            <div class="flex flex-wrap items-center justify-center lg:justify-end gap-2">
              <button
                type="button"
                @click="prevReviewPage"
                :disabled="reviewsCurrentPage === 1"
                class="px-4 py-2 rounded-full border border-[#4e0d05]/30 bg-white/60 text-[#4e0d05] disabled:opacity-40"
              >
                Anterior
              </button>

              <button
                v-for="p in totalReviewPages"
                :key="p"
                type="button"
                @click="goToReviewPage(p)"
                :class="[
                  'w-10 h-10 rounded-full border text-sm font-semibold transition',
                  p === reviewsCurrentPage
                    ? 'bg-[#3c490b] text-white border-[#3c490b]'
                    : 'bg-white/60 text-[#4e0d05] border-[#4e0d05]/30 hover:bg-white'
                ]"
              >
                {{ p }}
              </button>

              <button
                type="button"
                @click="nextReviewPage"
                :disabled="reviewsCurrentPage === totalReviewPages"
                class="px-4 py-2 rounded-full border border-[#4e0d05]/30 bg-white/60 text-[#4e0d05] disabled:opacity-40"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- modal historial -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4"
    >
      <div
        class="bg-[#ede8d7] p-6 rounded-2xl shadow-xl w-[90%] max-w-md border border-[#4e0d05]/20"
      >
        <h3 class="text-xl font-semibold text-[#3c490b] mb-3">Agregá una nota</h3>

        <p class="text-sm text-[#4e0d05]/70 mb-4">
          Elegí una opción para guardar en tu historial:
        </p>

    <!-- Opciones: 2 + 2 + 1 centrada -->
    <div class="grid grid-cols-2 gap-4">
      <!-- primeras 4 en 2x2 -->
      <button
        v-for="(opt, i) in noteOptions.slice(0, 4)"
        :key="i"
        type="button"
        @click="selectedNote = selectedNote === opt ? '' : opt" 
        class="h-20 flex items-center justify-center text-center px-4 rounded-2xl border text-sm transition"
        :class="
          selectedNote === opt
            ? 'border-[#3c490b] bg-[#3c490b]/10 text-[#3c490b] font-semibold'
            : 'border-[#e099a8]/50 bg-[#f6f6eb] text-[#4e0d05] hover:bg-[#e099a8]/10'
        "
      >
        <span class="leading-snug">{{ opt }}</span>
      </button>

      <!-- 5ta centrada -->
      <div class="col-span-2 flex justify-center">
        <button
          type="button"
          @click="selectedNote = selectedNote === noteOptions[4] ? '' : noteOptions[4]"
          class="h-20 w-full sm:w-[70%] flex items-center justify-center text-center px-4 rounded-2xl border text-sm transition"
          :class="
            selectedNote === noteOptions[4]
              ? 'border-[#3c490b] bg-[#3c490b]/10 text-[#3c490b] font-semibold'
              : 'border-[#e099a8]/50 bg-[#f6f6eb] text-[#4e0d05] hover:bg-[#e099a8]/10'
          "
        >
          <span class="leading-snug">{{ noteOptions[4] }}</span>
        </button>
      </div>

      <!-- textarea debajo del 5to -->
      <div class="col-span-2 mt-2">
        <label class="text-sm font-medium text-[#4e0d05]/80 block mb-2">
          Nota extra:
        </label>

        <textarea
          v-model="customNote"
          rows="3"
          placeholder="Ej: Lo tomé con amigos..."
          class="w-full border border-[#e099a8]/50 rounded-xl p-3 bg-[#f6f6eb] text-[#4e0d05] outline-none focus:ring-1 focus:ring-[#e099a8]"
        ></textarea>
      </div>
      <div v-if="modalError" class="col-span-2 mt-3">
        <div class="text-center font-semibold rounded-xl py-2 px-4 text-sm border bg-[#e099a8]/20 text-[#4e0d05] border-[#e099a8]/50">
          {{ modalError }}
        </div>
      </div>
    </div>

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
