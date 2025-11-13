
<script>
import AppH1 from '../components/AppH1.vue';
import { getCurrentUser } from '../services/auth.js';
import * as opciones from '../data/preferences-options.js';
import { savePreferencesForUser } from '../services/preferences.js';

export default {
  name: 'OnboardingQuestions',
  components: { AppH1 },
  data() {
    return {
      answers: {
        gusto: null,
        como: null,
        intensidad: null,
        sabores: [],
        frecuencia: null,
        con_quien: null,
        temas: [],
        temas_libre: '',
      },
      ...opciones,
      saving: false,
    };
  },
  methods: {
    chipClass(selected) {
      return [
        'px-3 py-1 rounded-full border',
        selected ? 'bg-[#e099a8] text-white' : 'bg-white text-[#3c490b]'
      ].join(' ');
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
        if (!user) throw new Error('Usuario no encontrado');
        // convertimos reactive -> POJO
        const plainPreferences = JSON.parse(JSON.stringify(this.answers));
        console.log('Guardando preferencias del usuario', user.id, plainPreferences);
        // guardamos en la tabla relacional
        const result = await savePreferencesForUser(user.id, plainPreferences);
        console.log('Preferencias guardadas (user_preferences):', result);
        this.$router.push('/mi-perfil');
      } catch (err) {
        console.error('Error guardando preferencias', err);
      } finally {
        this.saving = false;
      }
    },

    async skip() {
      this.saving = true;
      try {
        const user = await getCurrentUser();
        if (!user) throw new Error('Usuario no encontrado');
        const plainPreferences = { skipped: true };
        await savePreferencesForUser(user.id, plainPreferences);
        this.$router.push('/mi-perfil');
      } catch (err) {
        console.error('Error al saltar preferencias', err);
      } finally {
        this.saving = false;
      }
    }
  }
};
</script>

<template>
  <section class="min-h-screen flex flex-col items-center pt-16 bg-[#f6f6eb]">
    <AppH1 class="text-[#3c490b] text-2xl mb-4">Contanos tus gustos</AppH1>

    <form @submit.prevent="saveAnswers" class="w-full max-w-2xl bg-[#ede8d7] p-6 rounded-2xl shadow-md">
      <!-- 1. Gusto general -->
      <div class="mb-6">
        <h3 class="font-semibold text-[#3c490b] mb-2">¿Qué tipo de vino va más con vos?</h3>
        <div class="flex gap-2 flex-wrap">
          <button type="button" v-for="opt in gustoOpc" :key="opt.value"
            @click="answers.gusto = opt.value"
            :class="chipClass(answers.gusto === opt.value)">
            <span v-html="opt.label"></span>
          </button>
        </div>

        <h4 class="mt-4 font-semibold text-[#3c490b]">¿Cómo preferís disfrutarlo?</h4>
        <div class="flex gap-2 flex-wrap mt-2">
          <button v-for="opt in comoOpc" :key="opt.value" type="button"
            @click="answers.como = opt.value"
            :class="chipClass(answers.como === opt.value)">
            {{ opt.label }}
          </button>
        </div>
      </div>

      <!-- 2. Intensidad y sabor -->
      <div class="mb-6">
        <h3 class="font-semibold text-[#3c490b] mb-2">¿Qué tipo de intensidad disfrutás en un vino?</h3>
        <div class="flex gap-2 flex-wrap">
          <button v-for="opt in intensidadOpc" :key="opt.value" type="button"
            @click="answers.intensidad = opt.value"
            :class="chipClass(answers.intensidad === opt.value)">
            {{ opt.label }}
          </button>
        </div>

        <h4 class="mt-4 font-semibold text-[#3c490b]">¿Qué sabores te atraen más?</h4>
        <div class="flex gap-2 flex-wrap mt-2">
          <button v-for="opt in saboresOpc" :key="opt.value" type="button"
            @click="toggleSabor(opt.value)"
            :class="chipClass(answers.sabores.includes(opt.value))">
            {{ opt.label }}
          </button>
        </div>
      </div>

      <!-- 3. Contexto -->
      <div class="mb-6">
        <h3 class="font-semibold text-[#3c490b] mb-2">¿Cada cuánto tomás vino?</h3>
        <div class="flex gap-2 flex-wrap">
          <button v-for="opt in frecuenciaOpc" :key="opt.value" type="button"
            @click="answers.frecuencia = opt.value"
            :class="chipClass(answers.frecuencia === opt.value)">
            {{ opt.label }}
          </button>
        </div>

        <h4 class="mt-4 font-semibold text-[#3c490b]">¿Con quién compartís más el vino?</h4>
        <div class="flex gap-2 flex-wrap mt-2">
          <button v-for="opt in conQuienOpc" :key="opt.value" type="button"
            @click="answers.conQuien = opt.value"
            :class="chipClass(answers.conQuien === opt.value)">
            {{ opt.label }}
          </button>
        </div>
      </div>

      <!-- 4. Comunidad -->
      <div class="mb-6">
        <h3 class="font-semibold text-[#3c490b] mb-2">¿Qué temas te interesan?</h3>
        <div class="flex gap-2 flex-wrap">
          <button v-for="opt in temasOpc" :key="opt.value" type="button"
            @click="toggleTema(opt.value)"
            :class="chipClass(answers.temas.includes(opt.value))">
            {{ opt.label }}
          </button>
        </div>

        <label class="block text-sm mt-3 text-[#3c490b]">Otro (decime más):</label>
        <input v-model="answers.temas_libre" placeholder="Escribí un tema..." class="w-full rounded-full py-2 px-3 mt-2 border" />
      </div>

      <div class="flex items-center justify-between gap-3">
        <button 
          type="button" 
          @click="skip" 
          class="px-4 py-2 rounded-full border"
          >
          Saltar
        </button>
        <div class="flex gap-2">
          <button 
            type="submit" 
            class="px-4 py-2 rounded-full bg-[#e099a8] text-[#3c490b] font-semibold"
            >
            Guardar y continuar
          </button>
        </div>
      </div>
    </form>
  </section>
</template>
