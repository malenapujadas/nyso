<script>
import AppH1 from '../components/AppH1.vue';
import { supabase } from '../services/supabase.js';
import { register } from '../services/auth.js';

export default {
    name: 'Register',
    components: { AppH1 },
    data(){
        return{
            user: {
                email: '',
                password: '',
                nacimiento: '',
             },
            loading: false,
            errorMsg: '',
        };
    },
    methods:{
        async handleSubmit(){
            this.errorMsg = '';

            //validacion de edad 
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

                await register(this.user.email, this.user.password);
                
                this.$router.push('/mi-perfil');
            } catch (error) {
                this.errorMsg = 'No se pudo crear la cuenta';
            }
            this.loading = false;
        }
    }
}
</script>


<template>
    <AppH1>Crear una cuenta</AppH1>

    <form 
        action="#"
        @submit.prevent="handleSubmit"
        class="px-4 py-6 max-w-md mx-auto bg-white rounded-lg shadow-md"
    >
        <div v-if="errorMsg" class="mb-4 text-red-600 text-center font-bold">
            {{ errorMsg }}
        </div>
        <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
                Email
            </label>
            <input 
                class="shadow border rounded w-full py-2 px-3 text-gray-700" 
                id="email" 
                type="email" 
                placeholder="mail@gmail.com" 
                v-model="user.email"
            />
        </div>
        <div class="mb-6">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="nacimiento">
                Fecha de Nacimiento
            </label>
            <input 
                class="shadow border rounded w-full py-2 px-3 text-gray-700 mb-3 " 
                id="nacimiento" 
                type="date" 
                v-model="user.nacimiento"
            />
        </div>
        <div class="mb-6">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
                Contraseña
            </label>
            <input 
                class="shadow border rounded w-full py-2 px-3 text-gray-700 mb-3 " 
                id="password" 
                type="password" 
                v-model="user.password"
            />
            <p class="text-xs text-red-600 font-bold" >* La contraseña debe contener mínimo 6 (seis) caracteres</p>
        </div>
        <div class="flex items-center justify-between">
            <button class="text-lg rounded-lg px-4 py-2 bg-[#e099a8] shadow-lg shadow-[#e099a8]/50 hover:text-white inline-block text-center" type="submit">
                Crear cuenta
            </button>
        </div>
    </form>
</template>