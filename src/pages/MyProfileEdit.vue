<script>
import AppH1 from '../components/AppH1.vue';
import { subscribeToAuthChanges, updateAuthUserData } from '../services/auth.js';

export default {
  name: 'MyProfileEdit',
  components: { AppH1 },
  data() {
    return {
      formData: {
        display_name: '',
        vino: '',
      },
      loading: false,
    };
  },
  methods: {
    async handleSubmit() {
      try {
        this.loading = true;
        await updateAuthUserData(this.formData);
        this.$router.push('/mi-perfil');
      } catch (error) {
        console.error(error);
      }
      this.loading = false;
    },
  },
  mounted() {
    subscribeToAuthChanges((userState) => {
      this.formData = {
        display_name: userState.display_name ?? '',
        vino: userState.vino ?? '',
      };
    });
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


  
    <form
      @submit.prevent="handleSubmit"
      class="relative z-10 bg-[#ede8d7] border border-[#4e0d05]/20 rounded-3xl shadow-md p-10 w-full max-w-xl"
    >
      <div class="space-y-6">
        
        <div>
          <label class="block text-[#4e0d05] text-sm font-semibold mb-2" for="vino">
            Preferencia de vinos 🍷
          </label>
          <textarea
            id="vino"
            rows="3"
            v-model="formData.vino"
            class="w-full rounded-2xl border border-[#4e0d05]/30 bg-[#f6f6eb] text-[#4e0d05] p-3 focus:ring-1 focus:ring-[#e099a8] outline-none resize-none"
          ></textarea>
        </div>

    
        <div>
          <label class="block text-[#4e0d05] text-sm font-semibold mb-2" for="display_name">
            Nombre
          </label>
          <input
            id="display_name"
            type="text"
            v-model="formData.display_name"
            class="w-full rounded-2xl border border-[#4e0d05]/30 bg-[#f6f6eb] text-[#4e0d05] p-3 focus:ring-1 focus:ring-[#e099a8] outline-none"
          />
        </div>

        <div class="flex justify-center pt-4">
          <button
            type="submit"
            class="text-base font-medium rounded-full px-6 py-2 bg-[#e099a8] text-[#3c490b] border border-[#f6f6eb]/60 hover:bg-[#3c490b] hover:text-[#f6f6eb] transition-all duration-300"
          >
            Guardar cambios
          </button>
        </div>
      </div>
    </form>
  </section>
</template>
