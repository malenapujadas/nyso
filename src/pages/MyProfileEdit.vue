<script>
import AppH1 from '../components/AppH1.vue';
import { subscribeToAuthChanges, updateAuthUserData } from '../services/auth.js';
import { getUserProfileById, updateUserProfile } from '../services/user-profiles.js';

export default {
    name: 'MyProfileEdit',
    components:{AppH1,},
    data(){
        return{
            formData:{
                display_name: '',
                vino: '',
                /* career: '', */
            },
            loading: false,
        }
    },
    methods:{
        async handleSubmit(){
            try {
                this.loading = true;
                await updateAuthUserData(this.formData );
                this.$router.push('/mi-perfil');
            } catch (error) {
                
            }
            this.loaging = false;
        },
    },

    mounted(){
        subscribeToAuthChanges(userState =>{
            this.formData = {
                display_name: userState.display_name ?? '',
                vino: userState.vino ?? '',
                /* career: userState.career ?? '', */
            }
        });
    }
};
</script>

<template>
    <AppH1>Editar mi perfil</AppH1>
    <form
        action="#"
        @submit.prevent="handleSubmit" 
        class="px-4 py-6 max-w-md mx-auto bg-white rounded-lg shadow-md" 
    >

        <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="vino">
                    Preferencia de Vinos
                </label>
                <textarea 
                    class="shadow border rounded w-full py-2 px-3 text-gray-700" 
                    id="vino" 
                    type="text" 
                    v-model="formData.vino"
                ></textarea>
        </div>
        <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="display_name">
                Nombre
            </label>
            <input 
                class="shadow border rounded w-full py-2 px-3 text-gray-700" 
                id="display_name" 
                type="text" 
                v-model="formData.display_name"
            />
        </div>
        <!-- <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="career">
                Carrera
            </label>
            <input 
                class="shadow border rounded w-full py-2 px-3 text-gray-700" 
                id="career" 
                type="text" 
                v-model="formData.career"
            />
        </div> -->
        <div class="flex items-center justify-between">
            <button class="text-lg rounded-lg px-4 py-2 bg-[#e099a8] shadow-lg shadow-[#e099a8]/50 hover:text-white inline-block text-center" type="submit" >
                Editar 
            </button>
        </div>
    </form>
</template>