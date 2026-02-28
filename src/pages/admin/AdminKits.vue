<script>
import {
  getAllSubscriptions,
  updateSubscriptionStatus,
} from "../../services/subscriptions.js";
import AppLoader from "../../components/AppLoader.vue";

export default {
  name: "AdminKits",
  components: { AppLoader },
  data() {
    return {
      subscriptions: [],
      loading: true,
      error: null,
      processingId: null,
    };
  },
  async mounted() {
    await this.loadSubscriptions();
  },
  methods: {
    async loadSubscriptions() {
      this.loading = true;
      try {
        this.subscriptions = await getAllSubscriptions();
      } catch (e) {
        this.error = "Error al cargar las suscripciones.";
      } finally {
        this.loading = false;
      }
    },

    async changeStatus(sub, newStatus) {
      this.processingId = sub.id;
      try {
        await updateSubscriptionStatus(sub.id, newStatus);
        sub.status = newStatus;
      } catch (e) {
        alert("No se pudo actualizar el estado.");
      } finally {
        this.processingId = null;
      }
    },

    /* getWhatsAppLink(phone, name) {
      const cleanPhone = (phone || "").replace(/[^0-9]/g, "");
      const text = `Hola ${name}, te escribo de NYSO por tu suscripción al Box de vinos.`;
      return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
    }, */

    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    },
  },
};
</script>

