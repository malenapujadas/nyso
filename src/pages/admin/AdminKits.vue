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

    // Genera un link para hablarle al cliente directo
    getWhatsAppLink(phone, name) {
      // Limpiamos el teléfono de espacios o guiones
      const cleanPhone = phone.replace(/[^0-9]/g, "");
      const text = `Hola ${name}, te escribo de NYSO por tu suscripción al Box de vinos.`;
      return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
    },

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
  <div class="max-w-7xl mx-auto pb-20 px-4 md:px-0">
    <div class="mb-8">
      <h2 class="text-3xl font-bold text-[#4e0d05]">
        Gestión de Kits & Suscripciones
      </h2>
      <p class="text-[#4e0d05]/60">Administrá los pedidos de cajas mensuales.</p>
    </div>

    <div v-if="loading" class="flex justify-center py-10">
      <AppLoader />
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
        <!-- cards mobile-->
        <div class="md:hidden p-4 space-y-4">
          <div
            v-for="sub in subscriptions"
            :key="sub.id"
            class="bg-[#f6f6eb] border border-[#4e0d05]/20 rounded-2xl p-4 shadow-sm"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="text-[#4e0d05]">
                <p class="text-xs opacity-70">
                  {{ formatDate(sub.created_at) }}
                </p>
                <p class="font-bold text-lg leading-tight">
                  {{ sub.full_name }}
                </p>
                <p class="text-xs opacity-60">{{ sub.email }}</p>
              </div>

              <span
                class="px-3 py-1 rounded-full text-xs font-bold border whitespace-nowrap"
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
              <p class="text-sm">{{ sub.address }}</p>
              <p class="text-xs opacity-60">
                {{ sub.city }} (CP {{ sub.zip_code }})
              </p>
            </div>

            <div class="mt-3">
              <a
                :href="getWhatsAppLink(sub.phone, sub.full_name)"
                target="_blank"
                class="inline-flex items-center gap-2 text-[#3c490b] font-semibold hover:underline"
              >
                <span>📞</span> {{ sub.phone }}
              </a>
            </div>

            <div class="mt-4 flex items-center justify-end gap-2">
              <template v-if="processingId !== sub.id">
                <button
                  v-if="sub.status === 'pending' || sub.status === 'cancelled'"
                  @click="changeStatus(sub, 'active')"
                  class="px-3 py-2 rounded-xl bg-[#3c490b] text-white text-sm font-semibold hover:bg-[#4e0d05] transition"
                  title="Marcar como pagado/activo"
                >
                  Confirmar
                </button>

                <button
                  v-if="sub.status !== 'cancelled'"
                  @click="changeStatus(sub, 'cancelled')"
                  class="px-3 py-2 rounded-xl border border-[#e099a8] text-[#e099a8] text-sm font-semibold hover:bg-[#e099a8] hover:text-white transition"
                  title="Cancelar suscripción"
                >
                  ✕
                </button>
              </template>

              <span v-else class="text-sm text-[#4e0d05]/50">Procesando...</span>
            </div>
          </div>
        </div>

        <!-- tabla escritorio -->
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
                <th class="p-4 font-bold">Estado</th>
                <th class="p-4 font-bold text-right">Acciones</th>
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
                  <p class="text-xs opacity-60">{{ sub.email }}</p>
                </td>

                <td class="p-4 max-w-xs">
                  <p>{{ sub.address }}</p>
                  <p class="text-xs opacity-60">
                    {{ sub.city }} (CP {{ sub.zip_code }})
                  </p>
                </td>

                <td class="p-4">
                  <a
                    :href="getWhatsAppLink(sub.phone, sub.full_name)"
                    target="_blank"
                    class="inline-flex items-center gap-1 text-[#3c490b] font-semibold hover:underline"
                  >
                    <span>📞</span> {{ sub.phone }}
                  </a>
                </td>

                <td class="p-4">
                  <span
                    class="px-3 py-1 rounded-full text-xs font-bold border"
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

                <td class="p-4 text-right">
                  <div class="flex justify-end gap-2" v-if="processingId !== sub.id">
                    <button
                      v-if="sub.status === 'pending' || sub.status === 'cancelled'"
                      @click="changeStatus(sub, 'active')"
                      class="px-3 py-1 rounded-lg bg-[#3c490b] text-white text-xs font-semibold hover:bg-[#4e0d05] transition"
                      title="Marcar como pagado/activo"
                    >
                      Confirmar
                    </button>

                    <button
                      v-if="sub.status !== 'cancelled'"
                      @click="changeStatus(sub, 'cancelled')"
                      class="px-3 py-1 rounded-lg border border-[#e099a8] text-[#e099a8] text-xs font-semibold hover:bg-[#e099a8] hover:text-white transition"
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
</template>
