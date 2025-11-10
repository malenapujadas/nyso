
<script>
import AppH1 from '../components/AppH1.vue';
import { supabase } from '../services/supabase.js';
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
        conQuien: null,
        temas: [],
        temas_libre: '',
      },
      gustos: [
        { value: 'tinto', label: '🟥 Tinto' },
        { value: 'blanco', label: '🟨 Blanco' },
        { value: 'rosado', label: '🟪 Rosado' },
        { value: 'espumante', label: '🍾 Espumante' },
        { value: 'descubrir', label: '🤷‍♀️ No sé, quiero descubrir' },
      ],
      como: [
        { value: 'con_comida', label: '🍽️ Con comida' },
        { value: 'reuniones', label: '🎉 En reuniones' },
        { value: 'tranqui', label: '🌅 Tranqui' },
        { value: 'pareja', label: '❤️ En pareja' },
      ],
      intensidad: [
        { value: 'intenso', label: '💃 Intenso y con carácter' },
        { value: 'suave', label: '😌 Suave y relajado' },
        { value: 'equilibrado', label: '🤓 Equilibrado' },
        { value: 'sorprendente', label: '😜 Sorprendente' },
      ],
      saboresOpc: [
        { value: 'frutales', label: 'Frutales 🍒' },
        { value: 'dulces', label: 'Dulces 🍯' },
        { value: 'acidos', label: 'Ácidos 🍋' },
        { value: 'terrosos', label: 'Terrosos 🌿' },
        { value: 'especiados', label: 'Especiados 🌶️' },
      ],
      frecuencia: [
        { value: 'fines_semana', label: 'Casi todos los fines de semana' },
        { value: 'ocasiones', label: 'Solo en ocasiones especiales' },
        { value: 'descubriendo', label: 'Lo estoy descubriendo' },
        { value: 'fan', label: '¡Soy fan total!' },
      ],
      conQuien: [
        { value: 'amigos', label: 'Amigos' },
        { value: 'pareja', label: 'Pareja' },
        { value: 'familia', label: 'Familia' },
        { value: 'solo', label: 'Solo' },
      ],
      temasOpc: [
        { value: 'nuevas_bodegas', label: 'Nuevas bodegas' },
        { value: 'maridajes', label: 'Maridajes' },
        { value: 'tips', label: 'Tips para elegir' },
        { value: 'experiencias', label: 'Experiencias y eventos' },
      ],
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
        const { data } = await supabase.auth.getUser();
        const user = data?.user;
        if (!user) throw new Error('Usuario no encontrado');

        // convertimos reactive -> POJO
        const plainPreferences = JSON.parse(JSON.stringify(this.answers));

        console.log('Saving preferences for user', user.id, plainPreferences);

        // guardamos en la tabla relacional
        const result = await savePreferencesForUser(user.id, user.email, plainPreferences);

        console.log('Preferences saved (user_preferences):', result);

        // opcional: mantener también user_profiles.preferences para retrocompatibilidad
        // await supabase.from('user_profiles').upsert([{ id: user.id, email: user.email, preferences: plainPreferences }], { returning: 'minimal' });

        this.$router.push('/mi-perfil');
      } catch (err) {
        console.error('Error guardando preferencias', err);
        const msg = err?.message || 'No se pudieron guardar las preferencias. Intentá de nuevo.';
        alert(msg);
      } finally {
        this.saving = false;
      }
    },

    async skip() {
      this.saving = true;
      try {
        const { data } = await supabase.auth.getUser();
        const user = data?.user;
        if (!user) throw new Error('Usuario no encontrado');

        const plainPreferences = { skipped: true };

        const result = await savePreferencesForUser(user.id, user.email, plainPreferences);
        console.log('Skip saved (user_preferences):', result);

        this.$router.push('/mi-perfil');
      } catch (err) {
        console.error(err);
        alert('Error al saltar. Intentá de nuevo.');
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
          <button type="button" v-for="opt in gustos" :key="opt.value"
            @click="answers.gusto = opt.value"
            :class="chipClass(answers.gusto === opt.value)">
            <span v-html="opt.label"></span>
          </button>
        </div>

        <h4 class="mt-4 font-semibold text-[#3c490b]">¿Cómo te gusta disfrutar el vino?</h4>
        <div class="flex gap-2 flex-wrap mt-2">
          <button v-for="opt in como" :key="opt.value" type="button"
            @click="answers.como = opt.value"
            :class="chipClass(answers.como === opt.value)">
            {{ opt.label }}
          </button>
        </div>
      </div>

      <!-- 2. Intensidad y sabor -->
      <div class="mb-6">
        <h3 class="font-semibold text-[#3c490b] mb-2">Si tu vino ideal fuera una persona, sería…</h3>
        <div class="flex gap-2 flex-wrap">
          <button v-for="opt in intensidad" :key="opt.value" type="button"
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
          <button v-for="opt in frecuencia" :key="opt.value" type="button"
            @click="answers.frecuencia = opt.value"
            :class="chipClass(answers.frecuencia === opt.value)">
            {{ opt.label }}
          </button>
        </div>

        <h4 class="mt-4 font-semibold text-[#3c490b]">¿Con quién compartís más el vino?</h4>
        <div class="flex gap-2 flex-wrap mt-2">
          <button v-for="opt in conQuien" :key="opt.value" type="button"
            @click="answers.conQuien = opt.value"
            :class="chipClass(answers.conQuien === opt.value)">
            {{ opt.label }}
          </button>
        </div>
      </div>

      <!-- 4. Comunidad -->
      <div class="mb-6">
        <h3 class="font-semibold text-[#3c490b] mb-2">¿Qué temas del mundo del vino te gustaría ver en NYSO?</h3>
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
