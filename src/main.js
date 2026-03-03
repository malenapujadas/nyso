import './style.css';
import { createApp } from "vue";
import router  from './router/router';
import App from './App.vue'

// toastify  estilos
import Vue3Toastify from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const app = createApp(App);
app.use(router);


app.use(Vue3Toastify, {
  autoClose: 3000, 
  position: 'bottom-right',
  theme: 'dark', 
  
  toastStyle: {
    backgroundColor: '#4e0d05', 
    color: '#f6f6eb',           
    borderRadius: '1rem',       
    fontFamily: 'inherit',     
  },
  
  progressStyle: {
    background: '#e099a8',    
  }
});

app.mount('#app');