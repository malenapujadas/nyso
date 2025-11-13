
<script>
import { getPreferencesForUser } from '../services/preferences.js';
import { getUserProfileById } from '../services/user-profiles.js';
import { supabase } from '../services/supabase.js';

export default {
  name: 'UserProfile',
  data() {
    return {
      profile: null,
      preferences: null,
      loading: true,
      gustoOpc: {
        rosado: '🟪 Rosado',
        espumante: '🍾 Espumante',
        descubrir: '🤷‍♀️ Quiero descubrir',
      },
      comoOpc: {
        con_comida: '🍽️ Con comida',
        reuniones: '🎉 En reuniones',
        tranqui: '🌅 Tranqui',
        pareja: '❤️ En pareja',
      },
      intensidadOpc: {
        intenso: '💃 Intenso y con carácter',
        suave: '😌 Suave y relajado',
        equilibrado: '🤓 Equilibrado',
        sorprendente: '😜 Sorprendente',
      },
      saboresOpc: {
        frutales: 'Frutales 🍒',
        dulces: 'Dulces 🍯',
        acidos: 'Ácidos 🍋',
        terrosos: 'Terrosos 🌿',
        especiados: 'Especiados 🌶️',
      },
      frecuenciaOpc: {
        fines_semana: 'Casi todos los fines de semana',
        ocasiones: 'Solo en ocasiones especiales',
        descubriendo: 'Lo estoy descubriendo',
        fan: '¡Soy fan total!',
      },
      conQuienOpc: {
        amigos: 'Amigos 👯‍♀️',
        pareja: 'Pareja ❤️',
        familia: 'Familia 👨‍👩‍👧‍👦',
        solo: 'Solo 🍷',
      },
      temasOpc: {
        nuevas_bodegas: 'Nuevas bodegas 🏞️',
        maridajes: 'Maridajes 🍽️',
        tips: 'Tips para elegir 💡',
        experiencias: 'Experiencias y eventos 🎉',
      },
    };
  },
  async mounted() {
    try {
      const userId = this.$route.params.id;
      this.profile = await getUserProfileById(userId);
      this.preferences = await getPreferencesForUser(userId);
    } catch (error) {
      console.error('[UserProfile] Error al obtener datos:', error);
    } finally {
      this.loading = false;
    }
  }
};
</script>

