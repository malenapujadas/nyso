<script>
import AppH1 from '../components/AppH1.vue';
import { register } from '../services/auth.js';

export default {
  name: 'Register',
  components: { AppH1 },
  data() {
    return {
      user: {
        nombre:'',
        email: '',
        password: '',
        nacimiento: '',
      },
      loading: false,
      errorMsg: '',
    };
  },
  methods: {
    async handleSubmit() {
      this.errorMsg = '';

      if (!this.user.nacimiento) {
        this.errorMsg = 'Por favor, ingresá tu fecha de nacimiento.';
        return;
      }

      const nacimiento = new Date(this.user.nacimiento);
      const hoy = new Date();
      let edad = hoy.getFullYear() - nacimiento.getFullYear();
      const mes = hoy.getMonth() - nacimiento.getMonth();

      if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
      }

      if (edad < 18) {
        this.errorMsg = 'Debes ser mayor de 18 años para ingresar.';
        return;
      }

      try {
        this.loading = true;
        await register(this.user.email, this.user.password, this.user.nombre);
        this.$router.push('/preferencias');
      } catch (error) {
        this.errorMsg = 'No se pudo crear la cuenta';
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


    <AppH1 class="text-[#3c490b] text-3xl mb-6 z-10">Crear una cuenta</AppH1>


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

      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="nombre">
          Nombre
        </label>
      <input 
        class="shadow border rounded w-full py-2 px-3 text-gray-700" 
          id="nombre" 
          type="text" 
          placeholder="Tu nombre"
          v-model="user.nombre"
          />
      </div>
      <div>
        <label for="nacimiento" class="block text-[#3c490b] text-sm font-bold mb-1"
          >Fecha de Nacimiento</label
        >
        <input
          id="nacimiento"
          type="date"
          v-model="user.nacimiento"
          class="w-full border border-[#e099a8] rounded-full py-2 px-4 text-[#4e0d05] bg-white placeholder-[#4e0d05]/60 focus:outline-none focus:ring-1 focus:ring-[#e099a8]"
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
        <p class="text-xs text-[#4e0d05]/80 mt-1">
          * La contraseña debe contener mínimo 6 (seis) caracteres
        </p>
      </div>
      <button
        type="submit"
        :disabled="loading"
        class="w-full rounded-full bg-[#e099a8] text-[#3c490b] font-semibold py-2.5 mt-2 shadow-md hover:bg-[#3c490b] hover:text-[#f6f6eb] transition-all duration-300"
      >
        {{ loading ? 'Creando cuenta...' : 'Crear cuenta' }}
      </button>
      <p class="text-center text-sm text-[#4e0d05]/70 mt-3">
        ¿Ya tenés una cuenta?
        <RouterLink
          to="/ingresar"
          class="text-[#e099a8] font-semibold hover:text-[#3c490b] transition-colors"
        >
          Iniciá sesión
        </RouterLink>
      </p>
    </form>
  </section>
</template>
