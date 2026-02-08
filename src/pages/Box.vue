<script>
import AppH1 from "../components/AppH1.vue";

export default {
  name: "Box",
  components: { AppH1 },
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

          <!-- boton comprar-->
          <div class="mt-7 flex flex-col sm:flex-row gap-3">
            <button
              class="px-6 py-3 rounded-full bg-[#4e0d05] text-[#f6f6eb] font-semibold text-base hover:bg-[#3c490b] transition"
            >
              Comprar box mensual
            </button>
          </div>

          <!--  info -->
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

        <!-- Imágenes  -->
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

      <!-- que incluye-->
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
              Tips simples: cómo tomarlo, con qué comerlo y por qué vale la pena.
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
            class="px-6 py-3 rounded-full bg-[#e099a8] text-[#3c490b] font-semibold text-base hover:bg-[#3c490b] hover:text-[#f6f6eb] transition"
          >
            Suscribirme
          </button>
        </div>
        </div>
      </div>
    </div>
  </section>
</template>
