import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../pages/Home.vue";
import Login from "../pages/Login.vue";
import Register from "../pages/Register.vue";
import OnboardingQuestions from "../pages/OnboardingQuestions.vue";
import Social from "../pages/Social.vue";
import Blog from "../pages/Blog.vue";
import MyProfile from "../pages/MyProfile.vue";
import MyProfileEdit from "../pages/MyProfileEdit.vue";
import Detail from "../pages/Detail.vue";
import AdminBlog from "../pages/admin/AdminBlog.vue";
import AdminLayout from "../pages/admin/AdminLayout.vue";
import AdminProfile from "../pages/admin/AdminProfile.vue";
import RedSocial from "../pages/RedSocial.vue";
import UserProfile from "../pages/UserProfile.vue";
import RecuperarContrasena from "../pages/RecoverPassword.vue";
import ResetPassword from "../pages/ResetPassword.vue";
import { subscribeToAuthChanges } from "../services/auth";
import { getAuthUser } from "../services/auth";
import Box from "../pages/Box.vue";
import AdminKits from "../pages/admin/AdminKits.vue";
import AdminUsers from "../pages/admin/AdminUsers.vue";

// definir rutas

const routes = [
  { path: "/", component: Home },
  { path: "/ingresar", component: Login },
  { path: "/crear-cuenta", component: Register },
  { path: "/preferencias", component: OnboardingQuestions },
  { path: "/social", component: Social },
  { path: "/blog", component: Blog },
  { path: "/red-social", component: RedSocial },
  { path: "/detalle/:id", name: "detalle", component: Detail },
  { 
    path: "/mi-perfil", 
    component: MyProfile, 
    meta: { requiresAuth: true } 
  },

  {
    path: "/box",
    name: "box",
    component: Box,
  },
  {
    path: "/mi-perfil/editar",
    component: MyProfileEdit,
    meta: { requiresAuth: true },
  },
  //rutas de admin
  /* { path: "/admin", component: AdminSuggestions }, */
  {
    path: "/admin",
    component: AdminLayout, // El marco con Sidebar
    meta: { requiresAdmin: true }, // Nueva meta para proteger todo el grupo
    children: [
      {
        path: "", // Si entra a /admin, redirige a blog
        redirect: "/admin/blog"
      },
      {
        path: "blog", // URL: /admin/blog
        component: AdminBlog
      },
      {
        path: "usuarios", // URL: /admin/usuarios
        name: "AdminUsers",
        component: AdminUsers
      },
      {
        path: "kits", // URL: /admin/kits
        name: "AdminKits",
        component: AdminKits
      },
      { path: "perfil", component: AdminProfile }, // URL: /admin/perfil
    ]
  },
  { path: "/recuperar-contrasena", component: RecuperarContrasena },
  { path: "/reset-password", component: ResetPassword },
  {
    path: "/usuario/:id",
    component: UserProfile,
    name: "UserProfile",
    props: true,
  }, //el props permite usar el id sin usar el $route.params.id
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,

  scrollBehavior(to, from, savedPosition) {
    return { top: 0, behavior: "smooth" };
  },
});

//para saber si el usuario esta logueado
let user = { 
  id: null, 
  email: null, 
  role: null 
};

subscribeToAuthChanges((userState) => (user = userState));

/* PROTECCIONES */
router.beforeEach((to, from, next) => {
  // 1. Obtenemos el usuario actual
  const currentUser = getAuthUser();
  const isAuthenticated = !!currentUser.id;
  const isAdmin = currentUser.role === 'admin';

  // 2. Verificamos los requisitos de la ruta
  // .some() chequea si la ruta o sus padres tienen el meta
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin);

  // CASO 1: Rutas de Admin (Protección estricta)
  if (requiresAdmin) {
    // Si no está logueado -> Login
    if (!isAuthenticated) return next("/ingresar");
    // Si está logueado pero NO es admin -> Home (o donde prefieras)
    if (!isAdmin) return next("/"); 
    // Si es admin -> Pasa
    return next();
  }

  // CASO 2: Admin intentando entrar a "Mi Perfil" de usuario común
  // Si quiere ir a /mi-perfil Y es admin -> Lo mandamos a su dashboard
  if (to.path === '/mi-perfil' && isAdmin || to.path === '/mi-perfil/editar' && isAdmin) {
    return next('/admin/perfil');
  }

  // CASO 3: Rutas de Usuario Autenticado (Protección normal)
  if (requiresAuth) {
    if (!isAuthenticated) return next("/ingresar");
    return next();
  }

  // Si no aplica ninguna regla anterior, dejar pasar
  next();
});

export default router;


