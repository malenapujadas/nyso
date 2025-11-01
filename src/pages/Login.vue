<script>
import AppH1 from '../components/AppH1.vue';
import { login } from '../services/auth.js';

export default {
  name: 'Login',
  components: { AppH1 },
  data() {
    return {
      user: {
        email: '',
        password: '',
      },
      loading: false,
      errorMsg: '',
    };
  },
  methods: {
    async handleSubmit() {
      this.errorMsg = '';
      try {
        this.loading = true;
        await login(this.user.email, this.user.password);
        this.$router.push('/mi-perfil');
      } catch (error) {
        this.errorMsg = 'Credenciales inválidas';
      }
      this.loading = false;
    },
  },
};
</script>

<template>
  <section
    class="min-h-screen flex flex-col items-center justify-start pt-16 bg-[#f6f6eb] relative overflow-hidden"
  >
    
    <img src="/icono1.png" class="absolute top-8 left-12 w-16 rotate-12 opacity-100" />
    <img src="/icono6.png" class="absolute bottom-16 right-16 w-18 -rotate-6 opacity-100" />
    <img src="/icono3.png" class="absolute top-1/3 left-[8%] w-14 rotate-6 opacity-100" />
    <img src="/icono3.png" class="absolute top-1/3 right-16 w-18 rotate-6 opacity-100" />
    <img src="/icono7.png" class="absolute bottom-[20%] left-[25%] w-16 opacity-100 -rotate-12" />


    <AppH1 class="text-[#3c490b] text-1xl mb-6 z-7">Ingresar a mi cuenta</AppH1>

   
    <form
      @submit.prevent="handleSubmit"
      class="relative z-10 w-full max-w-md bg-[#ede8d7] border border-[#4e0d05]/20 rounded-3xl shadow-md p-8 flex flex-col gap-6 text-left"
    >
      <div
        v-if="errorMsg"
        class="text-center text-[#4e0d05] font-semibold bg-[#e099a8]/20 border border-[#e099a8] rounded-full py-2"
      >
        {{ errorMsg }}
      </div>

    
      <div>
        <label for="email" class="block text-[#3c490b] text-sm font-bold mb-1">Email</label>
        <input
          id="email"
          type="email"
          placeholder="mail@gmail.com"
          v-model="user.email"
          class="w-full border border-[#e099a8] rounded-full py-2 px-4 text-[#4e0d05] placeholder-[#4e0d05]/60 focus:outline-none focus:ring-1 focus:ring-[#e099a8]"
        />
      </div>

     
      <div>
        <label for="password" class="block text-[#3c490b] text-sm font-bold mb-1">Contraseña</label>
        <input
          id="password"
          type="password"
          placeholder="••••••••"
          v-model="user.password"
          class="w-full border border-[#e099a8] rounded-full py-2 px-4 text-[#4e0d05] placeholder-[#4e0d05]/60 focus:outline-none focus:ring-1 focus:ring-[#e099a8]"
        />
      </div>

      
      <button
        type="submit"
        :disabled="loading"
        class="w-full rounded-full bg-[#e099a8] text-[#3c490b] font-semibold py-2.5 mt-2 shadow-md hover:bg-[#3c490b] hover:text-[#f6f6eb] transition-all duration-300"
      >
        {{ loading ? 'Ingresando...' : 'Ingresar' }}
      </button>

   
      <p class="text-center text-sm text-[#4e0d05]/70 mt-3">
        ¿Todavía no tenés cuenta?
        <RouterLink
          to="/crear-cuenta"
          class="text-[#e099a8] font-semibold hover:text-[#3c490b] transition-colors"
        >
          Registrate acá
        </RouterLink>
      </p>
    </form>
  </section>
</template>
