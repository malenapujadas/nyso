<script>
import AppH1 from '../components/AppH1.vue';
import { login } from '../services/auth.js';

export default {
    name: 'Login',
    components: { AppH1},
    data(){
        return{
           user: {
            email: '',
            password: '',
           }, 
           loading: false,
           errorMsg: '',
        };
    },
    methods:{
        async handleSubmit(){
            this.errorMsg = '';
            try {
                this.loading = true;
                await login(this.user.email, this.user.password);   
                this.$router.push('/mi-perfil');
            } catch (error) {
                this.errorMsg = 'Credenciales inválidas';
            }
            this.loading = false;
        }
    },
}
</script>

<template>
    <AppH1>Ingresar a mi cuenta</AppH1>

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
            <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
                Contraseña
            </label>
            <input 
                class="shadow border rounded w-full py-2 px-3 text-gray-700 mb-3 " 
                id="password" 
                type="password" 
                v-model="user.password"
            />
        </div>
        <div class="flex items-center justify-between">
            <button class="text-lg rounded-lg px-4 py-2 bg-[#e099a8] shadow-lg shadow-[#e099a8]/50 hover:text-white inline-block text-center " type="submit">
                Ingresar
            </button>
        </div>
    </form>
</template>