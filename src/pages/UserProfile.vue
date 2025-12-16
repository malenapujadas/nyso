<script>
import { getPreferencesForUser } from "../services/preferences.js";
import { getUserProfileById } from "../services/user-profiles.js";
import AppLoader from "../components/AppLoader.vue";
import ProfilePreferences from "../components/ProfilePreferences.vue";

export default {
  name: "UserProfile",
  components: { AppLoader, ProfilePreferences },

  data() {
    return {
      profile: null,
      preferences: null,
      loading: true,
    };
  },

  async mounted() {
    try {
      const userId = this.$route.params.id;
      this.profile = await getUserProfileById(userId);
      this.preferences = await getPreferencesForUser(userId);
    } catch (error) {
      console.error("[UserProfile] Error al obtener datos:", error);
    } finally {
      this.loading = false;
    }
  },
};
</script>

<template>
  <template v-if="!loading">
    <section
      class="min-h-screen bg-[#f6f6eb] flex flex-col items-center px-6 py-16 relative overflow-hidden"
    >
      <img
        src="/icono1.png"
        alt=""
        class="absolute top-10 left-10 w-14 opacity-100 rotate-12"
      />
      <img
        src="/icono6.png"
        alt=""
        class="absolute bottom-20 right-12 w-22 opacity-100 -rotate-6"
      />
      <img
        src="/icono1.png"
        alt=""
        class="absolute top-1/5 right-20 w-14 opacity-100 rotate-12"
      />
      <img
        src="/icono3.png"
        alt=""
        class="absolute top-1/3 right-[8%] w-20 opacity-100 rotate-3"
      />
      <img
        src="/icono7.png"
        alt=""
        class="absolute bottom-[18%] left-[15%] w-25 opacity-100 -rotate-12"
      />

      <div
        class="w-full max-w-3xl z-10 bg-[#ede8d7] rounded-3xl shadow-lg p-8 border border-[#4e0d05]/20"
      >
        <h1 class="text-3xl font-extrabold text-[#3c490b] mb-6 text-center">
          Perfil
        </h1>

        <div v-if="loading" class="text-center py-8 text-[#4e0d05]/70 italic">
          Cargando perfil...
        </div>

        <div
          v-else-if="!profile"
          class="text-center py-8 text-[#e099a8] font-semibold"
        >
          Usuario no encontrado.
        </div>

        <div v-else class="space-y-6">
          <div
            class="bg-[#f6f6eb] rounded-2xl p-6 shadow-sm border border-[#4e0d05]/10"
          >
            <div class="flex flex-col items-center text-center">
              <img
                src="/nysito2.png"
                alt="MYSITO"
                class="w-28 h-28 rounded-full object-cover border-4 border-[#e099a8]/70 mb-4 bg-white"
              />
              <h2 class="text-2xl font-bold text-[#4e0d05] mb-1">
                {{ profile.display_name || "Sin nombre" }}
              </h2>
              <p class="text-sm text-[#4e0d05]/70">{{ profile.email }}</p>
            </div>
          </div>

          <div class="w-full flex justify-center mt-4"></div>

          <div
            v-if="preferences"
            class="rounded-2xl p-6 shadow-sm border border-[#4e0d05]/10 bg-[#ede8d7]/70"
          >
            <h3 class="text-xl font-semibold text-[#3c490b] mb-6 text-center">
              Preferencias personales
            </h3>
            <ProfilePreferences :preferences="preferences" />
          </div>
        </div>
      </div>
    </section>
  </template>

  <template v-else>
    <div class="w-full min-h-screen flex items-center justify-center">
      <AppLoader />
    </div>
  </template>
</template>
