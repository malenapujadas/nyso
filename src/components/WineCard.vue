<script>
export default {
  name: "WineCard",
  props: {
    vino: {
      type: Object,
      required: true,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
  },
};
</script>

<template>
  <div
    class="border border-[#4e0d05]/60 bg-[#f6f6eb] p-4 flex flex-col justify-between items-center text-center hover:shadow-lg transition-all duration-300 min-h-[520px]"
  >
    <img
      :src="vino.imagen"
      :alt="vino.nombre"
      class="w-full h-60 object-contain mb-4"
    />

    <div class="flex flex-col flex-grow justify-between items-center w-full">
      <div>
        <h2
          class="text-xl font-bold text-[#4e0d05] mb-1 h-[52px] flex items-center justify-center leading-tight"
        >
          {{ vino.nombre }}
        </h2>

        <!-- PROMEDIO -->
        <div
          v-if="reviewCount > 0"
          class="flex items-center justify-center gap-1 mb-2"
        >
          <span class="text-[#e099a8] text-lg leading-none">★</span>
          <span class="text-[#4e0d05] font-semibold">
            {{ averageRating.toFixed(1) }}
          </span>
          <span class="text-xs text-[#4e0d05]/60">
            ({{ reviewCount }})
          </span>
        </div>

        <div v-else class="text-xs text-[#4e0d05]/50 mb-2">
          Sin calificaciones
        </div>

        <p class="text-[#4e0d05]/80 mb-1">
          <strong>Bodega:</strong> {{ vino.bodega }}
        </p>
        <p class="text-[#4e0d05]/80 mb-1">
          <strong>Tipo:</strong> {{ vino.tipo }}
        </p>
        <p class="text-[#4e0d05]/80 mb-1">
          <strong>Uva:</strong> {{ vino.uva }}
        </p>
        <p class="text-[#4e0d05]/80 mb-1">
          <strong>Región:</strong> {{ vino.region }}
        </p>
        <p class="text-[#3c490b] font-semibold mt-2">
          ${{ vino.precio_aproximado }}
        </p>
      </div>

      <RouterLink
        :to="{ name: 'detalle', params: { id: vino.id } }"
        class="mt-4 inline-block text-[#e099a8] text-sm font-semibold hover:text-[#3c490b] transition-all"
      >
        Ver detalle
      </RouterLink>
    </div>
  </div>
</template>