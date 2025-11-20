<script>
import AppH1 from "../components/AppH1.vue";
import { getCurrentUser } from "../services/auth.js";
import * as opciones from "../data/preferences-options.js";
import { savePreferencesForUser } from "../services/preferences.js";

export default {
  name: "OnboardingQuestions",
  components: { AppH1 },

  data() {
    return {
      answers: { //rtas del usuario
        gusto: null,
        como: null,
        intensidad: null,
        sabores: [],
        frecuencia: null,
        con_quien: null,
        temas: [],
      },
      //opciones
      gustoOpc: opciones.gustoOpc,
      comoOpc: opciones.comoOpc,
      intensidadOpc: opciones.intensidadOpc,
      saboresOpc: opciones.saboresOpc,
      frecuenciaOpc: opciones.frecuenciaOpc,
      conQuienOpc: opciones.conQuienOpc,
      temasOpc: opciones.temasOpc,

      saving: false,
    };
  },

  methods: {
    chipClass(selected) {
      return [
        "px-3 py-1 rounded-full border transition-all duration-200",
        selected
          ? "bg-[#e099a8] text-white border-[#e099a8]"
          : "bg-[#f6f6eb] text-[#3c490b] border-[#3c490b]",
      ].join(" ");
    },

    toggleSabor(val) {
      const i = this.answers.sabores.indexOf(val);
      if (i === -1) this.answers.sabores.push(val);
      else this.answers.sabores.splice(i, 1);
    },

    toggleTema(val) {
      const i = this.answers.temas.indexOf(val);
      if (i === -1) this.answers.temas.push(val);
      else this.answers.temas.splice(i, 1);
    },

    async saveAnswers() {
      this.saving = true;
      try {
        const user = await getCurrentUser();
        if (!user) throw new Error("Usuario no encontrado");

        const plain = JSON.parse(JSON.stringify(this.answers));
        await savePreferencesForUser(user.id, plain);

        this.$router.push("/mi-perfil");
      } catch (err) {
        console.error("Error guardando preferencias", err);
      } finally {
        this.saving = false;
      }
    },

    async skip() {
      this.saving = true;
      try {
        const user = await getCurrentUser();
        if (!user) throw new Error("Usuario no encontrado");

        /* guardo todo vacio por si aprieto "saltar" */
        await savePreferencesForUser(user.id, {
          gusto: null,
          como: null,
          intensidad: null,
          sabores: [],
          frecuencia: null,
          con_quien: null,
          temas: [],
        });

        this.$router.push("/mi-perfil");
      } catch (err) {
        console.error("Error al saltar preferencias", err);
      } finally {
        this.saving = false;
      }
    },
  },
};
</script>

