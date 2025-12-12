<script>
  import { RouterLink } from 'vue-router';
  
  export default {
    name: 'Footer',
    components: { RouterLink },
  };
  </script>
  
  <template>
    <footer class="relative bg-[#f6f6eb] pt-16 flex flex-col items-center justify-center">
      <!-- Contenido principal -->
      <div class="w-full bg-[#3c490b] text-[#f6f6eb] rounded-t-[40px] px-8 py-14 md:px-10 md:py-16 shadow-inner">
        <div
          class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 items-start 
                 justify-items-center text-center md:text-left"
        >
          <!-- Sobre NYSO -->
          <div class="flex flex-col items-center md:items-start">
            <h3 class="font-bold text-base md:text-lg mb-3 uppercase tracking-wide text-[#e099a8]">
              Sobre NYSO
            </h3>
            <ul class="space-y-2 text-sm md:text-base text-[#f6f6eb]">
              <li>
                <RouterLink to="/" class="hover:text-[#e099a8] transition-colors">
                  Inicio
                </RouterLink>
              </li>
              <li>
                <RouterLink to="/social" class="hover:text-[#e099a8] transition-colors">
                  Vinos
                </RouterLink>
              </li>
              <li>
                <RouterLink to="/blog" class="hover:text-[#e099a8] transition-colors">
                  Blog
                </RouterLink>
              </li>
              <li>
                <RouterLink to="/red-social" class="hover:text-[#e099a8] transition-colors">
                  Red social
                </RouterLink>
              </li>
            </ul>
          </div>
  
          <div class="flex flex-col items-center text-center">
            <img src="/logo.png" alt="NYSO" class="w-20 md:w-28 mb-4" />
            <p class="text-xs md:text-sm leading-relaxed max-w-[220px] md:max-w-xs">
              Descubrí, guardá y compartí tus vinos favoritos.
            </p>
          </div>
  
          <!-- Redes -->
          <div class="flex flex-col items-center md:items-end text-center md:text-right">
            <h3 class="font-bold text-base md:text-lg mb-3 uppercase tracking-wide text-[#e099a8]">
              Seguinos
            </h3>
  
            <div class="flex justify-center md:justify-end gap-6 mb-4">
              <a href="https://www.instagram.com/nyso_vinos/" target="_blank">
                <img
                  src="/ig.png"
                  alt="Instagram"
                  class="w-7 h-7 md:w-8 md:h-8 hover:scale-110 transition-transform duration-300"
                />
              </a>
  
              <a href="#">
                <img
                  src="/tiktok.png"
                  alt="TikTok"
                  class="w-7 h-7 md:w-8 md:h-8 hover:scale-110 transition-transform duration-300"
                />
              </a>
            </div>
  
            <p class="text-[10px] md:text-xs text-[#f6f6eb]/80">#DescubríNYSO</p>
          </div>
        </div>
      </div>
  
      <div
        class="w-full bg-[#2d3707] text-[#f6f6eb]/70 text-xs md:text-sm 
               py-3 md:py-4 flex flex-col md:flex-row items-center justify-center gap-2 md:gap-8"
      >
        <p>© 2025 NYSO. Todos los derechos reservados.</p>
      </div>
    </footer>
  </template>
  