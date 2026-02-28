import './style.css';
import { createApp } from "vue";
import router  from './router/router';
import App from './App.vue'

// toastify y sus estilos
import Vue3Toastify from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const app = createApp(App);
app.use(router);

// 2. Configurar Toastify con tus colores inyectados por JS
app.use(Vue3Toastify, {
  autoClose: 3000, 
  position: 'bottom-right',
  theme: 'dark', // Usamos dark de base para que la crucecita de cerrar sea clarita
  
  // Estilo directo para la caja del mensaje
  toastStyle: {
    backgroundColor: '#4e0d05', // Fondo borravino
    color: '#f6f6eb',           // Texto cremita
    borderRadius: '1rem',       // Bordes redondeados
    fontFamily: 'inherit',      // Para que use la misma letra de tu web
  },
  
  // Estilo directo para la barrita de progreso
  progressStyle: {
    background: '#e099a8',      // Rosa viejo para resaltar
  }
});

app.mount('#app');