<template>
  <section class="min-h-screen bg-[#f6f6eb] flex flex-col items-center px-6 py-16 relative overflow-hidden">
    
    <!-- Íconos  -->
    <img src="/icono1.png" class="absolute top-10 left-10 w-14 opacity-100 rotate-12" />
    <img src="/icono6.png" class="absolute bottom-20 right-12 w-22 opacity-100 -rotate-6" />
    <img src="/icono1.png" class="absolute top-1/5 right-20 w-14 opacity-100 rotate-12" />
    <img src="/icono3.png" class="absolute top-1/3 right-[8%] w-20 opacity-100 rotate-3" />
    <img src="/icono7.png" class="absolute bottom-[18%] left-[15%] w-25 opacity-100 -rotate-12" />


    <div class="w-full max-w-3xl z-10 bg-[#ede8d7] rounded-3xl shadow-lg p-8 border border-[#4e0d05]/20">
      <h1 class="text-3xl font-extrabold text-[#3c490b] mb-6 text-center">
        Perfil
      </h1>

      <div v-if="loading" class="text-center py-8 text-[#4e0d05]/70 italic">
        Cargando perfil...
      </div>

      <div v-else-if="!profile" class="text-center py-8 text-[#e099a8] font-semibold">
        Usuario no encontrado.
      </div>

      <div v-else class="space-y-6">
        <!-- info del usuario -->
        <div class="bg-[#f6f6eb] rounded-2xl p-6 shadow-sm border border-[#4e0d05]/10">
          <div class="flex flex-col items-center text-center">
            <!-- Imagen -->
            <img
              src="/nysito2.png"
              alt="Avatar"
              class="w-28 h-28 rounded-full object-cover border-4 border-[#e099a8]/70 mb-4 bg-white"
            />
            <h2 class="text-2xl font-bold text-[#4e0d05] mb-1">
              {{ profile.display_name || 'Sin nombre' }}
            </h2>
            <p class="text-sm text-[#4e0d05]/70">{{ profile.email }}</p>
          </div>
        </div>

    <!-- Preferencias del usuario -->
    <div
      v-if="preferences"
      class="rounded-2xl p-6 shadow-sm border border-[#4e0d05]/10 bg-[#ede8d7]/70"
    >
      <h3 class="text-xl font-semibold text-[#3c490b] mb-6 text-center">
        Preferencias personales
      </h3>

      <!-- MINI CARDS GRID -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">

        <!-- Tipo -->
        <div class="p-4 bg-[#f0eadb] rounded-xl border border-[#4e0d05]/10 shadow-sm">
          <p class="text-sm text-[#4e0d05]/70">Tipo de vino</p>
          <p class="font-semibold">{{ gustoOpc[preferences.gusto] || 'No respondido' }}</p>
        </div>

        <!-- Cómo lo toma -->
        <div class="p-4 bg-[#f0eadb] rounded-xl border border-[#4e0d05]/10 shadow-sm">
          <p class="text-sm text-[#4e0d05]/70">Cómo lo toma</p>
          <p class="font-semibold">{{ comoOpc[preferences.como] || 'No respondido' }}</p>
        </div>

        <!-- Intensidad -->
        <div class="p-4 bg-[#f0eadb] rounded-xl border border-[#4e0d05]/10 shadow-sm">
          <p class="text-sm text-[#4e0d05]/70">Intensidad</p>
          <p class="font-semibold">{{ intensidadOpc[preferences.intensidad] || 'No respondido' }}</p>
        </div>

        <!-- Sabores -->
        <div class="p-4 bg-[#f0eadb] rounded-xl border border-[#4e0d05]/10 shadow-sm">
          <p class="text-sm text-[#4e0d05]/70">Sabores</p>
          <p class="font-semibold">
            {{
              Array.isArray(preferences.sabores) && preferences.sabores.length
                ? preferences.sabores.map(s => saboresOpc[s] || s).join(', ')
                : 'No respondido'
            }}
          </p>
        </div>

        <!-- Frecuencia -->
        <div class="p-4 bg-[#f0eadb] rounded-xl border border-[#4e0d05]/10 shadow-sm">
          <p class="text-sm text-[#4e0d05]/70">Frecuencia</p>
          <p class="font-semibold">{{ frecuenciaOpc[preferences.frecuencia] || 'No respondido' }}</p>
        </div>

        <!-- Con quién -->
        <div class="p-4 bg-[#f0eadb] rounded-xl border border-[#4e0d05]/10 shadow-sm">
          <p class="text-sm text-[#4e0d05]/70">Con quién</p>
          <p class="font-semibold">{{ conQuienOpc[preferences.con_quien] || 'No respondido' }}</p>
        </div>

        <!-- Temas -->
        <div class="p-4 bg-[#f0eadb] rounded-xl border border-[#4e0d05]/10 shadow-sm sm:col-span-2">
          <p class="text-sm text-[#4e0d05]/70">Temas de interés</p>
          <p class="font-semibold">
            {{
              Array.isArray(preferences.temas) && preferences.temas.length
                ? preferences.temas.map(t => temasOpc[t] || t).join(', ')
                : 'No respondido'
            }}
          </p>
        </div>

        <!-- Otro tema -->
        <div class="p-4 bg-[#f0eadb] rounded-xl border border-[#4e0d05]/10 shadow-sm sm:col-span-2">
          <p class="text-sm text-[#4e0d05]/70">Otro tema</p>
          <p class="font-semibold">{{ preferences.temas_libre || 'No respondido' }}</p>
        </div>

      </div>
    </div>

        <div v-else class="text-center text-[#4e0d05]/60 italic">
          Este usuario aún no completó sus preferencias.
        </div>
      </div>
    </div>

  </section>
</template>
