<script>
import AppH1 from '../components/AppH1.vue';
import { subscribeToAuthChanges } from '../services/auth.js';
import { getUserProfileById } from '../services/user-profiles.js';

export default {
    name: 'MyProfile',
    components:{AppH1,},
    data(){
        return{
            user:{
                id: null,
                email: null,
                display_name: null,
                bio: null,
                career: null,
            },
        }
    },
    mounted(){
        subscribeToAuthChanges(async userState =>{
            this.user = userState;
        });
    }
};
</script>

<template>
    <AppH1>Mi perfil</AppH1>
    <div class="px-4 py-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
        <h2 class="text-2xl font-bold mb-4">Información del usuario</h2>
        <p class="mb-2"><strong>Email:</strong> {{ user.email }}</p>
        <p class="mb-2"><strong>Nombre de usuario:</strong> {{ user.display_name ?? 'No establecido' }}</p>
        <p class="mb-2"><strong>Biografía:</strong> {{ user.bio ?? 'No establecida' }}</p>
        <p class="mb-2"><strong>Carrera:</strong> {{ user.career ?? 'No establecida' }}</p>
    </div>
    <div class="text-center pt-6">
        <RouterLink class="text-blue-500 hover:underline mb-4 inline-block" to="/mi-perfil/editar">Editar perfil</RouterLink>
    </div>
</template>