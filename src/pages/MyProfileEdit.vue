
<script>
import AppH1 from '../components/AppH1.vue';
import { getCurrentUser, updateAuthUserData } from '../services/auth.js';
import { getPreferencesForUser, savePreferencesForUser } from '../services/preferences.js';
import { updateUserProfile } from '../services/user-profiles.js';
import * as opciones from '../data/preferences-options.js';

export default {
  name: 'MyProfileEdit',
  components: { AppH1 },
  data() {
    return {
      display_name: '',
      answers: {
        gusto: '',
        como: '',
        intensidad: '',
        sabores: [],
        frecuencia: '',
        con_quien: '',
        temas: [],
        /* temas_libre: '', */
      },
      loading: false,
      ...opciones,
    };
  },
  methods: {
    chipClass(selected) {
      //clase dinamica, si esta seleccionado me lo pinta de rosa
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
    async handleSubmit() {
      try {
        this.loading = true;
        const user = await getCurrentUser();
        if (!user) throw new Error('Usuario no encontrado');
        // Guardar preferencias
        await savePreferencesForUser(user.id, this.answers);
        // Guardar nombre de usuario
        if (this.display_name) {
          await updateUserProfile(user.id, { display_name: this.display_name });
          await updateAuthUserData({ display_name: this.display_name });
        }
        this.$router.push('/mi-perfil');
      } catch (error) {
        console.error('[MyProfileEdit] Error al editar datos:', error);
        alert('Ocurrió un error al guardar los cambios. Intentá nuevamente.');
      }
      this.loading = false;
    },
  },
  async mounted() {
    const user = await getCurrentUser();
    if (user) {
      // Precargar nombre de usuario
      this.display_name = user.user_metadata?.display_name || user.display_name || '';
      // Cargar preferencias y asegurar valores por defecto
      const prefs = await getPreferencesForUser(user.id);
      if (prefs) {
        this.answers = {
          gusto: prefs.gusto ?? '',
          como: prefs.como ?? '',
          intensidad: prefs.intensidad ?? '',
          sabores: Array.isArray(prefs.sabores) ? prefs.sabores : [],
          frecuencia: prefs.frecuencia ?? '',
          con_quien: prefs.con_quien ?? '',
          temas: Array.isArray(prefs.temas) ? prefs.temas : [],
          /* temas_libre: prefs.temas_libre ?? '', */
        };
      }
    }
  },
};
</script>

<template>
  <section
    class="min-h-screen bg-[#f6f6eb] relative overflow-hidden flex flex-col items-center justify-start px-6 pt-16 pb-20"
  >
    
    <img src="/icono1.png" class="absolute top-10 left-12 w-14 rotate-12 opacity-100" />
    <img src="/icono2.png" class="absolute top-24 right-10 w-16 -rotate-6 opacity-100" />
    <img src="/icono6.png" class="absolute top-1/3 right-[12%] w-12 rotate-3 opacity-100" />
    <img src="/icono7.png" class="absolute bottom-[15%] left-[18%] w-14 opacity-100 -rotate-12" />


  
    <form @submit.prevent="handleSubmit" class="relative z-10 bg-[#ede8d7] border border-[#4e0d05]/20 rounded-3xl shadow-md p-10 w-full max-w-xl">
      <div class="space-y-6">
        <div>
          <label class="block text-[#4e0d05] text-sm font-semibold mb-2" for="display_name">
            Nombre de usuario
          </label>
          <input
            id="display_name"
            type="text"
            v-model="display_name"
            class="w-full rounded-2xl border border-[#4e0d05]/30 bg-[#f6f6eb] text-[#4e0d05] p-3 focus:ring-1 focus:ring-[#e099a8] outline-none"
          />
        </div>

        <div>
          <h3 class="font-semibold text-[#3c490b] mb-2">¿Qué tipo de vino va más con vos?</h3>
          <div class="flex gap-2 flex-wrap">
            <button type="button" v-for="opt in gustoOpc" :key="opt.value"
              @click="answers.gusto = opt.value"
              :class="chipClass(answers.gusto === opt.value)">
              <span v-html="opt.label"></span>
            </button>
          </div>

          <h4 class="mt-4 font-semibold text-[#3c490b]">¿Cómo te gusta disfrutar el vino?</h4>
          <div class="flex gap-2 flex-wrap mt-2">
            <button v-for="opt in comoOpc" :key="opt.value" type="button"
              @click="answers.como = opt.value"
              :class="chipClass(answers.como === opt.value)">
              {{ opt.label }}
            </button>
          </div>
        </div>

        <div>
          <h3 class="font-semibold text-[#3c490b] mb-2">Si tu vino ideal fuera una persona, sería…</h3>
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

        <div>
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
              @click="answers.con_quien = opt.value"
              :class="chipClass(answers.con_quien === opt.value)">
              {{ opt.label }}
            </button>
          </div>
        </div>

        <div>
          <h3 class="font-semibold text-[#3c490b] mb-2">¿Qué temas te interesan?</h3>
          <div class="flex gap-2 flex-wrap">
            <button v-for="opt in temasOpc" :key="opt.value" type="button"
              @click="toggleTema(opt.value)"
              :class="chipClass(answers.temas.includes(opt.value))">
              {{ opt.label }}
            </button>
          </div>
          <!-- <input
            v-model="answers.temas_libre"
            type="text"
            placeholder="Otro tema que te gustaría ver"
            class="w-full mt-2 rounded-2xl border border-[#4e0d05]/30 bg-[#f6f6eb] text-[#4e0d05] p-3 focus:ring-1 focus:ring-[#e099a8] outline-none"
          /> -->
        </div> 

        <div class="flex justify-center pt-4">
          <button
            type="submit"
            class="text-base font-medium rounded-full px-6 py-2 bg-[#e099a8] text-[#3c490b] border border-[#f6f6eb]/60 hover:bg-[#3c490b] hover:text-[#f6f6eb] transition-all duration-300"
            :disabled="loading"
          >
            Guardar cambios
          </button>
        </div>
      </div>
    </form>
  </section>
</template>