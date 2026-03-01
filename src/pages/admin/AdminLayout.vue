<script>
import { logout } from "../../services/auth.js";
import { getPendingSubscriptionsCount } from "../../services/subscriptions.js";
import { getPendingSuggestionsCount } from "../../services/blog.js";

export default {
  name: "AdminLayout",
  data() {
    return {
      pendingKitsCount: 0,
      pendingBlogCount: 0,
    };
  },
  async mounted() {
    await this.updateBadgeCount();
  },
  watch: {
    $route() {
      this.updateBadgeCount();
    },
  },
  methods: {
    async updateBadgeCount() {
      this.pendingKitsCount = await getPendingSubscriptionsCount();
      this.pendingBlogCount = await getPendingSuggestionsCount();
    },
    async handleLogout() {
      await logout();
      this.$router.push("/ingresar");
    },
  },
};
</script>

<template>
  <div class="min-h-screen bg-[#f6f6eb] flex flex-col">
    <div class="bg-[#4e0d05] text-[#f6f6eb] py-6 px-6 shadow-md">
      <div class="max-w-7xl mx-auto">
        <div class="flex items-center justify-between"></div>

        <div class="mt-6 flex justify-center gap-8 text-sm sm:text-base font-semibold">
          <router-link
            to="/admin/blog"
            class="relative pb-1 transition hover:text-white/80"
            :class="$route.path.includes('/admin/blog') ? 'border-b-2 border-white' : ''"
          >
            Blog
            <span
              v-if="pendingBlogCount > 0"
              class="absolute -top-2 -right-4 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full"
            >
              {{ pendingBlogCount }}
            </span>
          </router-link>

          <router-link
            to="/admin/usuarios"
            class="pb-1 transition hover:text-white/80"
            :class="$route.path.includes('/admin/usuarios') ? 'border-b-2 border-white' : ''"
          >
            Usuarios
          </router-link>

          <router-link
            to="/admin/kits"
            class="relative pb-1 transition hover:text-white/80"
            :class="$route.path.includes('/admin/kits') ? 'border-b-2 border-white' : ''"
          >
            Kits
            <span
              v-if="pendingKitsCount > 0"
              class="absolute -top-2 -right-4 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full"
            >
              {{ pendingKitsCount }}
            </span>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Contenido -->
    <div class="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
      <router-view />
    </div>
  </div>
</template>