<template>
  <section class="relative min-h-screen bg-[#f6f6eb] text-[#4e0d05] py-10 px-4 sm:py-16 sm:px-8">
    <!-- Iconos decorativos -->
    <img
      src="/icono1.png"
      alt="icono"
      class="hidden md:block absolute top-10 left-10 w-16 opacity-90 rotate-12 pointer-events-none"
    />
    <img
      src="/icono2.png"
      alt="icono"
      class="hidden md:block absolute top-16 right-20 w-20 opacity-100 -rotate-6 pointer-events-none"
    />
    <img
      src="/icono3.png"
      alt="icono"
      class="hidden md:block absolute top-1/3 left-10 w-22 opacity-80 rotate-3 pointer-events-none"
    />
    <img
      src="/icono4.png"
      alt="icono"
      class="hidden md:block absolute top-[40%] right-10 w-18 opacity-80 rotate-6 pointer-events-none"
    />
    <img
      src="/icono5.png"
      alt="icono"
      class="hidden md:block absolute bottom-[25%] left-10 w-24 opacity-80 -rotate-6 pointer-events-none"
    />
    <img
      src="/icono6.png"
      alt="icono"
      class="hidden md:block absolute bottom-[35%] right-20 w-24 opacity-80 rotate-3 pointer-events-none"
    />
    <img
      src="/icono7.png"
      alt="icono"
      class="hidden md:block absolute top-[20%] left-10 w-18 opacity-90 rotate-12 pointer-events-none"
    />
    <img
      src="/icono2.png"
      alt="icono"
      class="hidden md:block absolute bottom-16 right-20 w-20 opacity-100 -rotate-6 pointer-events-none"
    />
    <img
      src="/icono6.png"
      alt="icono"
      class="hidden md:block absolute bottom-22 left-20 w-24 opacity-100 -rotate-6 pointer-events-none"
    />

    <div class="relative z-10 max-w-7xl mx-auto pb-20 px-4 md:px-0">
      <!-- Header centrado (H1 correcto) -->
      <div class="mb-10 text-center">
        <h1 class="text-3xl sm:text-4xl font-bold text-[#3c490b] mb-4 tracking-wide">
          Gestión de Kits & Suscripciones
        </h1>
        <p class="text-[#4e0d05]/60">
          Administrá los pedidos de cajas mensuales.
        </p>
      </div>

      <div v-if="loading" class="flex justify-center py-10">
        <AppLoader />
      </div>

      <div v-else-if="error" class="text-center text-red-600">
        {{ error }}
      </div>

      <div
        v-else
        class="bg-[#ede8d7] rounded-3xl border border-[#4e0d05]/20 shadow-sm overflow-hidden"
      >
        <div
          v-if="subscriptions.length === 0"
          class="p-8 text-center text-[#4e0d05]/60"
        >
          No hay solicitudes de suscripción todavía.
        </div>

        <template v-else>
          <!-- CARDS MOBILE -->
          <div class="md:hidden p-4 space-y-4">
            <div
              v-for="sub in subscriptions"
              :key="sub.id"
              class="bg-[#f6f6eb] border border-[#4e0d05]/20 rounded-2xl p-4 shadow-sm"
            >
              <div class="flex items-start justify-between gap-3">
                <div class="text-[#4e0d05] min-w-0">
                  <p class="text-xs opacity-70">
                    {{ formatDate(sub.created_at) }}
                  </p>

                  <p class="font-bold text-lg leading-tight break-words">
                    {{ sub.full_name }}
                  </p>

                  <p class="text-xs opacity-60 break-all">
                    {{ sub.email }}
                  </p>
                </div>

                <span
                  class="shrink-0 w-[110px] text-center px-3 py-1 rounded-full text-xs font-bold border whitespace-nowrap"
                  :class="{
                    'bg-yellow-100 text-yellow-800 border-yellow-200':
                      sub.status === 'pending',
                    'bg-[#3c490b]/10 text-[#3c490b] border-[#3c490b]/20':
                      sub.status === 'active',
                    'bg-red-100 text-red-800 border-red-200':
                      sub.status === 'cancelled',
                  }"
                >
                  {{
                    sub.status === "pending"
                      ? "PENDIENTE"
                      : sub.status === "active"
                        ? "ACTIVO"
                        : "CANCELADO"
                  }}
                </span>
              </div>

              <div class="mt-3 text-[#4e0d05]">
                <p class="text-sm font-semibold">Dirección de Envío</p>
                <p class="text-sm break-words">{{ sub.address }}</p>
                <p class="text-xs opacity-60 break-words">
                  {{ sub.city }} (CP {{ sub.zip_code }})
                </p>
              </div>

              <div class="mt-3">
                <p
                  
                  target="_blank"
                  class="inline-flex items-center gap-2 text-[#3c490b] font-semibold hover:underline break-all"
                >
                  <!-- ícono whatsapp simple (no emoji) -->
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.08 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72c.12.86.31 1.7.57 2.5a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.58-1.09a2 2 0 0 1 2.11-.45c.8.26 1.64.45 2.5.57A2 2 0 0 1 22 16.92z"/>
                  </svg>
                  <span>{{ sub.phone }}</span>
                </p>
              </div>

              <div class="mt-4 flex items-center justify-end gap-2">
                <template v-if="processingId !== sub.id">
                  <button
                    v-if="sub.status === 'pending' || sub.status === 'cancelled'"
                    @click="changeStatus(sub, 'active')"
                    class="w-10 h-10 rounded-xl bg-[#3c490b] text-white text-base font-semibold hover:bg-[#4e0d05] transition flex items-center justify-center"
                    title="Aceptar / activar"
                  >
                    ✓
                  </button>

                  <button
                    v-if="sub.status !== 'cancelled'"
                    @click="changeStatus(sub, 'cancelled')"
                    class="w-10 h-10 rounded-xl border border-[#e099a8] text-[#e099a8] text-base font-semibold hover:bg-[#e099a8] hover:text-white transition flex items-center justify-center"
                    title="Cancelar suscripción"
                  >
                    ✕
                  </button>
                </template>

                <span v-else class="text-sm text-[#4e0d05]/50">Procesando...</span>
              </div>
            </div>
          </div>

          <!-- TABLA ESCRITORIO -->
          <div class="hidden md:block overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr
                  class="bg-[#4e0d05]/5 text-[#4e0d05] text-xs uppercase tracking-wider border-b border-[#4e0d05]/10"
                >
                  <th class="p-4 font-bold">Fecha</th>
                  <th class="p-4 font-bold">Cliente</th>
                  <th class="p-4 font-bold">Dirección de Envío</th>
                  <th class="p-4 font-bold">Contacto</th>
                  <th class="p-4 font-bold text-center">Estado</th>
                  <th class="p-4 font-bold text-center">Acciones</th>
                </tr>
              </thead>

              <tbody class="text-sm text-[#4e0d05]">
                <tr
                  v-for="sub in subscriptions"
                  :key="sub.id"
                  class="border-b border-[#4e0d05]/5 hover:bg-[#4e0d05]/5 transition-colors"
                >
                  <td class="p-4 whitespace-nowrap opacity-70">
                    {{ formatDate(sub.created_at) }}
                  </td>

                  <td class="p-4">
                    <p class="font-bold">{{ sub.full_name }}</p>
                    <p class="text-xs opacity-60 break-all">{{ sub.email }}</p>
                  </td>

                  <td class="p-4 max-w-xs">
                    <p class="break-words">{{ sub.address }}</p>
                    <p class="text-xs opacity-60 break-words">
                      {{ sub.city }} (CP {{ sub.zip_code }})
                    </p>
                  </td>

                  <td class="p-4">
                    <p
                      
                      target="_blank"
                      class="inline-flex items-center gap-2 text-[#3c490b] font-semibold hover:underline break-all"
                    >
                      <!-- ícono simple (no emoji) -->
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.08 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72c.12.86.31 1.7.57 2.5a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.58-1.09a2 2 0 0 1 2.11-.45c.8.26 1.64.45 2.5.57A2 2 0 0 1 22 16.92z"/>
                      </svg>
                      <span>{{ sub.phone }}</span>
                    </p>
                  </td>

                  <td class="p-4 text-center">
                    <span
                      class="w-[120px] inline-block text-center px-3 py-1 rounded-full text-xs font-bold border"
                      :class="{
                        'bg-yellow-100 text-yellow-800 border-yellow-200':
                          sub.status === 'pending',
                        'bg-[#3c490b]/10 text-[#3c490b] border-[#3c490b]/20':
                          sub.status === 'active',
                        'bg-red-100 text-red-800 border-red-200':
                          sub.status === 'cancelled',
                      }"
                    >
                      {{
                        sub.status === "pending"
                          ? "PENDIENTE"
                          : sub.status === "active"
                            ? "ACTIVO"
                            : "CANCELADO"
                      }}
                    </span>
                  </td>

                  <td class="p-4 text-center">
                    <div class="flex justify-center gap-2" v-if="processingId !== sub.id">
                      <button
                        v-if="sub.status === 'pending' || sub.status === 'cancelled'"
                        @click="changeStatus(sub, 'active')"
                        class="w-9 h-9 rounded-lg bg-[#3c490b] text-white text-sm font-semibold hover:bg-[#4e0d05] transition flex items-center justify-center"
                        title="Aceptar / activar"
                      >
                        ✓
                      </button>

                      <button
                        v-if="sub.status !== 'cancelled'"
                        @click="changeStatus(sub, 'cancelled')"
                        class="w-9 h-9 rounded-lg border border-[#e099a8] text-[#e099a8] text-sm font-semibold hover:bg-[#e099a8] hover:text-white transition flex items-center justify-center"
                        title="Cancelar suscripción"
                      >
                        ✕
                      </button>
                    </div>
                    <span v-else class="text-xs text-[#4e0d05]/50">Procesando...</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
      </div>
    </div>
  </section>
</template>