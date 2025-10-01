import './bootstrap.min.css';
import './style.css';
import { createApp } from "vue";
import router  from './router/router';
import App from "./app.vue";

const app = createApp(App);
app.use(router);
app.mount('#app');