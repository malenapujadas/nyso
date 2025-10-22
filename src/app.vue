<script>
import Home from './pages/Home.vue';
import { logout, subscribeToAuthChanges } from './services/auth.js';

export default {
    name: 'App',
    components: { Home },
    data(){
        return{
            user: {
                id: null,
                email: null,
            }
        }
    },
    methods:{
        handleLogOut(){
            logout();
            this.$router.push('/ingresar');
        }
    },
    mounted(){
        subscribeToAuthChanges(userState => this.user = userState);
    }
}
</script>


<template>
    
    <nav class="flex justify-around gap-8 p-4 bg-red-950 text-white shadow-lg shadow-red-950/50">      
            <RouterLink class="text-xl hover:text-[#e099a8]" to="/">Nyso </RouterLink>
                <button class="" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Mostar / ocultar navegación">
                <span class=""></span>
                </button>
            <div id="navbarNav">
                <ul class="flex gap-4">
                    <li>
                        <RouterLink class="text-xl hover:text-[#e099a8]" aria-current="page" to="/">Home</RouterLink>
                    </li>
                    <li>
                        <RouterLink class="text-xl hover:text-[#e099a8]" aria-current="page" to="/social">Publicaciones</RouterLink>
                    </li>
                </ul>
            </div>
    </nav>
    <main class="p-4 mt-22">
        <RouterView />
    </main>
    <footer class="flex justify-center items-center border-t border-red-950 text-black h-25">
        <p class="font-bold">NYSO - Todos los derechossssss reservados.</p>
    </footer>
</template>

