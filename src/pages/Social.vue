<script>
import AppH1 from '../components/AppH1.vue';
import { savePost, suscribeToPosts, fetchLastpost } from '../services/posts.js';
import { subscribeToAuthChanges, logout } from '../services/auth.js';

export default {
    name: 'Social',  
    components: { AppH1 }, 
    data: function() {
        return {
            posts: [],
            newMessage: {
                email: '',
                content: '',
            },
            user: {
                id: null,
                email: null,
            }
        };
    },
    methods:{
        async handleSubmit(){
            savePost({
                ...this.newMessage
            });

            this.posts = await fetchLastpost();

            this.newMessage.content = '';

            await this.$nextTick();
            this.$refs.postsContainer.scrollTop = this.$refs.postsContainer.scrollHeight;
        }
    },
    async mounted(){
        suscribeToPosts(async newpost=> {
            this.posts.push(newpost);
            await this.$nextTick();
            this.$refs.postsContainer.scrollTop = this.$refs.postsContainer.scrollHeight;
        });

        this.posts = await fetchLastpost();

        await this.$nextTick();
        this.$refs.postsContainer.scrollTop = this.$refs.postsContainer.scrollHeight;

        subscribeToAuthChanges(userState => this.user = userState);
    },
  
}
</script>

<template>
    <div class="flex flex-col lg:flex-row  gap-8">
        <section ref="postsContainer" class="overflow-y-auto lg:w-9/12">
            <AppH1 class="pb-2 pt-2">Descubre todas las publicaciones sobre vinos en Argentina.</AppH1>
            <ol class="grid grid-cols-1 gap-4 background-white p-4 rounded shadow-md md:grid-cols-2 lg:grid-cols-3">
                <li v-for="post in posts" :key="post.id" class="mb-4 border rounded p-6">
                    <h2 class="text-xl font-bold">{{ post.title }}</h2>
                    <p class="text-sm text-gray-600">Publicado por: {{ post.email }} | {{ post.created_at }}</p>
                    <p class="mt-2">{{ post.content }}</p>
                </li>
            </ol>
        </section>
        <section class=" lg:w-3/12  mt-8">
            <div v-if="user.id === null">
                    <RouterLink 
                    class="text-l rounded-lg p-2 bg-[#e099a8] shadow-lg shadow-[#e099a8]/50 hover:text-white " 
                    aria-current="page" 
                    to="/ingresar"
                    >+ Inicia sesión para publicar una reseña</RouterLink>
            </div>
            <div v-else>
                <h2 class="pb-6 text-center">Publicar una nueva reseña</h2>
                <form 
                    action="#"
                    @submit.prevent="handleSubmit"
                    class="px-4 py-6 max-w-md mx-auto bg-white rounded-lg shadow-md"
                >
                    <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="email">Email</label>
                    <input 
                        class="shadow border rounded w-full py-2 px-3 text-gray-700" 
                        id="email" 
                        type="email" 
                        placeholder="mail@gmail.com" 
                        v-model="newMessage.email"
                    />
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="title">Titulo</label>
                    <input 
                        class="shadow border rounded w-full py-2 px-3 text-gray-700" 
                        id="title" 
                        type="title" 
                        v-model="newMessage.title"
                    />
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="content">Contenido</label>
                    <textarea 
                        class="shadow border rounded min-h-25 w-full py-2 px-3 text-gray-700" 
                        id="content" 
                        type="content"
                        v-model="newMessage.content"
                        >
                    </textarea>

                </div>
                <div class="flex items-center justify-between">
                    <button class="text-lg rounded-lg px-4 py-2 bg-[#e099a8] shadow-lg shadow-[#e099a8]/50 hover:text-white inline-block text-center" type="submit">
                        Publicar
                    </button>
                </div>
                </form>
            </div>
        </section>
    </div>
</template>