<template>
  <section class="relative min-h-screen flex flex-col items-center px-6 py-20 bg-[#f6f6eb]">
    <img
      src="/icono1.png"
      class="hidden md:block absolute top-8 left-2 md:left-10 w-10 md:w-14 opacity-100 rotate-12"
    />
    <img
      src="/icono2.png"
      class="hidden md:block absolute top-1/4 right-3 md:right-10 w-8 md:w-10 opacity-100 -rotate-6"
    />
    <img
      src="/icono3.png"
      class="hidden md:block absolute top-1/2 left-4 md:left-10 w-14 md:w-20 opacity-100 rotate-3"
    />
    <img
      src="/icono6.png"
      class="hidden md:block absolute top-[70%] right-4 md:right-16 w-12 md:w-18 opacity-100 rotate-6"
    />
    <img
      src="/icono1.png"
      class="hidden md:block absolute bottom-[10%] right-2 md:right-12 w-10 md:w-14 opacity-100 rotate-12"
    />
    <img
      src="/icono2.png"
      class="hidden md:block absolute top-[60%] left-4 md:left-10 w-6 md:w-10 opacity-100 rotate-6"
    />
    <img
      src="/icono6.png"
      class="hidden md:block absolute bottom-[40%] right-4 md:right-8 w-14 md:w-20 opacity-100 rotate-6"
    />
    <img
      src="/icono7.png"
      class="hidden md:block absolute top-[85%] left-2 md:left-10 w-12 md:w-18 opacity-100 rotate-3"
    />

    <form
      @submit.prevent="saveAnswers"
      class="w-full max-w-3xl bg-[#ede8d7] border border-[#4e0d05]/25 rounded-[30px] shadow-xl pt-10 pb-12 px-0 md:px-0 z-10"
    >
      <!-- Sección 1 -->
      <div class="px-8 md:px-10 space-y-12">
        <div>
          <h3 class="font-semibold text-[#3c490b] text-lg mb-4">
            ¿Qué tipo de vino va más con vos?
          </h3>

          <div class="flex flex-wrap gap-3">
            <button
              v-for="opt in gustoOpc"
              :key="opt.value"
              type="button"
              @click="answers.gusto = opt.value"
              :class="chipClass(answers.gusto === opt.value)"
            >
              <span v-html="opt.label"></span>
            </button>
          </div>

          <h4 class="mt-6 font-semibold text-[#3c490b] text-lg">
            ¿Cómo te gusta disfrutar el vino?
          </h4>

          <div class="flex flex-wrap gap-3 mt-3">
            <button
              v-for="opt in comoOpc"
              :key="opt.value"
              type="button"
              @click="answers.como = opt.value"
              :class="chipClass(answers.como === opt.value)"
            >
              {{ opt.label }}
            </button>
          </div>
        </div>
      </div>

      <img src="/lineacuadros.png" class="w-full block my-10" />

      <!-- Sección 2 -->
      <div class="px-8 md:px-10 space-y-12">
        <div>
          <h3 class="font-semibold text-[#3c490b] text-lg mb-4">
            Si tu vino ideal fuera una persona, sería…
          </h3>

          <div class="flex flex-wrap gap-3">
            <button
              v-for="opt in intensidadOpc"
              :key="opt.value"
              type="button"
              @click="answers.intensidad = opt.value"
              :class="chipClass(answers.intensidad === opt.value)"
            >
              {{ opt.label }}
            </button>
          </div>

          <h4 class="mt-6 font-semibold text-[#3c490b] text-lg">
            ¿Qué sabores te atraen más?
          </h4>

          <div class="flex flex-wrap gap-3 mt-3">
            <button
              v-for="opt in saboresOpc"
              :key="opt.value"
              type="button"
              @click="toggleSabor(opt.value)"
              :class="chipClass(answers.sabores.includes(opt.value))"
            >
              {{ opt.label }}
            </button>
          </div>
        </div>
      </div>

      <img src="/lineacuadros.png" class="w-full block my-10" />

      <!-- Sección 3 -->
      <div class="px-8 md:px-10 space-y-12">
        <div>
          <h3 class="font-semibold text-[#3c490b] text-lg mb-4">
            ¿Cada cuánto tomás vino?
          </h3>

          <div class="flex flex-wrap gap-3">
            <button
              v-for="opt in frecuenciaOpc"
              :key="opt.value"
              type="button"
              @click="answers.frecuencia = opt.value"
              :class="chipClass(answers.frecuencia === opt.value)"
            >
              {{ opt.label }}
            </button>
          </div>

          <h4 class="mt-6 font-semibold text-[#3c490b] text-lg">
            ¿Con quién compartís más el vino?
          </h4>

          <div class="flex flex-wrap gap-3 mt-3">
            <button
              v-for="opt in conQuienOpc"
              :key="opt.value"
              type="button"
              @click="answers.con_quien = opt.value"
              :class="chipClass(answers.con_quien === opt.value)"
            >
              {{ opt.label }}
            </button>
          </div>
        </div>
      </div>

      <img src="/lineacuadros.png" class="w-full block my-10" />

      <!-- Sección 4 -->
      <div class="px-8 md:px-10 space-y-12">
        <div>
          <h3 class="font-semibold text-[#3c490b] text-lg mb-4">
            ¿Qué temas del mundo del vino te gustaría ver en NYSO?
          </h3>

          <div class="flex flex-wrap gap-3">
            <button
              v-for="opt in temasOpc"
              :key="opt.value"
              type="button"
              @click="toggleTema(opt.value)"
              :class="chipClass(answers.temas.includes(opt.value))"
            >
              {{ opt.label }}
            </button>
          </div>
        </div>
      </div>

      <!-- Botones -->
      <div class="px-8 md:px-10 mt-12 flex flex-col sm:flex-row justify-between items-center gap-4">
        <button
          type="button"
          @click="skip"
          class="w-full sm:w-auto px-6 py-2 rounded-full border border-[#4e0d05] 
                 text-[#4e0d05] hover:bg-[#4e0d05] hover:text-[#f6f6eb] 
                 transition-all font-medium text-center"
        > 
          Saltar
        </button>

        <button
          type="submit"
          class="w-full sm:w-auto px-6 py-2 rounded-full bg-[#e099a8] text-[#3c490b] 
                 font-bold hover:bg-[#3c490b] hover:text-[#f6f6f6] transition-all 
                 text-center shadow-sm"
        >
          Guardar y continuar
        </button>
      </div>
    </form>
  </section>
</template>
