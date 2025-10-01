import { createRouter, createWebHistory} from 'vue-router';
import Home from '../pages/Home.vue';
import Login from '../pages/Login.vue';
import Register from '../pages/Register.vue';






// definir rutas

const routes = [
{path: '/',                     component: Home, },
{path: '/Login',                     component: Login, },
{path: '/Register',                     component: Register, },

];

const router = createRouter({
    routes, 
    history: createWebHistory(),
});

export default router;
