<script>
import NavBar from './components/NavBar.vue';
import Footer from './components/Footer.vue';
import { RouterView } from 'vue-router';

export default {
  name: 'App',
  components: { NavBar, RouterView, Footer }
};
</script>

<template>
  <div class="min-h-screen bg-[#f6f6eb] flex flex-col">
    
    <NavBar />

    <main class="flex-1">
      <RouterView />
    </main>

    <Footer />
  </div>
</template>
