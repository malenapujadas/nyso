<script>
import AppH1 from "../components/AppH1.vue";
import { getCurrentUser } from "../services/auth.js";
import {
  createSubscription,
  getUserSubscription,
} from "../services/subscriptions.js";

export default {
  name: "Box",
  components: { AppH1 },

  data() {
    return {
      user: null,
      showModal: false,
      loading: false,
      success: false, 
      errorMsg: "",

      // Datos del formulario
      form: {
        full_name: "",
        address: "",
        city: "",
        zip_code: "",
        phone: "",
      },
    };
  },
  async mounted() {
    this.user = await getCurrentUser();
    if (this.user) {
    }
  },
  methods: {
    openSubscribeModal() {
      if (!this.user) {
        this.$router.push("/ingresar"); 
        return;
      }
      this.showModal = true;
    },

    async handleSubscribe() {
      this.errorMsg = "";

      const nombre = this.form.full_name.trim();
      const direccion = this.form.address.trim();
      const ciudad = this.form.city.trim();
      const cp = this.form.zip_code.trim();
      const telefono = this.form.phone.trim();

      // Validamos que no haya campos vacíos
      if (!nombre || !direccion || !ciudad || !cp || !telefono) {
        this.errorMsg = "Por favor, completá todos los campos.";
        return;
      }

      // Validar Nombre
      if (nombre.length < 3) {
        this.errorMsg = "El nombre debe tener al menos 3 caracteres.";
        return;
      }

      // Validar Dirección
      if (direccion.length < 5) {
        this.errorMsg = "La dirección debe tener al menos 5 caracteres.";
        return;
      }

      // 4. Validar Ciudad
      if (ciudad.length < 3) {
        this.errorMsg = "La ciudad debe tener al menos 3 caracteres.";
        return;
      }

      //  Validar Código Postal
      if (cp.length !== 4) {
        this.errorMsg =
          "El código postal debe contener exactamente 4 caracteres.";
        return;
      }

      if (isNaN(cp)) {
        this.errorMsg = "El código postal debe contener únicamente números.";
        return;
      }

      //  Validar Teléfono
      if (telefono.length !== 10) {
        this.errorMsg = "El teléfono debe contener exactamente 10 números.";
        return;
      }

      if (isNaN(telefono)) {
        this.errorMsg = "El teléfono debe contener únicamente números.";
        return;
      }

      this.loading = true;
      try {
        await createSubscription({
          user_id: this.user.id,
          full_name: nombre,
          address: direccion,
          city: ciudad,
          zip_code: cp,
          phone: telefono,
          status: "pending",
        });

        this.success = true;
      } catch (error) {
        this.errorMsg = "Hubo un error al procesar tu solicitud.";
      } finally {
        this.loading = false;
      }
    },

    closeModal() {
      this.showModal = false;
      this.success = false;
      this.errorMsg = "";
      // Limpiar form
      this.form = {
        full_name: "",
        address: "",
        city: "",
        zip_code: "",
        phone: "",
      };
    },
  },
};
</script>

