<script>
import * as opciones from "../data/preferences-options.js";

export default {
  name: "ProfilePreferences",
  props: {
    preferences: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      gustoOpc: opciones.gustoOpc,
      comoOpc: opciones.comoOpc,
      intensidadOpc: opciones.intensidadOpc,
      saboresOpc: opciones.saboresOpc,
      frecuenciaOpc: opciones.frecuenciaOpc,
      conQuienOpc: opciones.conQuienOpc,
      temasOpc: opciones.temasOpc,
    };
  },
};
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div
      class="p-4 rounded-xl bg-[#f0eadb] border border-[#4e0d05]/10 shadow-sm"
    >
      <p class="text-sm text-[#4e0d05]/70">Preferencia de vino</p>
      <p class="font-semibold">
        {{
          gustoOpc.find((opt) => opt.value === preferences.gusto)?.label ||
          "No respondido"
        }}
      </p>
    </div>

    <div
      class="p-4 rounded-xl bg-[#f0eadb] border border-[#4e0d05]/10 shadow-sm"
    >
      <p class="text-sm text-[#4e0d05]/70">¿Cómo lo tomás?</p>
      <p class="font-semibold">
        {{
          comoOpc.find((opt) => opt.value === preferences.como)?.label ||
          "No respondido"
        }}
      </p>
    </div>

    <div
      class="p-4 rounded-xl bg-[#f0eadb] border border-[#4e0d05]/10 shadow-sm"
    >
      <p class="text-sm text-[#4e0d05]/70">Intensidad</p>
      <p class="font-semibold">
        {{
          intensidadOpc.find((opt) => opt.value === preferences.intensidad)
            ?.label || "No respondido"
        }}
      </p>
    </div>

    <div
      class="p-4 rounded-xl bg-[#f0eadb] border border-[#4e0d05]/10 shadow-sm"
    >
      <p class="text-sm text-[#4e0d05]/70">Sabores preferidos</p>
      <p class="font-semibold">
        {{
          Array.isArray(preferences.sabores) && preferences.sabores.length
            ? preferences.sabores
                .map(
                  (s) => saboresOpc.find((opt) => opt.value === s)?.label || s
                )
                .join(", ")
            : "No respondido"
        }}
      </p>
    </div>

    <div
      class="p-4 rounded-xl bg-[#f0eadb] border border-[#4e0d05]/10 shadow-sm"
    >
      <p class="text-sm text-[#4e0d05]/70">Frecuencia</p>
      <p class="font-semibold">
        {{
          frecuenciaOpc.find((opt) => opt.value === preferences.frecuencia)
            ?.label || "No respondido"
        }}
      </p>
    </div>

    <div
      class="p-4 rounded-xl bg-[#f0eadb] border border-[#4e0d05]/10 shadow-sm"
    >
      <p class="text-sm text-[#4e0d05]/70">Con quién</p>
      <p class="font-semibold">
        {{
          conQuienOpc.find((opt) => opt.value === preferences.con_quien)
            ?.label || "No respondido"
        }}
      </p>
    </div>

    <div
      class="p-4 rounded-xl bg-[#f0eadb] border border-[#4e0d05]/10 shadow-sm col-span-full"
    >
      <p class="text-sm text-[#4e0d05]/70">Temas que te interesan</p>
      <p class="font-semibold">
        {{
          Array.isArray(preferences.temas) && preferences.temas.length
            ? preferences.temas
                .map((t) => temasOpc.find((opt) => opt.value === t)?.label || t)
                .join(", ")
            : "No respondido"
        }}
      </p>
    </div>
  </div>
</template>