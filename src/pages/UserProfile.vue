<template>
  <section class="min-h-screen bg-[#f6f6eb] flex flex-col items-center px-6 py-16">
    <div class="w-full max-w-2xl">
      <h1 class="text-3xl font-bold mb-6 text-[#3c490b]">Perfil público</h1>
      <div v-if="loading" class="text-center py-8">Cargando...</div>
      <div v-else-if="!profile" class="text-center py-8 text-[#e099a8]">Usuario no encontrado.</div>
      <div v-else class="bg-white rounded-lg shadow p-6">
        <p class="mb-2"><strong>Nombre:</strong> {{ profile.display_name || 'Sin nombre' }}</p>
        <p class="mb-2"><strong>Email:</strong> {{ profile.email }}</p>
        <div v-if="preferences">
          <h2 class="font-semibold mt-4 mb-2">Preferencias</h2>
          <p><strong>Preferencia de vino:</strong> {{ gustoOpc[preferences.gusto] || 'No respondido' }}</p>
          <p><strong>¿Cómo preferís tomar vino?</strong> {{ comoOpc[preferences.como] || 'No respondido' }}</p>
          <p><strong>Intensidad:</strong> {{ intensidadOpc[preferences.intensidad] || 'No respondido' }}</p>
          <p><strong>Sabores:</strong> {{ Array.isArray(preferences.sabores) && preferences.sabores.length ? preferences.sabores.map(s => saboresOpc[s] || s).join(', ') : 'No respondido' }}</p>
          <p><strong>¿Con qué frecuencia tomás vino?</strong> {{ frecuenciaOpc[preferences.frecuencia] || 'No respondido' }}</p>
          <p><strong>¿Con quién solés tomar vino?</strong> {{ conQuienOpc[preferences.con_quien] || 'No respondido' }}</p>
          <p><strong>¿Qué temas te interesan?</strong> {{ Array.isArray(preferences.temas) && preferences.temas.length ? preferences.temas.map(t => temasOpc[t] || t).join(', ') : 'No respondido' }}</p>
          <p><strong>Otro tema que te gustaría ver:</strong> {{ preferences.temas_libre || 'No respondido' }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { getPreferencesForUser } from '../services/preferences.js';
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
        descubrir: '🤷‍♀️ No sé, quiero descubrir',
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
        amigos: 'Amigos',
        pareja: 'Pareja',
        familia: 'Familia',
        solo: 'Solo',
      },
      temasOpc: {
        nuevas_bodegas: 'Nuevas bodegas',
        maridajes: 'Maridajes',
        tips: 'Tips para elegir',
        experiencias: 'Experiencias y eventos',
      },
    };
  },
  async mounted() {
    const userId = this.$route.params.id;
    if (!userId) {
      this.loading = false;
      return;
    }
    // Obtener perfil
    const { data, error } = await supabase
      .from('user_profiles')
      .select('id, display_name, email')
      .eq('id', userId)
      .single();
    if (data) {
      this.profile = data;
      this.preferences = await getPreferencesForUser(userId);
    }
    this.loading = false;
  },
};
</script>