<template>
  <section class="min-h-screen bg-[#f6f6eb]">
    <div class="mx-auto max-w-6xl px-6 md:px-12 py-10 md:py-14">
      <div class="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div class="lg:col-span-6 text-left">
          <p class="text-[#4e0d05]/70 font-semibold tracking-wide">
            BOX MENSUAL NYSO
          </p>

          <AppH1
            class="mt-3 text-[#4e0d05] font-extrabold text-3xl sm:text-4xl md:text-4xl leading-tight tracking-tight font-[Poppins] text-left max-w-none"
          >
            Tu vino del mes, directo a casa.
            <span class="text-[#3c490b]"> Una box que te acompaña</span>
            <span class="text-[#e099a8]"> todo el año.</span>
          </AppH1>

          <p
            class="mt-5 text-[#4e0d05]/80 text-base md:text-lg leading-relaxed max-w-xl"
          >
            Todos los meses te llega una selección curada por NYSO: un vino
            protagonista con un regalo sorpresa.
          </p>

          <div class="mt-6 flex items-end gap-3">
            <p class="text-3xl md:text-4xl font-extrabold text-[#4e0d05]">
              $30.000
            </p>
            <p class="text-sm text-[#4e0d05]/60">por mes</p>
          </div>

          <div class="mt-7 flex flex-col sm:flex-row gap-3">
            <button
              @click="openSubscribeModal"
              class="px-6 py-3 rounded-full bg-[#4e0d05] text-[#f6f6eb] font-semibold text-base hover:bg-[#3c490b] transition"
            >
              Comprar box mensual
            </button>
          </div>

          <!-- Info -->
          <div class="mt-8 grid grid-cols-3 gap-3 max-w-xl">
            <div
              class="rounded-2xl bg-white/40 border border-[#4e0d05]/10 px-4 py-3"
            >
              <p class="text-xs text-[#4e0d05]/60">Frecuencia</p>
              <p class="text-sm font-bold text-[#4e0d05]">Mensual</p>
            </div>
            <div
              class="rounded-2xl bg-white/40 border border-[#4e0d05]/10 px-4 py-3"
            >
              <p class="text-xs text-[#4e0d05]/60">Selección</p>
              <p class="text-sm font-bold text-[#4e0d05]">Curada</p>
            </div>
            <div
              class="rounded-2xl bg-white/40 border border-[#4e0d05]/10 px-4 py-3"
            >
              <p class="text-xs text-[#4e0d05]/60">Entrega</p>
              <p class="text-sm font-bold text-[#4e0d05]">A domicilio</p>
            </div>
          </div>
        </div>

        <!-- Imágenes -->
        <div class="lg:col-span-6">
          <div class="grid grid-cols-12 gap-4">
            <div
              class="col-span-6 rounded-3xl overflow-hidden border border-[#4e0d05]/20 bg-[#ede8d7]/40"
            >
              <img
                src="/box.png"
                alt="Box NYSO"
                class="w-full h-44 md:h-48 object-cover"
              />
            </div>

            <div
              class="col-span-6 rounded-3xl overflow-hidden border border-[#4e0d05]/20 bg-[#ede8d7]/40"
            >
              <img
                src="/botella.png"
                alt="Botella"
                class="w-full h-44 md:h-48 object-cover"
              />
            </div>

            <div
              class="col-span-12 md:col-span-6 rounded-3xl overflow-hidden border border-[#4e0d05]/20 bg-[#ede8d7]/40"
            >
              <img
                src="/box-2.jpg"
                alt="Detalle box"
                class="w-full h-64 md:h-72 object-cover object-center"
              />
            </div>

            <div
              class="col-span-12 md:col-span-6 rounded-3xl overflow-hidden border border-[#4e0d05]/20 bg-[#ede8d7]/40"
            >
              <img
                src="/box-3.jpg"
                alt="Experiencia NYSO"
                class="w-full h-64 md:h-72 object-cover object-center"
              />
            </div>
          </div>
        </div>
      </div>

      <div
        class="mt-14 rounded-3xl border border-[#4e0d05]/10 bg-[#ede8d7]/60 p-7 md:p-10"
      >
        <h2 class="text-2xl md:text-3xl font-extrabold text-[#3c490b]">
          ¿Qué incluye la Box NYSO?
        </h2>

        <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5">
          <div class="rounded-2xl bg-[#f6f6eb] border border-[#4e0d05]/10 p-5">
            <p class="font-bold text-[#4e0d05]">1 vino protagonista</p>
            <p class="text-sm text-[#4e0d05]/70 mt-2">
              Elegido para que descubras algo nuevo.
            </p>
          </div>

          <div class="rounded-2xl bg-[#f6f6eb] border border-[#4e0d05]/10 p-5">
            <p class="font-bold text-[#4e0d05]">Guía + maridajes</p>
            <p class="text-sm text-[#4e0d05]/70 mt-2">
              Tips simples: cómo tomarlo, con qué comerlo y por qué vale la
              pena.
            </p>
          </div>

          <div class="rounded-2xl bg-[#f6f6eb] border border-[#4e0d05]/10 p-5">
            <p class="font-bold text-[#4e0d05]">Sorpresas mensuales</p>
            <p class="text-sm text-[#4e0d05]/70 mt-2">
              Detalles para que el momento sea especial (según temporada).
            </p>
          </div>
        </div>

        <div class="mt-8 flex flex-col sm:flex-row gap-3">
          <div class="mt-8 flex flex-col sm:flex-row gap-3">
            <button
              @click="openSubscribeModal"
              class="px-6 py-3 rounded-full bg-[#e099a8] text-[#3c490b] font-semibold text-base hover:bg-[#3c490b] hover:text-[#f6f6eb] transition"
            >
              Suscribirme
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="showModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    >
      <div
        class="bg-[#f6f6eb] rounded-3xl p-8 max-w-md w-full shadow-2xl relative border border-[#4e0d05]/10"
      >
        <button
          @click="closeModal"
          class="absolute top-4 right-4 text-[#4e0d05]/50 hover:text-[#4e0d05]"
        >
          ✕
        </button>

        <div v-if="!success">
          <h3 class="text-2xl font-bold text-[#4e0d05] mb-2">
            Suscribirse al Box
          </h3>
          <p class="text-sm text-[#4e0d05]/70 mb-6">
            Completá tus datos de envío. Te contactaremos para coordinar el pago
            y la entrega.
          </p>

          <form @submit.prevent="handleSubscribe" class="space-y-4">
            <div
              v-if="errorMsg"
              class="text-center text-[#4e0d05] font-semibold bg-[#e099a8]/20 border border-[#e099a8] rounded-full py-2 px-4 text-sm md:text-base mb-2"
            >
              {{ errorMsg }}
            </div>

            <div>
              <label class="block text-xs font-bold text-[#4e0d05] uppercase mb-1">
                Nombre Completo
              </label>
              <input
                v-model="form.full_name"
                required
                type="text"
                class="w-full p-3 rounded-xl border border-[#4e0d05]/20 bg-white"
                placeholder="Ej: Juan Pérez"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-[#4e0d05] uppercase mb-1">
                Dirección de Entrega
              </label>
              <input
                v-model="form.address"
                required
                type="text"
                class="w-full p-3 rounded-xl border border-[#4e0d05]/20 bg-white"
                placeholder="Calle y altura"
              />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold text-[#4e0d05] uppercase mb-1">
                  Ciudad
                </label>
                <input
                  v-model="form.city"
                  required
                  type="text"
                  class="w-full p-3 rounded-xl border border-[#4e0d05]/20 bg-white"
                />
              </div>
              <div>
                <label class="block text-xs font-bold text-[#4e0d05] uppercase mb-1">
                  C.P.
                </label>
                <input
                  v-model="form.zip_code"
                  required
                  type="text"
                  class="w-full p-3 rounded-xl border border-[#4e0d05]/20 bg-white"
                />
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-[#4e0d05] uppercase mb-1">
                Teléfono / WhatsApp
              </label>
              <input
                v-model="form.phone"
                required
                type="tel"
                class="w-full p-3 rounded-xl border border-[#4e0d05]/20 bg-white"
                placeholder="Para coordinar el pago"
              />
            </div>

            <button
              type="submit"
              :disabled="loading"
              class="w-full py-3 mt-4 rounded-full bg-[#4e0d05] text-[#f6f6eb] font-bold hover:bg-[#3c490b] transition disabled:opacity-50"
            >
              {{ loading ? "Procesando..." : "Confirmar Solicitud" }}
            </button>
          </form>
        </div>

        <div v-else class="text-center py-6">
            <h3 class="text-2xl font-bold text-[#3c490b] mb-2">
              ¡Solicitud Enviada!
            </h3>
          <p class="text-[#4e0d05]/80 mb-6">
            Ya recibimos tus datos. En las próximas 24hs te vamos a escribir al
            WhatsApp/Mail que nos dejaste para finalizar la suscripción.
          </p>
          <button
            @click="closeModal"
            class="px-6 py-2 rounded-full border border-[#4e0d05] text-[#4e0d05] font-semibold hover:bg-[#4e0d05] hover:text-white transition"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  </section>
</template>