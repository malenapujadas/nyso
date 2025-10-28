import { createRouter, createWebHistory} from 'vue-router';
import Home from '../pages/Home.vue';
import Login from '../pages/Login.vue';
import Register from '../pages/Register.vue';
import Social from '../pages/Social.vue';
import Blog from '../pages/Blog.vue';
import MyProfile from '../pages/MyProfile.vue';
import MyProfileEdit from '../pages/MyProfileEdit.vue';
import Detail from '../pages/Detail.vue';
import { subscribeToAuthChanges } from '../services/auth';


// definir rutas

const routes = [
{path: '/',                         component: Home, },
{path: '/ingresar',                 component: Login, },
{path: '/crear-cuenta',             component: Register, },
{path: '/social',                   component: Social, },
{path: '/blog',                     component: Blog, },
{path: '/detalle/:id', name: 'detalle', component: Detail, },
{path: '/mi-perfil',                component: MyProfile, meta: { requiresAuth: true } },
{path: '/mi-perfil/editar',         component: MyProfileEdit, meta: { requiresAuth: true } },

];


const router = createRouter({
    history: createWebHistory(),
  
    routes,
  
 
    scrollBehavior(to, from, savedPosition) {
      return { top: 0, behavior: 'smooth' };
    },
  });
  
  let user = {
    id: null,
    email: null,
  };

subscribeToAuthChanges(userState => user = userState); 

router.beforeEach((to, from)=> {
    if(to.meta.requiresAuth && user.id === null){
        return '/ingresar';
    }
    
});


export default router;
