import { createRouter, createWebHistory} from 'vue-router';
import Home from '../pages/Home.vue';
import Login from '../pages/Login.vue';
import Register from '../pages/Register.vue';
import OnboardingQuestions from '../pages/OnboardingQuestions.vue';
import Social from '../pages/Social.vue';
import Blog from '../pages/Blog.vue';
import MyProfile from '../pages/MyProfile.vue';
import MyProfileEdit from '../pages/MyProfileEdit.vue';
import Detail from '../pages/Detail.vue';
import AdminSuggestions from '../pages/admin/Admin.vue';
import RedSocial from '../pages/RedSocial.vue';
import UserProfile from '../pages/UserProfile.vue';
import RecuperarContrasena from '../pages/RecoverPassword.vue';
import ResetPassword from '../pages/ResetPassword.vue';
import { subscribeToAuthChanges } from '../services/auth';
import { getAuthUser } from '../services/auth';


// definir rutas

const routes = [
  {path: '/',                             component: Home, },
  {path: '/ingresar',                     component: Login, },
  {path: '/crear-cuenta',                 component: Register, },
  {path: '/preferencias',                 component: OnboardingQuestions, },
  {path: '/social',                       component: Social, },
  {path: '/blog',                         component: Blog, },
  {path: '/red-social',                   component: RedSocial, },
  {path: '/detalle/:id', name: 'detalle', component: Detail, },
  {path: '/mi-perfil',                    component: MyProfile, meta: { requiresAuth: true } },
  {path: '/mi-perfil/editar',             component: MyProfileEdit, meta: { requiresAuth: true } },
  {path: '/admin',                        component: AdminSuggestions},
  {path: '/recuperar-contrasena',         component: RecuperarContrasena, },
  {path: '/reset-password',               component: ResetPassword, },
  {path: '/usuario/:id',                  component: UserProfile, name: 'UserProfile', props: true },
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

router.beforeEach((to, from, next) => {
  const user = getAuthUser();

  // Si la ruta requiere admin
  if (to.path === "/admin") {
    if (!user?.id) {
      // No está logueado
      return next("/ingresar");
    }

    if (user.role !== "admin") {
      // Está logueado pero no es admin
      return next("/ingresar"); 
    }  
  }
  next();
});

export default router;
