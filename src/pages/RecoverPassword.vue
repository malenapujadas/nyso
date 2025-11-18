<script>
import { recoverPassword } from '../services/auth.recovery.js';
import AppH1 from '../components/AppH1.vue';


export default {
  name: 'RecuperarContrasena',
  components: { AppH1 },
  data() {
    return {
      email: '',
      status: 'idle', 
      errorMessage: null,
    };
  },

  methods: {
    async enviarCorreo() {
      this.status = 'loading';
      this.errorMessage = null;

      const result = await recoverPassword(this.email);

      if (!result.ok) {
        if (result.reason === 'not_registered') {
          this.errorMessage = 'No estás registrado. Creá tu cuenta.';
          this.status = 'error';
          setTimeout(() => this.$router.push('/ingresar'), 5000);
          return;
        }

        if (result.reason === 'supabase_error') {
          this.errorMessage = result.message;
          this.status = 'error';
          return;
        }
      }

      this.status = 'success';
    }
  }
};
</script>

<template>
  <section
    class="min-h-screen flex flex-col items-center justify-start 
           pt-16 md:pt-20 bg-[#f6f6eb] relative overflow-hidden"
  >

    <img src="/icono1.png" class="absolute top-6 left-4 w-8 md:w-16 rotate-12 opacity-100" />
    <img src="/icono6.png" class="absolute bottom-20 right-4 w-10 md:w-18 -rotate-6 opacity-100" />
    <img src="/icono3.png" class="absolute top-24 left-3 w-8 md:w-14 rotate-6 opacity-100" />
    <img src="/icono3.png" class="absolute top-36 right-6 w-10 md:w-18 rotate-6 opacity-100" />
    <img src="/icono7.png" class="absolute bottom-[30%] left-[12%] w-10 md:w-16 opacity-100 -rotate-12" />

    <AppH1 class="text-[#3c490b] text-2xl md:text-3xl mb-4 z-10 text-center px-6 leading-tight">
      Recuperar contraseña
    </AppH1>

    <p class="pb-4 px-6 text-sm md:text-base text-[#3c490b]/70 font-bold text-center max-w-md">
      Ingresá tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
    </p>

    <form
      @submit.prevent="enviarCorreo"
      class="relative z-10 w-[92%] max-w-md bg-[#ede8d7] border border-[#4e0d05]/20 
             rounded-2xl md:rounded-3xl shadow-md p-6 md:p-8 
             flex flex-col gap-6 text-left mt-4"
    >
      <div>
        <label 
          for="email" 
          class="block text-[#3c490b] text-xs md:text-sm font-bold mb-1"
        >
          Mail
        </label>

        <input
          id="email"
          v-model="email"
          type="email"
          placeholder="mail@gmail.com"
          required
          class="w-full border border-[#e099a8] rounded-full py-2 px-4 text-sm md:text-base
                text-[#4e0d05] placeholder-[#4e0d05]/60 
                focus:outline-none focus:ring-1 focus:ring-[#e099a8]"
        />
      </div>

      <button 
        type="submit"
        class="w-full rounded-full bg-[#e099a8] text-[#3c490b] font-semibold 
               py-2.5 text-sm md:text-base mt-2 shadow-md 
               hover:bg-[#3c490b] hover:text-[#f6f6eb] 
               transition-all duration-300"
        :disabled="status === 'loading'"
      >
        {{ status === 'loading' ? 'Enviando...' : 'Enviar mail'  }}
      </button>
    </form>

    <p v-if="status === 'success'" class="success text-center mt-6 px-4">
      Revisá tu correo: te enviamos un enlace.
    </p>

    <p v-if="status === 'error'" class="error text-center mt-6 px-4">
      {{ errorMessage }}
    </p>

  </section>
</template>
