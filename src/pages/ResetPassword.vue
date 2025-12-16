<script>
import { updatePassword } from "../services/auth.recovery.js";
import AppH1 from "../components/AppH1.vue";

export default {
  name: "ResetPassword",
  components: { AppH1 },

  data() {
    return {
      password: "",
      confirm: "",
      status: "idle",
      errorMessage: null,
    };
  },

  methods: {
    async actualizarPassword() {
      this.errorMessage = null;

      // validacion
      if (!this.password || !this.confirm) {
        this.errorMessage = "Completá ambos campos";
        return;
      }

      if (this.password !== this.confirm) {
        this.errorMessage = "Las contraseñas no coinciden";
        return;
      }

      this.status = "loading";

      const result = await updatePassword(this.password);

      if (!result.ok) {
        this.errorMessage = result.message;
        this.status = "error";
        return;
      }

      this.status = "success";
    },
  },
};
</script>

<template>
  <section
    class="min-h-screen flex flex-col items-center justify-start pt-12 md:pt-16 bg-[#f6f6eb] relative overflow-hidden"
  >
    <img
      src="/icono1.png"
      alt=""
      class="absolute top-6 left-6 w-10 md:w-16 rotate-12 opacity-100"
    />
    <img
      src="/icono6.png"
      alt=""
      class="absolute bottom-28 md:bottom-16 right-10 md:right-16 w-14 md:w-18 -rotate-6 opacity-100"
    />
    <img
      src="/icono3.png"
      alt=""
      class="absolute top-24 md:top-1/3 left-6 md:left-[8%] w-10 md:w-14 rotate-6 opacity-100"
    />
    <img
      src="/icono3.png"
      alt=""
      class="absolute top-36 md:top-1/3 right-10 md:right-16 w-12 md:w-18 rotate-6 opacity-100"
    />
    <img
      src="/icono7.png"
      alt=""
      class="absolute bottom-[28%] md:bottom-[20%] left-[18%] md:left-[25%] w-12 md:w-16 opacity-100 -rotate-12"
    />

    <AppH1 class="text-[#3c490b] text-lg md:text-xl mb-6 z-10 text-center px-6">
      Restablecer contraseña
    </AppH1>

    <form
      @submit.prevent="actualizarPassword"
      class="relative z-10 w-[90%] max-w-[400px] mx-auto bg-[#ede8d7] border border-[#4e0d05]/20 rounded-2xl md:rounded-3xl shadow-md p-6 md:p-8 flex flex-col gap-6 text-left"
    >
      <div>
        <label
          for="password"
          class="block text-[#3c490b] text-xs md:text-sm font-bold mb-1"
        >
          Nueva Contraseña
        </label>

        <input
          id="password"
          v-model="password"
          class="w-full border border-[#e099a8] rounded-full py-2 px-4 text-sm md:text-base text-[#4e0d05] placeholder-[#4e0d05]/60 focus:outline-none focus:ring-1 focus:ring-[#e099a8]"
          type="password"
          placeholder="Nueva contraseña"
          required
        />
      </div>

      <div>
        <label
          for="confirm"
          class="block text-[#3c490b] text-xs md:text-sm font-bold mb-1"
        >
          Confirmar Contraseña
        </label>

        <input
          id="confirm"
          v-model="confirm"
          class="w-full border border-[#e099a8] rounded-full py-2 px-4 text-sm md:text-base text-[#4e0d05] placeholder-[#4e0d05]/60 focus:outline-none focus:ring-1 focus:ring-[#e099a8]"
          type="password"
          placeholder="Confirmar contraseña"
          required
        />
      </div>

      <button
        type="submit"
        class="w-full rounded-full bg-[#e099a8] text-[#3c490b] font-semibold py-2.5 text-sm md:text-base mt-2 shadow-md hover:bg-[#3c490b] hover:text-[#f6f6eb] transition-all duration-300"
        :disabled="status === 'loading'"
      >
        {{ status === "loading" ? "Actualizando..." : "Actualizar contraseña" }}
      </button>
    </form>

    <p v-if="status === 'success'" class="text-green-600 text-center mt-6">
      ¡Contraseña actualizada! Ya podés iniciar sesión.
    </p>

    <p v-if="status === 'error'" class="text-red-600 text-center mt-6">
      {{ errorMessage }}
    </p>
  </section>
</template>
